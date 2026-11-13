import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as db } from "./db_Brmecv0_.mjs";
//#region src/pages/api/export-rsvp.ts
var export_rsvp_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async () => {
	try {
		const data = db.prepare(`
      SELECT guest_name, phone, attendance, guest_count, message, created_at 
      FROM rsvps 
      ORDER BY created_at DESC
    `).all();
		const csvRows = [];
		csvRows.push([
			"Nama Tamu",
			"No HP",
			"Kehadiran",
			"Jumlah",
			"Pesan",
			"Waktu Input"
		].join(","));
		data.forEach((row) => {
			const values = [
				`"${row.guest_name}"`,
				`'${row.phone || "-"}'`,
				row.attendance,
				row.guest_count,
				`"${(row.message || "").replace(/"/g, "\"\"")}"`,
				row.created_at
			];
			csvRows.push(values.join(","));
		});
		const csvContent = csvRows.join("\n");
		return new Response(csvContent, {
			status: 200,
			headers: {
				"Content-Type": "text/csv",
				"Content-Disposition": `attachment; filename="wedding-rsvp-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv"`
			}
		});
	} catch (error) {
		console.error(error);
		return new Response("Failed to export data", { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/export-rsvp@_@ts
var page = () => export_rsvp_exports;
//#endregion
export { page };
