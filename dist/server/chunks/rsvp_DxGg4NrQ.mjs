import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as getConfig, t as db } from "./db_Brmecv0_.mjs";
import { n as checkRateLimit, t as sendTelegramNotification } from "./telegram_D6YvhAV0.mjs";
//#region src/pages/api/rsvp.ts
var rsvp_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST
});
var sanitize = (str) => {
	if (!str) return "";
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};
var GET = async () => {
	try {
		const rsvps = db.prepare("SELECT id, guest_name, attendance, guest_count, message, created_at FROM rsvps ORDER BY created_at DESC").all();
		return new Response(JSON.stringify(rsvps), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch {
		return new Response(JSON.stringify({ error: "Failed to fetch RSVPs" }), { status: 500 });
	}
};
var POST = async ({ request, clientAddress }) => {
	if (!checkRateLimit(clientAddress || "unknown", 5, 6e4)) return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), { status: 429 });
	try {
		const rawData = await request.json();
		const guest_name = sanitize(rawData.guest_name);
		const phone = sanitize(rawData.phone);
		const message = sanitize(rawData.message);
		const attendance = rawData.attendance;
		const guest_count = rawData.guest_count;
		const existing = db.prepare("SELECT id FROM rsvps WHERE guest_name = ?").get(guest_name);
		let actionType = "";
		let resultId = 0;
		if (existing) {
			db.prepare("UPDATE rsvps SET phone=?, attendance=?, guest_count=?, message=?, created_at=? WHERE id=?").run(phone, attendance, guest_count, message || "", (/* @__PURE__ */ new Date()).toISOString(), existing.id);
			actionType = "updated";
			resultId = existing.id;
		} else {
			const result = db.prepare("INSERT INTO rsvps (guest_name, phone, attendance, guest_count, message, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(guest_name, phone, attendance, guest_count, message || "", (/* @__PURE__ */ new Date()).toISOString());
			actionType = "created";
			resultId = Number(result.lastInsertRowid);
		}
		const config = getConfig();
		sendTelegramNotification(`
${actionType === "created" ? "<b>RSVP BARU MASUK!</b>" : "<b>PEMBARUAN DATA RSVP!</b>"}

<b>Nama:</b> ${guest_name}
<b>Status:</b> ${attendance.toUpperCase()}
<b>Jml:</b> ${attendance === "hadir" ? guest_count + " Orang" : "-"}
<b>Kontak:</b> ${phone || "-"}

<b>Pesan:</b>
<i>"${message || "-"}"</i>
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
//#region \0virtual:astro:page:src/pages/api/rsvp@_@ts
var page = () => rsvp_exports;
//#endregion
export { page };
