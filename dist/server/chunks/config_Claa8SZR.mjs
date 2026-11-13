import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as parseDateFromText } from "./configParser_D1R-qDcw.mjs";
import { n as getConfig, r as setConfig } from "./db_Brmecv0_.mjs";
//#region src/pages/api/config.ts
var config_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST
});
var GET = async () => {
	try {
		const safeConfig = { ...getConfig() };
		delete safeConfig.TELEGRAM_BOT_TOKEN;
		delete safeConfig.TELEGRAM_CHAT_ID;
		return new Response(JSON.stringify(safeConfig), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch {
		return new Response(JSON.stringify({ error: "Failed to fetch config" }), { status: 500 });
	}
};
var POST = async ({ request, cookies }) => {
	if (cookies.get("wedding_admin_auth")?.value !== "true") return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
	try {
		const body = await request.json();
		for (const [key, value] of Object.entries(body)) if (typeof value === "string") setConfig(key, value);
		else setConfig(key, JSON.stringify(value));
		if (body.AKAD_DATE) {
			const parsed = parseDateFromText(body.AKAD_DATE, body.AKAD_START || "08:00");
			if (parsed && !isNaN(parsed.getTime())) {
				setConfig("AKAD_ISO_START", parsed.toISOString());
				setConfig("AKAD_ISO_END", new Date(parsed.getTime() + 7200 * 1e3).toISOString());
			}
		}
		if (body.RESEPSI_DATE) {
			const parsed = parseDateFromText(body.RESEPSI_DATE, body.RESEPSI_START || "11:00");
			if (parsed && !isNaN(parsed.getTime())) {
				setConfig("RESEPSI_ISO_START", parsed.toISOString());
				setConfig("RESEPSI_ISO_END", new Date(parsed.getTime() + 10800 * 1e3).toISOString());
			}
		}
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch {
		return new Response(JSON.stringify({ error: "Failed to save config" }), { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/config@_@ts
var page = () => config_exports;
//#endregion
export { page };
