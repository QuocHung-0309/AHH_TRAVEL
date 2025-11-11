"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminLogin } from "@/app/admin/hooks/useAdmin";
import { useAdminStore } from "#/stores/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAdminStore((s) => s.setAuth);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const { mutateAsync, isPending, error } = useAdminLogin(() =>
    router.replace("/admin/dashboard")
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const resp = await mutateAsync({ identifier, password });
    setAuth(resp.accessToken, resp.admin);
  }

  return (
    <div className="mx-auto mt-20 max-w-md rounded-2xl border bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-semibold">Đăng nhập Admin</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Username / email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <input
          className="w-full rounded border px-3 py-2"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">Đăng nhập thất bại</p>}
        <button
          disabled={isPending}
          className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {isPending ? "Đang xử lý…" : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
