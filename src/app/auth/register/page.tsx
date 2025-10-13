// src/app/auth/register/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { authApi } from "@/lib/auth/authApi";
import { AxiosError } from "axios";
import { useRegister } from "#/hooks/auth-hook/useAuth";

export default function RegisterPage() {
  const router = useRouter();

  const [userName, setUserName] = useState(""); // Tên
  const [fullName, setFullName] = useState(""); // Họ và tên lót
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState("");
  const { mutate: registerMutate, isPending, isError } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // chặn double-submit

    const newErrors: { [key: string]: string } = {};

    // Sửa message đúng với field
    if (!fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên";
    if (!userName.trim()) newErrors.userName = "Vui lòng nhập Username";
    if (!email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!password.trim()) newErrors.password = "Vui lòng nhập mật khẩu";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    if (!agree) newErrors.agree = "Bạn cần đồng ý điều khoản";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setApiError("");
    const input = {
      fullName: fullName.trim(),
      username: userName.trim(),
      email: email.trim(),
      phoneNumber: phone.trim(),
      password: password.trim(),
    };
    registerMutate(input, {
      onSuccess: (data) => {
        console.log("Đăng ký thành công", data.user);
        window.location.href = "/";
      },
      onError: (error: any) => {
        if (error.response?.data?.errors) {
          setApiError(
            error.response?.data?.errors[0].msg || "Đăng ký thất bại"
          );
        } else setApiError(error.response?.data?.message || "Đăng ký thất bại");
      },
    });
    setLoading(false);
    // try {
    //   await authApi.register(lastName, firstName, email, phone, password);
    //   await authApi.sendEmailOTP(email, "register");
    //   router.push(`/auth/otp?email=${encodeURIComponent(email)}`);
    // } catch (error: unknown) {
    //   const err = error as AxiosError<{ message?: string }>;
    //   setApiError(err.response?.data?.message || "Đăng ký thất bại");
    // } finally {
    //   setLoading(false);
    // }
  };

  // Handler tạm cho social (đổi sang route OAuth thực tế của bạn)
  const startOAuth = (provider: "facebook" | "google" | "apple") => {
    router.push(`/api/auth/${provider}`);
  };

  return (
    <>
      <h2 className="heading-2 font-bold text-[var(--secondary)] mb-1">
        ĐĂNG KÝ
      </h2>
      <p className="text-sm text-gray-600 mb-5">
        Hãy bắt đầu tạo tài khoản cho bản thân
      </p>

      {apiError && (
        <p className="text-[var(--warning)] text-sm mb-3">{apiError}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 pt-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="text"
              label="Họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={errors.fullName ? "input-error" : ""}
            />
            {errors.fullName && (
              <p className="text-[var(--warning)] text-sm">{errors.fullName}</p>
            )}
          </div>
          <div>
            <Input
              type="text"
              label="User name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className={errors.userName ? "input-error" : ""}
            />
            {errors.userName && (
              <p className="text-[var(--warning)] text-sm">{errors.userName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <p className="text-[var(--warning)] text-sm">{errors.email}</p>
            )}
          </div>
          <div>
            <Input
              type="text"
              label="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && (
              <p className="text-[var(--warning)] text-sm">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            label="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={errors.password ? "input-error" : ""}
          />
          <button
            type="button"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
          {errors.password && (
            <p className="text-[var(--warning)] text-sm">{errors.password}</p>
          )}
        </div>

        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            label="Xác thực mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={errors.confirmPassword ? "input-error" : ""}
          />
          <button
            type="button"
            aria-label={
              showConfirmPassword
                ? "Ẩn xác thực mật khẩu"
                : "Hiện xác thực mật khẩu"
            }
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
          {errors.confirmPassword && (
            <p className="text-[var(--error)] text-sm">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={agree}
            onChange={() => setAgree(!agree)}
            className="w-4 h-4 rounded border-gray-300"
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            Tôi đã đọc các điều khoản và điều kiện
          </label>
        </div>
        {errors.agree && (
          <p className="text-[var(--warning)] text-sm">{errors.agree}</p>
        )}

        {/* Quan trọng: Button của bạn phải forward prop `type` xuống <button> */}
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4"
          disabled={loading}
        >
          {loading ? "Đang đăng ký..." : "ĐĂNG KÝ"}
        </Button>
      </form>

      <p className="text-sm mt-6 text-gray-600 text-center">
        Bạn đã có tài khoản?{" "}
        <a href="/auth/login" className="text-[var(--primary)] hover:underline">
          Đăng nhập ngay
        </a>
      </p>

      <div className="flex items-center gap-2 pt-5">
        <hr className="flex-1 border-gray-300" />
        <span className="text-gray-500 text-sm">Hoặc đăng ký bằng</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <Button
          variant="outline-primary"
          type="button"
          aria-label="Đăng ký bằng Facebook"
          onClick={() => startOAuth("facebook")}
        >
          <FaFacebookF className="text-[var(--primary)] text-xl" />
        </Button>

        <Button
          variant="outline-primary"
          type="button"
          aria-label="Đăng ký bằng Google"
          onClick={() => startOAuth("google")}
        >
          <FcGoogle className="text-xl" />
        </Button>

        <Button
          variant="outline-primary"
          type="button"
          aria-label="Đăng ký bằng Apple"
          onClick={() => startOAuth("apple")}
        >
          <FaApple className="text-black text-xl" />
        </Button>
      </div>
    </>
  );
}
