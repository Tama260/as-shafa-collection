import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter: max 5 orders per IP per 60 seconds
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Cleanup stale entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 120_000);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Rate limit by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Terlalu banyak permintaan. Silakan coba lagi nanti." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.json();

    // Server-side validation
    const {
      order_id,
      nama_lengkap,
      nomor_whatsapp,
      alamat_pengiriman,
      produk_dipilih,
      variasi_produk,
      ukuran,
      jumlah_pesanan,
      metode_pembayaran,
      catatan_tambahan,
    } = body;

    // Required fields
    if (!order_id || !nama_lengkap || !nomor_whatsapp || !alamat_pengiriman || !produk_dipilih || !metode_pembayaran) {
      return new Response(
        JSON.stringify({ error: "Field wajib tidak lengkap." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate order_id format
    if (!/^AS-\d{6}$/.test(order_id)) {
      return new Response(
        JSON.stringify({ error: "Format Order ID tidak valid." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate WhatsApp format
    if (!/^08[0-9]{8,11}$/.test(nomor_whatsapp)) {
      return new Response(
        JSON.stringify({ error: "Format nomor WhatsApp tidak valid." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate lengths
    if (typeof nama_lengkap !== "string" || nama_lengkap.trim().length < 1 || nama_lengkap.length > 200) {
      return new Response(
        JSON.stringify({ error: "Nama tidak valid." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof alamat_pengiriman !== "string" || alamat_pengiriman.trim().length < 1 || alamat_pengiriman.length > 500) {
      return new Response(
        JSON.stringify({ error: "Alamat tidak valid." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof produk_dipilih !== "string" || produk_dipilih.trim().length < 1 || produk_dipilih.length > 200) {
      return new Response(
        JSON.stringify({ error: "Produk tidak valid." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate payment method
    const validPaymentMethods = ["Transfer Bank", "COD", "E-Wallet"];
    if (!validPaymentMethods.includes(metode_pembayaran)) {
      return new Response(
        JSON.stringify({ error: "Metode pembayaran tidak valid." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate quantity
    const qty = typeof jumlah_pesanan === "number" ? jumlah_pesanan : parseInt(jumlah_pesanan);
    if (isNaN(qty) || qty < 1 || qty > 999) {
      return new Response(
        JSON.stringify({ error: "Jumlah pesanan tidak valid." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert using service role key (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabaseAdmin.from("orders").insert({
      order_id,
      nama_lengkap: nama_lengkap.trim(),
      nomor_whatsapp: nomor_whatsapp.trim(),
      alamat_pengiriman: alamat_pengiriman.trim(),
      produk_dipilih: produk_dipilih.trim(),
      variasi_produk: variasi_produk || null,
      ukuran: ukuran || null,
      jumlah_pesanan: qty,
      metode_pembayaran,
      catatan_tambahan: catatan_tambahan?.trim() || null,
    });

    if (error) {
      console.error("Insert error:", error.message);
      return new Response(
        JSON.stringify({ error: "Gagal menyimpan pesanan." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, order_id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan server." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
