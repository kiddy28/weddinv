import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { C as createAstro, a as renderComponent, f as renderTemplate, g as maybeRenderHead, n as renderScript, o as Fragment$2, w as createComponent } from "./server_Dp_sK3eV.mjs";
import "./compiler_BlKSN11M.mjs";
import { t as $$Layout } from "./Layout_D17skDwr.mjs";
import { t as db } from "./db_Brmecv0_.mjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, CheckCircle2, ChevronLeft, ChevronRight, Copy, Download, Edit, Eye, FileSpreadsheet, FileText, HelpCircle, Loader2, LogOut, MessageCircle, Printer, QrCode, RefreshCcw, Save, Search, Settings, Sparkles, Trash2, Upload, Users, X, XCircle } from "lucide-react";
import FileSaver from "file-saver";
import jsPDF from "jspdf";
import JSZip from "jszip";
import Papa from "papaparse";
import QRCode from "qrcode";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { QRCodeCanvas } from "qrcode.react";
//#endregion
//#region src/components/InvitationManager.tsx
var THEMES = [
	{
		name: "Sage Green (Original)",
		id: "sage",
		bg: [
			255,
			255,
			255
		],
		primary: [
			85,
			107,
			47
		],
		secondary: [
			189,
			209,
			166
		],
		textMain: [
			47,
			61,
			26
		],
		textMuted: [
			110,
			120,
			90
		]
	},
	{
		name: "Classic Maroon",
		id: "maroon",
		bg: [
			255,
			252,
			252
		],
		primary: [
			128,
			0,
			32
		],
		secondary: [
			230,
			180,
			190
		],
		textMain: [
			80,
			0,
			20
		],
		textMuted: [
			150,
			80,
			90
		]
	},
	{
		name: "Royal Gold",
		id: "gold",
		bg: [
			255,
			255,
			252
		],
		primary: [
			184,
			134,
			11
		],
		secondary: [
			240,
			230,
			140
		],
		textMain: [
			101,
			67,
			33
		],
		textMuted: [
			160,
			130,
			90
		]
	},
	{
		name: "Dusty Blue",
		id: "blue",
		bg: [
			250,
			250,
			255
		],
		primary: [
			70,
			90,
			120
		],
		secondary: [
			190,
			210,
			230
		],
		textMain: [
			30,
			45,
			70
		],
		textMuted: [
			100,
			120,
			140
		]
	}
];
var InvitationManager = ({ siteUrl }) => {
	const [selectedModel, setSelectedModel] = useState("navy_floral");
	const [activeTab, setActiveTab] = useState("single");
	const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
	const [singleData, setSingleData] = useState({
		name: "",
		address: "Di Tempat"
	});
	const [bulkData, setBulkData] = useState([]);
	const [isReadingCsv, setIsReadingCsv] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isPreviewing, setIsPreviewing] = useState(false);
	const [isDownloadingSingle, setIsDownloadingSingle] = useState(false);
	const [progress, setProgress] = useState(0);
	const [statusMsg, setStatusMsg] = useState("");
	const [previewUri, setPreviewUri] = useState(null);
	const [cfg, setCfg] = useState({});
	useEffect(() => {
		fetch("/api/config").then((r) => r.json()).then((data) => setCfg(data)).catch(() => {});
	}, []);
	const baseUrl = siteUrl?.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl || "";
	const handleSaveAs = (blob, name) => {
		(FileSaver.saveAs || FileSaver)(blob, name);
	};
	const drawLeaf = (doc, x, y, size, angle) => {
		const rad = angle * Math.PI / 180;
		const ctx = {
			c: Math.cos(rad),
			s: Math.sin(rad)
		};
		const t = (lx, ly) => ({
			x: x + (lx * ctx.c - ly * ctx.s) * size,
			y: y + (lx * ctx.s + ly * ctx.c) * size
		});
		doc.setFillColor(currentTheme.secondary[0], currentTheme.secondary[1], currentTheme.secondary[2]);
		doc.setDrawColor(currentTheme.primary[0], currentTheme.primary[1], currentTheme.primary[2]);
		doc.setLineWidth(.15);
		const p1 = t(0, 0);
		const p2 = t(5, 2.5);
		const p3 = t(10, 0);
		const p4 = t(5, -2.5);
		doc.triangle(p1.x, p1.y, p3.x, p3.y, p2.x, p2.y, "FD");
		doc.triangle(p1.x, p1.y, p3.x, p3.y, p4.x, p4.y, "FD");
		doc.setLineWidth(.1);
		doc.line(p1.x, p1.y, p3.x, p3.y);
	};
	const drawRose = (doc, x, y, size) => {
		doc.setFillColor(255, 255, 255);
		doc.setDrawColor(currentTheme.primary[0], currentTheme.primary[1], currentTheme.primary[2]);
		doc.setLineWidth(.25);
		doc.circle(x, y, size, "FD");
		const steps = 18;
		let radius = .8;
		let angle = 0;
		let prevX = x;
		let prevY = y;
		for (let i = 0; i < steps; i++) {
			angle += .7;
			radius += size / steps;
			const nextX = x + Math.cos(angle) * radius;
			const nextY = y + Math.sin(angle) * radius;
			if (i > 1) {
				doc.setLineWidth(.15 - i * .005);
				doc.line(prevX, prevY, nextX, nextY);
			}
			prevX = nextX;
			prevY = nextY;
		}
	};
	const drawFloralCluster = (doc, cx, cy, rot) => {
		[
			{
				s: 1.6,
				a: rot + 5,
				d: 9
			},
			{
				s: 1.3,
				a: rot + 35,
				d: 9
			},
			{
				s: 1.6,
				a: rot + 75,
				d: 9
			},
			{
				s: 1.1,
				a: rot + 20,
				d: 13
			},
			{
				s: 1.1,
				a: rot + 60,
				d: 13
			},
			{
				s: .9,
				a: rot + 45,
				d: 15
			}
		].forEach((l) => {
			drawLeaf(doc, cx + Math.cos(l.a * Math.PI / 180) * l.d, cy + Math.sin(l.a * Math.PI / 180) * l.d, l.s, l.a);
		});
		drawRose(doc, cx, cy, 7.5);
		[
			{
				a: rot + 15,
				d: 10
			},
			{
				a: rot + 65,
				d: 10
			},
			{
				a: rot + 40,
				d: 12
			}
		].forEach((b) => {
			drawRose(doc, cx + Math.cos(b.a * Math.PI / 180) * b.d, cy + Math.sin(b.a * Math.PI / 180) * b.d, 3.5);
		});
	};
	const drawBorder = (doc, w, h) => {
		const m = 6;
		doc.setDrawColor(currentTheme.primary[0], currentTheme.primary[1], currentTheme.primary[2]);
		doc.setLineWidth(.5);
		doc.rect(m, m, w - m * 2, h - m * 2);
		doc.setLineWidth(.15);
		doc.rect(7.5, 7.5, w - 7.5 * 2, h - 7.5 * 2);
		doc.setLineWidth(.15);
		doc.rect(8.5, 8.5, w - 8.5 * 2, h - 8.5 * 2);
	};
	const drawCornerDecorations = (doc, width, height) => {
		const offset = 12;
		drawFloralCluster(doc, offset, offset, 0);
		drawFloralCluster(doc, width - offset, offset, 90);
		drawFloralCluster(doc, width - offset, height - offset, 180);
		drawFloralCluster(doc, offset, height - offset, 270);
		doc.setDrawColor(currentTheme.secondary[0], currentTheme.secondary[1], currentTheme.secondary[2]);
		doc.setLineWidth(.1);
		[
			{
				x: width / 2,
				y: 8
			},
			{
				x: width / 2,
				y: height - 8
			},
			{
				x: 8,
				y: height / 2
			},
			{
				x: width - 8,
				y: height / 2
			}
		].forEach((pos) => {
			for (let i = 0; i < 3; i++) {
				const size = .8 - i * .2;
				doc.circle(pos.x, pos.y, size, "D");
			}
		});
	};
	const generateClassicFloralPDF = async (guest) => {
		const brideName = cfg.BRIDE_NICKNAME || "Bride";
		const groomName = cfg.GROOM_NICKNAME || "Groom";
		const brideFullName = cfg.BRIDE_FULLNAME || "Bride";
		const groomFullName = cfg.GROOM_FULLNAME || "Groom";
		const brideParents = cfg.BRIDE_PARENTS || "";
		const groomParents = cfg.GROOM_PARENTS || "";
		const venueName = cfg.VENUE_NAME || "";
		const venueAddress = cfg.VENUE_ADDRESS || "";
		const venueLat = cfg.VENUE_LAT || "0";
		const venueLng = cfg.VENUE_LNG || "0";
		const akadTitle = cfg.AKAD_TITLE || "Akad Nikah";
		const akadDay = cfg.AKAD_DAY || "";
		const akadDate = cfg.AKAD_DATE || "";
		const akadStart = cfg.AKAD_START || "";
		const akadEnd = cfg.AKAD_END || "";
		const resepsiTitle = cfg.RESEPSI_TITLE || "Resepsi Pernikahan";
		const resepsiDay = cfg.RESEPSI_DAY || "";
		const resepsiDate = cfg.RESEPSI_DATE || "";
		const resepsiStart = cfg.RESEPSI_START || "";
		const resepsiEnd = cfg.RESEPSI_END || "";
		const salamOpening = cfg.TEXT_SALAM_OPENING || "Assalamu'alaikum Warahmatullahi Wabarakatuh";
		const quoteArRum = cfg.TEXT_QUOTE_AR_RUM || "";
		const closingText = cfg.TEXT_CLOSING || "";
		const salamClosing = cfg.TEXT_SALAM_CLOSING || "Wassalamu'alaikum Warahmatullahi Wabarakatuh";
		const signature = cfg.TEXT_SIGNATURE || "Kami yang berbahagia,";
		const doc = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: "a5"
		});
		const width = doc.internal.pageSize.getWidth();
		const height = doc.internal.pageSize.getHeight();
		const cx = width / 2;
		const guestUrl = `${baseUrl}/?to=${encodeURIComponent(guest.name)}`;
		const qrGuestImg = await QRCode.toDataURL(guestUrl, {
			margin: 0,
			color: {
				dark: "#2f3d1a",
				light: "#ffffff"
			}
		});
		const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${venueLat},${venueLng}`;
		const qrMapsImg = await QRCode.toDataURL(mapsUrl, {
			margin: 0,
			color: {
				dark: "#2f3d1a",
				light: "#ffffff"
			}
		});
		doc.setFillColor(currentTheme.bg[0], currentTheme.bg[1], currentTheme.bg[2]);
		doc.rect(0, 0, width, height, "F");
		drawBorder(doc, width, height);
		drawCornerDecorations(doc, width, height);
		doc.setFont("times", "bold");
		doc.setFontSize(12);
		doc.setTextColor(currentTheme.textMuted[0], currentTheme.textMuted[1], currentTheme.textMuted[2]);
		doc.text("THE WEDDING OF", cx, 50, { align: "center" });
		doc.setFont("times", "italic");
		doc.setFontSize(40);
		doc.setTextColor(currentTheme.textMain[0], currentTheme.textMain[1], currentTheme.textMain[2]);
		doc.text(brideName, cx, 75, { align: "center" });
		doc.setFont("times", "normal");
		doc.setFontSize(16);
		doc.setTextColor(currentTheme.primary[0], currentTheme.primary[1], currentTheme.primary[2]);
		doc.text("&", cx, 88, { align: "center" });
		doc.setFont("times", "italic");
		doc.setFontSize(40);
		doc.setTextColor(currentTheme.textMain[0], currentTheme.textMain[1], currentTheme.textMain[2]);
		doc.text(groomName, cx, 105, { align: "center" });
		doc.setDrawColor(currentTheme.secondary[0], currentTheme.secondary[1], currentTheme.secondary[2]);
		doc.setLineWidth(.2);
		doc.line(cx - 20, 115, cx + 20, 115);
		doc.setFont("times", "bold");
		doc.setFontSize(9);
		doc.setTextColor(currentTheme.textMuted[0], currentTheme.textMuted[1], currentTheme.textMuted[2]);
		doc.text(resepsiDate.toUpperCase(), cx, 125, { align: "center" });
		const boxY = 155;
		const boxW = 85;
		const boxH = 30;
		doc.setFillColor(250, 250, 250);
		doc.setDrawColor(currentTheme.secondary[0], currentTheme.secondary[1], currentTheme.secondary[2]);
		doc.setLineWidth(.3);
		doc.roundedRect(cx - boxW / 2 + .5, 155.5, boxW, boxH, 2, 2, "F");
		doc.setFillColor(255, 255, 255);
		doc.setDrawColor(currentTheme.primary[0], currentTheme.primary[1], currentTheme.primary[2]);
		doc.setLineWidth(.5);
		doc.roundedRect(cx - boxW / 2, boxY, boxW, boxH, 2, 2, "FD");
		doc.setFont("times", "normal");
		doc.setFontSize(9);
		doc.text("Kepada Yth. Bapak/Ibu/Saudara/i:", cx, 163, { align: "center" });
		doc.setFont("times", "bolditalic");
		doc.setFontSize(14);
		doc.setTextColor(currentTheme.textMain[0], currentTheme.textMain[1], currentTheme.textMain[2]);
		const splitName = doc.splitTextToSize(guest.name, boxW - 5);
		doc.text(splitName, cx, 173, { align: "center" });
		if (guest.address) {
			doc.setFont("times", "normal");
			doc.setFontSize(9);
			doc.setTextColor(currentTheme.textMuted[0], currentTheme.textMuted[1], currentTheme.textMuted[2]);
			doc.text(guest.address, cx, 181, { align: "center" });
		}
		doc.addPage();
		drawBorder(doc, width, height);
		drawCornerDecorations(doc, width, height);
		doc.setFont("times", "bold");
		doc.setFontSize(12);
		doc.setTextColor(currentTheme.textMain[0], currentTheme.textMain[1], currentTheme.textMain[2]);
		doc.text(salamOpening, cx, 50, { align: "center" });
		doc.setFont("times", "italic");
		doc.setFontSize(10);
		doc.setTextColor(currentTheme.textMuted[0], currentTheme.textMuted[1], currentTheme.textMuted[2]);
		const quote = doc.splitTextToSize(quoteArRum, width - 60);
		doc.text(quote, cx, 60, { align: "center" });
		doc.setFont("times", "normal");
		doc.setFontSize(10);
		doc.text("Kami bermaksud menyelenggarakan pernikahan putra-putri kami:", cx, 95, { align: "center" });
		doc.setFont("times", "bold");
		doc.setFontSize(16);
		doc.setTextColor(currentTheme.primary[0], currentTheme.primary[1], currentTheme.primary[2]);
		doc.text(brideFullName, cx, 110, { align: "center" });
		doc.setFont("times", "normal");
		doc.setFontSize(9);
		doc.setTextColor(currentTheme.textMuted[0], currentTheme.textMuted[1], currentTheme.textMuted[2]);
		doc.text(brideParents, cx, 117, { align: "center" });
		doc.setFont("times", "italic");
		doc.setFontSize(12);
		doc.text("&", cx, 127, { align: "center" });
		doc.setFont("times", "bold");
		doc.setFontSize(16);
		doc.setTextColor(currentTheme.primary[0], currentTheme.primary[1], currentTheme.primary[2]);
		doc.text(groomFullName, cx, 137, { align: "center" });
		doc.setFont("times", "normal");
		doc.setFontSize(9);
		doc.setTextColor(currentTheme.textMuted[0], currentTheme.textMuted[1], currentTheme.textMuted[2]);
		doc.text(groomParents, cx, 144, { align: "center" });
		doc.addPage();
		drawBorder(doc, width, height);
		drawCornerDecorations(doc, width, height);
		doc.setFont("times", "italic");
		doc.setFontSize(11);
		doc.setTextColor(currentTheme.textMain[0], currentTheme.textMain[1], currentTheme.textMain[2]);
		doc.text("Insya Allah acara akan dilaksanakan pada:", cx, 35, { align: "center" });
		doc.setFont("times", "bold");
		doc.setFontSize(14);
		doc.setTextColor(currentTheme.primary[0], currentTheme.primary[1], currentTheme.primary[2]);
		doc.text(akadTitle, cx, 50, { align: "center" });
		doc.setFont("times", "normal");
		doc.setFontSize(10);
		doc.setTextColor(currentTheme.textMain[0], currentTheme.textMain[1], currentTheme.textMain[2]);
		doc.text(`${akadDay}, ${akadDate}`, cx, 57, { align: "center" });
		doc.text(`Pukul: ${akadStart} - ${akadEnd} WIB`, cx, 62, { align: "center" });
		doc.setDrawColor(currentTheme.secondary[0], currentTheme.secondary[1], currentTheme.secondary[2]);
		doc.setLineWidth(.15);
		doc.line(cx - 20, 70, cx - 5, 70);
		doc.line(cx + 5, 70, cx + 20, 70);
		doc.setFillColor(currentTheme.primary[0], currentTheme.primary[1], currentTheme.primary[2]);
		for (let i = 0; i < 3; i++) doc.circle(cx - 2 + i, 70, .3, "F");
		doc.setFont("times", "bold");
		doc.setFontSize(14);
		doc.setTextColor(currentTheme.primary[0], currentTheme.primary[1], currentTheme.primary[2]);
		doc.text(resepsiTitle, cx, 85, { align: "center" });
		doc.setFont("times", "normal");
		doc.setFontSize(10);
		doc.setTextColor(currentTheme.textMain[0], currentTheme.textMain[1], currentTheme.textMain[2]);
		doc.text(`${resepsiDay}, ${resepsiDate}`, cx, 92, { align: "center" });
		doc.text(`Pukul: ${resepsiStart} - ${resepsiEnd} WIB`, cx, 97, { align: "center" });
		doc.setFont("times", "bold");
		doc.setFontSize(12);
		doc.setTextColor(currentTheme.textMain[0], currentTheme.textMain[1], currentTheme.textMain[2]);
		doc.text("BERTEMPAT DI:", cx, 115, { align: "center" });
		doc.setFont("times", "normal");
		doc.setFontSize(11);
		doc.text(venueName, cx, 122, { align: "center" });
		doc.setFontSize(9);
		doc.setTextColor(currentTheme.textMuted[0], currentTheme.textMuted[1], currentTheme.textMuted[2]);
		const addr = doc.splitTextToSize(venueAddress, 80);
		doc.text(addr, cx, 128, { align: "center" });
		const qrSize = 22;
		const qrY = 145;
		doc.setDrawColor(currentTheme.secondary[0], currentTheme.secondary[1], currentTheme.secondary[2]);
		doc.setLineWidth(.3);
		doc.roundedRect(cx - qrSize / 2 - 1.5, qrY - 1.5, 25, 25, 1, 1);
		doc.addImage(qrMapsImg, "PNG", cx - qrSize / 2, qrY, qrSize, qrSize);
		doc.text("Scan Google Maps", cx, 172, { align: "center" });
		doc.addPage();
		drawBorder(doc, width, height);
		drawCornerDecorations(doc, width, height);
		doc.setFont("times", "bold");
		doc.setFontSize(10);
		doc.setTextColor(currentTheme.primary[0], currentTheme.primary[1], currentTheme.primary[2]);
		doc.text("E-INVITATION", cx, 50, { align: "center" });
		const qrDigiSize = 40;
		const digiY = 60;
		doc.setFillColor(currentTheme.bg[0], currentTheme.bg[1], currentTheme.bg[2]);
		doc.setDrawColor(currentTheme.secondary[0], currentTheme.secondary[1], currentTheme.secondary[2]);
		doc.setLineWidth(.3);
		doc.roundedRect(cx - qrDigiSize / 2 - 2.5, digiY - 2.5, 45, 45, 2, 2, "FD");
		doc.setDrawColor(currentTheme.primary[0], currentTheme.primary[1], currentTheme.primary[2]);
		doc.setLineWidth(.4);
		doc.roundedRect(cx - qrDigiSize / 2 - 2, digiY - 2, 44, 44, 1.5, 1.5, "D");
		doc.addImage(qrGuestImg, "PNG", cx - qrDigiSize / 2, digiY, qrDigiSize, qrDigiSize);
		doc.setFont("times", "normal");
		doc.setFontSize(9);
		doc.setTextColor(currentTheme.textMuted[0], currentTheme.textMuted[1], currentTheme.textMuted[2]);
		doc.text("Scan untuk buka undangan digital & konfirmasi kehadiran", cx, 108, { align: "center" });
		const closingY = 135;
		doc.setFont("times", "normal");
		doc.setFontSize(10);
		doc.setTextColor(currentTheme.textMain[0], currentTheme.textMain[1], currentTheme.textMain[2]);
		const closing = doc.splitTextToSize(closingText, width - 60);
		doc.text(closing, cx, closingY, { align: "center" });
		doc.setFont("times", "bolditalic");
		doc.text(salamClosing, cx, 155, { align: "center" });
		doc.setFont("times", "normal");
		doc.setFontSize(9);
		doc.text(signature, cx, 165, { align: "center" });
		doc.setFont("times", "bold");
		doc.setFontSize(12);
		doc.setTextColor(currentTheme.primary[0], currentTheme.primary[1], currentTheme.primary[2]);
		doc.text(`${brideName} & ${groomName}`, cx, 173, { align: "center" });
		doc.setDrawColor(currentTheme.secondary[0], currentTheme.secondary[1], currentTheme.secondary[2]);
		doc.setLineWidth(.1);
		for (let i = 0; i < 5; i++) doc.circle(cx + (-10 + i * 5), 183, .4, "D");
		return doc;
	};
	const drawNavyPetal = (doc, cx, cy, r, color) => {
		doc.setFillColor(color[0], color[1], color[2]);
		doc.setDrawColor(Math.max(color[0] - 25, 0), Math.max(color[1] - 25, 0), Math.max(color[2] - 20, 0));
		doc.setLineWidth(.12);
		doc.circle(cx, cy, r, "FD");
	};
	const drawNavyFlower = (doc, cx, cy, size, variant = "light") => {
		const petalColor = variant === "light" ? [
			168,
			185,
			238
		] : variant === "deep" ? [
			115,
			155,
			212
		] : [
			135,
			170,
			225
		];
		const innerPetalColor = variant === "light" ? [
			188,
			205,
			248
		] : variant === "deep" ? [
			140,
			175,
			225
		] : [
			155,
			185,
			235
		];
		const numPetals = 5;
		const dist = size * .52;
		const r = size * .44;
		for (let i = 0; i < numPetals; i++) {
			const angle = i * 2 * Math.PI / numPetals - Math.PI / 2;
			drawNavyPetal(doc, cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, r, petalColor);
		}
		for (let i = 0; i < numPetals; i++) {
			const angle = i * 2 * Math.PI / numPetals - Math.PI / 2 + Math.PI / 5;
			drawNavyPetal(doc, cx + Math.cos(angle) * (dist * .72), cy + Math.sin(angle) * (dist * .72), r * .72, innerPetalColor);
		}
		doc.setFillColor(25, 45, 75);
		doc.setDrawColor(15, 30, 50);
		doc.setLineWidth(.1);
		doc.circle(cx, cy, size * .28, "FD");
		doc.setFillColor(242, 160, 48);
		doc.circle(cx, cy, size * .19, "F");
		doc.setFillColor(255, 245, 220);
		const numStamens = 7;
		for (let j = 0; j < numStamens; j++) {
			const sAngle = j * 2 * Math.PI / numStamens;
			const sx = cx + Math.cos(sAngle) * (size * .23);
			const sy = cy + Math.sin(sAngle) * (size * .23);
			doc.circle(sx, sy, .22, "F");
		}
	};
	const drawNavyLeaf = (doc, x, y, size, angleDeg, color = [
		75,
		105,
		110
	]) => {
		const rad = angleDeg * Math.PI / 180;
		const c = Math.cos(rad);
		const s = Math.sin(rad);
		const t = (lx, ly) => ({
			x: x + (lx * c - ly * s) * size,
			y: y + (lx * s + ly * c) * size
		});
		doc.setFillColor(color[0], color[1], color[2]);
		doc.setDrawColor(Math.max(color[0] - 25, 0), Math.max(color[1] - 25, 0), Math.max(color[2] - 25, 0));
		doc.setLineWidth(.12);
		const p1 = t(0, 0);
		const p2 = t(5, 2.4);
		const p3 = t(11, 0);
		const p4 = t(5, -2.4);
		doc.triangle(p1.x, p1.y, p3.x, p3.y, p2.x, p2.y, "FD");
		doc.triangle(p1.x, p1.y, p3.x, p3.y, p4.x, p4.y, "FD");
		doc.setDrawColor(Math.min(color[0] + 35, 255), Math.min(color[1] + 35, 255), Math.min(color[2] + 35, 255));
		doc.setLineWidth(.1);
		doc.line(p1.x, p1.y, p3.x, p3.y);
	};
	const drawNavyGoldBranches = (doc, divX) => {
		doc.setDrawColor(218, 175, 55);
		doc.setLineWidth(.25);
		[
			{
				start: [divX - 25, 30],
				end: [divX - 6, 55]
			},
			{
				start: [divX - 12, 45],
				end: [divX + 5, 35]
			},
			{
				start: [divX - 28, 48],
				end: [divX - 14, 25]
			},
			{
				start: [divX - 18, 155],
				end: [divX - 28, 185]
			},
			{
				start: [divX - 10, 162],
				end: [divX + 3, 192]
			},
			{
				start: [divX - 22, 170],
				end: [divX - 12, 202]
			}
		].forEach((b) => {
			doc.line(b.start[0], b.start[1], b.end[0], b.end[1]);
			doc.circle(b.end[0], b.end[1], .8, "D");
		});
	};
	const drawNavyFloralComposition = (doc, divX) => {
		drawNavyGoldBranches(doc, divX);
		[
			{
				x: divX - 18,
				y: 55,
				s: 1.1,
				a: -60,
				c: [
					75,
					105,
					110
				]
			},
			{
				x: divX - 10,
				y: 62,
				s: 1.3,
				a: -40,
				c: [
					95,
					125,
					130
				]
			},
			{
				x: divX - 4,
				y: 68,
				s: 1.2,
				a: 15,
				c: [
					60,
					90,
					95
				]
			},
			{
				x: divX - 26,
				y: 72,
				s: 1,
				a: -85,
				c: [
					115,
					140,
					145
				]
			},
			{
				x: divX - 30,
				y: 88,
				s: 1.2,
				a: -110,
				c: [
					85,
					115,
					120
				]
			},
			{
				x: divX - 24,
				y: 110,
				s: 1.3,
				a: -125,
				c: [
					65,
					95,
					100
				]
			},
			{
				x: divX + 3,
				y: 90,
				s: 1.2,
				a: 20,
				c: [
					75,
					105,
					110
				]
			},
			{
				x: divX + 5,
				y: 118,
				s: 1.1,
				a: 35,
				c: [
					90,
					120,
					125
				]
			},
			{
				x: divX - 22,
				y: 135,
				s: 1.2,
				a: -140,
				c: [
					75,
					105,
					110
				]
			},
			{
				x: divX - 16,
				y: 154,
				s: 1.3,
				a: -150,
				c: [
					95,
					125,
					130
				]
			},
			{
				x: divX - 8,
				y: 168,
				s: 1.2,
				a: -120,
				c: [
					60,
					90,
					95
				]
			},
			{
				x: divX - 18,
				y: 180,
				s: 1,
				a: -160,
				c: [
					115,
					140,
					145
				]
			},
			{
				x: divX - 24,
				y: 145,
				s: 1.1,
				a: -130,
				c: [
					70,
					100,
					105
				]
			}
		].forEach((lf) => {
			drawNavyLeaf(doc, lf.x, lf.y, lf.s, lf.a, lf.c);
		});
		drawNavyFlower(doc, divX - 16, 52, 4.5, "light");
		drawNavyFlower(doc, divX - 24, 76, 5.5, "light");
		drawNavyFlower(doc, divX - 15, 142, 6, "light");
		drawNavyFlower(doc, divX - 10, 160, 5, "light");
		drawNavyFlower(doc, divX - 10, 68, 7.5, "light");
		drawNavyFlower(doc, divX - 7, 126, 7.5, "deep");
		drawNavyFlower(doc, divX - 1, 100, 11, "anemone");
		drawNavyFlower(doc, divX - 14, 110, 8.5, "light");
		drawNavyFlower(doc, divX - 12, 88, 7, "deep");
	};
	const BULAN_FULL = {
		JAN: "Januari",
		FEB: "Februari",
		MAR: "Maret",
		APR: "April",
		MEI: "Mei",
		MAY: "Mei",
		JUN: "Juni",
		JUL: "Juli",
		AGU: "Agustus",
		AUG: "Agustus",
		SEP: "September",
		OKT: "Oktober",
		OCT: "Oktober",
		NOV: "November",
		DES: "Desember",
		DEC: "Desember"
	};
	const HARI_FULL = {
		MIN: "Minggu",
		SEN: "Senin",
		SEL: "Selasa",
		RAB: "Rabu",
		KAM: "Kamis",
		JUM: "Jumat",
		SAB: "Sabtu",
		MINGGU: "Minggu",
		SENIN: "Senin",
		SELASA: "Selasa",
		RABU: "Rabu",
		KAMIS: "Kamis",
		JUMAT: "Jumat",
		SABTU: "Sabtu",
		SUN: "Minggu",
		MON: "Senin",
		TUE: "Selasa",
		WED: "Rabu",
		THU: "Kamis",
		FRI: "Jumat",
		SAT: "Sabtu"
	};
	const parseBadgeInfo = (dateStr, dayStr) => {
		let dayNum = "21";
		let monthStr = "Mei";
		if (dateStr) {
			const match = dateStr.match(/(\d{1,2})\s+([a-zA-Z]+)/);
			if (match) {
				dayNum = match[1];
				monthStr = BULAN_FULL[match[2].toUpperCase().slice(0, 3)] || match[2];
			}
		}
		return {
			dayName: HARI_FULL[(dayStr || "Jumat").toUpperCase().trim()] || dayStr || "Jumat",
			dayNum,
			monthStr
		};
	};
	let cachedNavyBgDataUrl = null;
	const getNavyFloralBg = async () => {
		if (cachedNavyBgDataUrl) return cachedNavyBgDataUrl;
		try {
			const res = await fetch("/templates/navy-floral-bg.jpg");
			if (!res.ok) return null;
			const blob = await res.blob();
			return new Promise((resolve) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					cachedNavyBgDataUrl = reader.result;
					resolve(cachedNavyBgDataUrl);
				};
				reader.onerror = () => resolve(null);
				reader.readAsDataURL(blob);
			});
		} catch (e) {
			console.error("Gagal load navy floral template:", e);
			return null;
		}
	};
	const generateNavyFloralPDF = async (guest) => {
		const brideName = cfg.BRIDE_NICKNAME || "Elizabeth";
		const groomName = cfg.GROOM_NICKNAME || "Andrean";
		const brideFullName = cfg.BRIDE_FULLNAME || "Elizabeth Alexandra";
		const groomFullName = cfg.GROOM_FULLNAME || "Andrean Pratama";
		const brideParents = cfg.BRIDE_PARENTS || "Putri dari Bpk. Alexandra & Ibu Maria";
		const groomParents = cfg.GROOM_PARENTS || "Putra dari Bpk. Pratama & Ibu Ratna";
		const venueName = cfg.VENUE_NAME || "The Royal Azure Ballroom";
		const venueAddress = cfg.VENUE_ADDRESS || "Jl. Sudirman No. 4567, Jakarta Pusat";
		const venueLat = cfg.VENUE_LAT || "0";
		const venueLng = cfg.VENUE_LNG || "0";
		const akadTitle = cfg.AKAD_TITLE || "Akad Nikah";
		const akadDay = cfg.AKAD_DAY || "Jumat";
		const akadDate = cfg.AKAD_DATE || "21 Mei 2026";
		const akadStart = cfg.AKAD_START || "10:00";
		const akadEnd = cfg.AKAD_END || "12:00";
		const resepsiTitle = cfg.RESEPSI_TITLE || "Resepsi Pernikahan";
		const resepsiDay = cfg.RESEPSI_DAY || "Jumat";
		const resepsiDate = cfg.RESEPSI_DATE || "21 Mei 2026";
		const resepsiStart = cfg.RESEPSI_START || "13:00";
		const resepsiEnd = cfg.RESEPSI_END || "16:00";
		const salamOpening = cfg.TEXT_SALAM_OPENING || "Assalamu'alaikum Warahmatullahi Wabarakatuh";
		const quoteArRum = cfg.TEXT_QUOTE_AR_RUM || "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)";
		const closingText = cfg.TEXT_CLOSING || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.";
		const salamClosing = cfg.TEXT_SALAM_CLOSING || "Wassalamu'alaikum Warahmatullahi Wabarakatuh";
		const signature = cfg.TEXT_SIGNATURE || "Kami yang berbahagia,";
		const doc = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: "a5"
		});
		const width = doc.internal.pageSize.getWidth();
		const height = doc.internal.pageSize.getHeight();
		const rx = 114;
		const guestUrl = `${baseUrl}/?to=${encodeURIComponent(guest.name)}`;
		const qrGuestImg = await QRCode.toDataURL(guestUrl, {
			margin: 0,
			color: {
				dark: "#0b2540",
				light: "#ffffff"
			}
		});
		const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${venueLat},${venueLng}`;
		const qrMapsImg = await QRCode.toDataURL(mapsUrl, {
			margin: 0,
			color: {
				dark: "#0b2540",
				light: "#ffffff"
			}
		});
		const badge = parseBadgeInfo(resepsiDate || akadDate, resepsiDay || akadDay);
		const bgImg = await getNavyFloralBg();
		if (bgImg) doc.addImage(bgImg, "JPEG", 0, 0, width, height);
		else {
			const divX = 55;
			doc.setFillColor(236, 244, 252);
			doc.rect(0, 0, divX, height, "F");
			doc.setFillColor(11, 37, 64);
			doc.rect(divX, 0, width - divX, height, "F");
			drawNavyFloralComposition(doc, divX);
		}
		doc.setFont("times", "italic");
		doc.setFontSize(38);
		doc.setTextColor(255, 255, 255);
		doc.text(brideName, rx, 52, { align: "center" });
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8);
		doc.setTextColor(215, 230, 248);
		doc.text("AND", rx, 63, { align: "center" });
		doc.setFont("times", "italic");
		doc.setFontSize(38);
		doc.setTextColor(255, 255, 255);
		doc.text(groomName, rx, 76, { align: "center" });
		doc.setFont("helvetica", "normal");
		doc.setFontSize(7.5);
		doc.setTextColor(205, 225, 245);
		doc.text("INVITE YOU TO JOIN", rx, 90, { align: "center" });
		doc.text("IN THE CELEBRATION ON THEIR", rx, 95, { align: "center" });
		doc.setFont("helvetica", "bold");
		doc.setFontSize(9.5);
		doc.setTextColor(255, 255, 255);
		doc.text("WEDDING", rx, 102, { align: "center" });
		const badgeY = 118;
		const badgeR = 6.2;
		const gapFromCircle = 3.2;
		const lineW = 20;
		const leftLineEnd = rx - badgeR - gapFromCircle;
		const leftLineStart = leftLineEnd - lineW;
		const leftCenter = 189.2 / 2;
		const rightLineStart = 123.4;
		const rightLineEnd = 143.4;
		const rightCenter = 266.8 / 2;
		doc.setDrawColor(180, 210, 238);
		doc.setLineWidth(.35);
		doc.line(leftLineStart, badgeY - 4.5, leftLineEnd, badgeY - 4.5);
		doc.line(leftLineStart, 122.5, leftLineEnd, 122.5);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(7.5);
		doc.setTextColor(255, 255, 255);
		doc.text(badge.dayName.toUpperCase(), leftCenter, badgeY, {
			align: "center",
			baseline: "middle"
		});
		doc.setFillColor(210, 230, 252);
		doc.circle(rx, badgeY, badgeR, "F");
		doc.setTextColor(11, 37, 64);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(13);
		doc.text(badge.dayNum, rx, badgeY, {
			align: "center",
			baseline: "middle"
		});
		doc.setDrawColor(180, 210, 238);
		doc.setLineWidth(.35);
		doc.line(rightLineStart, badgeY - 4.5, rightLineEnd, badgeY - 4.5);
		doc.line(rightLineStart, 122.5, rightLineEnd, 122.5);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(7.5);
		doc.setTextColor(255, 255, 255);
		doc.text(badge.monthStr.toUpperCase(), rightCenter, badgeY, {
			align: "center",
			baseline: "middle"
		});
		doc.setTextColor(220, 235, 250);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8);
		doc.text(`AT ${akadStart || "10.00"} WIB`, rx, 133, { align: "center" });
		doc.setFont("helvetica", "bold");
		doc.setFontSize(8.5);
		doc.setTextColor(255, 255, 255);
		doc.text(venueName || "Lokasi Acara", rx, 140, { align: "center" });
		doc.setFont("helvetica", "normal");
		doc.setFontSize(7);
		doc.setTextColor(190, 215, 238);
		const addrLines = doc.splitTextToSize(venueAddress || "", 56);
		doc.text(addrLines, rx, 145, { align: "center" });
		doc.setFont("helvetica", "italic");
		doc.setFontSize(7.5);
		doc.setTextColor(215, 230, 248);
		doc.text("RECEPTION TO FOLLOW", rx, 154, { align: "center" });
		const boxY = 162;
		const boxW = 58;
		const boxH = 34;
		const boxX = rx - boxW / 2;
		doc.setFillColor(15, 42, 72);
		doc.setDrawColor(48, 90, 135);
		doc.setLineWidth(.4);
		doc.roundedRect(boxX, boxY, boxW, boxH, 2.5, 2.5, "FD");
		doc.setDrawColor(35, 75, 115);
		doc.setLineWidth(.15);
		doc.roundedRect(86, 163, boxW - 2, boxH - 2, 2, 2, "D");
		const guestTextCenterX = 104.5;
		doc.setFont("helvetica", "normal");
		doc.setFontSize(6.5);
		doc.setTextColor(185, 215, 240);
		doc.text("Kepada Yth. Bapak/Ibu/Saudara/i:", guestTextCenterX, 168.5, { align: "center" });
		doc.setFont("times", "bolditalic");
		doc.setFontSize(11);
		doc.setTextColor(255, 255, 255);
		const splitGuest = doc.splitTextToSize(guest.name, 36);
		doc.text(splitGuest, guestTextCenterX, 176.5, { align: "center" });
		if (guest.address) {
			doc.setFont("helvetica", "normal");
			doc.setFontSize(7);
			doc.setTextColor(195, 220, 245);
			doc.text(guest.address, guestTextCenterX, 185.5, { align: "center" });
		}
		const qrSize = 16;
		const qrX = 143 - qrSize - 3.5;
		const qrY = 167;
		doc.setFillColor(255, 255, 255);
		doc.roundedRect(qrX - .8, qrY - .8, 17.6, 17.6, 1, 1, "F");
		doc.addImage(qrGuestImg, "PNG", qrX, qrY, qrSize, qrSize);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(5.5);
		doc.setTextColor(185, 215, 240);
		doc.text("Scan Undangan", 131.5, 186.2, { align: "center" });
		doc.addPage();
		doc.setFillColor(11, 37, 64);
		doc.rect(0, 0, width, height, "F");
		doc.setDrawColor(218, 175, 55);
		doc.setLineWidth(.35);
		doc.rect(8, 8, width - 16, height - 16);
		doc.setLineWidth(.15);
		doc.rect(11, 11, width - 22, height - 22);
		const drawBotanicalLeaf = (bx, by, tx, ty, leafW = 1) => {
			const dx = tx - bx;
			const dy = ty - by;
			const len = Math.hypot(dx, dy);
			if (len < .1) return;
			const nx = -dy / len;
			const ny = dx / len;
			const c1x = bx + dx * .35 + nx * leafW;
			const c1y = by + dy * .35 + ny * leafW;
			const c2x = bx + dx * .7 + nx * (leafW * .65);
			const c2y = by + dy * .7 + ny * (leafW * .65);
			const c3x = bx + dx * .7 - nx * (leafW * .65);
			const c3y = by + dy * .7 - ny * (leafW * .65);
			const c4x = bx + dx * .35 - nx * leafW;
			const c4y = by + dy * .35 - ny * leafW;
			doc.lines([[
				c1x - bx,
				c1y - by,
				c2x - bx,
				c2y - by,
				tx - bx,
				ty - by
			], [
				c3x - tx,
				c3y - ty,
				c4x - tx,
				c4y - ty,
				bx - tx,
				by - ty
			]], bx, by, [1, 1], "S", true);
			doc.line(bx, by, bx + dx * .72, by + dy * .72);
		};
		const drawBotanicalCorner = (cornerX, cornerY, flipX = 1, flipY = 1) => {
			doc.setDrawColor(218, 175, 55);
			doc.setLineWidth(.2);
			doc.setFillColor(218, 175, 55);
			const p = (lx, ly) => ({
				x: cornerX + lx * flipX,
				y: cornerY + ly * flipY
			});
			const h0 = p(0, 0), h1 = p(6, 1.5), h2 = p(13, 1.8), h3 = p(20, 1.2);
			doc.lines([[
				h1.x - h0.x,
				h1.y - h0.y,
				h2.x - h0.x,
				h2.y - h0.y,
				h3.x - h0.x,
				h3.y - h0.y
			]], h0.x, h0.y, [1, 1], "S", false);
			const v0 = p(0, 0), v1 = p(1.5, 6), v2 = p(1.8, 13), v3 = p(1.2, 20);
			doc.lines([[
				v1.x - v0.x,
				v1.y - v0.y,
				v2.x - v0.x,
				v2.y - v0.y,
				v3.x - v0.x,
				v3.y - v0.y
			]], v0.x, v0.y, [1, 1], "S", false);
			drawBotanicalLeaf(p(4, 1.3).x, p(4, 1.3).y, p(7, -1.2).x, p(7, -1.2).y, .85);
			drawBotanicalLeaf(p(8, 1.6).x, p(8, 1.6).y, p(11, 3.8).x, p(11, 3.8).y, .8);
			drawBotanicalLeaf(p(12.5, 1.7).x, p(12.5, 1.7).y, p(15.5, -.5).x, p(15.5, -.5).y, .78);
			drawBotanicalLeaf(p(16.5, 1.5).x, p(16.5, 1.5).y, p(19.5, 3.5).x, p(19.5, 3.5).y, .68);
			drawBotanicalLeaf(p(20, 1.2).x, p(20, 1.2).y, p(23.5, 1).x, p(23.5, 1).y, .6);
			drawBotanicalLeaf(p(1.3, 4).x, p(1.3, 4).y, p(-1.2, 7).x, p(-1.2, 7).y, .85);
			drawBotanicalLeaf(p(1.6, 8).x, p(1.6, 8).y, p(3.8, 11).x, p(3.8, 11).y, .8);
			drawBotanicalLeaf(p(1.7, 12.5).x, p(1.7, 12.5).y, p(-.5, 15.5).x, p(-.5, 15.5).y, .78);
			drawBotanicalLeaf(p(1.5, 16.5).x, p(1.5, 16.5).y, p(3.5, 19.5).x, p(3.5, 19.5).y, .68);
			drawBotanicalLeaf(p(1.2, 20).x, p(1.2, 20).y, p(1, 23.5).x, p(1, 23.5).y, .6);
			[
				{
					from: p(6.5, 1.5),
					to: p(7.5, 3.5)
				},
				{
					from: p(14.5, 1.6),
					to: p(15.5, -.8)
				},
				{
					from: p(1.5, 6.5),
					to: p(3.5, 7.5)
				},
				{
					from: p(1.6, 14.5),
					to: p(-.8, 15.5)
				}
			].forEach((b) => {
				doc.line(b.from.x, b.from.y, b.to.x, b.to.y);
				doc.circle(b.to.x, b.to.y, .42, "FD");
			});
			doc.circle(p(.8, .8).x, p(.8, .8).y, .55, "FD");
		};
		drawBotanicalCorner(11, 11, 1, 1);
		drawBotanicalCorner(width - 11, 11, -1, 1);
		drawBotanicalCorner(11, height - 11, 1, -1);
		drawBotanicalCorner(width - 11, height - 11, -1, -1);
		const cx2 = width / 2;
		const drawEditorialDivider = (y) => {
			doc.setDrawColor(218, 175, 55);
			doc.setLineWidth(.25);
			doc.setFillColor(11, 37, 64);
			const dw = 2.4;
			const dh = 1.4;
			doc.line(16, y, cx2 - dw - 2.5, y);
			doc.line(cx2 + dw + 2.5, y, width - 16, y);
			doc.lines([
				[dw, dh],
				[-2.4, dh],
				[-2.4, -1.4],
				[dw, -1.4]
			], cx2, y - dh, [1, 1], "D", true);
		};
		doc.setFont("times", "italic");
		doc.setFontSize(10.5);
		doc.setTextColor(255, 255, 255);
		doc.text(salamOpening, cx2, 27, { align: "center" });
		drawEditorialDivider(31.5);
		doc.setFont("times", "italic");
		doc.setFontSize(7.5);
		doc.setTextColor(195, 220, 245);
		const quote = doc.splitTextToSize(quoteArRum, 105);
		doc.text(quote, cx2, 36, { align: "center" });
		drawEditorialDivider(53);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(7.5);
		doc.setTextColor(165, 200, 230);
		doc.text("Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan:", cx2, 59, {
			align: "center",
			maxWidth: 110
		});
		doc.setFont("times", "bold");
		doc.setFontSize(17);
		doc.setTextColor(255, 255, 255);
		doc.text(brideFullName, cx2, 68, { align: "center" });
		doc.setFont("helvetica", "normal");
		doc.setFontSize(7.5);
		doc.setTextColor(185, 210, 235);
		doc.text(brideParents, cx2, 72.5, {
			align: "center",
			maxWidth: 110
		});
		doc.setFont("times", "italic");
		doc.setFontSize(13);
		doc.setTextColor(218, 175, 55);
		doc.text("&", cx2, 79, { align: "center" });
		doc.setFont("times", "bold");
		doc.setFontSize(17);
		doc.setTextColor(255, 255, 255);
		doc.text(groomFullName, cx2, 87.5, { align: "center" });
		doc.setFont("helvetica", "normal");
		doc.setFontSize(7.5);
		doc.setTextColor(185, 210, 235);
		doc.text(groomParents, cx2, 92, {
			align: "center",
			maxWidth: 110
		});
		drawEditorialDivider(97.5);
		const schedY = 100;
		const schedColW = (width - 32) / 2;
		const leftColCx = 16 + schedColW / 2;
		const rightColCx = width - 16 - schedColW / 2;
		doc.setDrawColor(218, 175, 55);
		doc.setLineWidth(.2);
		doc.line(16, schedY, width - 16, schedY);
		doc.line(16, 129, width - 16, 129);
		doc.line(cx2, 102, cx2, 127);
		doc.setFont("times", "bold");
		doc.setFontSize(10.5);
		doc.setTextColor(220, 235, 252);
		doc.text(akadTitle.toUpperCase(), leftColCx, 108, { align: "center" });
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8.5);
		doc.setTextColor(255, 255, 255);
		doc.text(`${akadDay}, ${akadDate}`, leftColCx, 115.5, {
			align: "center",
			maxWidth: schedColW - 4
		});
		doc.text(`Pukul ${akadStart}–${akadEnd} WIB`, leftColCx, 122, {
			align: "center",
			maxWidth: schedColW - 4
		});
		doc.setFont("times", "bold");
		doc.setFontSize(10.5);
		doc.setTextColor(220, 235, 252);
		doc.text(resepsiTitle.toUpperCase(), rightColCx, 108, { align: "center" });
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8.5);
		doc.setTextColor(255, 255, 255);
		doc.text(`${resepsiDay}, ${resepsiDate}`, rightColCx, 115.5, {
			align: "center",
			maxWidth: schedColW - 4
		});
		doc.text(`Pukul ${resepsiStart}–${resepsiEnd} WIB`, rightColCx, 122, {
			align: "center",
			maxWidth: schedColW - 4
		});
		drawEditorialDivider(132.5);
		const qrMapSize = 22;
		const qrMapY = 136;
		doc.setFillColor(255, 255, 255);
		doc.rect(cx2 - qrMapSize / 2 - 1.5, qrMapY - 1.5, 25, 25, "F");
		doc.setDrawColor(218, 175, 55);
		doc.setLineWidth(.3);
		doc.rect(cx2 - qrMapSize / 2 - 1.5, qrMapY - 1.5, 25, 25);
		doc.addImage(qrMapsImg, "PNG", cx2 - qrMapSize / 2, qrMapY, qrMapSize, qrMapSize);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(7);
		doc.setTextColor(185, 210, 240);
		doc.text("Scan Google Maps Menuju Lokasi Acara", cx2, 164, { align: "center" });
		drawEditorialDivider(169);
		const closeY = 174;
		doc.setFont("times", "italic");
		doc.setFontSize(7.5);
		doc.setTextColor(195, 220, 245);
		const closeLines = doc.splitTextToSize(closingText, 105);
		doc.text(closeLines, cx2, closeY, { align: "center" });
		doc.setFont("times", "italic");
		doc.setFontSize(10.5);
		doc.setTextColor(255, 255, 255);
		doc.text(salamClosing, cx2, 185, { align: "center" });
		doc.setFont("helvetica", "normal");
		doc.setFontSize(7);
		doc.setTextColor(165, 200, 230);
		doc.text(signature, cx2, 191, { align: "center" });
		doc.setFont("times", "bold");
		doc.setFontSize(11);
		doc.setTextColor(255, 255, 255);
		doc.text(`${brideName} & ${groomName}`, cx2, 197, { align: "center" });
		return doc;
	};
	const generatePDFDoc = async (guest) => {
		if (selectedModel === "navy_floral") return await generateNavyFloralPDF(guest);
		return await generateClassicFloralPDF(guest);
	};
	const handlePreview = async () => {
		setIsPreviewing(true);
		try {
			setPreviewUri((await generatePDFDoc(singleData.name?.trim() ? singleData : {
				name: "Nama Tamu Undangan",
				address: "Di Tempat"
			})).output("datauristring"));
		} catch (err) {
			console.error("Gagal preview PDF:", err);
			alert("Terjadi kesalahan saat memproses preview PDF: " + err?.message);
		} finally {
			setIsPreviewing(false);
		}
	};
	const downloadSingle = async () => {
		setIsDownloadingSingle(true);
		try {
			const target = singleData.name?.trim() ? singleData : {
				name: "Tamu_Undangan",
				address: "Di Tempat"
			};
			const doc = await generatePDFDoc(target);
			const modelTag = selectedModel === "navy_floral" ? "Navy_Floral" : currentTheme.id;
			handleSaveAs(doc.output("blob"), `Inv_${target.name.replace(/[^a-zA-Z0-9]/g, "_")}_${modelTag}.pdf`);
		} catch (err) {
			console.error("Gagal download PDF:", err);
			alert("Terjadi kesalahan saat mengunduh PDF: " + err?.message);
		} finally {
			setIsDownloadingSingle(false);
		}
	};
	const downloadTemplate = () => {
		handleSaveAs(new Blob(["Nama Tamu,Alamat (Opsional)\nBapak Jokowi & Ibu Iriana,Jakarta\nTeman-teman Alumni SMA 1,Di Tempat\nKeluarga Besar H. Syarif,Bandung"], { type: "text/csv;charset=utf-8;" }), "template_undangan_pdf.csv");
	};
	const handleFileUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setIsReadingCsv(true);
		setTimeout(() => {
			Papa.parse(file, {
				complete: (results) => {
					const guests = [];
					results.data.forEach((row) => {
						const name = row[0];
						const address = row[1] || "Di Tempat";
						if (name && typeof name === "string" && name.trim() !== "") {
							if (!name.toLowerCase().includes("nama tamu")) guests.push({
								name: name.trim(),
								address: address.trim()
							});
						}
					});
					setBulkData(guests);
					setIsReadingCsv(false);
				},
				header: false
			});
		}, 100);
	};
	const processBulk = async () => {
		if (bulkData.length === 0) return;
		setIsProcessing(true);
		setProgress(0);
		setStatusMsg("Menyiapkan assets...");
		try {
			const zip = new JSZip();
			const modelTag = selectedModel === "navy_floral" ? "Navy_Floral" : currentTheme.id;
			const folder = zip.folder(`Undangan_${modelTag}`);
			const CHUNK_SIZE = 10;
			for (let i = 0; i < bulkData.length; i += CHUNK_SIZE) {
				const chunk = bulkData.slice(i, i + CHUNK_SIZE);
				setStatusMsg(`Generating PDF ${i + 1} - ${Math.min(i + chunk.length, bulkData.length)} dari ${bulkData.length}...`);
				await Promise.all(chunk.map(async (guest, idx) => {
					const blob = (await generatePDFDoc(guest)).output("blob");
					const safeName = guest.name.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);
					folder?.file(`${i + idx + 1}_${safeName}.pdf`, blob);
				}));
				setProgress(Math.round(Math.min(i + CHUNK_SIZE, bulkData.length) / bulkData.length * 100));
				await new Promise((r) => setTimeout(r, 20));
			}
			setStatusMsg("Mengompres ZIP...");
			handleSaveAs(await zip.generateAsync({ type: "blob" }), `Undangan-${modelTag}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.zip`);
			setStatusMsg("Selesai!");
		} catch (error) {
			console.error("Gagal generate bulk:", error);
			alert("Terjadi kesalahan sistem saat memproses PDF.");
		} finally {
			setTimeout(() => {
				setIsProcessing(false);
				setProgress(0);
				setStatusMsg("");
			}, 1e3);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "animate-reveal space-y-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-3 text-center",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-1.5 shadow-sm dark:from-slate-800 dark:to-slate-900",
						children: [/* @__PURE__ */ jsx("div", { className: "h-2 w-2 animate-pulse rounded-full bg-emerald-500" }), /* @__PURE__ */ jsx("span", {
							className: "text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400",
							children: "Premium Edition"
						})]
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text font-serif text-3xl font-bold text-transparent dark:from-white dark:to-slate-300",
						children: "Wedding PDF Invitation"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400",
						children: "Pilih model desain undangan PDF, sesuaikan data nama tamu & download satuan atau banyak sekaligus dalam format ZIP."
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-center",
					children: /* @__PURE__ */ jsx("span", {
						className: "text-xs font-bold tracking-widest text-slate-400 uppercase",
						children: "Pilih Model Desain Undangan"
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => {
							setSelectedModel("navy_floral");
							setPreviewUri(null);
						},
						className: `group relative flex flex-col justify-between rounded-2xl border-2 p-4 text-left transition-all ${selectedModel === "navy_floral" ? "border-blue-600 bg-blue-50/70 shadow-lg ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-950/30" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow dark:border-slate-700 dark:bg-slate-800"}`,
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "mb-2 flex w-full items-center justify-between",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm dark:bg-blue-500",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }), " Model Baru"]
								}), selectedModel === "navy_floral" && /* @__PURE__ */ jsx("div", {
									className: "flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white",
									children: /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 stroke-[3]" })
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "font-bold text-slate-900 dark:text-white",
								children: "Navy & Floral Elegance"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400",
								children: "Desain split-card mewah: sisi kiri floral watercolor biru & aksen daun emas, sisi kanan midnight navy dengan badge tanggal lingkaran dan kartu nama tamu."
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "mt-3 flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-blue-700 dark:text-blue-300 font-medium",
							children: [/* @__PURE__ */ jsx("div", { className: "h-3.5 w-3.5 rounded-full bg-[#0b2540] border border-blue-400" }), /* @__PURE__ */ jsx("span", { children: "2 Halaman A5 (Cover Split & Rincian Acara)" })]
						})]
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => {
							setSelectedModel("classic");
							setPreviewUri(null);
						},
						className: `group relative flex flex-col justify-between rounded-2xl border-2 p-4 text-left transition-all ${selectedModel === "classic" ? "border-emerald-600 bg-emerald-50/70 shadow-lg ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/30" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow dark:border-slate-700 dark:bg-slate-800"}`,
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "mb-2 flex w-full items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300",
									children: "Model Bawaan"
								}), selectedModel === "classic" && /* @__PURE__ */ jsx("div", {
									className: "flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white",
									children: /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 stroke-[3]" })
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "font-bold text-slate-900 dark:text-white",
								children: "Classic Floral (Original)"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400",
								children: "Template 4 Halaman A5 dengan ornamen vektor bunga mawar klasik, bingkai ukir, dan dukungan 4 pilihan tema warna."
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "mt-3 flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium",
							children: [/* @__PURE__ */ jsx("div", { className: "h-3.5 w-3.5 rounded-full bg-[#556b2f] border border-emerald-400" }), /* @__PURE__ */ jsx("span", { children: "4 Halaman A5 (Buku Undangan Lengkap)" })]
						})]
					})]
				})]
			}),
			selectedModel === "classic" ? /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-center gap-4",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-xs font-bold tracking-widest text-slate-400 uppercase",
					children: "Pilih Nuansa Warna"
				}), /* @__PURE__ */ jsx("div", {
					className: "flex gap-4",
					children: THEMES.map((theme) => /* @__PURE__ */ jsxs("button", {
						onClick: () => {
							setCurrentTheme(theme);
							setPreviewUri(null);
						},
						className: `group relative flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${currentTheme.id === theme.id ? "scale-110 border-slate-800 ring-4 ring-slate-200 dark:border-white dark:ring-slate-700" : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"}`,
						style: { backgroundColor: `rgb(${theme.bg[0]},${theme.bg[1]},${theme.bg[2]})` },
						title: theme.name,
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative h-9 w-9",
							children: [/* @__PURE__ */ jsx("div", {
								className: "absolute top-0 right-0 h-6 w-6 rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-110 dark:border-slate-900",
								style: { backgroundColor: `rgb(${theme.primary[0]},${theme.primary[1]},${theme.primary[2]})` }
							}), /* @__PURE__ */ jsx("div", {
								className: "absolute bottom-0 left-0 h-6 w-6 rounded-tl-xl rounded-br-xl border-2 border-white shadow-md transition-transform group-hover:scale-110 dark:border-slate-900",
								style: { backgroundColor: `rgb(${theme.secondary[0]},${theme.secondary[1]},${theme.secondary[2]})` }
							})]
						}), currentTheme.id === theme.id && /* @__PURE__ */ jsx("div", {
							className: "absolute -bottom-3 rounded-lg bg-gradient-to-r from-slate-800 to-slate-700 px-3 py-1 text-[10px] font-bold whitespace-nowrap text-white shadow-lg dark:from-white dark:to-slate-100 dark:text-slate-900",
							children: theme.name
						})]
					}, theme.id))
				})]
			}) : /* @__PURE__ */ jsx("div", {
				className: "flex justify-center",
				children: /* @__PURE__ */ jsxs("div", {
					className: "inline-flex items-center gap-2 rounded-xl bg-blue-50/80 px-4 py-2 text-xs font-semibold text-blue-900 dark:bg-blue-950/40 dark:text-blue-200",
					children: [/* @__PURE__ */ jsx("div", { className: "h-2.5 w-2.5 rounded-full bg-blue-600" }), /* @__PURE__ */ jsx("span", { children: "Palet Warna: Midnight Navy Blue & Periwinkle Blue Floral (Sesuai Referensi Gambar)" })]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex justify-center",
				children: /* @__PURE__ */ jsxs("div", {
					className: "inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-900",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => setActiveTab("single"),
						className: `rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === "single" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`,
						children: "Manual (Satuan)"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setActiveTab("bulk"),
						className: `rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === "bulk" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`,
						children: "Import CSV (Banyak)"
					})]
				})
			}),
			activeTab === "single" && /* @__PURE__ */ jsxs("div", {
				className: "grid items-start gap-8 md:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-bold tracking-widest text-slate-400 uppercase",
								children: "Nama Tamu"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: singleData.name,
								onChange: (e) => setSingleData({
									...singleData,
									name: e.target.value
								}),
								placeholder: "Contoh: Bpk. Habibie & Keluarga",
								className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-lg focus:ring-2 focus:ring-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-bold tracking-widest text-slate-400 uppercase",
								children: "Alamat / Kota (Opsional)"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: singleData.address,
								onChange: (e) => setSingleData({
									...singleData,
									address: e.target.value
								}),
								placeholder: "Jakarta Selatan",
								className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base focus:ring-2 focus:ring-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: handlePreview,
							disabled: !singleData.name || isPreviewing,
							className: "flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold uppercase hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800",
							children: isPreviewing ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Memuat..."] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }), " Preview"] })
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: downloadSingle,
							disabled: !singleData.name || isDownloadingSingle,
							className: "flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-xs font-bold text-white uppercase shadow-lg hover:bg-slate-900 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
							children: isDownloadingSingle ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Mengunduh..."] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Printer, { className: "h-4 w-4" }), " Download PDF"] })
						})]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex min-h-[400px] items-center justify-center rounded-xl bg-slate-200 p-4 dark:bg-slate-900/50",
					children: previewUri ? /* @__PURE__ */ jsx("iframe", {
						src: previewUri,
						className: "h-[500px] w-full rounded-lg bg-white shadow-2xl",
						title: "PDF Preview"
					}) : /* @__PURE__ */ jsxs("div", {
						className: "text-center text-slate-400",
						children: [
							/* @__PURE__ */ jsx(FileSpreadsheet, { className: "mx-auto mb-2 h-12 w-12 opacity-50" }),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm",
								children: "Masukkan data & klik Preview"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-slate-500",
								children: "(Ornamen bunga dirender menggunakan vektor PDF)"
							})
						]
					})
				})]
			}),
			activeTab === "bulk" && /* @__PURE__ */ jsx("div", {
				className: "animate-reveal space-y-8",
				children: bulkData.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "space-y-6 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
							children: isReadingCsv ? /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "h-8 w-8" })
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "text-xl font-bold text-slate-800 dark:text-white",
									children: isReadingCsv ? "Membaca File CSV..." : "Upload Database Tamu"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mx-auto max-w-md text-sm text-slate-500",
									children: [
										"Siapkan file CSV dengan format:",
										/* @__PURE__ */ jsx("br", {}),
										/* @__PURE__ */ jsx("strong", { children: "Kolom 1: Nama Tamu" }),
										" |",
										" ",
										/* @__PURE__ */ jsx("strong", { children: "Kolom 2: Alamat/Kota (Opsional)" })
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex justify-center pt-2",
									children: /* @__PURE__ */ jsxs("button", {
										onClick: downloadTemplate,
										className: "inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700",
										children: [/* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }), "Download Template CSV"]
									})
								})
							]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: `inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:opacity-90 dark:bg-white dark:text-slate-900 ${isReadingCsv ? "pointer-events-none opacity-50" : ""}`,
							children: ["Pilih File CSV", /* @__PURE__ */ jsx("input", {
								type: "file",
								accept: ".csv",
								onChange: handleFileUpload,
								className: "hidden",
								disabled: isReadingCsv
							})]
						})
					]
				}) : /* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 md:flex-row md:items-center md:justify-between dark:border-blue-900/30 dark:bg-blue-900/10",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "rounded-lg bg-blue-100 p-2 font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
									children: bulkData.length
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-sm font-bold text-slate-700 dark:text-blue-100",
										children: "Tamu Terdeteksi"
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-xs text-slate-500 dark:text-slate-400",
										children: [
											"Tema:",
											" ",
											/* @__PURE__ */ jsx("span", {
												className: "font-bold",
												children: currentTheme.name
											})
										]
									})]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ jsxs("button", {
									onClick: () => {
										if (confirm("Yakin ingin menghapus semua data?")) setBulkData([]);
									},
									className: "group flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-5 py-2.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100 hover:shadow-sm active:scale-95 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30",
									children: [/* @__PURE__ */ jsx(RefreshCcw, { className: "h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" }), "Reset Data"]
								}), /* @__PURE__ */ jsx("button", {
									onClick: processBulk,
									disabled: isProcessing,
									className: "group relative flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-slate-900 px-8 py-2.5 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200",
									children: /* @__PURE__ */ jsxs("div", {
										className: "relative z-10 flex items-center gap-2",
										children: [isProcessing ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: isProcessing ? "Memproses..." : "Download ZIP" })]
									})
								})]
							})]
						}),
						isProcessing && /* @__PURE__ */ jsxs("div", {
							className: "animate-reveal space-y-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400",
								children: [/* @__PURE__ */ jsx("span", { children: statusMsg }), /* @__PURE__ */ jsxs("span", { children: [progress, "%"] })]
							}), /* @__PURE__ */ jsx("div", {
								className: "h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700",
								children: /* @__PURE__ */ jsx("div", {
									className: "h-full rounded-full bg-blue-600 transition-all duration-300 ease-out",
									style: { width: `${progress}%` }
								})
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "custom-scrollbar grid max-h-[400px] grid-cols-1 gap-3 overflow-y-auto pr-2 md:grid-cols-2 lg:grid-cols-3",
							children: bulkData.map((guest, idx) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 overflow-hidden",
									children: [/* @__PURE__ */ jsx("div", {
										className: "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-slate-700",
										children: idx + 1
									}), /* @__PURE__ */ jsxs("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ jsx("p", {
											className: "truncate text-xs font-bold text-slate-700 dark:text-slate-300",
											children: guest.name
										}), /* @__PURE__ */ jsx("p", {
											className: "truncate text-[10px] text-slate-400",
											children: guest.address
										})]
									})]
								}), /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-green-500" })]
							}, idx))
						})
					]
				})
			})
		]
	});
};
//#endregion
//#region src/components/QRCodeManager.tsx
var QRCodeManager = ({ siteUrl }) => {
	const [activeTab, setActiveTab] = useState("single");
	const [singleName, setSingleName] = useState("");
	const [bulkNames, setBulkNames] = useState([]);
	const [isReadingCsv, setIsReadingCsv] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [progress, setProgress] = useState(0);
	const [statusMsg, setStatusMsg] = useState("");
	const [brideInitial, setBrideInitial] = useState("B");
	const [groomInitial, setGroomInitial] = useState("G");
	const qrRefs = useRef({});
	const baseUrl = siteUrl?.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl || "";
	useEffect(() => {
		fetch("/api/config").then((r) => r.json()).then((data) => {
			if (data.BRIDE_NICKNAME) setBrideInitial(data.BRIDE_NICKNAME.charAt(0).toUpperCase());
			if (data.GROOM_NICKNAME) setGroomInitial(data.GROOM_NICKNAME.charAt(0).toUpperCase());
		}).catch(() => {});
	}, []);
	const generateUrl = (name) => {
		if (!name) return baseUrl;
		return `${baseUrl}/?to=${encodeURIComponent(name.trim())}`;
	};
	const handleSaveAs = (blob, name) => {
		(FileSaver.saveAs || FileSaver)(blob, name);
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
	const downloadTemplate = () => {
		handleSaveAs(new Blob(["Nama Tamu\nAhmad Syarief Ramadhan\nMuhammad Ikbal Pauji\nKeluarga Besar Bapak Jokowi"], { type: "text/csv;charset=utf-8;" }), "template_tamu.csv");
	};
	const handleFileUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setIsReadingCsv(true);
		setTimeout(() => {
			Papa.parse(file, {
				complete: (results) => {
					const names = [];
					results.data.forEach((row) => {
						if (row[0] && typeof row[0] === "string" && row[0].trim() !== "") {
							if (!row[0].toLowerCase().includes("nama tamu")) names.push(row[0].trim());
						}
					});
					setBulkNames(names);
					setIsReadingCsv(false);
				},
				header: false
			});
		}, 100);
	};
	const downloadAllZip = async () => {
		if (bulkNames.length === 0) return;
		setIsProcessing(true);
		setProgress(0);
		setStatusMsg("Menyiapkan assets...");
		try {
			const zip = new JSZip();
			const folder = zip.folder("QR_Codes_Wedding");
			const CHUNK_SIZE = 50;
			for (let i = 0; i < bulkNames.length; i += CHUNK_SIZE) {
				const chunk = bulkNames.slice(i, i + CHUNK_SIZE);
				setStatusMsg(`Memproses ${i + 1} - ${Math.min(i + chunk.length, bulkNames.length)} dari ${bulkNames.length}...`);
				await Promise.all(chunk.map(async (name, chunkIdx) => {
					const globalIdx = i + chunkIdx;
					const canvas = qrRefs.current[globalIdx];
					if (canvas) {
						const base64Data = canvas.toDataURL("image/png").split(",")[1];
						const safeName = name.replace(/[^a-z0-9]/gi, "_").substring(0, 50);
						folder?.file(`${globalIdx + 1}_${safeName}.png`, base64Data, { base64: true });
					}
				}));
				setProgress(Math.round((i + chunk.length) / bulkNames.length * 100));
				await new Promise((resolve) => setTimeout(resolve, 20));
			}
			setStatusMsg("Mengompres file ZIP...");
			handleSaveAs(await zip.generateAsync({ type: "blob" }), `QR-Codes-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.zip`);
			setStatusMsg("Selesai!");
		} catch {
			alert("Terjadi kesalahan saat membuat ZIP.");
		} finally {
			setTimeout(() => {
				setIsProcessing(false);
				setProgress(0);
				setStatusMsg("");
			}, 1e3);
		}
	};
	const downloadSingle = () => {
		const canvas = document.getElementById("single-qr");
		if (canvas) handleSaveAs(canvas.toDataURL("image/png"), `QR-${singleName || "Wedding"}.png`);
	};
	const copySingleLink = () => {
		navigator.clipboard.writeText(generateUrl(singleName));
		alert("Link berhasil disalin!");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex justify-center",
				children: /* @__PURE__ */ jsxs("div", {
					className: "inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-900",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => setActiveTab("single"),
						className: `rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === "single" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`,
						children: "Manual (Satuan)"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setActiveTab("bulk"),
						className: `rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === "bulk" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`,
						children: "Import CSV (Banyak)"
					})]
				})
			}),
			activeTab === "single" && /* @__PURE__ */ jsxs("div", {
				className: "animate-reveal grid items-center gap-8 md:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-bold tracking-widest text-slate-400 uppercase",
								children: "Nama Tamu"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: singleName,
								onChange: (e) => setSingleName(e.target.value),
								placeholder: "Ketik nama tamu...",
								className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "rounded-xl bg-slate-50 p-4 font-mono text-xs break-all text-slate-500 dark:bg-slate-900/50 dark:text-slate-400",
							children: generateUrl(singleName)
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ jsxs("button", {
								onClick: copySingleLink,
								className: "flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold uppercase hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800",
								children: [/* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }), " Copy Link"]
							}), /* @__PURE__ */ jsxs("button", {
								onClick: downloadSingle,
								disabled: !singleName,
								className: "flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white uppercase shadow-lg transition-all hover:bg-blue-700 disabled:opacity-50",
								children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Download PNG"]
							})]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800",
						children: [/* @__PURE__ */ jsx(QRCodeCanvas, {
							id: "single-qr",
							value: generateUrl(singleName),
							size: 250,
							level: "H",
							includeMargin: true,
							imageSettings: centerLogo ? {
								src: centerLogo,
								height: 50,
								width: 50,
								excavate: true
							} : void 0
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-4 text-center",
							children: /* @__PURE__ */ jsx("p", {
								className: "text-xs font-bold tracking-widest text-slate-400 uppercase",
								children: "Preview Desain"
							})
						})]
					})
				})]
			}),
			activeTab === "bulk" && /* @__PURE__ */ jsx("div", {
				className: "animate-reveal space-y-8",
				children: bulkNames.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "space-y-6 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center md:p-10 dark:border-slate-700 dark:bg-slate-800/50",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/20",
							children: isReadingCsv ? /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "h-8 w-8" })
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "text-xl font-bold text-slate-800 dark:text-white",
									children: isReadingCsv ? "Membaca File CSV..." : "Upload File CSV"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mx-auto max-w-md text-sm leading-relaxed text-slate-500",
									children: [
										"Siapkan file CSV sederhana dimana",
										" ",
										/* @__PURE__ */ jsx("strong", { children: "kolom pertama" }),
										" berisi daftar nama tamu."
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex justify-center pt-2",
									children: /* @__PURE__ */ jsxs("button", {
										onClick: downloadTemplate,
										className: "inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700",
										children: [/* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }), "Download Template CSV"]
									})
								})
							]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: `inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:opacity-90 dark:bg-white dark:text-slate-900 ${isReadingCsv ? "pointer-events-none opacity-50" : ""}`,
							children: ["Pilih File CSV", /* @__PURE__ */ jsx("input", {
								type: "file",
								accept: ".csv",
								onChange: handleFileUpload,
								className: "hidden",
								disabled: isReadingCsv
							})]
						})
					]
				}) : /* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 md:flex-row md:items-center md:justify-between dark:border-blue-900/30 dark:bg-blue-900/10",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "rounded-lg bg-blue-100 p-2 font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
									children: bulkNames.length
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-sm font-bold text-slate-700 dark:text-blue-100",
										children: "Data Tamu Siap"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs text-slate-500 dark:text-slate-400",
										children: "Desain Premium dengan Logo Terpasang"
									})]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ jsxs("button", {
									onClick: () => {
										if (confirm("Yakin ingin menghapus semua data?")) setBulkNames([]);
									},
									className: "group flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-5 py-2.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100 hover:shadow-sm active:scale-95 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30",
									children: [/* @__PURE__ */ jsx(RefreshCcw, { className: "h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" }), "Reset Data"]
								}), /* @__PURE__ */ jsx("button", {
									onClick: downloadAllZip,
									disabled: isProcessing,
									className: "group relative flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-blue-600 px-8 py-2.5 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70",
									children: /* @__PURE__ */ jsxs("div", {
										className: "relative z-10 flex items-center gap-2",
										children: [isProcessing ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: isProcessing ? "Memproses..." : "Download ZIP" })]
									})
								})]
							})]
						}),
						isProcessing && /* @__PURE__ */ jsxs("div", {
							className: "animate-reveal space-y-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400",
								children: [/* @__PURE__ */ jsx("span", { children: statusMsg }), /* @__PURE__ */ jsxs("span", { children: [progress, "%"] })]
							}), /* @__PURE__ */ jsx("div", {
								className: "h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700",
								children: /* @__PURE__ */ jsx("div", {
									className: "h-full bg-blue-600 transition-all duration-300 ease-out",
									style: { width: `${progress}%` }
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5",
							children: [bulkNames.slice(0, 50).map((name, idx) => /* @__PURE__ */ jsxs("div", {
								className: "group relative flex flex-col items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800",
								children: [/* @__PURE__ */ jsx("div", {
									className: "rounded-lg bg-white p-1",
									children: /* @__PURE__ */ jsx(QRCodeCanvas, {
										ref: (el) => qrRefs.current[idx] = el,
										value: generateUrl(name),
										size: 140,
										level: "H",
										includeMargin: true,
										imageSettings: centerLogo ? {
											src: centerLogo,
											height: 35,
											width: 35,
											excavate: true
										} : void 0
									})
								}), /* @__PURE__ */ jsxs("div", {
									className: "w-full text-center",
									children: [/* @__PURE__ */ jsx("p", {
										className: "truncate text-xs font-bold text-slate-700 dark:text-slate-300",
										children: name
									}), /* @__PURE__ */ jsx("div", {
										className: "mt-1 flex justify-center opacity-0 transition-opacity group-hover:opacity-100",
										children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3 text-green-500" })
									})]
								})]
							}, idx)), bulkNames.slice(50).map((name, idx) => /* @__PURE__ */ jsx("div", {
								className: "hidden",
								children: /* @__PURE__ */ jsx(QRCodeCanvas, {
									ref: (el) => qrRefs.current[idx + 50] = el,
									value: generateUrl(name),
									size: 250,
									level: "H",
									includeMargin: true,
									imageSettings: centerLogo ? {
										src: centerLogo,
										height: 50,
										width: 50,
										excavate: true
									} : void 0
								})
							}, idx + 50))]
						}),
						bulkNames.length > 50 && /* @__PURE__ */ jsxs("p", {
							className: "text-center text-xs text-slate-400 italic",
							children: [
								"... dan ",
								bulkNames.length - 50,
								" QR Code lainnya (disembunyikan agar browser tidak berat, namun tetap akan terunduh)."
							]
						})
					]
				})
			})
		]
	});
};
//#endregion
//#region src/components/Admin/AdminDashboard.tsx
var DataTable = ({ data, columns, onEdit, onDelete, onBulkDelete }) => {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [selected, setSelected] = useState([]);
	const filteredData = useMemo(() => {
		return data.filter((item) => Object.values(item).some((val) => String(val).toLowerCase().includes(search.toLowerCase())));
	}, [data, search]);
	useEffect(() => {
		setPage(1);
	}, [search]);
	useEffect(() => {
		setSelected([]);
	}, [data]);
	const totalPages = Math.ceil(filteredData.length / pageSize);
	const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
	const handleSelectAll = (e) => {
		if (e.target.checked) setSelected(paginatedData.map((d) => d.id));
		else setSelected([]);
	};
	const handleSelectOne = (id) => {
		setSelected((prev) => prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]);
	};
	const executeBulkDelete = () => {
		if (onBulkDelete && selected.length > 0) {
			if (confirm(`Yakin hapus ${selected.length} data terpilih?`)) {
				onBulkDelete(selected);
				setSelected([]);
			}
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col justify-between gap-4 md:flex-row md:items-center",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("select", {
						value: pageSize,
						onChange: (e) => {
							setPageSize(Number(e.target.value));
							setPage(1);
						},
						className: "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800",
						children: [
							5,
							10,
							25,
							50
						].map((size) => /* @__PURE__ */ jsxs("option", {
							value: size,
							children: [size, " Data"]
						}, size))
					}), onBulkDelete && selected.length > 0 && /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: executeBulkDelete,
						className: "flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400",
						children: [
							/* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }),
							" Hapus (",
							selected.length,
							")"
						]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative w-full md:w-64",
					children: [/* @__PURE__ */ jsx(Search, { className: "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ jsx("input", {
						type: "text",
						placeholder: "Cari data...",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						className: "w-full rounded-lg border border-slate-200 py-2 pr-4 pl-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800",
				children: /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-slate-50 text-xs text-slate-500 uppercase dark:bg-slate-900/50 dark:text-slate-400",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								onBulkDelete && /* @__PURE__ */ jsx("th", {
									className: "w-4 px-6 py-4",
									children: /* @__PURE__ */ jsx("input", {
										type: "checkbox",
										onChange: handleSelectAll,
										checked: paginatedData.length > 0 && paginatedData.every((d) => selected.includes(d.id)),
										className: "rounded border-slate-300 text-blue-600 focus:ring-blue-500"
									})
								}),
								columns.map((col, idx) => /* @__PURE__ */ jsx("th", {
									className: `px-6 py-4 font-bold ${col.className || ""}`,
									children: col.header
								}, idx)),
								(onEdit || onDelete) && /* @__PURE__ */ jsx("th", {
									className: "px-6 py-4 text-right",
									children: "Aksi"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-100 dark:divide-slate-700",
							children: paginatedData.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: columns.length + (onBulkDelete ? 2 : onEdit ? 1 : 0),
								className: "px-6 py-8 text-center text-slate-400",
								children: "Tidak ada data ditemukan."
							}) }) : paginatedData.map((item) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-slate-50 dark:hover:bg-slate-700/50",
								children: [
									onBulkDelete && /* @__PURE__ */ jsx("td", {
										className: "px-6 py-4",
										children: /* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: selected.includes(item.id),
											onChange: () => handleSelectOne(item.id),
											className: "rounded border-slate-300 text-blue-600 focus:ring-blue-500"
										})
									}),
									columns.map((col, idx) => /* @__PURE__ */ jsx("td", {
										className: `px-6 py-4 ${col.className || ""}`,
										children: typeof col.accessor === "function" ? col.accessor(item) : item[col.accessor]
									}, idx)),
									(onEdit || onDelete) && /* @__PURE__ */ jsx("td", {
										className: "px-6 py-4 text-right",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex justify-end gap-2",
											children: [onEdit && /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => onEdit(item),
												className: "rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20",
												children: /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" })
											}), onDelete && /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => {
													if (confirm("Yakin hapus data ini?")) onDelete(item.id);
												},
												className: "rounded p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20",
												children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
											})]
										})
									})
								]
							}, item.id))
						})]
					})
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-xs text-slate-500",
					children: [
						"Halaman ",
						filteredData.length === 0 ? 0 : page,
						" dari ",
						totalPages,
						" ",
						"(Total ",
						filteredData.length,
						" Data)"
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setPage(Math.max(1, page - 1)),
						disabled: page === 1,
						className: "rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800",
						children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setPage(Math.min(totalPages, page + 1)),
						disabled: page === totalPages || totalPages === 0,
						className: "rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800",
						children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
					})]
				})]
			})
		]
	});
};
var CONFIG_SECTIONS = [
	{
		title: "Mempelai Wanita",
		fields: [
			{
				key: "BRIDE_NICKNAME",
				label: "Nama Panggilan",
				type: "text"
			},
			{
				key: "BRIDE_FULLNAME",
				label: "Nama Lengkap",
				type: "text"
			},
			{
				key: "BRIDE_PARENTS",
				label: "Nama Orang Tua",
				type: "text"
			},
			{
				key: "BRIDE_INSTAGRAM",
				label: "Instagram (tanpa @)",
				type: "text"
			},
			{
				key: "BRIDE_IMAGE",
				label: "URL Foto",
				type: "url"
			}
		]
	},
	{
		title: "Mempelai Pria",
		fields: [
			{
				key: "GROOM_NICKNAME",
				label: "Nama Panggilan",
				type: "text"
			},
			{
				key: "GROOM_FULLNAME",
				label: "Nama Lengkap",
				type: "text"
			},
			{
				key: "GROOM_PARENTS",
				label: "Nama Orang Tua",
				type: "text"
			},
			{
				key: "GROOM_INSTAGRAM",
				label: "Instagram (tanpa @)",
				type: "text"
			},
			{
				key: "GROOM_IMAGE",
				label: "URL Foto",
				type: "url"
			}
		]
	},
	{
		title: "Venue",
		fields: [
			{
				key: "VENUE_NAME",
				label: "Nama Gedung",
				type: "text"
			},
			{
				key: "VENUE_ADDRESS",
				label: "Alamat Lengkap",
				type: "textarea"
			},
			{
				key: "VENUE_LAT",
				label: "Latitude",
				type: "text",
				placeholder: "-6.3032707"
			},
			{
				key: "VENUE_LNG",
				label: "Longitude",
				type: "text",
				placeholder: "106.1011039"
			}
		]
	},
	{
		title: "Akad Nikah",
		fields: [
			{
				key: "AKAD_TITLE",
				label: "Judul",
				type: "text"
			},
			{
				key: "AKAD_DAY",
				label: "Hari",
				type: "text",
				placeholder: "Minggu"
			},
			{
				key: "AKAD_DATE",
				label: "Tanggal",
				type: "text",
				placeholder: "11 Oktober 2025"
			},
			{
				key: "AKAD_START",
				label: "Jam Mulai",
				type: "text",
				placeholder: "08:00"
			},
			{
				key: "AKAD_END",
				label: "Jam Selesai",
				type: "text",
				placeholder: "10:00"
			},
			{
				key: "AKAD_ISO_START",
				label: "ISO Start",
				type: "text",
				placeholder: "2025-10-11T08:00:00+07:00"
			},
			{
				key: "AKAD_ISO_END",
				label: "ISO End",
				type: "text",
				placeholder: "2025-10-11T10:00:00+07:00"
			}
		]
	},
	{
		title: "Resepsi",
		fields: [
			{
				key: "RESEPSI_TITLE",
				label: "Judul",
				type: "text"
			},
			{
				key: "RESEPSI_DAY",
				label: "Hari",
				type: "text",
				placeholder: "Minggu"
			},
			{
				key: "RESEPSI_DATE",
				label: "Tanggal",
				type: "text",
				placeholder: "11 Oktober 2025"
			},
			{
				key: "RESEPSI_START",
				label: "Jam Mulai",
				type: "text",
				placeholder: "11:00"
			},
			{
				key: "RESEPSI_END",
				label: "Jam Selesai",
				type: "text",
				placeholder: "14:00"
			},
			{
				key: "RESEPSI_ISO_START",
				label: "ISO Start",
				type: "text",
				placeholder: "2025-10-11T11:00:00+07:00"
			},
			{
				key: "RESEPSI_ISO_END",
				label: "ISO End",
				type: "text",
				placeholder: "2025-10-11T14:00:00+07:00"
			}
		]
	},
	{
		title: "Hero & Media",
		fields: [
			{
				key: "HERO_IMAGE",
				label: "URL Gambar Hero",
				type: "url"
			},
			{
				key: "HERO_CITY",
				label: "Kota",
				type: "text",
				placeholder: "Kab. Pandeglang, Banten"
			},
			{
				key: "MUSIC_URL",
				label: "URL Musik (MP3)",
				type: "url"
			},
			{
				key: "RSVP_MAX_GUESTS",
				label: "Maks Tamu per RSVP",
				type: "number",
				placeholder: "20"
			}
		]
	},
	{
		title: "Teks & Konten",
		fields: [
			{
				key: "TEXT_SALAM_OPENING",
				label: "Salam Pembuka",
				type: "text"
			},
			{
				key: "TEXT_QUOTE_AR_RUM",
				label: "Kutipan Ar-Rum",
				type: "textarea"
			},
			{
				key: "TEXT_QUOTE_SOURCE",
				label: "Sumber Kutipan",
				type: "text",
				placeholder: "QS. Ar-Rum: 21"
			},
			{
				key: "TEXT_INVITATION",
				label: "Kalimat Undangan",
				type: "textarea"
			},
			{
				key: "TEXT_CLOSING",
				label: "Teks Penutup",
				type: "textarea"
			},
			{
				key: "TEXT_SALAM_CLOSING",
				label: "Salam Penutup",
				type: "text"
			},
			{
				key: "TEXT_SIGNATURE",
				label: "Tanda Tangan",
				type: "text",
				placeholder: "Kami yang berbahagia,"
			},
			{
				key: "TEXT_FAMILY",
				label: "Nama Keluarga",
				type: "text",
				placeholder: "Kel. Bpk ... & Kel. Bpk ..."
			},
			{
				key: "TEXT_GIFT_TITLE",
				label: "Judul Hadiah",
				type: "text",
				placeholder: "Tanda Kasih"
			},
			{
				key: "TEXT_GIFT_DESC",
				label: "Deskripsi Hadiah",
				type: "textarea"
			}
		]
	},
	{
		title: "Kirim Kado Fisik (Rumah)",
		fields: [{
			key: "GIFT_ADDRESS",
			label: "Alamat Rumah Penerima Kado",
			type: "textarea",
			placeholder: "Alamat rumah lengkap untuk pengiriman kado fisik..."
		}, {
			key: "GIFT_RECEIVER",
			label: "Nama Penerima & No. Kontak di Rumah",
			type: "text",
			placeholder: "Contoh: Bpk. Bambang / Pengantin (0812-3456-7890)"
		}]
	},
	{
		title: "Rekening Bank",
		fields: [{
			key: "BANK_ACCOUNTS",
			label: "JSON Array [{\"bank\":\"...\",\"number\":\"...\",\"name\":\"...\"}]",
			type: "json"
		}]
	},
	{
		title: "Kisah Cinta",
		fields: [{
			key: "LOVE_STORY",
			label: "JSON Array [{\"date\":\"...\",\"title\":\"...\",\"desc\":\"...\"}]",
			type: "json"
		}]
	},
	{
		title: "Galeri",
		fields: [{
			key: "GALLERY_IMAGES",
			label: "JSON Array [\"url1\",\"url2\",...]",
			type: "json"
		}]
	},
	{
		title: "Notifikasi Telegram",
		fields: [{
			key: "TELEGRAM_BOT_TOKEN",
			label: "Bot Token",
			type: "text",
			placeholder: "123456:ABC..."
		}, {
			key: "TELEGRAM_CHAT_ID",
			label: "Chat ID",
			type: "text",
			placeholder: "7671009829"
		}]
	}
];
var SettingsTab = () => {
	const [rawConfig, setRawConfig] = useState({});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [jsonErrors, setJsonErrors] = useState({});
	useEffect(() => {
		fetch("/api/config/full", { credentials: "include" }).then((r) => r.json()).then((full) => {
			setRawConfig(full);
			setLoading(false);
		}).catch(() => {
			fetch("/api/config", { credentials: "include" }).then((r) => r.json()).then((data) => {
				setRawConfig(data);
				setLoading(false);
			});
		});
	}, []);
	const handleChange = (key, value) => {
		setRawConfig((prev) => ({
			...prev,
			[key]: value
		}));
		if (jsonErrors[key]) setJsonErrors((prev) => {
			const next = { ...prev };
			delete next[key];
			return next;
		});
	};
	const validateJson = (key, value) => {
		try {
			JSON.parse(value);
			return true;
		} catch {
			setJsonErrors((prev) => ({
				...prev,
				[key]: "JSON tidak valid"
			}));
			return false;
		}
	};
	const handleSave = async () => {
		const jsonFields = [
			"BANK_ACCOUNTS",
			"LOVE_STORY",
			"GALLERY_IMAGES"
		];
		let hasError = false;
		for (const key of jsonFields) if (rawConfig[key] && !validateJson(key, rawConfig[key])) hasError = true;
		if (hasError) return;
		setSaving(true);
		try {
			if ((await fetch("/api/config", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(rawConfig)
			})).ok) {
				setSaved(true);
				setTimeout(() => setSaved(false), 3e3);
			}
		} finally {
			setSaving(false);
		}
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "flex items-center justify-center py-20",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-slate-400" })
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-500 dark:text-slate-400",
					children: "Perubahan akan langsung diterapkan setelah disimpan."
				}), /* @__PURE__ */ jsxs("button", {
					onClick: handleSave,
					disabled: saving,
					className: `flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-50 ${saved ? "bg-green-500" : "bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700"}`,
					children: [saving ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), saved ? "Tersimpan!" : "Simpan Semua"]
				})]
			}),
			CONFIG_SECTIONS.map((section) => /* @__PURE__ */ jsxs("div", {
				className: "rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "mb-6 font-serif text-lg font-bold text-slate-800 italic dark:text-white",
					children: section.title
				}), /* @__PURE__ */ jsx("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: section.fields.map((field) => /* @__PURE__ */ jsxs("div", {
						className: field.type === "textarea" || field.type === "json" ? "md:col-span-2" : "",
						children: [
							/* @__PURE__ */ jsx("label", {
								className: "mb-1.5 block text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500",
								children: field.label
							}),
							field.type === "textarea" || field.type === "json" ? /* @__PURE__ */ jsx("textarea", {
								value: rawConfig[field.key] ?? "",
								onChange: (e) => handleChange(field.key, e.target.value),
								placeholder: field.placeholder,
								rows: field.type === "json" ? 5 : 3,
								className: `w-full rounded-lg border bg-slate-50 px-4 py-3 font-mono text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-white ${jsonErrors[field.key] ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-slate-700"}`
							}) : /* @__PURE__ */ jsx("input", {
								type: field.type === "number" ? "number" : "text",
								value: rawConfig[field.key] ?? "",
								onChange: (e) => handleChange(field.key, e.target.value),
								placeholder: field.placeholder,
								className: "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
							}),
							jsonErrors[field.key] && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-red-500",
								children: jsonErrors[field.key]
							})
						]
					}, field.key))
				})]
			}, section.title)),
			/* @__PURE__ */ jsx("div", {
				className: "flex justify-end pb-8",
				children: /* @__PURE__ */ jsxs("button", {
					onClick: handleSave,
					disabled: saving,
					className: `flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-50 ${saved ? "bg-green-500" : "bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700"}`,
					children: [saving ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), saved ? "Tersimpan!" : "Simpan Semua"]
				})
			})
		]
	});
};
var AdminDashboard = ({ initialRsvps, initialWishes, siteUrl }) => {
	const [activeTab, setActiveTab] = useState("rsvp");
	const [rsvps, setRsvps] = useState(initialRsvps);
	const [wishes, setWishes] = useState(initialWishes);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [editingItem, setEditingItem] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleDelete = async (type, ids) => {
		if (ids.length === 0) return;
		setIsDeleting(true);
		try {
			const res = await fetch("/api/admin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: type === "rsvp" ? "delete_rsvp" : "delete_wish",
					ids
				})
			});
			const json = await res.json();
			if (res.ok && json.success) {
				if (type === "rsvp") setRsvps((prev) => prev.filter((i) => !ids.includes(i.id)));
				if (type === "wish") setWishes((prev) => prev.filter((i) => !ids.includes(i.id)));
			} else alert("Gagal menghapus: " + (json.error || "Unknown Error"));
		} catch {
			alert("Error Network.");
		} finally {
			setIsDeleting(false);
		}
	};
	const handleUpdate = async (type, id, data) => {
		setIsSaving(true);
		try {
			if ((await fetch("/api/admin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: type === "rsvp" ? "update_rsvp" : "update_wish",
					id,
					data
				})
			})).ok) {
				if (type === "rsvp") setRsvps((prev) => prev.map((item) => item.id === id ? {
					...item,
					...data
				} : item));
				else setWishes((prev) => prev.map((item) => item.id === id ? {
					...item,
					...data
				} : item));
				setIsModalOpen(false);
			} else alert("Gagal update data.");
		} finally {
			setIsSaving(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", { children: [
		isDeleting && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-4 rounded-xl bg-white p-6 shadow-2xl",
				children: [/* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-blue-600" }), /* @__PURE__ */ jsx("span", {
					className: "text-lg font-bold text-slate-700",
					children: "Menghapus Data..."
				})]
			})
		}),
		/* @__PURE__ */ jsx("div", {
			className: "mb-8 flex gap-2 overflow-x-auto border-b border-slate-200 pb-1 dark:border-slate-700",
			children: [
				{
					id: "rsvp",
					label: "Data RSVP",
					icon: Users
				},
				{
					id: "wishes",
					label: "Ucapan & Doa",
					icon: MessageCircle
				},
				{
					id: "qr",
					label: "QR Generator",
					icon: QrCode
				},
				{
					id: "pdf",
					label: "Design PDF",
					icon: Printer
				},
				{
					id: "settings",
					label: "Pengaturan",
					icon: Settings
				}
			].map((tab) => /* @__PURE__ */ jsxs("button", {
				onClick: () => setActiveTab(tab.id),
				className: `flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`,
				children: [/* @__PURE__ */ jsx(tab.icon, { className: "h-4 w-4" }), tab.label]
			}, tab.id))
		}),
		activeTab === "rsvp" && /* @__PURE__ */ jsxs("div", {
			className: "animate-reveal space-y-6",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ jsxs("a", {
					href: "/api/export-rsvp",
					target: "_blank",
					className: "flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-green-700",
					children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " EXPORT CSV"]
				})
			}), /* @__PURE__ */ jsx(DataTable, {
				data: rsvps,
				columns: [
					{
						header: "Nama Tamu",
						accessor: "guest_name",
						className: "font-medium"
					},
					{
						header: "Status",
						accessor: (item) => /* @__PURE__ */ jsx("span", {
							className: `rounded-full px-2 py-1 text-[10px] font-bold uppercase ${item.attendance === "hadir" ? "bg-green-100 text-green-700" : item.attendance === "tidak_hadir" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`,
							children: item.attendance.replace("_", " ")
						})
					},
					{
						header: "Pax",
						accessor: "guest_count"
					},
					{
						header: "Pesan",
						accessor: (item) => /* @__PURE__ */ jsx("span", {
							className: "block max-w-[200px] truncate text-slate-500",
							children: item.message
						})
					},
					{
						header: "Waktu",
						accessor: (item) => new Date(item.created_at).toLocaleDateString("id-ID")
					}
				],
				onEdit: (item) => {
					setEditingItem(item);
					setIsModalOpen(true);
				},
				onDelete: (id) => handleDelete("rsvp", [id]),
				onBulkDelete: (ids) => handleDelete("rsvp", ids)
			})]
		}),
		activeTab === "wishes" && /* @__PURE__ */ jsxs("div", {
			className: "animate-reveal space-y-6",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ jsxs("a", {
					href: "/api/export-wishes",
					target: "_blank",
					className: "flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700",
					children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " EXPORT CSV"]
				})
			}), /* @__PURE__ */ jsx(DataTable, {
				data: wishes,
				columns: [
					{
						header: "Nama Pengirim",
						accessor: "name",
						className: "font-medium"
					},
					{
						header: "Ucapan",
						accessor: (item) => /* @__PURE__ */ jsxs("span", {
							className: "block max-w-[300px] text-wrap text-slate-500 italic",
							children: [
								"\"",
								item.message,
								"\""
							]
						})
					},
					{
						header: "Waktu",
						accessor: (item) => new Date(item.created_at).toLocaleDateString("id-ID")
					}
				],
				onEdit: (item) => {
					setEditingItem(item);
					setIsModalOpen(true);
				},
				onDelete: (id) => handleDelete("wish", [id]),
				onBulkDelete: (ids) => handleDelete("wish", ids)
			})]
		}),
		activeTab === "qr" && /* @__PURE__ */ jsx("div", {
			className: "animate-reveal rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800",
			children: /* @__PURE__ */ jsx(QRCodeManager, { siteUrl })
		}),
		activeTab === "pdf" && /* @__PURE__ */ jsx("div", {
			className: "animate-reveal rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800",
			children: /* @__PURE__ */ jsx(InvitationManager, { siteUrl })
		}),
		activeTab === "settings" && /* @__PURE__ */ jsx("div", {
			className: "animate-reveal",
			children: /* @__PURE__ */ jsx(SettingsTab, {})
		}),
		isModalOpen && editingItem && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm",
			children: /* @__PURE__ */ jsxs("div", {
				className: "w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-bold dark:text-white",
						children: "Edit Data"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setIsModalOpen(false),
						children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5 text-slate-400" })
					})]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: (e) => {
						e.preventDefault();
						const formData = new FormData(e.currentTarget);
						const data = Object.fromEntries(formData.entries());
						handleUpdate(activeTab === "rsvp" ? "rsvp" : "wish", editingItem.id, data);
					},
					className: "space-y-4",
					children: [activeTab === "rsvp" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-bold text-slate-500 uppercase",
								children: "Nama Tamu"
							}), /* @__PURE__ */ jsx("input", {
								name: "guest_name",
								defaultValue: editingItem.guest_name,
								className: "w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white",
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-bold text-slate-500 uppercase",
									children: "Status"
								}), /* @__PURE__ */ jsxs("select", {
									name: "attendance",
									defaultValue: editingItem.attendance,
									className: "w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "hadir",
											children: "Hadir"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "ragu",
											children: "Ragu"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "tidak_hadir",
											children: "Tidak Hadir"
										})
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-bold text-slate-500 uppercase",
									children: "Pax"
								}), /* @__PURE__ */ jsx("input", {
									type: "number",
									name: "guest_count",
									defaultValue: editingItem.guest_count,
									min: 1,
									className: "w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-bold text-slate-500 uppercase",
								children: "Pesan"
							}), /* @__PURE__ */ jsx("textarea", {
								name: "message",
								defaultValue: editingItem.message,
								className: "w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white",
								rows: 3
							})]
						})
					] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ jsx("label", {
							className: "text-xs font-bold text-slate-500 uppercase",
							children: "Nama Pengirim"
						}), /* @__PURE__ */ jsx("input", {
							name: "name",
							defaultValue: editingItem.name,
							className: "w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white",
							required: true
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ jsx("label", {
							className: "text-xs font-bold text-slate-500 uppercase",
							children: "Ucapan"
						}), /* @__PURE__ */ jsx("textarea", {
							name: "message",
							defaultValue: editingItem.message,
							className: "w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white",
							rows: 5,
							required: true
						})]
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-700",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setIsModalOpen(false),
							className: "rounded-lg px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700",
							children: "Batal"
						}), /* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: isSaving,
							className: "flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50",
							children: [isSaving ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), "Simpan"]
						})]
					})]
				})]
			})
		})
	] });
};
//#endregion
//#region src/pages/admin.astro
var admin_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Admin,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://wedding.zedlabs.id");
var $$Admin = createComponent(async ($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Admin;
	const ADMIN_PASSWORD = "P@ssw0rd";
	const COOKIE_NAME = "wedding_admin_auth";
	if (Astro2.request.method === "POST") {
		if ((Astro2.request.headers.get("content-type") || "").includes("application/json")) {
			const body = await Astro2.request.json();
			const action = body.action;
			if (action === "login") if (body.credential?.toString() === ADMIN_PASSWORD) {
				Astro2.cookies.set(COOKIE_NAME, "true", {
					path: "/",
					httpOnly: true,
					secure: true,
					maxAge: 3600 * 24
				});
				return new Response(JSON.stringify({ success: true }), {
					status: 200,
					headers: { "Content-Type": "application/json" }
				});
			} else return new Response(JSON.stringify({
				success: false,
				error: "Invalid credential"
			}), {
				status: 401,
				headers: { "Content-Type": "application/json" }
			});
			if (action === "logout") {
				Astro2.cookies.delete(COOKIE_NAME, { path: "/" });
				return new Response(JSON.stringify({ success: true }), {
					status: 200,
					headers: { "Content-Type": "application/json" }
				});
			}
		}
	}
	const isAuthenticated = Astro2.cookies.has(COOKIE_NAME);
	let rsvps = [], wishes = [], stats = {
		total: 0,
		hadir: 0,
		ragu: 0,
		tidak: 0,
		guestCount: 0
	};
	if (isAuthenticated) {
		rsvps = db.prepare("SELECT * FROM rsvps ORDER BY created_at DESC").all();
		wishes = db.prepare("SELECT * FROM wishes ORDER BY created_at DESC").all();
		stats.total = rsvps.length;
		stats.hadir = rsvps.filter((r) => r.attendance === "hadir").length;
		stats.ragu = rsvps.filter((r) => r.attendance === "ragu").length;
		stats.tidak = rsvps.filter((r) => r.attendance === "tidak_hadir").length;
		stats.guestCount = rsvps.filter((r) => r.attendance === "hadir").reduce((sum, r) => sum + (r.guest_count || 1), 0);
	}
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin Dashboard" }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<main class="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200">${!isAuthenticated ? renderTemplate`<div class="flex h-screen w-full items-center justify-center px-4"><div class="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl dark:bg-slate-800"><div class="text-center"><h1 class="font-serif text-3xl font-bold text-slate-900 italic dark:text-white">Admin Access</h1></div><div id="login-error" class="hidden rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">Kredensial tidak valid. Silakan coba lagi.</div><div class="mt-8 space-y-6"><input id="admin-credential" type="password" autocomplete="current-password" class="block w-full rounded-lg border border-slate-300 bg-slate-50 p-4 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white" placeholder="Masukkan akses kunci..."><button id="login-btn" type="button" class="w-full rounded-lg bg-slate-900 px-4 py-4 text-sm font-bold text-white hover:bg-slate-800 dark:bg-blue-600">MASUK</button></div></div></div>` : renderTemplate`<div class="container mx-auto max-w-7xl px-4 py-10"><div class="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row"><div><h1 class="font-serif text-3xl font-bold italic md:text-4xl">Wedding Dashboard</h1><p class="text-sm text-slate-500 dark:text-slate-400">Selamat datang, Admin</p></div><button id="logout-btn" type="button" class="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-2 text-xs font-bold text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">${renderComponent($$result2, "LogOut", LogOut, { "className": "h-4 w-4" })} LOGOUT</button></div><div class="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6"><div class="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800"><div class="flex items-center gap-3 text-slate-400">${renderComponent($$result2, "Fragment", Fragment$2, {}, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Users", Users, { "className": "h-5 w-5" })}<span class="text-xs font-bold uppercase">Total Respon</span>` })}</div><p class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">${stats.total}</p></div><div class="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800"><div class="flex items-center gap-3 text-green-500">${renderComponent($$result2, "Fragment", Fragment$2, {}, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "CheckCircle2", CheckCircle2, { "className": "h-5 w-5" })}<span class="text-xs font-bold uppercase">Hadir</span>` })}</div><div class="mt-2 flex items-baseline gap-2">${renderComponent($$result2, "Fragment", Fragment$2, {}, { "default": ($$result3) => renderTemplate`<span class="text-3xl font-bold text-slate-900 dark:text-white">${stats.hadir}</span><span class="text-lg font-medium text-slate-400">(${stats.guestCount} Pax)</span>` })}</div></div><div class="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800"><div class="flex items-center gap-3 text-yellow-500">${renderComponent($$result2, "Fragment", Fragment$2, {}, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "HelpCircle", HelpCircle, { "className": "h-5 w-5" })}<span class="text-xs font-bold uppercase">Ragu</span>` })}</div><p class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">${stats.ragu}</p></div><div class="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800"><div class="flex items-center gap-3 text-red-500">${renderComponent($$result2, "Fragment", Fragment$2, {}, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "XCircle", XCircle, { "className": "h-5 w-5" })}<span class="text-xs font-bold uppercase">Tidak Hadir</span>` })}</div><p class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">${stats.tidak}</p></div></div>${renderComponent($$result2, "AdminDashboard", AdminDashboard, {
		"client:load": true,
		"initialRsvps": rsvps,
		"initialWishes": wishes,
		"siteUrl": Astro2.site?.toString() || "https://wedding.zedlabs.id",
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/BIRKOMPU-P3HAL2/Documents/yanuar/code/Invitation-2-main/Invitation-2-main/src/components/Admin/AdminDashboard",
		"client:component-export": "default"
	})}</div>`}</main>${renderScript($$result2, "C:/Users/BIRKOMPU-P3HAL2/Documents/yanuar/code/Invitation-2-main/Invitation-2-main/src/pages/admin.astro?astro&type=script&index=0&lang.ts")}` })}`;
}, "C:/Users/BIRKOMPU-P3HAL2/Documents/yanuar/code/Invitation-2-main/Invitation-2-main/src/pages/admin.astro", void 0);
var $$file = "C:/Users/BIRKOMPU-P3HAL2/Documents/yanuar/code/Invitation-2-main/Invitation-2-main/src/pages/admin.astro";
var $$url = "/admin";
//#endregion
//#region \0virtual:astro:page:src/pages/admin@_@astro
var page = () => admin_exports;
//#endregion
export { page };
