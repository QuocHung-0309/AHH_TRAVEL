// src/app/auth/login/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from 'react-redux';
import { useSearchParams } from "next/navigation";
import { login as loginAction } from '@/app/admin/store/authSlice';
import { useRouter } from 'next/navigation';
import { BASE_URL } from "../utils/config";
import api from "@/services/api";


export default function LoginPage() {

  const dispatch = useDispatch();
  const searchParams = useSearchParams()
  const router = useRouter()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login data:", { email, password });
  };

  useEffect(()=> {
    const prefillEmail = searchParams.get('email')
    if (prefillEmail) setEmail(prefillEmail)
  },[searchParams])

  
  const handleLogin = async() => {

    if (!email || !password)
        return alert('Vui lòng nhập đầy đủ thông tin');

    try {
        const res = await api.post(`${BASE_URL}/users/login`, { email, password });
        const { accessToken, refreshToken, user } = res.data;

        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        }

        if (user.role !== 'admin') {
            alert('Bạn không có quyền truy cập admin');
            return;
        }

        dispatch(loginAction({accessToken:accessToken, refreshToken:refreshToken}))
        alert('Login sucessfullly')
        router.push('/admin/dashboard')        

    } catch (err) {
        alert('Failed to login')
        console.log(err)
    }
  }

  return (
    <>
      <h2 className="heading-2 font-bold text-[var(--secondary)] mb-1">ĐĂNG NHẬP QUẢN TRỊ</h2>
      <p className="text-sm text-gray-600 mb-5">Đăng nhập tài khoản Admin</p>

      <form onSubmit={handleSubmit} className="space-y-5 pt-5">
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary)]" />
            <span className="ml-2 text-sm text-gray-900">Ghi nhớ mật khẩu</span>
          </label>

          <a href="/auth/forgot-password" className="text-[var(--primary)] hover:underline">
            Quên mật khẩu?
          </a>
        </div>

        <Button onClick={handleLogin} type="submit" variant="primary" className="w-full mt-4">
          ĐĂNG NHẬP
        </Button>
      </form>
    </>
  );
}