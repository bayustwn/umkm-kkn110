"use client";

import { useState, useEffect } from "react";
import api from "../utils/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { setCookie, getCookie } from "cookies-next";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("session");
    if (token) {
      router.push("/admin/dashboard");
    }
  }, []);

  const login = async () => {
    if (!username || !password) {
      toast.error("Username dan password tidak boleh kosong");
      return;
    }
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post("/user/login", { username, password });
      setCookie("session", res.data.token, { path: "/" });
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-8 py-10">
        <Toaster />
        <div className="w-full max-w-sm flex flex-col gap-6">
          <div className="flex flex-col text-center gap-2">
            <h1 className="font-bold text-3xl">Log In</h1>
            <p className="text-gray-500">Masukkan infomasi login admin.</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <img src="/icons/user.svg" alt="user" className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-11 border border-gray-200 bg-gray-50 rounded-lg px-5 py-3 outline-none focus:border-primary focus:bg-white transition w-full"
              />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <img src="/icons/password.svg" alt="password" className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="pl-11 border border-gray-200 bg-gray-50 rounded-lg px-5 py-3 outline-none focus:border-primary focus:bg-white transition w-full"
              />
            </div>
          </div>
          <button
            onClick={login}
            className="w-full text-white py-3 h-12 font-semibold rounded-lg bg-primary hover:bg-primary/90 transition-all flex justify-center items-center"
          >
            {isLoading ? (
              <img
                src="/icons/loading.svg"
                className="w-6"
                alt="loading"
              />
            ) : (
              "Log in"
            )}
          </button>
        </div>
      </div>
      <img src="/image/berita.jpg" className="hidden md:block w-1/2 object-cover bg-primary"></img>
    </div>
  );
}
