// /components/layout/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut, List, Settings, CreditCard } from "lucide-react";
import Button from "@/components/ui/Button";
import { useEffect, useRef, useState } from "react";
import { authApi } from "@/lib/auth/authApi";
import { useAuthStore } from "#/stores/auth";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const accessToken = useAuthStore((s) => s.token.accessToken ?? "");
  const resetAuth = useAuthStore((s) => s.resetAuth);
  const setUserId = useAuthStore((s) => s.setUserId);

  const [mounted, setMounted] = useState(false);
  const isLoggedIn = mounted && !!accessToken;

  const [firstName, setFirstName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/Image.svg");
  const [memberStatus, setMemberStatus] = useState("Thành viên");

  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  // Fetch profile khi có token (và khi đổi route – để luôn sync)
  const loadProfile = async (token: string) => {
    try {
      const u = await authApi.getProfile(token);
      const full = (u.fullName || "").trim();
      const parts = full.split(/\s+/);

      setFirstName(parts[parts.length - 1] || full);
      setAvatarUrl(u.avatar || "/Image.svg");
      setMemberStatus(u.memberStatus || "Thành viên");
      setUserId(u.id);
    } catch (e: any) {
      const status = e?.response?.status;
      console.warn("getProfile (Header) failed", status, e?.message);

      // ❗️Chỉ logout khi token thật sự không hợp lệ
      if (status === 401 || status === 403) {
        resetAuth();
        router.push("/auth/login");
      }
      // Các lỗi khác (network/CORS): không xoá token, chỉ ẩn UI user
    }
  };

  useEffect(() => {
    if (!mounted) return;
    if (accessToken) {
      loadProfile(accessToken);
    } else {
      setFirstName("");
      setAvatarUrl("/Image.svg");
      setMemberStatus("Thành viên");
      setUserId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, accessToken, pathname]);

  const navItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Tour", href: "/user/destination" },
    { label: "Bài viết", href: "/user/blog" },
  ];

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/" || pathname === "/user/home"
      : pathname.startsWith(href);

  const dropdownItems = [
    { name: "Cài đặt", href: "/user/profile", icon: Settings },
    { name: "Đặt chỗ của tôi", href: "/user/bookings", icon: List },
    { name: "Thẻ của tôi", href: "/user/cards", icon: CreditCard },
  ];

  const handleLogout = () => {
    resetAuth(); // Xoá toàn bộ state + persist
    router.push("/auth/login");
  };

  if (!mounted) return null;

  return (
    <header className="bg-white shadow-sm w-full z-50">
      <div className="max-w-screen-2xl mx-auto px-5 lg:px-14 py-4 flex items-center gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/Logo.png" alt="Logo" width={140} height={140} />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex flex-1 justify-center space-x-6 text-base">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition ${
                isActive(item.href)
                  ? "text-[var(--primary)] font-bold"
                  : "text-gray-700 font-medium"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3 ml-auto">
          {!isLoggedIn && (
            <Link href="/auth/login">
              <Button variant="outline-primary">Đăng nhập / Đăng ký</Button>
            </Link>
          )}

          {isLoggedIn && (
            <div
              ref={avatarRef}
              className="relative flex items-center gap-2 cursor-pointer"
              onClick={() => setAvatarOpen((v) => !v)}
            >
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <span className="text-gray-800 font-medium">{firstName}</span>
              <ChevronDown size={16} className="text-gray-500" />

              {avatarOpen && (
                <div className="absolute right-0 top-[110%] w-60 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4 border-b bg-gray-50">
                    <p className="font-bold">{firstName}</p>
                    <p className="text-xs text-yellow-600">
                      Thành viên {memberStatus}
                    </p>
                  </div>

                  <nav className="flex flex-col py-2">
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setAvatarOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <item.icon size={18} />
                        {item.name}
                      </Link>
                    ))}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-100 border-t"
                    >
                      <LogOut size={18} /> Đăng xuất
                    </button>
                  </nav>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
