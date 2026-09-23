"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiLogIn, FiLoader, FiAlertCircle } from "react-icons/fi";
import CannabisIcon from "@/components/CannabisIcon";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError("Invalid username or password");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#4ade80]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CannabisIcon className="w-7 h-7 text-[#4ade80]" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-600 mt-1">WeedLaps Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="bg-gray-100 rounded-2xl border border-gray-200 p-6 space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-red-400/10 border border-red-400/30 text-red-400 text-sm px-4 py-2.5 rounded-lg"
            >
              <FiAlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent placeholder:text-gray-600"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent placeholder:text-gray-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#4ade80] hover:bg-[#22c55e] disabled:bg-[#22c55e]/50 text-black font-semibold py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-[#4ade80]/25"
          >
            {loading ? (
              <FiLoader className="w-5 h-5 animate-spin" />
            ) : (
              <FiLogIn className="w-5 h-5" />
            )}
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}


