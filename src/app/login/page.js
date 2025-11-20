"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Login attempt (page):", {
      email,
      passwordRaw: password,
      passwordLength: password ? password.length : 0,
      passwordType: typeof password,
      isLogin,
      name,
    });

    if (!password) {
      console.error("Login prevented: password is empty or undefined");
      setError("Please enter a password");
      setLoading(false);
      return;
    }

    let result;
    try {
      result = isLogin
        ? await login(email, password)
        : await register(email, password, name);
    } catch (err) {
      console.error("Unhandled error calling auth methods:", err);
      setError("Unexpected error during authentication");
      setLoading(false);
      return;
    }

    setLoading(false);

    if (result.success) {
      console.log("Login successful, redirecting to dashboard");
      router.push("/dashboard");
    } else {
      console.error("Login failed:", result.error);
      setError(result.error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFB] p-5">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-[#19191C]">
            {isLogin ? "Login" : "Register"}
          </h1>
          <p className="text-[#56565C]">
            {isLogin
              ? "Welcome back! Please login to your account."
              : "Create a new account to get started."}
          </p>
        </div>

        <div className="rounded-lg border border-[#EBEBEB] bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-[#19191C]"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="w-full rounded-md border border-[#EBEBEB] px-4 py-2 text-[#19191C] focus:border-[#FD366E] focus:outline-none focus:ring-2 focus:ring-[#FD366E]/20"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#19191C]"
              >
                Email
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                className="w-full rounded-md border border-[#EBEBEB] px-4 py-2 text-[#19191C] focus:border-[#FD366E] focus:outline-none focus:ring-2 focus:ring-[#FD366E]/20"
                placeholder="you@example.com"
              />
              <p className="mt-1 text-xs text-[#97979B]">
                Use the same email address you registered with.
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#19191C]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="w-full rounded-md border border-[#EBEBEB] px-4 py-2 pr-10 text-[#19191C] focus:border-[#FD366E] focus:outline-none focus:ring-2 focus:ring-[#FD366E]/20"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#97979B] hover:text-[#19191C]"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#FD366E] px-4 py-2 font-medium text-white transition-colors hover:bg-[#E02D5E] disabled:opacity-50"
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-[#FD366E] hover:underline"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </button>
          </div>

          <div className="mt-6 border-t border-[#EBEBEB] pt-4">
            <Link
              href="/"
              className="block w-full rounded-md border border-[#EBEBEB] bg-white px-4 py-2 text-center font-medium text-[#19191C] transition-colors hover:bg-[#FAFAFB]"
            >
              Continue without Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
