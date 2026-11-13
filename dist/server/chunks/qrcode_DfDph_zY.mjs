import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { C as createAstro, a as renderComponent, f as renderTemplate, g as maybeRenderHead, w as createComponent } from "./server_Dp_sK3eV.mjs";
import "./compiler_BlKSN11M.mjs";
import { t as $$Layout } from "./Layout_D17skDwr.mjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Link } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
import { QRCodeCanvas } from "qrcode.react";
//#region src/components/QRCodeGenerator.tsx
var QRCodeGenerator = ({ siteUrl }) => {
	const [guestName, setGuestName] = useState("");
	const [brideInitial, setBrideInitial] = useState("B");
	const [groomInitial, setGroomInitial] = useState("G");
	const canvasRef = useRef(null);
	const baseUrl = siteUrl?.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl || "";
	useEffect(() => {
		fetch("/api/config").then((r) => r.json()).then((data) => {
			if (data.BRIDE_NICKNAME) setBrideInitial(data.BRIDE_NICKNAME.charAt(0).toUpperCase());
			if (data.GROOM_NICKNAME) setGroomInitial(data.GROOM_NICKNAME.charAt(0).toUpperCase());
		}).catch(() => {});
	}, []);
	const generateUrl = () => {
		if (!guestName) return baseUrl;
		return `${baseUrl}/?to=${encodeURIComponent(guestName.trim())}`;
	};
	const centerLogo = useMemo(() => {
		try {
			const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#B45309;stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="white" />
          <circle cx="50" cy="50" r="46" fill="none" stroke="url(#goldGradient)" stroke-width="2" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" stroke-width="1" />
          <g font-family="'Times New Roman', Times, serif" font-weight="bold" font-size="40" fill="#334155" text-anchor="middle">
             <text x="26" y="64">${brideInitial}</text>
             <text x="74" y="64">${groomInitial}</text>
          </g>
          <path d="M50 38 C 46 32, 36 33, 36 42 C 36 52, 50 64, 50 64 C 50 64, 64 52, 64 42 C 64 33, 54 32, 50 38 Z" fill="#e11d48" stroke="white" stroke-width="1.5" />
        </svg>
      `.trim();
			return `data:image/svg+xml;base64,${btoa(svgString)}`;
		} catch {
			return "";
		}
	}, [brideInitial, groomInitial]);
	const downloadQR = () => {
		const canvas = canvasRef.current;
		if (canvas) {
			const pngUrl = canvas.toDataURL("image/png");
			const downloadLink = document.createElement("a");
			downloadLink.href = pngUrl;
			downloadLink.download = `QR-${guestName || "Wedding"}.png`;
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		}
	};
	const copyLink = () => {
		navigator.clipboard.writeText(generateUrl());
		alert("Link berhasil disalin!");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "animate-reveal grid items-center gap-10 md:grid-cols-2",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "text-xs font-bold tracking-widest text-slate-400 uppercase",
							children: "Nama Tamu"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "text",
							value: guestName,
							onChange: (e) => setGuestName(e.target.value),
							placeholder: "Contoh: Ahmad Syarief Ramadhan & Partner",
							className: "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-400 italic",
							children: "*Nama akan otomatis muncul di sampul undangan & form RSVP."
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs break-all text-slate-500 dark:border-slate-700 dark:bg-slate-900/50",
					children: generateUrl()
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex gap-4",
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: copyLink,
						className: "flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold uppercase transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
						children: [/* @__PURE__ */ jsx(Link, { className: "h-4 w-4" }), " Copy Link"]
					}), /* @__PURE__ */ jsxs("button", {
						onClick: downloadQR,
						disabled: !guestName,
						className: "flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white uppercase shadow-lg transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50",
						children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Download QR"]
					})]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-white/5",
			children: [/* @__PURE__ */ jsx("div", {
				className: "rounded-2xl border border-slate-100 bg-white p-6 shadow-xl",
				children: /* @__PURE__ */ jsx(QRCodeCanvas, {
					ref: canvasRef,
					value: generateUrl(),
					size: 280,
					level: "H",
					includeMargin: true,
					imageSettings: centerLogo ? {
						src: centerLogo,
						height: 60,
						width: 60,
						excavate: true
					} : void 0
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-8 space-y-1 text-center",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm font-bold tracking-widest text-slate-400 uppercase",
					children: "Preview Result"
				}), guestName && /* @__PURE__ */ jsxs("p", {
					className: "font-serif text-lg text-slate-800 italic dark:text-white",
					children: [
						"\"",
						guestName,
						"\""
					]
				})]
			})]
		})]
	});
};
//#endregion
//#region src/pages/qrcode.astro
var qrcode_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Qrcode,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://wedding.zedlabs.id");
var $$Qrcode = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Qrcode;
	if (!Astro.cookies.has("wedding_admin_auth")) return Astro.redirect("/admin");
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "QR Code Generator" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="min-h-screen bg-slate-50 px-4 py-20 dark:bg-slate-900"><div class="mx-auto max-w-4xl space-y-8"><div class="space-y-2 text-center"><h1 class="font-serif text-4xl italic dark:text-white">QR Code Generator</h1><p class="text-slate-500">Buat QR Code unik untuk setiap tamu undangan</p></div><div class="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl dark:border-white/5 dark:bg-slate-800">${renderComponent($$result, "QRCodeGenerator", QRCodeGenerator, {
		"client:load": true,
		"siteUrl": Astro.site?.toString() || "https://wedding.zedlabs.id",
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/BIRKOMPU-P3HAL2/Documents/yanuar/code/Invitation-2-main/Invitation-2-main/src/components/QRCodeGenerator",
		"client:component-export": "default"
	})}</div><div class="text-center"><a href="/admin" class="text-sm font-bold tracking-widest text-slate-400 uppercase hover:text-slate-600">&larr; Kembali ke Dashboard</a></div></div></div>` })}`;
}, "C:/Users/BIRKOMPU-P3HAL2/Documents/yanuar/code/Invitation-2-main/Invitation-2-main/src/pages/qrcode.astro", void 0);
var $$file = "C:/Users/BIRKOMPU-P3HAL2/Documents/yanuar/code/Invitation-2-main/Invitation-2-main/src/pages/qrcode.astro";
var $$url = "/qrcode";
//#endregion
//#region \0virtual:astro:page:src/pages/qrcode@_@astro
var page = () => qrcode_exports;
//#endregion
export { page };
