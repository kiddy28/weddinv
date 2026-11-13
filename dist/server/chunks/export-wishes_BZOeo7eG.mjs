import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as db } from "./db_Brmecv0_.mjs";
//#region src/pages/api/export-wishes.ts
var export_wishes_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async () => {
	try {
		const data = db.prepare(`
      SELECT name, message, created_at 
      FROM wishes 
      ORDER BY created_at DESC
    `).all();
		const csvRows = [];
		csvRows.push([
			"Nama Pengirim",
			"Ucapan & Doa",
			"Waktu Input"
		].join(","));
		data.forEach((row) => {
			const values = [
				`"${(row.name || "").replace(/"/g, "\"\"")}"`,
				`"${(row.message || "").replace(/"/g, "\"\"").replace(/\n/g, " ")}"`,
				row.created_at
			];
			csvRows.push(values.join(","));
		});
		const csvContent = csvRows.join("\n");
		const filename = `wedding-wishes-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
		return new Response(csvContent, {
			status: 200,
			headers: {
				"Content-Type": "text/csv; charset=utf-8",
				"Content-Disposition": `attachment; filename="${filename}"`
			}
		});
	} catch (error) {
		console.error("Export Error:", error);
		return new Response("Failed to export wishes data", { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/export-wishes@_@ts
var page = () => export_wishes_exports;
//#endregion
export { page };
