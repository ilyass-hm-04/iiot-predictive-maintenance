import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from typing import List, Dict, Any, Optional

# Load environment variables
load_dotenv()

class RAGChatbot:
    def __init__(self, index_name: str = "industrial-chatbot"):
        self.pinecone_api_key = os.getenv("PINECONE_API_KEY")
        self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
        self.index_name = index_name
        
        if not self.pinecone_api_key:
            raise ValueError("PINECONE_API_KEY environment variable not set")
        if not self.openrouter_api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable not set")
            
        # Initialize Pinecone
        self.pc = Pinecone(api_key=self.pinecone_api_key)
        
        # Initialize Embeddings
        self.embeddings = self._initialize_embeddings()
        
        # Initialize Vector Store
        self.vector_store = self._initialize_vector_store()
        
        # Initialize LLM
        self.llm = self._initialize_llm()
        
        # Initialize Chain
        self.rag_chain = self._initialize_chain()

    def _initialize_embeddings(self):
        """Initialize HuggingFace embeddings."""
        model_name = "sentence-transformers/all-MiniLM-L6-v2"
        return HuggingFaceEmbeddings(model_name=model_name)

    def _initialize_vector_store(self):
        """Initialize Pinecone Vector Store."""
        # Check if index exists, create if not
        if self.index_name not in self.pc.list_indexes().names():
            print(f"Creating index: {self.index_name}")
            self.pc.create_index(
                name=self.index_name,
                dimension=384,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
        
        return PineconeVectorStore(
            index_name=self.index_name,
            embedding=self.embeddings,
            pinecone_api_key=self.pinecone_api_key
        )

    def _initialize_llm(self):
        """Initialize ChatOpenAI with OpenRouter."""
        return ChatOpenAI(
            model_name="openai/gpt-4o-mini", 
            openai_api_base="https://openrouter.ai/api/v1",
            api_key=self.openrouter_api_key
        )

    def _initialize_chain(self):
        """Setup the RAG chain."""
        system_prompt = """
        You are an expert maintenance technician. 
        You MUST answer ONLY using the information explicitly present in the provided manual context.

        STRICT RULES:
        - Only provide the information requested in the following sections.
        - Do NOT add, infer, or invent any information.
        - If a section is not present in the manual, write "Information not available in the manual" for that section.
        - Do NOT include any extra explanation or steps beyond the requested sections.

        RESPONSE FORMAT (DO NOT CHANGE):
        1. Symptom (ONLY if explicitly stated in the manual)
        2. Possible causes (bullet list, ONLY if explicitly stated in the manual)
        3. Diagnostic procedure (bullet list, ONLY if explicitly stated in the manual)
        4. Maintenance / corrective actions (numbered steps, ONLY if explicitly stated in the manual)
        5. Safety warning (ONLY if explicitly stated in the manual)
        6. Manual reference (section or page if available)

        MANUAL CONTEXT:
        {context}
        """

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                ("human", "{input}"),
            ]
        )

        retriever = self.vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 3})
        question_answer_chain = create_stuff_documents_chain(self.llm, prompt)
        return create_retrieval_chain(retriever, question_answer_chain)

    def ingest_data(self, data_path: str, glob_pattern: str = "*.pdf", is_directory: bool = True):
        """Load, split, and ingest documents into Pinecone."""
        if is_directory:
            print(f"Loading documents from directory {data_path} with pattern {glob_pattern}...")
            loader = DirectoryLoader(
                data_path,
                glob=glob_pattern,
                loader_cls=PyPDFLoader
            )
        else:
            print(f"Loading single document from {data_path}...")
            loader = PyPDFLoader(data_path)
            
        documents = loader.load()
        print(f"Loaded {len(documents)} documents.")
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100,
            separators=["\n\n", "\n", ".", " ", ""]
        )
        texts_chunk = text_splitter.split_documents(documents)
        print(f"Created {len(texts_chunk)} chunks.")
        
        print("Upserting to Pinecone...")
        PineconeVectorStore.from_documents(
            documents=texts_chunk,
            embedding=self.embeddings,
            index_name=self.index_name
        )
        print("Ingestion complete.")

    def query(self, input_text: str) -> Dict[str, Any]:
        """Query the RAG chain."""
        return self.rag_chain.invoke({"input": input_text})

if __name__ == "__main__":
    # Example usage
    try:
        chatbot = RAGChatbot()
        response = chatbot.query("The CNC machine motor does not start and the fuses keep blowing.")
        print("Answer:\n", response["answer"])
    except Exception as e:
        print(f"Error: {e}")
