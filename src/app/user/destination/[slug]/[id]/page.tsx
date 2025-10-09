"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";

/** =========================
 *  MOCK DATA (đổi sang fetch DB sau)
 *  ========================= */
type Timeline = { timeLineId: number | string; title: string; description: string }; // HTML ok
type Tour = {
  id: number;
  slug: string;
  title: string;
  destination?: string;
  images?: string[];
  image?: string;
  price?: number;
  priceBefore?: number;
  priceAdult?: number;
  priceChild?: number;
  duration?: string;
  departTime?: string;
  startPoint?: string;
  code?: string;
  overview?: string;
  descriptionHtml?: string;
  startDate?: string;
  endDate?: string;
  avgStar?: number;
  rating?: number;
  timeline?: Timeline[];
};

const SAMPLE: Tour[] = [
  {
    id: 2,
    slug: "tour-1-ngay-my-tho-ben-tre",
    title: "TOUR 1 NGÀY MỸ THO - BẾN TRE",
    destination: "Mỹ Tho – Bến Tre",
    images: [
      "/admin/assets/images/gallery-tours/img1.jpg",
      "/admin/assets/images/gallery-tours/img2.jpg",
      "/admin/assets/images/gallery-tours/img3.jpg",
      "/admin/assets/images/gallery-tours/img4.jpg",
      "/admin/assets/images/gallery-tours/img5.jpg",
    ],
    price: 480_000,
    priceBefore: 650_000,
    priceAdult: 480_000,
    priceChild: 350_000,
    duration: "1 ngày",
    departTime: "07:30",
    startPoint: "Trung tâm Q.1",
    code: "MT-1D",
    overview: "Khám phá sông nước miền Tây, đờn ca tài tử, trái cây miệt vườn.",
    descriptionHtml:
      "<p>Khám phá sông nước miền Tây, chèo xuồng ba lá, thưởng thức đờn ca tài tử…</p>",
    startDate: "2025-10-20",
    endDate: "2025-10-20",
    avgStar: 4,
    rating: 4.6,
    timeline: [
      {
        timeLineId: 101,
        title: "TP.HCM → Mỹ Tho",
        description: "<ul><li>Khởi hành buổi sáng, tham quan chùa Vĩnh Tràng…</li></ul>",
      },
      {
        timeLineId: 102,
        title: "Bến Tre – về lại TP.HCM",
        description: "<ul><li>Chèo xuồng, thưởng thức trái cây, mật ong…</li></ul>",
      },
    ],
  },
];

/** =========================
 *  HELPERS
 *  ========================= */
const money = (n?: number) => (typeof n === "number" ? n.toLocaleString("vi-VN") + " VND" : "Liên hệ");
const pct = (b?: number, a?: number) => (b && a && b > a ? Math.round(((b - a) / b) * 100) : undefined);
const fmtDate = (d?: string) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("vi-VN");
  } catch {
    return d;
  }
};

/** =========================
 *  PAGE
 *  ========================= */
type PageProps = { params: { slug: string; id: string } };

export default function TourDetail({ params }: PageProps) {
  const { slug, id } = params;
  const tour = SAMPLE.find((d) => d.slug === slug && String(d.id) === id);
  if (!tour) return <div className="p-8">Không tìm thấy tour.</div>;

  const imgs = tour.images?.length ? tour.images : [tour.image ?? "/placeholder.jpg"];
  const discount = pct(tour.priceBefore, tour.price);
  const canReview = true; // tương đương $checkDisplay

  return (
    <main className="mx-auto max-w-[1200px]">
      {/* Banner gradient + breadcrumb */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/80 via-white to-white" />
        <div className="relative mx-auto max-w-[1200px] px-4 pt-8 pb-6">
          <nav className="mb-3 text-sm text-slate-500">
            <Crumb href="/">Trang chủ</Crumb> / <Crumb href="/user/destination">Tour</Crumb> /{" "}
            <span className="text-slate-800 font-medium">{tour.title}</span>
          </nav>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-[30px] md:text-[34px] font-extrabold tracking-tight text-slate-900">
                {tour.title}
              </h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>Mã tour: {tour.code ?? `T-${id}`}</Badge>
                {tour.duration && <Badge>{tour.duration}</Badge>}
                {tour.departTime && <Badge>Đón: {tour.departTime}</Badge>}
                {tour.startPoint && <Badge>Điểm đón: {tour.startPoint}</Badge>}
              </div>
              <div className="mt-3 flex items-center gap-2 text-slate-600">
                <i className="far fa-map-marker-alt" aria-hidden />
                <span className="text-[15px]">{tour.destination ?? "—"}</span>
                <span className="mx-2 text-slate-300">•</span>
                <Stars count={tour.avgStar ?? 0} />
              </div>
            </div>

            {/* Giá tóm tắt */}
            <div className="md:text-right">
              <div className="mt-2 inline-flex items-end gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <span className="text-xl font-bold text-emerald-700">{money(tour.price)}</span>
                {tour.priceBefore && <span className="text-sm text-slate-400 line-through">{money(tour.priceBefore)}</span>}
                {discount && (
                  <span className="ml-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Gallery mosaic */}
      <section className="px-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="grid gap-3">
            <FadeImg src={imgs[0]} alt={tour.title} className="aspect-[16/10]" />
            <FadeImg src={imgs[1]} alt={tour.title} className="aspect-[16/10]" />
          </div>
          <div className="hidden md:block">
            <FadeImg src={imgs[2]} alt={tour.title} className="h-full min-h-[300px]" />
          </div>
          <div className="grid gap-3">
            <FadeImg src={imgs[3]} alt={tour.title} className="aspect-[16/10]" />
            <FadeImg src={imgs[4]} alt={tour.title} className="aspect-[16/10]" />
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="pb-24 pt-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-8">
            {/* Khám phá tour */}
            <Card>
              <h2 className="section-title">Khám phá tour</h2>
              <div
                className="prose max-w-none prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: tour.descriptionHtml ?? tour.overview ?? "",
                }}
              />
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div>
                  <h5 className="sub-title">Bao gồm</h5>
                  <ListCheck
                    items={[
                      "Dịch vụ đón và trả khách",
                      "1 bữa ăn mỗi ngày",
                      "Bữa tối trên du thuyền & sự kiện âm nhạc",
                      "Tham quan 7 địa điểm nổi bật",
                      "Nước đóng chai trên xe buýt",
                      "Xe buýt du lịch hạng sang",
                    ]}
                  />
                </div>
                <div>
                  <h5 className="sub-title">Không bao gồm</h5>
                  <ListTimes
                    items={[
                      "Tiền boa",
                      "Đón và trả khách tại khách sạn",
                      "Bữa trưa, đồ ăn & đồ uống",
                      "Nâng cấp tùy chọn",
                      "Dịch vụ bổ sung",
                      "Bảo hiểm",
                    ]}
                  />
                </div>
              </div>
            </Card>

            {/* Lịch trình */}
            <Card>
              <h2 className="section-title">Lịch trình</h2>
              <div className="mt-4 space-y-3">
                {(tour.timeline ?? []).map((tl, idx) => (
                  <DetailsRow key={tl.timeLineId} title={`Ngày ${idx + 1} – ${tl.title}`}>
                    <div
                      className="prose max-w-none prose-li:leading-relaxed prose-p:leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: tl.description }}
                    />
                  </DetailsRow>
                ))}
              </div>
            </Card>

            {/* Reviews */}
            <Card id="partials_reviews">
              <h2 className="section-title">Đánh giá</h2>
              <p className="text-slate-600 mt-1">*(Tải danh sách đánh giá từ API/DB…)</p>
            </Card>

            {/* Thêm đánh giá */}
            {canReview && (
              <Card>
                <h2 className="section-title">Thêm đánh giá</h2>
                <form action="/api/reviews" method="POST" className="mt-4 space-y-4">
                  <div>
                    <label className="label">Đánh giá</label>
                    <StarPicker name="stars" defaultValue={5} />
                  </div>
                  <div>
                    <label htmlFor="message" className="label">
                      Nội dung
                    </label>
                    <textarea id="message" name="message" rows={5} required className="input textarea" placeholder="Chia sẻ trải nghiệm của bạn…" />
                  </div>
                  <input type="hidden" name="tourId" value={tour.id} />
                  <div className="flex gap-3">
                    <Button type="submit" variant="primary">Gửi đánh giá</Button>
                    <Button type="reset" variant="soft">Xoá nội dung</Button>
                  </div>
                </form>
              </Card>
            )}
          </div>

          {/* RIGHT / Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-20 space-y-8">
              {/* Booking */}
              <Card className="p-0 overflow-hidden">
                <div className="bg-gradient-to-tr from-emerald-500 to-emerald-600 p-5 text-white relative">
                  <h5 className="text-base font-semibold">Đặt tour ngay</h5>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-3xl font-extrabold drop-shadow-sm">{money(tour.price)}</span>
                    {tour.priceBefore && (
                      <span className="text-sm/none opacity-90 line-through">{money(tour.priceBefore)}</span>
                    )}
                    {discount && (
                      <span className="ml-auto rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold">
                        -{discount}%
                      </span>
                    )}
                  </div>
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
                </div>

                <div className="p-5">
                  <form action={`/api/booking?id=${tour.id}`} method="POST" className="space-y-4">
                    <Field label="Ngày bắt đầu">
                      <input type="text" value={fmtDate(tour.startDate)} name="startdate" disabled className="input disabled:opacity-100" />
                    </Field>
                    <Field label="Ngày kết thúc">
                      <input type="text" value={fmtDate(tour.endDate)} name="enddate" disabled className="input disabled:opacity-100" />
                    </Field>
                    <Field label="Thời gian">
                      <div className="text-[15px]">{tour.duration ?? "—"}</div>
                      <input type="hidden" name="time" value={tour.duration ?? ""} />
                    </Field>

                    <div className="my-2 border-t" />
                    <h6 className="text-sm font-semibold">Vé</h6>
                    <ul className="mt-2 space-y-1 text-[15px]">
                      <li className="flex justify-between">
                        <span>Người lớn</span>
                        <span className="font-medium">{money(tour.priceAdult ?? tour.price)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Trẻ em</span>
                        <span className="font-medium">{money(tour.priceChild)}</span>
                      </li>
                    </ul>

                    <Button type="submit" variant="primary" full className="mt-3">Đặt ngay</Button>
                    <Button type="button" variant="soft" full>Gọi tư vấn</Button>

                    <ul className="mt-4 divide-y text-xs text-slate-600">
                      <li className="py-2">• Giá minh bạch</li>
                      <li className="py-2">• Hỗ trợ 24/7</li>
                      <li className="py-2">• Miễn phí đổi ngày*</li>
                      <li className="py-2">• Thanh toán an toàn</li>
                    </ul>
                  </form>
                </div>
              </Card>

              {/* Contact */}
              <Card>
                <h5 className="sub-title mb-3">Cần trợ giúp?</h5>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <i className="far fa-envelope" aria-hidden />
                    <a href="mailto:minhdien.dev@gmail.com" className="link">minhdien.dev@gmail.com</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="far fa-phone-volume" aria-hidden />
                    <a href="tel:+00012345688" className="link">+000 (123) 456 88</a>
                  </li>
                </ul>
              </Card>

              {/* Recommendations (demo) */}
              <Card>
                <h6 className="sub-title mb-3">Tours tương tự</h6>
                <RecCard
                  href={`/user/destination/city-tour-sai-gon-nua-ngay/5`}
                  image="/admin/assets/images/gallery-tours/city1.jpg"
                  destination="TP. Hồ Chí Minh"
                  rating={4.7}
                  title="City Tour Sài Gòn nửa ngày (PM)"
                />
              </Card>
            </div>
          </aside>
        </div>
      </section>

      {/* Newsletter + Footer */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-[1200px] px-4">
          <Card>
            <h5 className="text-base font-semibold">Nhận tin mới</h5>
            <form className="mt-3 flex gap-2">
              <input className="input flex-1" placeholder="Email của bạn" />
              <Button variant="primary">Đăng ký</Button>
            </form>
          </Card>
        </div>
      </section>
      <footer className="border-t">
        <div className="mx-auto max-w-[1200px] px-4 py-6 text-sm text-slate-600">
          © {new Date().getFullYear()} Bon Phương Tours
        </div>
      </footer>
    </main>
  );
}

/** =========================
 *  UI PRIMITIVES
 *  ========================= */
function Crumb({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded px-1"
    >
      {children}
    </Link>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium shadow-sm">
      {children}
    </span>
  );
}

function Stars({ count = 0 }: { count?: number }) {
  const n = Math.max(0, Math.min(5, count));
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={`fa${i < n ? "s" : "r"} fa-star text-amber-500`} aria-hidden />
      ))}
      <span className="sr-only">{n} trên 5 sao</span>
    </span>
  );
}

function Card({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2 }}
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

function FadeImg({ src, alt, className = "" }: { src?: string; alt?: string; className?: string }) {
  const s = src ?? "/placeholder.jpg";
  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={s} alt={alt ?? "image"} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
    </motion.figure>
  );
}

function Dot({ color = "bg-emerald-100", dot = "bg-emerald-500" }: { color?: string; dot?: string }) {
  return (
    <span className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full ${color}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
    </span>
  );
}

function ListCheck({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2 text-[15px] text-slate-700">
      {items.map((t, i) => (
        <li key={i} className="flex items-start gap-2">
          <Dot />
          <span className="leading-relaxed">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function ListTimes({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2 text-[15px] text-slate-700">
      {items.map((t, i) => (
        <li key={i} className="flex items-start gap-2">
          <Dot color="bg-rose-100" dot="bg-rose-500" />
          <span className="leading-relaxed">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function DetailsRow({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <motion.details
      initial={false}
      animate={{ backgroundColor: open ? "rgba(248,250,252,0.6)" : "white" }}
      transition={{ duration: 0.25 }}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="group rounded-2xl border border-slate-200 p-4"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="font-medium text-slate-900">{title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border bg-white text-slate-600 shadow-sm"
        >
          <i className="far fa-chevron-down text-xs" />
        </motion.span>
      </summary>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, marginTop: open ? 12 : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    </motion.details>
  );
}

function StarPicker({ name, defaultValue = 5 }: { name: string; defaultValue?: number }) {
  const [val, setVal] = React.useState(defaultValue);
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1;
        const active = v <= val;
        return (
          <button
            key={v}
            type="button"
            onClick={() => setVal(v)}
            aria-label={`Đánh giá ${v}`}
            className={`text-2xl transition ${active ? "text-amber-500" : "text-slate-300 hover:text-amber-400"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded`}
          >
            <i className={`fa${active ? "s" : "r"} fa-star`} />
          </button>
        );
      })}
      <input type="hidden" name={name} value={val} />
    </div>
  );
}

function RecCard(props: { href: string; image: string; destination: string; rating?: number; title: string }) {
  const { href, image, destination, rating, title } = props;
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="h-[140px] w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
      <div className="p-3">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span className="inline-flex items-center gap-1">
            <i className="far fa-map-marker-alt" aria-hidden />
            {destination}
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="fas fa-star text-amber-500" aria-hidden />
            ({rating?.toFixed(1) ?? "—"})
          </span>
        </div>
        <h6 className="mt-1 font-semibold text-slate-900">{title}</h6>
      </div>
    </Link>
  );
}

function Button({
  variant = "primary",
  full,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "soft" | "ghost"; full?: boolean }) {
  const base =
    "relative inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition outline-none";
  const styles: Record<string, string> = {
    primary:
      "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200/50 hover:from-emerald-600 hover:to-emerald-700 focus-visible:ring-2 ring-emerald-400",
    soft: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-2 ring-emerald-400",
    ghost: "text-emerald-700 hover:bg-emerald-50 focus-visible:ring-2 ring-emerald-400",
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

/** =========================
 *  DESIGN TOKENS (utility)
 *  ========================= */
const styles = {
  input:
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[15px] text-slate-800 placeholder:text-slate-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
  textarea:
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[15px] text-slate-800 placeholder:text-slate-400 shadow-sm min-h-[120px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
  label: "block text-[13px] font-medium text-slate-600",
  sectionTitle: "text-xl font-semibold text-slate-900",
  subTitle: "text-sm font-semibold text-slate-900",
  link: "underline underline-offset-2 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded",
};

// expose class helpers
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={styles.input + " " + (props.className ?? "")} />;
