import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as getConfig, t as db } from "./db_Brmecv0_.mjs";
import { n as checkRateLimit, t as sendTelegramNotification } from "./telegram_D6YvhAV0.mjs";
//#region src/pages/api/wishes.ts
var wishes_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST
});
var sanitize = (str) => {
	if (!str) return "";
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};
var GET = async () => {
	try {
		const wishes = db.prepare("SELECT * FROM wishes ORDER BY created_at DESC").all();
		return new Response(JSON.stringify(wishes), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch {
		return new Response(JSON.stringify({ error: "Failed to fetch" }), { status: 500 });
	}
};
var POST = async ({ request, clientAddress }) => {
	if (!checkRateLimit(clientAddress || "unknown", 5, 6e4)) return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), { status: 429 });
	try {
		const rawData = await request.json();
		const name = sanitize(rawData.name);
		const message = sanitize(rawData.message);
		const existing = db.prepare("SELECT id FROM wishes WHERE name = ?").get(name);
		let actionType = "";
		let resultId = 0;
		if (existing) {
			db.prepare("UPDATE wishes SET message=?, created_at=? WHERE id=?").run(message, (/* @__PURE__ */ new Date()).toISOString(), existing.id);
			actionType = "updated";
			resultId = existing.id;
		} else {
			const result = db.prepare("INSERT INTO wishes (name, message, created_at) VALUES (?, ?, ?)").run(name, message, (/* @__PURE__ */ new Date()).toISOString());
			actionType = "created";
			resultId = Number(result.lastInsertRowid);
		}
		const config = getConfig();
		sendTelegramNotification(`
${actionType === "created" ? "<b>UCAPAN & DOA BARU!</b>" : "<b>UCAPAN DIPERBARUI!</b>"}

<b>Dari:</b> ${name}

<i>"${message}"</i>
    `.trim(), config.TELEGRAM_BOT_TOKEN, config.TELEGRAM_CHAT_ID);
		return new Response(JSON.stringify({
			success: true,
			id: resultId,
			action: actionType
		}), { status: 200 });
	} catch {
		return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/wishes@_@ts
var page = () => wishes_exports;
//#endregion
export { page };
