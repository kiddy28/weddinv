import type { APIRoute } from "astro";
import { getConfig, setConfig } from "../../lib/db";
import { parseDateFromText } from "../../utils/configParser";

export const GET: APIRoute = async () => {
  try {
    const config = getConfig();
    const safeConfig = { ...config };
    delete safeConfig.TELEGRAM_BOT_TOKEN;
    delete safeConfig.TELEGRAM_CHAT_ID;
    return new Response(JSON.stringify(safeConfig), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to fetch config" }), {
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = cookies.get("wedding_admin_auth")?.value;
  if (auth !== "true") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const body = await request.json();
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        setConfig(key, value);
      } else {
        setConfig(key, JSON.stringify(value));
      }
    }

    // Auto-sinkronisasi format ISO Start & End saat admin menyimpan teks tanggal acara
    if (body.AKAD_DATE) {
      const parsed = parseDateFromText(body.AKAD_DATE, body.AKAD_START || "08:00");
      if (parsed && !isNaN(parsed.getTime())) {
        setConfig("AKAD_ISO_START", parsed.toISOString());
        const end = new Date(parsed.getTime() + 2 * 60 * 60 * 1000);
        setConfig("AKAD_ISO_END", end.toISOString());
      }
    }
    if (body.RESEPSI_DATE) {
      const parsed = parseDateFromText(body.RESEPSI_DATE, body.RESEPSI_START || "11:00");
      if (parsed && !isNaN(parsed.getTime())) {
        setConfig("RESEPSI_ISO_START", parsed.toISOString());
        const end = new Date(parsed.getTime() + 3 * 60 * 60 * 1000);
        setConfig("RESEPSI_ISO_END", end.toISOString());
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to save config" }), {
      status: 500,
    });
  }
};
