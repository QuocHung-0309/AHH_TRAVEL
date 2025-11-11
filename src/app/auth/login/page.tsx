// /app/auth/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AxiosError } from "axios";
import { useSignin } from "#/hooks/auth-hook/useAuth";
import { useAuthStore } from "#/stores/auth";
import { authApi } from "@/lib/auth/authApi";

export default function LoginPage() {
  const router = useRouter();

  const setToken = useAuthStore((s) => s.setToken);
  const setUserId = useAuthStore((s) => s.setUserId);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("remember_email");
    const rememberedPassword = localStorage.getItem("remember_password");
    if (rememberedEmail && rememberedPassword) {
      setEmail(rememberedEmail);
      setPassword(rememberedPassword);
      setRememberMe(true);
    }
  }, []);

  const { mutate: signinMutate, isPending } = useSignin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    signinMutate(
      { identifier: email, password },
      {
        onSuccess: async (res) => {
          const accessToken = res?.accessToken ?? null;
          const refreshToken = res?.refreshToken ?? null;

          if (!accessToken) {
            setApiError("Thiếu access token từ server.");
            return;
          }

          // Ghi nhớ
          if (rememberMe) {
            localStorage.setItem("remember_email", email);
            localStorage.setItem("remember_password", password);
          } else {
            localStorage.removeItem("remember_email");
            localStorage.removeItem("remember_password");
          }

          // Lưu token vào Zustand (persist)
          setToken({ accessToken, refreshToken });

          // (tuỳ chọn) lấy trước userId để các trang khác có ngay
          try {
            const me = await authApi.getProfile(accessToken);
            setUserId(me.id);
          } catch {
            // bỏ qua, Header sẽ auto fetch lại
          }

          router.replace("/"); // replace cho sạch history
        },
        onError: (error) => {
          const err = error as AxiosError<{ message?: string }>;
          setApiError(err.response?.data?.message || "Đăng nhập thất bại");
        },
      }
    );
  };

  return (
    <>
      <h2 className="heading-2 font-bold text-[var(--secondary)] mb-1">
        ĐĂNG NHẬP
      </h2>
      <p className="text-sm text-gray-600 mb-5">Đăng nhập tài khoản của bạn</p>

      {apiError && (
        <p className="text-[var(--warning)] text-sm mb-2">{apiError}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 pt-5">
        <Input
          label="User name"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            label="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm flex-wrap gap-2">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-[var(--primary)]"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Ghi nhớ tài khoản
          </label>
          <a
            href="/auth/forgot-password"
            className="text-[var(--primary)] hover:underline whitespace-nowrap"
          >
            Quên mật khẩu?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4"
          disabled={isPending}
        >
          {isPending ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
        </Button>
      </form>

      <p className="text-sm mt-6 text-gray-600 text-center">
        Bạn chưa có tài khoản?{" "}
        <a
          href="/auth/register"
          className="text-[var(--primary)] hover:underline"
        >
          Đăng ký ngay
        </a>
      </p>

      <div className="flex items-center gap-2 py-2">
        <hr className="flex-1 border-gray-300" />
        <span className="text-gray-500 text-sm">Hoặc đăng nhập bằng</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <Button variant="outline-primary">
          <FaFacebookF className="text-[var(--primary)] text-xl" />
        </Button>
        <Button variant="outline-primary">
          <FcGoogle className="text-xl" />
        </Button>
        <Button variant="outline-primary">
          <FaApple className="text-black text-xl" />
        </Button>
      </div>
    </>
  );
}
