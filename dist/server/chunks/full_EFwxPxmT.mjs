import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as getConfig } from "./db_Brmecv0_.mjs";
//#region src/pages/api/config/full.ts
var full_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async ({ cookies }) => {
	if (cookies.get("wedding_admin_auth")?.value !== "true") return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
	try {
		const config = getConfig();
		return new Response(JSON.stringify(config), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch {
		return new Response(JSON.stringify({ error: "Failed" }), { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/config/full@_@ts
var page = () => full_exports;
//#endregion
export { page };
