"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetTourById } from "#/hooks/tours-hook/useTourDetail";
import {
  getCheckoutQuote,
  createCheckout,
  type CheckoutQuoteResponse,
  type CheckoutCreateResponse,
} from "#/apis/checkout/api-checkout";

/* ===== Helpers ===== */
const toNum = (v?: number | string) => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[^\d]/g, ""));
    return Number.isNaN(n) ? undefined : n;
  }
};
const vnd = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })
        .format(n)
        .replace(/\s?₫$/, "VNĐ")
    : "—";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isPhoneVN = (s: string) => /^(\+?84|0)(\d{9,10})$/.test(s.replace(/\s+/g, ""));

export default function CheckoutPage() {
  const search = useSearchParams();
  const router = useRouter();

  const id = (search.get("id") ?? "").toString();
  const initAdults = Math.max(1, Number(search.get("adults") ?? 1));
  const initChildren = Math.max(0, Number(search.get("children") ?? 0));

  const { data: tour, isLoading, isError } = useGetTourById(id);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [adults, setAdults] = useState(initAdults);
  const [children, setChildren] = useState(initChildren);

  const priceAdult = toNum(tour?.priceAdult) ?? 0;
  const priceChild = toNum(tour?.priceChild) ?? 0;

  const [quote, setQuote] = useState<CheckoutQuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fallbackTotal = useMemo(
    () => adults * priceAdult + children * priceChild,
    [adults, children, priceAdult, priceChild],
  );

  useEffect(() => {
    let ignore = false;
    if (!id) return;
    (async () => {
      try {
        setQuoteLoading(true);
        setQuoteError(null);
        const q = await getCheckoutQuote({
          tourId: id,
          guests: { adults, children },
          pricing: { priceAdult, priceChild },
          couponCode: coupon || null,
        });
        if (!ignore) setQuote(q);
      } catch (e: any) {
        if (!ignore) {
          setQuote(null);
          setQuoteError(
            typeof e?.response?.data === "string"
              ? e.response.data
              : e?.response?.data?.message || "Không lấy được tạm tính từ hệ thống.",
          );
        }
      } finally {
        if (!ignore) setQuoteLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id, adults, children, coupon, priceAdult, priceChild]);

  const onApplyCoupon = async () => {
    if (!coupon) { setCouponMsg("Vui lòng nhập mã."); return; }
    try {
      setCouponLoading(true);
      setCouponMsg("Đang áp mã…");
      setCouponMsg("Đã áp mã (nếu hợp lệ).");
    } finally {
      setCouponLoading(false);
    }
  };

  const totalFromQuote = quote?.breakdown?.total;
  const discountFromQuote = quote?.breakdown?.discount?.amount || 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!fullName.trim()) { setSubmitError("Vui lòng nhập họ tên."); return; }
    if (!isPhoneVN(phone)) { setSubmitError("Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)."); return; }
    if (!isEmail(email)) { setSubmitError("Email không hợp lệ."); return; }

    const total = typeof totalFromQuote === "number" ? totalFromQuote : fallbackTotal;

    const payload = {
      tourId: String(tour?._id ?? id),
      contact: { fullName: fullName.trim(), phone: phone.trim(), email: email.trim() },
      guests: { adults: Number(adults) || 1, children: Number(children) || 0 },
      pricing: { priceAdult: Number(priceAdult) || 0, priceChild: Number(priceChild) || 0, total: Number(total) || 0 },
      couponCode: coupon || null,
      meta: {
        title: tour?.title,
        destination: tour?.destination,
        startDate: tour?.startDate,
        endDate: tour?.endDate,
        time: tour?.time,
      },
    };

    try {
      setSubmitting(true);
      const res: CheckoutCreateResponse = await createCheckout(payload as any);
      if (res?.payment?.redirectUrl) { window.location.href = res.payment.redirectUrl; return; }
      if (res?.ok) { router.replace("/user/checkout/success"); return; }
      setSubmitError("Không tạo được đơn đặt chỗ. Vui lòng thử lại sau.");
    } catch (e: any) {
      const status = e?.response?.status;
      const msg =
        typeof e?.response?.data === "string"
          ? e.response.data
          : e?.response?.data?.message || "Đặt chỗ thất bại. Bạn thử lại giúp mình nhé!";
      setSubmitError(status ? `Lỗi ${status}: ${msg}` : msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!id) return <div className="mx-auto max-w-6xl px-5 py-12">Thiếu mã tour.</div>;
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[var(--brand-primary)]/20 border-t-[var(--brand-primary)]"></div>
          <p className="mt-4 text-lg text-slate-600">Đang tải thông tin tour...</p>
        </div>
      </div>
    );
  }
  if (isError || !tour) return <div className="mx-auto max-w-6xl px-5 py-12">Không tìm thấy tour.</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Không dùng header ở đây vì trang đã có header chung */}

      <main className="mx-auto max-w-7xl px-5 py-8 md:py-12">
        {/* Steps */}
        <div className="mb-8">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white">✓</div>
              <span className="text-sm font-medium text-slate-800">Thông tin</span>
            </div>
            <div className="h-px w-12 bg-slate-300/60" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-accent)]/10 text-[var(--brand-accent)]">2</div>
              <span className="text-sm text-slate-600">Thanh toán</span>
            </div>
            <div className="h-px w-12 bg-slate-300/60" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">3</div>
              <span className="text-sm text-slate-600">Hoàn tất</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          {/* LEFT: form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Thông tin liên hệ */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,.12)] md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Thông tin liên hệ</h2>
                  <p className="text-sm text-slate-500">Chúng tôi sẽ gửi xác nhận qua email</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Họ và tên *</label>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-primary)]/20"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Số điện thoại *</label>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-primary)]/20"
                    placeholder="0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email *</label>
                  <input
                    type="email"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-primary)]/20"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              {submitError && <p className="mt-4 text-sm font-medium text-[var(--brand-accent)]">{submitError}</p>}
            </section>

            {/* Hành khách */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,.12)] md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-accent)]/10 text-[var(--brand-accent)]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Số lượng hành khách</h2>
                  <p className="text-sm text-slate-500">Chọn số người tham gia tour</p>
                </div>
              </div>

              <div className="grid gap-4">
                {/* Người lớn */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Người lớn</div>
                      <div className="text-sm text-slate-500">Từ 12 tuổi trở lên</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] disabled:opacity-40"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      disabled={adults <= 1}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-lg font-bold text-slate-900">{adults}</span>
                    <button
                      type="button"
                      className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                      onClick={() => setAdults(adults + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Trẻ em */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-accent)]/10 text-[var(--brand-accent)]">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Trẻ em</div>
                      <div className="text-sm text-slate-500">Dưới 12 tuổi</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] disabled:opacity-40"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children <= 0}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-lg font-bold text-slate-900">{children}</span>
                    <button
                      type="button"
                      className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                      onClick={() => setChildren(children + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Coupon */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-accent)]/10 text-[var(--brand-accent)]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Mã giảm giá</h2>
                  <p className="text-sm text-slate-600">Nhập mã để nhận ưu đãi</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-[var(--brand-accent)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-accent)]/20"
                  placeholder="Nhập mã (ví dụ: AHH10)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.trim().toUpperCase())}
                />
                <button
                  type="button"
                  onClick={onApplyCoupon}
                  disabled={couponLoading || !coupon}
                  className="rounded-2xl bg-[var(--brand-accent)] px-6 py-3 font-semibold text-white shadow transition hover:brightness-110 disabled:opacity-50"
                >
                  {couponLoading ? "..." : "Áp dụng"}
                </button>
              </div>
              {couponMsg && <p className="mt-3 text-sm font-medium text-[var(--brand-accent)]">{couponMsg}</p>}
            </section>

            {/* Payment */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,.1)] md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Phương thức thanh toán</h2>
                  <p className="text-sm text-slate-500">Chuyển khoản ngân hàng</p>
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-[var(--brand-primary)]/70 bg-[var(--brand-primary)]/5 p-4 text-[var(--brand-primary)]">
                <input type="radio" name="pm" defaultChecked className="h-5 w-5 text-[var(--brand-primary)]" />
                <span>Chuyển khoản ngân hàng (xác nhận qua điện thoại)</span>
              </label>
            </section>

            {/* Submit */}
            <div className="space-y-2">
              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] px-8 py-4 text-lg font-bold text-white shadow-md transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {submitting ? "Đang tạo đơn…" : "Xác nhận đặt chỗ"}
                  {!submitting && (
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}
            </div>
          </form>

          {/* RIGHT: summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_40px_-15px_rgba(0,0,0,.15)]">
              <div className="mb-6">
                <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-2xl">
                  <Image
                    src={tour?.image ?? tour?.cover ?? "/hot1.jpg"}
                    alt={tour?.title ?? "tour"}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 text-xs text-white/90">
                      <span className="font-medium">{tour?.destination}</span>
                    </div>
                  </div>
                </div>
                <h3 className="mb-1 text-lg font-semibold leading-tight text-slate-900">{tour?.title}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg className="h-4 w-4 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{tour?.time}</span>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />

              <div className="my-6 space-y-3">
                <div className="flex items-center justify-between text-base">
                  <span className="text-slate-600">Người lớn × {adults}</span>
                  <span className="font-semibold text-slate-900">
                    {quoteLoading ? "…" : vnd(quote?.breakdown?.adults?.amount ?? adults * priceAdult)}
                  </span>
                </div>
                {children > 0 && (
                  <div className="flex items-center justify-between text-base">
                    <span className="text-slate-600">Trẻ em × {children}</span>
                    <span className="font-semibold text-slate-900">
                      {quoteLoading ? "…" : vnd(quote?.breakdown?.children?.amount ?? children * priceChild)}
                    </span>
                  </div>
                )}
                {discountFromQuote > 0 && (
                  <div className="flex items-center justify-between rounded-xl bg-[var(--brand-accent)]/10 px-3 py-2 text-base">
                    <span className="font-medium text-[var(--brand-accent)]">Giảm giá</span>
                    <span className="font-bold text-[var(--brand-accent)]">-{vnd(discountFromQuote)}</span>
                  </div>
                )}
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">Tổng thanh toán</span>
                  <span className="text-2xl font-extrabold text-[var(--brand-primary)]">
                    {quoteLoading ? "…" : vnd(typeof quote?.breakdown?.total === "number" ? quote.breakdown.total : fallbackTotal)}
                  </span>
                </div>
              </div>

              {quoteError && (
                <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  {quoteError} — hệ thống sẽ dùng tạm giá niêm yết.
                </div>
              )}

              <div className="mt-6 space-y-2 text-sm">
                <div className="text-slate-600">
                  Khởi hành:{" "}
                  <strong className="text-slate-900">
                    {tour?.startDate ? new Date(tour.startDate).toLocaleDateString("vi-VN") : "—"}
                  </strong>
                </div>
                <div className="text-slate-600">
                  Kết thúc:{" "}
                  <strong className="text-slate-900">
                    {tour?.endDate ? new Date(tour.endDate).toLocaleDateString("vi-VN") : "—"}
                  </strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
