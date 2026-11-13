import { C as createAstro, _ as renderHead, f as renderTemplate, l as renderSlot, v as addAttribute, w as createComponent } from "./server_Dp_sK3eV.mjs";
import "./compiler_BlKSN11M.mjs";
//#region src/layouts/Layout.astro
createAstro("https://wedding.zedlabs.id");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title = "The Wedding Invitation", description = "Kami mengundang Anda untuk hadir di pernikahan kami.", image = "/thumbnail.png" } = Astro.props;
	const siteOrigin = Astro.site || "https://wedding.zedlabs.id";
	const canonicalURL = new URL(Astro.url.pathname + Astro.url.search, siteOrigin);
	const ogImage = image.startsWith("http") ? image : new URL(image, siteOrigin).href;
	return renderTemplate`<html lang="id" class="scroll-smooth"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/ico" href="/favicon.ico"><meta name="generator"${addAttribute(Astro.generator, "content")}><title>${title}</title><meta name="title"${addAttribute(title, "content")}><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonicalURL, "href")}><meta property="og:type" content="website"><meta property="og:url"${addAttribute(canonicalURL, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(ogImage, "content")}><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(canonicalURL, "content")}><meta property="twitter:title"${addAttribute(title, "content")}><meta property="twitter:description"${addAttribute(description, "content")}><meta property="twitter:image"${addAttribute(ogImage, "content")}><meta name="theme-color" content="#020617"><link rel="manifest" href="/manifest.webmanifest"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@100;200;300;400;500;600&display=swap" rel="stylesheet">${renderHead($$result)}</head><body><script>
      const theme = (() => {
        if (
          typeof localStorage !== "undefined" &&
          localStorage.getItem("theme")
        ) {
          return localStorage.getItem("theme");
        }
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return "dark";
        }
        return "light";
      })();

      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    <\/script>${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "C:/Users/BIRKOMPU-P3HAL2/Documents/yanuar/code/Invitation-2-main/Invitation-2-main/src/layouts/Layout.astro", void 0);
//#endregion
export { $$Layout as t };
