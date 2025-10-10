import axios from "#/apis/api-constant";

export type CheckoutQuoteRequest = {
  tourId: string | number;
  guests: { adults: number; children?: number };
  pricing?: { priceAdult?: number; priceChild?: number };
  couponCode?: string | null;
};

export type CheckoutQuoteResponse = {
  ok: boolean;
  breakdown?: {
    adults?: { qty: number; unit: number; amount: number };
    children?: { qty: number; unit: number; amount: number };
    subtotal: number;
    discount?: { code?: string | null; amount: number } | null;
    total: number;
  };
  currency?: "VND";
  message?: string;
};

export type CheckoutCreateRequest = {
  tourId: string | number;
  contact: { fullName: string; phone: string; email: string };
  guests: { adults: number; children?: number };
  pricing: { priceAdult: number; priceChild: number; total: number };
  couponCode?: string | null;
  meta?: Record<string, any>;
};

export type CheckoutCreateResponse = {
  ok: boolean;
  orderId?: string;
  payment?: { method?: string; redirectUrl?: string | null; qrImageUrl?: string | null };
  message?: string;
};

// BẬT MOCK khi backend chưa có (404)
const USE_MOCK = true;

export async function getCheckoutQuote(payload: CheckoutQuoteRequest): Promise<CheckoutQuoteResponse> {
  if (USE_MOCK) {
    const { guests, pricing, couponCode } = payload;
    const adults = Number(guests.adults ?? 1);
    const children = Number(guests.children ?? 0);
    const pa = Number(pricing?.priceAdult ?? 0);
    const pc = Number(pricing?.priceChild ?? 0);
    const subtotal = adults * pa + children * pc;
    const discount = couponCode === "AHH10" ? Math.round(subtotal * 0.1) : 0;
    return Promise.resolve({
      ok: true,
      breakdown: {
        adults: { qty: adults, unit: pa, amount: adults * pa },
        children: { qty: children, unit: pc, amount: children * pc },
        subtotal,
        discount: discount ? { code: couponCode, amount: discount } : null,
        total: Math.max(0, subtotal - discount),
      },
      currency: "VND",
    });
  }

  const { data } = await axios.post("/api/checkout/quote", payload);
  return data;
}

export async function createCheckout(payload: CheckoutCreateRequest): Promise<CheckoutCreateResponse> {
  if (USE_MOCK) {
    return Promise.resolve({
      ok: true,
      orderId: "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      payment: { method: "bank_transfer", redirectUrl: null },
      message: "Mock checkout success",
    });
  }

  const { data } = await axios.post("/api/checkout", payload);
  return data;
}
    