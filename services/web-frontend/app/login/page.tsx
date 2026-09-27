"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Shield, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { authUrl } from "@/lib/api-config";
import { Brand, Eyebrow } from "@/components/design";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(authUrl('/auth/login'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Authentication failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink text-white">
      {/* Machinery backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/visuals/machine-bay.svg')] bg-cover bg-center opacity-70 grayscale-[35%]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
      <div aria-hidden="true" className="hairlines absolute inset-0 opacity-60" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col px-4 py-4 sm:px-8 sm:py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex h-12 items-center rounded-full border border-white/[0.08] bg-ink/85 pl-2.5 pr-5 backdrop-blur-xl transition-colors hover:border-white/25"
          >
            <Brand />
          </Link>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/"
              className="group inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 text-sm font-medium text-neutral-950 sm:px-5 transition-colors hover:bg-neutral-200"
            >
              <ArrowRight className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
              Back to home
            </Link>
          </motion.div>
        </div>

        {/* Content */}
        <div className="grid flex-1 items-end gap-10 py-10 lg:grid-cols-[1fr_minmax(0,500px)] lg:items-center lg:gap-16">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.1, 1] }}
            className="order-2 lg:order-1 lg:self-end lg:pb-6"
          >
            <p className="display max-w-xl text-4xl text-white sm:text-5xl lg:text-6xl">
              Welcome back to the future of maintenance
            </p>

            {/* Security Badge */}
            <div className="mt-8 flex max-w-md items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/10">
                <Shield className="size-[18px]" />
              </span>
              <div>
                <p className="text-sm font-medium text-white">Enterprise Security</p>
                <p className="mt-1 text-sm text-slate-300">
                  Protected by JWT authentication with end-to-end encryption
                </p>
              </div>
            </div>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.2, 0.7, 0.1, 1] }}
            className="order-1 rounded-2xl bg-white p-7 text-neutral-950 shadow-[0_40px_120px_-40px_rgba(0,0,0,.9)] sm:p-10 lg:order-2"
          >
            <div className="mb-8 flex items-center justify-between">
              <Eyebrow className="text-neutral-500">Console access</Eyebrow>
              <span className="flex size-10 items-center justify-center rounded-full bg-neutral-950 text-white">
                <Lock className="size-4" />
              </span>
            </div>

            <h2 className="display text-4xl sm:text-[44px]">
              Sign In
            </h2>
            <p className="mt-3 text-[15px] text-neutral-500">
              Access your industrial intelligence platform
            </p>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="username" className="block text-[13px] text-neutral-500">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="field-line"
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[13px] text-neutral-500">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field-line"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex items-center gap-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="inline-flex h-12 items-center gap-2 rounded-full bg-neutral-950 px-7 text-sm font-medium text-white transition-colors group-hover:bg-neutral-800">
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="size-4 rounded-full border-2 border-white border-t-transparent"
                        />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-flex size-12 items-center justify-center rounded-full bg-neutral-950 text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-neutral-800"
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
