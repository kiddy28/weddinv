import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as db } from "./db_Brmecv0_.mjs";
//#region src/pages/api/admin.ts
var admin_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request, cookies }) => {
	if (cookies.get("wedding_admin_auth")?.value !== "true") return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
	try {
		const { action, id, ids, data } = await request.json();
		const targetIds = ids || (id ? [id] : []);
		if (targetIds.length === 0 && !data) return new Response(JSON.stringify({ error: "No valid ID provided" }), { status: 400 });
		const placeholders = targetIds.map(() => "?").join(",");
		if (action === "update_rsvp") {
			const { guest_name, attendance, guest_count, message } = data;
			db.prepare("UPDATE rsvps SET guest_name=?, attendance=?, guest_count=?, message=? WHERE id=?").run(guest_name, attendance, guest_count, message, id);
			return new Response(JSON.stringify({ success: true }));
		}
		if (action === "delete_rsvp") {
			db.prepare(`DELETE FROM rsvps WHERE id IN (${placeholders})`).run(...targetIds);
			return new Response(JSON.stringify({ success: true }));
		}
		if (action === "update_wish") {
			const { name, message } = data;
			db.prepare("UPDATE wishes SET name=?, message=? WHERE id=?").run(name, message, id);
			return new Response(JSON.stringify({ success: true }));
		}
		if (action === "delete_wish") {
			db.prepare(`DELETE FROM wishes WHERE id IN (${placeholders})`).run(...targetIds);
			return new Response(JSON.stringify({ success: true }));
		}
		return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
	} catch (error) {
		console.error("Admin API Error:", error);
		return new Response(JSON.stringify({ error: error.message || "Server Error" }), { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/admin@_@ts
var page = () => admin_exports;
//#endregion
export { page };
