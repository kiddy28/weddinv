import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { a as renderComponent, f as renderTemplate, g as maybeRenderHead, w as createComponent } from "./server_Dp_sK3eV.mjs";
import "./compiler_BlKSN11M.mjs";
import { t as $$Layout } from "./Layout_D17skDwr.mjs";
import { Heart } from "lucide-react";
//#region src/pages/404.astro
var _404_exports = /* @__PURE__ */ __exportAll({
	default: () => $$404,
	file: () => $$file,
	url: () => $$url
});
var $$404 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Page Not Found" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main class="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 text-center text-white"><div class="pointer-events-none absolute inset-0 opacity-20">${renderComponent($$result, "Heart", Heart, { "className": "absolute top-1/2 left-1/2 h-[120vw] w-[120vw] -translate-x-1/2 -translate-y-1/2 stroke-[0.1]" })}</div><div class="relative z-10 space-y-6"><h1 class="font-serif text-9xl text-white/20 italic">404</h1><h2 class="font-serif text-4xl italic md:text-6xl">Halaman Tidak Ditemukan</h2><p class="mx-auto max-w-md font-light text-white/60">Maaf, sepertinya Anda tersesat. Silakan kembali ke halaman utama undangan kami.</p><a href="/" class="mt-8 inline-block rounded-full bg-white px-10 py-4 text-xs font-bold tracking-widest text-slate-950 uppercase transition-colors hover:bg-slate-200">Kembali ke Undangan</a></div></main>` })}`;
}, "C:/Users/BIRKOMPU-P3HAL2/Documents/yanuar/code/Invitation-2-main/Invitation-2-main/src/pages/404.astro", void 0);
var $$file = "C:/Users/BIRKOMPU-P3HAL2/Documents/yanuar/code/Invitation-2-main/Invitation-2-main/src/pages/404.astro";
var $$url = "/404";
//#endregion
//#region \0virtual:astro:page:src/pages/404@_@astro
var page = () => _404_exports;
//#endregion
export { page };
