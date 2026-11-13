import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { C as createAstro, a as renderComponent, f as renderTemplate, w as createComponent } from "./server_Dp_sK3eV.mjs";
import "./compiler_BlKSN11M.mjs";
import { t as $$Layout } from "./Layout_D17skDwr.mjs";
import { n as getConfig } from "./db_Brmecv0_.mjs";
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
createAstro("https://wedding.zedlabs.id");
var $$Index = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const config = getConfig();
	const brideName = config.BRIDE_NICKNAME || "Bride";
	const groomName = config.GROOM_NICKNAME || "Groom";
	const heroImage = config.HERO_IMAGE || "/thumbnail.png";
	const toParam = Astro.url.searchParams.get("to");
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `The Wedding of ${brideName} & ${groomName}${toParam ? ` | Yth. ${toParam}` : ""}`,
		"description": `Undangan Pernikahan ${brideName} & ${groomName}. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.`,
		"image": heroImage
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "App", null, {
		"client:only": "react",
		"client:component-hydration": "only",
		"client:component-path": "C:/Users/BIRKOMPU-P3HAL2/Documents/yanuar/code/Invitation-2-main/Invitation-2-main/src/App",
		"client:component-export": "default"
	})}` })}`;
}, "C:/Users/BIRKOMPU-P3HAL2/Documents/yanuar/code/Invitation-2-main/Invitation-2-main/src/pages/index.astro", void 0);
var $$file = "C:/Users/BIRKOMPU-P3HAL2/Documents/yanuar/code/Invitation-2-main/Invitation-2-main/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
