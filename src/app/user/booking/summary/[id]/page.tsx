"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";

/** ========= Demo data (thay bằng fetch DB/Prisma) ========= */
type Booking = {
  id: string; // bookingId
  bookingStatus: "f" | "p"; // f=finished (đã đi), p=pending/ongoing
  tourId: number;
  title: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  paymentMethod: "office-payment" | "paypal-payment" | "momo-payment";
  numAdults: number;
  priceAdult: number;
  numChildren: number;
  priceChild: number;
  totalPrice: number;
};

const SAMPLE: Booking[] = [
  {
    id: "BKG123456",
    bookingStatus: "p",
    tourId: 2,
    title: "TOUR 1 NGÀY MỸ THO - BẾN TRE",
    startDate: "2025-10-20",
    endDate: "2025-10-20",
    fullName: "Nguyễn Văn A",
    email: "a@example.com",
    phoneNumber: "0901234567",
    address: "12 Đường ABC, Q.1, TP.HCM",
    paymentMethod: "office-payment",
    numAdults: 2,
    priceAdult: 480000,
    numChildren: 1,
    priceChild: 350000,
    totalPrice: 1310000,
  },
];

/** ================= Helpers ================= */
const vnd = (n: number) => n.toLocaleString("vi-VN") + " VNĐ";
const dmy = (d: string) => new Date(d).toLocaleDateString("vi-VN");

/** ================= Page ================= */
export default function BookingSummaryPage({ params }: { params: { id: string } }) {
  const booking = SAMPLE.find(b => b.id === params.id) ?? SAMPLE[0]; // TODO: fetch theo params.id
  const discount =
    booking.numAdults * booking.priceAdult + booking.numChildren * booking.priceChild - booking.totalPrice;

  const canCancel = booking.bookingStatus !== "f"; // giống điều kiện Blade

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-10">
      {/* Banner mini + breadcrumb */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-emerald-50 to-white p-5"
      >
        <nav className="text-sm text-slate-600">
          <Crumb href="/">Trang chủ</Crumb> / <Crumb href="/user">Tài khoản</Crumb> /{" "}
          <span className="font-medium text-slate-900">Đơn đặt tour</span>
        </nav>
        <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-slate-900">
          Tổng quan chuyến đi
        </h1>
        <p className="text-slate-600">
          Mã đơn: <span className="font-semibold">{booking.id}</span> • {booking.title}
        </p>
      </motion.section>

      {/* Form tổng – layout 2 cột */}
      <form action="/api/cancel-booking" method="POST" className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT: Thông tin liên lạc + Điều khoản + Phương thức thanh toán */}
        <div className="lg:col-span-7 space-y-8">
          <Card>
            <h2 className="section-title mb-4">Thông tin liên lạc</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Họ và tên*">
                <input name="fullName" defaultValue={booking.fullName} readOnly className="input" />
              </Field>
              <Field label="Email*">
                <input type="email" name="email" defaultValue={booking.email} readOnly className="input" />
              </Field>
              <Field label="Số điện thoại*">
                <input type="tel" name="tel" defaultValue={booking.phoneNumber} readOnly className="input" />
              </Field>
              <Field label="Địa chỉ*">
                <input name="address" defaultValue={booking.address} readOnly className="input" />
              </Field>
            </div>
          </Card>

          <Card>
            <h2 className="section-title mb-3">Điều khoản & bảo mật</h2>
            <p className="text-[15px] leading-relaxed text-slate-700">
              Bằng cách nhấn <b>“ĐỒNG Ý”</b>, bạn chấp thuận điều khoản sử dụng dịch vụ. Vui lòng đọc kỹ trước khi tiếp tục.
            </p>
            <label className="mt-3 inline-flex select-none items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <input type="checkbox" checked disabled className="h-4 w-4 rounded border-slate-300" />
              Tôi đã đọc và đồng ý với{" "}
              <a className="link" href="#" target="_blank" rel="noreferrer">
                Điều khoản thanh toán
              </a>
            </label>
          </Card>

          <Card>
            <h2 className="section-title mb-4">Phương thức thanh toán</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <PayOption
                label="Thanh toán tại văn phòng"
                checked={booking.paymentMethod === "office-payment"}
                img="/clients/assets/images/contact/icon.png"
              />
              <PayOption
                label="Thanh toán PayPal"
                checked={booking.paymentMethod === "paypal-payment"}
                img="/clients/assets/images/booking/cong-thanh-toan-paypal.jpg"
              />
              <PayOption
                label="Thanh toán MoMo"
                checked={booking.paymentMethod === "momo-payment"}
                img="/clients/assets/images/booking/thanh-toan-momo.jpg"
              />
            </div>
          </Card>
        </div>

        {/* RIGHT: Tóm tắt đơn + Hành động */}
        <div className="lg:col-span-5">
          <Card className="p-0 overflow-hidden">
            <div className="relative bg-gradient-to-tr from-emerald-500 to-emerald-600 p-5 text-white">
              <h3 className="text-base font-semibold">Tóm tắt đơn</h3>
              <div className="mt-2 text-sm opacity-95">
                Mã tour: <b>{booking.tourId}</b>
              </div>
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
            </div>

            <div className="p-5">
              <input type="hidden" name="bookingId" value={booking.id} />
              <input type="hidden" name="tourId" value={booking.tourId} />
              <div className="mb-4">
                <h5 className="text-[15px] font-semibold text-slate-900">{booking.title}</h5>
                <p className="text-sm text-slate-600">
                  Ngày khởi hành: <b>{dmy(booking.startDate)}</b>
                </p>
                <p className="text-sm text-slate-600">
                  Ngày kết thúc: <b>{dmy(booking.endDate)}</b>
                </p>
              </div>

              <div className="mb-4 border-b pb-4 text-[15px]">
                <Row label="Người lớn">
                  <span className="tabular-nums">
                    {booking.numAdults.toLocaleString("vi-VN")} × {vnd(booking.priceAdult)}
                  </span>
                </Row>
                <Row label="Trẻ em">
                  <span className="tabular-nums">
                    {booking.numChildren.toLocaleString("vi-VN")} × {vnd(booking.priceChild)}
                  </span>
                </Row>
                <Row label="Giảm giá">
                  <span className="tabular-nums">{vnd(discount)}</span>
                </Row>
                <Row label={<b>Tổng cộng</b>} strong>
                  <b className="tabular-nums">{vnd(booking.totalPrice)}</b>
                </Row>
              </div>

              {/* Actions */}
              {canCancel ? (
                <div className="space-y-2">
                  <Button type="submit" variant="danger" full className="py-3">
                    Hủy tour
                  </Button>
                  <Link
                    href={`/user/destination/tour-1-ngay-my-tho-ben-tre/${booking.tourId}`}
                    className="block text-center text-sm text-slate-600 underline underline-offset-2 hover:text-slate-800"
                  >
                    Xem chi tiết tour
                  </Link>
                </div>
              ) : (
                <Link
                  href={`/user/destination/tour-1-ngay-my-tho-ben-tre/${booking.tourId}#partials_reviews`}
                  className="btn-primary block text-center"
                >
                  Đánh giá
                </Link>
              )}
            </div>
          </Card>
        </div>
      </form>
    </main>
  );
}

/** ================= UI bits (đẹp + animation) ================= */
function Crumb({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded px-1 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
    >
      {children}
    </Link>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(2,6,23,0.18)] ${className}`}
    >
      {children}
    </motion.section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Row({
  label,
  children,
  strong,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className={`text-slate-600 ${strong ? "font-semibold text-slate-900" : ""}`}>{label}</span>
      <span className={`text-slate-800 ${strong ? "font-semibold" : ""}`}>{children}</span>
    </div>
  );
}

function PayOption({ img, label, checked }: { img: string; label: string; checked?: boolean }) {
  return (
    <label
      className={`flex cursor-not-allowed items-center gap-3 rounded-xl border px-3 py-2 text-sm ${
        checked ? "border-emerald-300 bg-emerald-50/60" : "border-slate-200 bg-white"
      }`}
      title={checked ? "Phương thức đã chọn" : "Chỉ hiển thị (đơn đã tạo)"}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt="" className="h-6 w-6 rounded object-cover" />
      <input type="radio" disabled checked={checked} className="h-4 w-4" />
      <span>{label}</span>
    </label>
  );
}

function Button({
  variant = "primary",
  full,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "soft" | "danger";
  full?: boolean;
}) {
  const base =
    "relative inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-semibold transition outline-none focus-visible:ring-2 focus-visible:ring-offset-0";
  const styles: Record<string, string> = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-400",
    soft: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-emerald-400",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-400",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      className={`${base} ${styles[variant]} ${full ? "w-full" : ""} ${className}`}
      {...rest}
    />
  );
}

/** ================= Token classes ================= */
const styles = {
  input:
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[15px] text-slate-800 placeholder:text-slate-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-100",
  label: "block text-[13px] font-medium text-slate-600",
  sectionTitle: "text-[18px] font-semibold text-slate-900",
  link: "underline underline-offset-2 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded",
};
// className helpers
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={styles.input + (props.className ? " " + props.className : "")} />
);
