import FileSaver from "file-saver";
import jsPDF from "jspdf";
import JSZip from "jszip";
import {
  Check,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Loader2,
  Printer,
  RefreshCcw,
  Sparkles,
  Upload,
} from "lucide-react";
import Papa from "papaparse";
import QRCode from "qrcode";
import React, { useEffect, useState } from "react";

interface GuestData {
  name: string;
  address: string;
}

interface ThemeColor {
  name: string;
  id: string;
  bg: [number, number, number];
  primary: [number, number, number];
  secondary: [number, number, number];
  textMain: [number, number, number];
  textMuted: [number, number, number];
}

const THEMES: ThemeColor[] = [
  {
    name: "Sage Green (Original)",
    id: "sage",
    bg: [255, 255, 255],
    primary: [85, 107, 47],
    secondary: [189, 209, 166],
    textMain: [47, 61, 26],
    textMuted: [110, 120, 90],
  },
  {
    name: "Classic Maroon",
    id: "maroon",
    bg: [255, 252, 252],
    primary: [128, 0, 32],
    secondary: [230, 180, 190],
    textMain: [80, 0, 20],
    textMuted: [150, 80, 90],
  },
  {
    name: "Royal Gold",
    id: "gold",
    bg: [255, 255, 252],
    primary: [184, 134, 11],
    secondary: [240, 230, 140],
    textMain: [101, 67, 33],
    textMuted: [160, 130, 90],
  },
  {
    name: "Dusty Blue",
    id: "blue",
    bg: [250, 250, 255],
    primary: [70, 90, 120],
    secondary: [190, 210, 230],
    textMain: [30, 45, 70],
    textMuted: [100, 120, 140],
  },
];

interface InvitationManagerProps {
  siteUrl: string;
}

const InvitationManager: React.FC<InvitationManagerProps> = ({ siteUrl }) => {
  const [selectedModel, setSelectedModel] = useState<"navy_floral" | "classic">("navy_floral");
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>(THEMES[0]);
  const [singleData, setSingleData] = useState<GuestData>({
    name: "",
    address: "Di Tempat",
  });
  const [bulkData, setBulkData] = useState<GuestData[]>([]);
  const [isReadingCsv, setIsReadingCsv] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isDownloadingSingle, setIsDownloadingSingle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [cfg, setCfg] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => setCfg(data))
      .catch(() => { });
  }, []);

  const baseUrl = siteUrl?.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl || "";

  const handleSaveAs = (blob: Blob | string, name: string) => {
    const saveAsFunc = (FileSaver as any).saveAs || FileSaver;
    saveAsFunc(blob, name);
  };

  const drawLeaf = (
    doc: jsPDF,
    x: number,
    y: number,
    size: number,
    angle: number
  ) => {
    const rad = (angle * Math.PI) / 180;
    const ctx = { c: Math.cos(rad), s: Math.sin(rad) };
    const t = (lx: number, ly: number) => ({
      x: x + (lx * ctx.c - ly * ctx.s) * size,
      y: y + (lx * ctx.s + ly * ctx.c) * size,
    });
    doc.setFillColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setDrawColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.setLineWidth(0.15);
    const p1 = t(0, 0);
    const p2 = t(5, 2.5);
    const p3 = t(10, 0);
    const p4 = t(5, -2.5);
    doc.triangle(p1.x, p1.y, p3.x, p3.y, p2.x, p2.y, "FD");
    doc.triangle(p1.x, p1.y, p3.x, p3.y, p4.x, p4.y, "FD");
    doc.setLineWidth(0.1);
    doc.line(p1.x, p1.y, p3.x, p3.y);
  };

  const drawRose = (doc: jsPDF, x: number, y: number, size: number) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.setLineWidth(0.25);
    doc.circle(x, y, size, "FD");
    const steps = 18;
    let radius = 0.8;
    let angle = 0;
    let prevX = x;
    let prevY = y;
    for (let i = 0; i < steps; i++) {
      angle += 0.7;
      radius += size / steps;
      const nextX = x + Math.cos(angle) * radius;
      const nextY = y + Math.sin(angle) * radius;
      if (i > 1) {
        doc.setLineWidth(0.15 - i * 0.005);
        doc.line(prevX, prevY, nextX, nextY);
      }
      prevX = nextX;
      prevY = nextY;
    }
  };

  const drawFloralCluster = (
    doc: jsPDF,
    cx: number,
    cy: number,
    rot: number
  ) => {
    const leaves = [
      { s: 1.6, a: rot + 5, d: 9 },
      { s: 1.3, a: rot + 35, d: 9 },
      { s: 1.6, a: rot + 75, d: 9 },
      { s: 1.1, a: rot + 20, d: 13 },
      { s: 1.1, a: rot + 60, d: 13 },
      { s: 0.9, a: rot + 45, d: 15 },
    ];
    leaves.forEach((l) => {
      const lx = cx + Math.cos((l.a * Math.PI) / 180) * l.d;
      const ly = cy + Math.sin((l.a * Math.PI) / 180) * l.d;
      drawLeaf(doc, lx, ly, l.s, l.a);
    });
    drawRose(doc, cx, cy, 7.5);
    const buds = [
      { a: rot + 15, d: 10 },
      { a: rot + 65, d: 10 },
      { a: rot + 40, d: 12 },
    ];
    buds.forEach((b) => {
      const bx = cx + Math.cos((b.a * Math.PI) / 180) * b.d;
      const by = cy + Math.sin((b.a * Math.PI) / 180) * b.d;
      drawRose(doc, bx, by, 3.5);
    });
  };

  const drawBorder = (doc: jsPDF, w: number, h: number) => {
    const m = 6;
    doc.setDrawColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.setLineWidth(0.5);
    doc.rect(m, m, w - m * 2, h - m * 2);
    doc.setLineWidth(0.15);
    doc.rect(m + 1.5, m + 1.5, w - (m + 1.5) * 2, h - (m + 1.5) * 2);
    doc.setLineWidth(0.15);
    doc.rect(m + 2.5, m + 2.5, w - (m + 2.5) * 2, h - (m + 2.5) * 2);
  };

  const drawCornerDecorations = (doc: jsPDF, width: number, height: number) => {
    const offset = 12;
    drawFloralCluster(doc, offset, offset, 0);
    drawFloralCluster(doc, width - offset, offset, 90);
    drawFloralCluster(doc, width - offset, height - offset, 180);
    drawFloralCluster(doc, offset, height - offset, 270);
    doc.setDrawColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setLineWidth(0.1);
    const midTop = { x: width / 2, y: 8 };
    const midBottom = { x: width / 2, y: height - 8 };
    const midLeft = { x: 8, y: height / 2 };
    const midRight = { x: width - 8, y: height / 2 };
    [midTop, midBottom, midLeft, midRight].forEach((pos) => {
      for (let i = 0; i < 3; i++) {
        const size = 0.8 - i * 0.2;
        doc.circle(pos.x, pos.y, size, "D");
      }
    });
  };

  const generateClassicFloralPDF = async (
    guest: GuestData
  ): Promise<jsPDF> => {
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
    const salamOpening =
      cfg.TEXT_SALAM_OPENING || "Assalamu'alaikum Warahmatullahi Wabarakatuh";
    const quoteArRum = cfg.TEXT_QUOTE_AR_RUM || "";
    const closingText = cfg.TEXT_CLOSING || "";
    const salamClosing =
      cfg.TEXT_SALAM_CLOSING || "Wassalamu'alaikum Warahmatullahi Wabarakatuh";
    const signature = cfg.TEXT_SIGNATURE || "Kami yang berbahagia,";

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5",
    });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const cx = width / 2;

    const guestUrl = `${baseUrl}/?to=${encodeURIComponent(guest.name)}`;
    const qrGuestImg = await QRCode.toDataURL(guestUrl, {
      margin: 0,
      color: { dark: "#2f3d1a", light: "#ffffff" },
    });
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${venueLat},${venueLng}`;
    const qrMapsImg = await QRCode.toDataURL(mapsUrl, {
      margin: 0,
      color: { dark: "#2f3d1a", light: "#ffffff" },
    });

    doc.setFillColor(
      currentTheme.bg[0],
      currentTheme.bg[1],
      currentTheme.bg[2]
    );
    doc.rect(0, 0, width, height, "F");
    drawBorder(doc, width, height);
    drawCornerDecorations(doc, width, height);

    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(
      currentTheme.textMuted[0],
      currentTheme.textMuted[1],
      currentTheme.textMuted[2]
    );
    doc.text("THE WEDDING OF", cx, 50, { align: "center" });
    doc.setFont("times", "italic");
    doc.setFontSize(40);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    doc.text(brideName, cx, 75, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(16);
    doc.setTextColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.text("&", cx, 88, { align: "center" });
    doc.setFont("times", "italic");
    doc.setFontSize(40);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    doc.text(groomName, cx, 105, { align: "center" });
    doc.setDrawColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setLineWidth(0.2);
    doc.line(cx - 20, 115, cx + 20, 115);
    doc.setFont("times", "bold");
    doc.setFontSize(9);
    doc.setTextColor(
      currentTheme.textMuted[0],
      currentTheme.textMuted[1],
      currentTheme.textMuted[2]
    );
    doc.text(resepsiDate.toUpperCase(), cx, 125, { align: "center" });

    const boxY = 155;
    const boxW = 85;
    const boxH = 30;
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setLineWidth(0.3);
    doc.roundedRect(cx - boxW / 2 + 0.5, boxY + 0.5, boxW, boxH, 2, 2, "F");
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.setLineWidth(0.5);
    doc.roundedRect(cx - boxW / 2, boxY, boxW, boxH, 2, 2, "FD");
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.text("Kepada Yth. Bapak/Ibu/Saudara/i:", cx, boxY + 8, {
      align: "center",
    });
    doc.setFont("times", "bolditalic");
    doc.setFontSize(14);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    const splitName = doc.splitTextToSize(guest.name, boxW - 5);
    doc.text(splitName, cx, boxY + 18, { align: "center" });
    if (guest.address) {
      doc.setFont("times", "normal");
      doc.setFontSize(9);
      doc.setTextColor(
        currentTheme.textMuted[0],
        currentTheme.textMuted[1],
        currentTheme.textMuted[2]
      );
      doc.text(guest.address, cx, boxY + 26, { align: "center" });
    }

    doc.addPage();
    drawBorder(doc, width, height);
    drawCornerDecorations(doc, width, height);
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    doc.text(salamOpening, cx, 50, { align: "center" });
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(
      currentTheme.textMuted[0],
      currentTheme.textMuted[1],
      currentTheme.textMuted[2]
    );
    const quote = doc.splitTextToSize(quoteArRum, width - 60);
    doc.text(quote, cx, 60, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text(
      "Kami bermaksud menyelenggarakan pernikahan putra-putri kami:",
      cx,
      95,
      { align: "center" }
    );
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.text(brideFullName, cx, 110, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.setTextColor(
      currentTheme.textMuted[0],
      currentTheme.textMuted[1],
      currentTheme.textMuted[2]
    );
    doc.text(brideParents, cx, 117, { align: "center" });
    doc.setFont("times", "italic");
    doc.setFontSize(12);
    doc.text("&", cx, 127, { align: "center" });
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.text(groomFullName, cx, 137, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.setTextColor(
      currentTheme.textMuted[0],
      currentTheme.textMuted[1],
      currentTheme.textMuted[2]
    );
    doc.text(groomParents, cx, 144, { align: "center" });

    doc.addPage();
    drawBorder(doc, width, height);
    drawCornerDecorations(doc, width, height);
    doc.setFont("times", "italic");
    doc.setFontSize(11);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    doc.text("Insya Allah acara akan dilaksanakan pada:", cx, 35, {
      align: "center",
    });
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.text(akadTitle, cx, 50, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    doc.text(`${akadDay}, ${akadDate}`, cx, 57, { align: "center" });
    doc.text(`Pukul: ${akadStart} - ${akadEnd} WIB`, cx, 62, {
      align: "center",
    });
    doc.setDrawColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setLineWidth(0.15);
    doc.line(cx - 20, 70, cx - 5, 70);
    doc.line(cx + 5, 70, cx + 20, 70);
    doc.setFillColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    for (let i = 0; i < 3; i++) {
      doc.circle(cx - 2 + i, 70, 0.3, "F");
    }
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.text(resepsiTitle, cx, 85, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    doc.text(`${resepsiDay}, ${resepsiDate}`, cx, 92, { align: "center" });
    doc.text(`Pukul: ${resepsiStart} - ${resepsiEnd} WIB`, cx, 97, {
      align: "center",
    });
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    doc.text("BERTEMPAT DI:", cx, 115, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.text(venueName, cx, 122, { align: "center" });
    doc.setFontSize(9);
    doc.setTextColor(
      currentTheme.textMuted[0],
      currentTheme.textMuted[1],
      currentTheme.textMuted[2]
    );
    const addr = doc.splitTextToSize(venueAddress, 80);
    doc.text(addr, cx, 128, { align: "center" });
    const qrSize = 22;
    const qrY = 145;
    doc.setDrawColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setLineWidth(0.3);
    doc.roundedRect(
      cx - qrSize / 2 - 1.5,
      qrY - 1.5,
      qrSize + 3,
      qrSize + 3,
      1,
      1
    );
    doc.addImage(qrMapsImg, "PNG", cx - qrSize / 2, qrY, qrSize, qrSize);
    doc.text("Scan Google Maps", cx, qrY + qrSize + 5, { align: "center" });

    doc.addPage();
    drawBorder(doc, width, height);
    drawCornerDecorations(doc, width, height);
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.setTextColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.text("E-INVITATION", cx, 50, { align: "center" });
    const qrDigiSize = 40;
    const digiY = 60;
    doc.setFillColor(
      currentTheme.bg[0],
      currentTheme.bg[1],
      currentTheme.bg[2]
    );
    doc.setDrawColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setLineWidth(0.3);
    doc.roundedRect(
      cx - qrDigiSize / 2 - 2.5,
      digiY - 2.5,
      qrDigiSize + 5,
      qrDigiSize + 5,
      2,
      2,
      "FD"
    );
    doc.setDrawColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.setLineWidth(0.4);
    doc.roundedRect(
      cx - qrDigiSize / 2 - 2,
      digiY - 2,
      qrDigiSize + 4,
      qrDigiSize + 4,
      1.5,
      1.5,
      "D"
    );
    doc.addImage(
      qrGuestImg,
      "PNG",
      cx - qrDigiSize / 2,
      digiY,
      qrDigiSize,
      qrDigiSize
    );
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.setTextColor(
      currentTheme.textMuted[0],
      currentTheme.textMuted[1],
      currentTheme.textMuted[2]
    );
    doc.text(
      "Scan untuk buka undangan digital & konfirmasi kehadiran",
      cx,
      digiY + qrDigiSize + 8,
      { align: "center" }
    );
    const closingY = 135;
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    const closing = doc.splitTextToSize(closingText, width - 60);
    doc.text(closing, cx, closingY, { align: "center" });
    doc.setFont("times", "bolditalic");
    doc.text(salamClosing, cx, closingY + 20, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.text(signature, cx, closingY + 30, { align: "center" });
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.text(`${brideName} & ${groomName}`, cx, closingY + 38, {
      align: "center",
    });
    doc.setDrawColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setLineWidth(0.1);
    for (let i = 0; i < 5; i++) {
      doc.circle(cx + (-10 + i * 5), closingY + 48, 0.4, "D");
    }

    return doc;
  };

  const drawNavyPetal = (
    doc: jsPDF,
    cx: number,
    cy: number,
    r: number,
    color: [number, number, number]
  ) => {
    doc.setFillColor(color[0], color[1], color[2]);
    doc.setDrawColor(
      Math.max(color[0] - 25, 0),
      Math.max(color[1] - 25, 0),
      Math.max(color[2] - 20, 0)
    );
    doc.setLineWidth(0.12);
    doc.circle(cx, cy, r, "FD");
  };

  const drawNavyFlower = (
    doc: jsPDF,
    cx: number,
    cy: number,
    size: number,
    variant: "light" | "deep" | "anemone" = "light"
  ) => {
    const petalColor: [number, number, number] =
      variant === "light"
        ? [168, 185, 238]
        : variant === "deep"
          ? [115, 155, 212]
          : [135, 170, 225];
    const innerPetalColor: [number, number, number] =
      variant === "light"
        ? [188, 205, 248]
        : variant === "deep"
          ? [140, 175, 225]
          : [155, 185, 235];

    const numPetals = 5;
    const dist = size * 0.52;
    const r = size * 0.44;

    for (let i = 0; i < numPetals; i++) {
      const angle = (i * 2 * Math.PI) / numPetals - Math.PI / 2;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      drawNavyPetal(doc, px, py, r, petalColor);
    }
    for (let i = 0; i < numPetals; i++) {
      const angle = (i * 2 * Math.PI) / numPetals - Math.PI / 2 + Math.PI / 5;
      const px = cx + Math.cos(angle) * (dist * 0.72);
      const py = cy + Math.sin(angle) * (dist * 0.72);
      drawNavyPetal(doc, px, py, r * 0.72, innerPetalColor);
    }

    doc.setFillColor(25, 45, 75);
    doc.setDrawColor(15, 30, 50);
    doc.setLineWidth(0.1);
    doc.circle(cx, cy, size * 0.28, "FD");

    doc.setFillColor(242, 160, 48);
    doc.circle(cx, cy, size * 0.19, "F");

    doc.setFillColor(255, 245, 220);
    const numStamens = 7;
    for (let j = 0; j < numStamens; j++) {
      const sAngle = (j * 2 * Math.PI) / numStamens;
      const sx = cx + Math.cos(sAngle) * (size * 0.23);
      const sy = cy + Math.sin(sAngle) * (size * 0.23);
      doc.circle(sx, sy, 0.22, "F");
    }
  };

  const drawNavyLeaf = (
    doc: jsPDF,
    x: number,
    y: number,
    size: number,
    angleDeg: number,
    color: [number, number, number] = [75, 105, 110]
  ) => {
    const rad = (angleDeg * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const t = (lx: number, ly: number) => ({
      x: x + (lx * c - ly * s) * size,
      y: y + (lx * s + ly * c) * size,
    });

    doc.setFillColor(color[0], color[1], color[2]);
    doc.setDrawColor(
      Math.max(color[0] - 25, 0),
      Math.max(color[1] - 25, 0),
      Math.max(color[2] - 25, 0)
    );
    doc.setLineWidth(0.12);

    const p1 = t(0, 0);
    const p2 = t(5, 2.4);
    const p3 = t(11, 0);
    const p4 = t(5, -2.4);

    doc.triangle(p1.x, p1.y, p3.x, p3.y, p2.x, p2.y, "FD");
    doc.triangle(p1.x, p1.y, p3.x, p3.y, p4.x, p4.y, "FD");

    doc.setDrawColor(
      Math.min(color[0] + 35, 255),
      Math.min(color[1] + 35, 255),
      Math.min(color[2] + 35, 255)
    );
    doc.setLineWidth(0.1);
    doc.line(p1.x, p1.y, p3.x, p3.y);
  };

  const drawNavyGoldBranches = (doc: jsPDF, divX: number) => {
    doc.setDrawColor(218, 175, 55);
    doc.setLineWidth(0.25);

    const branches = [
      { start: [divX - 25, 30], end: [divX - 6, 55] },
      { start: [divX - 12, 45], end: [divX + 5, 35] },
      { start: [divX - 28, 48], end: [divX - 14, 25] },
      { start: [divX - 18, 155], end: [divX - 28, 185] },
      { start: [divX - 10, 162], end: [divX + 3, 192] },
      { start: [divX - 22, 170], end: [divX - 12, 202] },
    ];
    branches.forEach((b) => {
      doc.line(b.start[0], b.start[1], b.end[0], b.end[1]);
      doc.circle(b.end[0], b.end[1], 0.8, "D");
    });
  };

  const drawNavyFloralComposition = (doc: jsPDF, divX: number) => {
    drawNavyGoldBranches(doc, divX);

    const leaves: {
      x: number;
      y: number;
      s: number;
      a: number;
      c: [number, number, number];
    }[] = [
        { x: divX - 18, y: 55, s: 1.1, a: -60, c: [75, 105, 110] },
        { x: divX - 10, y: 62, s: 1.3, a: -40, c: [95, 125, 130] },
        { x: divX - 4, y: 68, s: 1.2, a: 15, c: [60, 90, 95] },
        { x: divX - 26, y: 72, s: 1.0, a: -85, c: [115, 140, 145] },
        { x: divX - 30, y: 88, s: 1.2, a: -110, c: [85, 115, 120] },
        { x: divX - 24, y: 110, s: 1.3, a: -125, c: [65, 95, 100] },
        { x: divX + 3, y: 90, s: 1.2, a: 20, c: [75, 105, 110] },
        { x: divX + 5, y: 118, s: 1.1, a: 35, c: [90, 120, 125] },
        { x: divX - 22, y: 135, s: 1.2, a: -140, c: [75, 105, 110] },
        { x: divX - 16, y: 154, s: 1.3, a: -150, c: [95, 125, 130] },
        { x: divX - 8, y: 168, s: 1.2, a: -120, c: [60, 90, 95] },
        { x: divX - 18, y: 180, s: 1.0, a: -160, c: [115, 140, 145] },
        { x: divX - 24, y: 145, s: 1.1, a: -130, c: [70, 100, 105] },
      ];

    leaves.forEach((lf) => {
      drawNavyLeaf(doc, lf.x, lf.y, lf.s, lf.a, lf.c);
    });

    drawNavyFlower(doc, divX - 16, 52, 4.5, "light");
    drawNavyFlower(doc, divX - 24, 76, 5.5, "light");
    drawNavyFlower(doc, divX - 15, 142, 6.0, "light");
    drawNavyFlower(doc, divX - 10, 160, 5.0, "light");

    drawNavyFlower(doc, divX - 10, 68, 7.5, "light");
    drawNavyFlower(doc, divX - 7, 126, 7.5, "deep");

    drawNavyFlower(doc, divX - 1, 100, 11.0, "anemone");
    drawNavyFlower(doc, divX - 14, 110, 8.5, "light");
    drawNavyFlower(doc, divX - 12, 88, 7.0, "deep");
  };

  const BULAN_FULL: Record<string, string> = {
    JAN: "Januari", FEB: "Februari", MAR: "Maret", APR: "April",
    MEI: "Mei", MAY: "Mei", JUN: "Juni", JUL: "Juli",
    AGU: "Agustus", AUG: "Agustus", SEP: "September",
    OKT: "Oktober", OCT: "Oktober", NOV: "November",
    DES: "Desember", DEC: "Desember",
  };

  const HARI_FULL: Record<string, string> = {
    MIN: "Minggu", SEN: "Senin", SEL: "Selasa", RAB: "Rabu",
    KAM: "Kamis", JUM: "Jumat", SAB: "Sabtu",
    MINGGU: "Minggu", SENIN: "Senin", SELASA: "Selasa", RABU: "Rabu",
    KAMIS: "Kamis", JUMAT: "Jumat", SABTU: "Sabtu",
    SUN: "Minggu", MON: "Senin", TUE: "Selasa", WED: "Rabu",
    THU: "Kamis", FRI: "Jumat", SAT: "Sabtu",
  };

  const parseBadgeInfo = (dateStr: string, dayStr: string) => {
    let dayNum = "21";
    let monthStr = "Mei";

    if (dateStr) {
      const match = dateStr.match(/(\d{1,2})\s+([a-zA-Z]+)/);
      if (match) {
        dayNum = match[1];
        const rawMonth = match[2].toUpperCase().slice(0, 3);
        monthStr = BULAN_FULL[rawMonth] || match[2];
      }
    }

    const upperDay = (dayStr || "Jumat").toUpperCase().trim();
    const dayName = HARI_FULL[upperDay] || dayStr || "Jumat";

    return { dayName, dayNum, monthStr };
  };

  let cachedNavyBgDataUrl: string | null = null;

  const getNavyFloralBg = async (): Promise<string | null> => {
    if (cachedNavyBgDataUrl) return cachedNavyBgDataUrl;
    try {
      const res = await fetch("/templates/navy-floral-bg.jpg");
      if (!res.ok) return null;
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          cachedNavyBgDataUrl = reader.result as string;
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

  const generateNavyFloralPDF = async (guest: GuestData): Promise<jsPDF> => {
    const brideName = cfg.BRIDE_NICKNAME || "Elizabeth";
    const groomName = cfg.GROOM_NICKNAME || "Andrean";
    const brideFullName = cfg.BRIDE_FULLNAME || "Elizabeth Alexandra";
    const groomFullName = cfg.GROOM_FULLNAME || "Andrean Pratama";
    const brideParents =
      cfg.BRIDE_PARENTS || "Putri dari Bpk. Alexandra & Ibu Maria";
    const groomParents =
      cfg.GROOM_PARENTS || "Putra dari Bpk. Pratama & Ibu Ratna";
    const venueName = cfg.VENUE_NAME || "The Royal Azure Ballroom";
    const venueAddress =
      cfg.VENUE_ADDRESS || "Jl. Sudirman No. 4567, Jakarta Pusat";
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
    const salamOpening =
      cfg.TEXT_SALAM_OPENING || "Assalamu'alaikum Warahmatullahi Wabarakatuh";
    const quoteArRum =
      cfg.TEXT_QUOTE_AR_RUM ||
      "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)";
    const closingText =
      cfg.TEXT_CLOSING ||
      "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.";
    const salamClosing =
      cfg.TEXT_SALAM_CLOSING || "Wassalamu'alaikum Warahmatullahi Wabarakatuh";
    const signature = cfg.TEXT_SIGNATURE || "Kami yang berbahagia,";

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5",
    });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    // Senter kolom navy di sebelah kanan ornamen bunga (bunga berakhir di x ~78mm)
    // Senter tepat antara 80mm dan 148mm: (80 + 148) / 2 = 114 mm
    const rx = 114;

    const guestUrl = `${baseUrl}/?to=${encodeURIComponent(guest.name)}`;
    const qrGuestImg = await QRCode.toDataURL(guestUrl, {
      margin: 0,
      color: { dark: "#0b2540", light: "#ffffff" },
    });
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${venueLat},${venueLng}`;
    const qrMapsImg = await QRCode.toDataURL(mapsUrl, {
      margin: 0,
      color: { dark: "#0b2540", light: "#ffffff" },
    });

    const badge = parseBadgeInfo(resepsiDate || akadDate, resepsiDay || akadDay);

    // ==========================================
    // HALAMAN 1: COVER ELEGAN NATURAL WATERCOLOR
    // ==========================================
    const bgImg = await getNavyFloralBg();
    if (bgImg) {
      doc.addImage(bgImg, "JPEG", 0, 0, width, height);
    } else {
      // Fallback jika gambar template belum termuat
      const divX = 55;
      doc.setFillColor(236, 244, 252);
      doc.rect(0, 0, divX, height, "F");
      doc.setFillColor(11, 37, 64);
      doc.rect(divX, 0, width - divX, height, "F");
      drawNavyFloralComposition(doc, divX);
    }

    // Nama Mempelai Cursive Elegan
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

    // BADGE TANGGAL ELEGAN SESUAI REFERENSI:
    // Garis ganda di atas & bawah Hari & Bulan, Lingkaran di tengah dengan angka tanggal 100% center
    const badgeY = 118;
    const badgeR = 6.2;
    const gapFromCircle = 3.2;
    const lineW = 20;

    const leftLineEnd = rx - badgeR - gapFromCircle; // ~104.6 mm
    const leftLineStart = leftLineEnd - lineW;       // ~84.6 mm (jauh aman dari bunga di 78mm)
    const leftCenter = (leftLineStart + leftLineEnd) / 2;

    const rightLineStart = rx + badgeR + gapFromCircle; // ~123.4 mm
    const rightLineEnd = rightLineStart + lineW;        // ~143.4 mm (aman dari margin kanan 148mm)
    const rightCenter = (rightLineStart + rightLineEnd) / 2;

    // Garis atas dan bawah untuk HARI (kiri)
    doc.setDrawColor(180, 210, 238);
    doc.setLineWidth(0.35);
    doc.line(leftLineStart, badgeY - 4.5, leftLineEnd, badgeY - 4.5);
    doc.line(leftLineStart, badgeY + 4.5, leftLineEnd, badgeY + 4.5);

    // Teks HARI - vertikal & horizontal center sempurna
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(badge.dayName.toUpperCase(), leftCenter, badgeY, {
      align: "center",
      baseline: "middle",
    });

    // Lingkaran tengah & angka tanggal center
    doc.setFillColor(210, 230, 252);
    doc.circle(rx, badgeY, badgeR, "F");

    doc.setTextColor(11, 37, 64);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(badge.dayNum, rx, badgeY, {
      align: "center",
      baseline: "middle",
    });

    // Garis atas dan bawah untuk BULAN (kanan)
    doc.setDrawColor(180, 210, 238);
    doc.setLineWidth(0.35);
    doc.line(rightLineStart, badgeY - 4.5, rightLineEnd, badgeY - 4.5);
    doc.line(rightLineStart, badgeY + 4.5, rightLineEnd, badgeY + 4.5);

    // Teks BULAN - vertikal & horizontal center sempurna
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(badge.monthStr.toUpperCase(), rightCenter, badgeY, {
      align: "center",
      baseline: "middle",
    });

    // Waktu & Tempat Acara
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

    // Box Kartu Tamu Personal + QR Code
    const boxY = 162;
    const boxW = 58;
    const boxH = 34;
    const boxX = rx - boxW / 2; // ~85 mm

    doc.setFillColor(15, 42, 72);
    doc.setDrawColor(48, 90, 135);
    doc.setLineWidth(0.4);
    doc.roundedRect(boxX, boxY, boxW, boxH, 2.5, 2.5, "FD");

    doc.setDrawColor(35, 75, 115);
    doc.setLineWidth(0.15);
    doc.roundedRect(boxX + 1, boxY + 1, boxW - 2, boxH - 2, 2, 2, "D");

    const guestTextCenterX = boxX + (boxW - 19) / 2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(185, 215, 240);
    doc.text("Kepada Yth. Bapak/Ibu/Saudara/i:", guestTextCenterX, boxY + 6.5, {
      align: "center",
    });

    doc.setFont("times", "bolditalic");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    const splitGuest = doc.splitTextToSize(guest.name, 36);
    doc.text(splitGuest, guestTextCenterX, boxY + 14.5, { align: "center" });

    if (guest.address) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(195, 220, 245);
      doc.text(guest.address, guestTextCenterX, boxY + 23.5, { align: "center" });
    }

    const qrSize = 16;
    const qrX = boxX + boxW - qrSize - 3.5;
    const qrY = boxY + 5;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(qrX - 0.8, qrY - 0.8, qrSize + 1.6, qrSize + 1.6, 1, 1, "F");
    doc.addImage(qrGuestImg, "PNG", qrX, qrY, qrSize, qrSize);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    doc.setTextColor(185, 215, 240);
    doc.text("Scan Undangan", qrX + qrSize / 2, qrY + qrSize + 3.2, {
      align: "center",
    });

    // ==========================================
    // HALAMAN 2: MINIMALIST LUXURY BOTANICAL LINE-ART (REFACTORED)
    // ==========================================
    doc.addPage();

    // Solid dark navy background
    doc.setFillColor(11, 37, 64);
    doc.rect(0, 0, width, height, "F");

    // ── BINGKAI GARIS GANDA HAIRLINE ──────────────────────────────────────────
    // Bingkai luar: garis tebal 0.35 mm, margin 8 mm
    doc.setDrawColor(218, 175, 55);
    doc.setLineWidth(0.35);
    doc.rect(8, 8, width - 16, height - 16);
    // Bingkai dalam: garis tipis 0.15 mm, margin 11 mm
    doc.setLineWidth(0.15);
    doc.rect(11, 11, width - 22, height - 22);

    // ── FUNGSI HELPER BOTANICAL LINE-ART ─────────────────────────────────────
    // Gambar daun organik dengan kurva Bezier
    const drawBotanicalLeaf = (
      bx: number,
      by: number,
      tx: number,
      ty: number,
      leafW = 1.0
    ) => {
      const dx = tx - bx;
      const dy = ty - by;
      const len = Math.hypot(dx, dy);
      if (len < 0.1) return;
      const nx = -dy / len;
      const ny = dx / len;
      const c1x = bx + dx * 0.35 + nx * leafW;
      const c1y = by + dy * 0.35 + ny * leafW;
      const c2x = bx + dx * 0.7 + nx * (leafW * 0.65);
      const c2y = by + dy * 0.7 + ny * (leafW * 0.65);
      const c3x = bx + dx * 0.7 - nx * (leafW * 0.65);
      const c3y = by + dy * 0.7 - ny * (leafW * 0.65);
      const c4x = bx + dx * 0.35 - nx * leafW;
      const c4y = by + dy * 0.35 - ny * leafW;
      doc.lines(
        [
          [c1x - bx, c1y - by, c2x - bx, c2y - by, tx - bx, ty - by],
          [c3x - tx, c3y - ty, c4x - tx, c4y - ty, bx - tx, by - ty],
        ],
        bx, by, [1, 1], "S", true
      );
      // Tulang daun tengah
      doc.line(bx, by, bx + dx * 0.72, by + dy * 0.72);
    };

    // Ornamen sudut botanical: dua sulur (horizontal + vertikal) + daun
    const drawBotanicalCorner = (
      cornerX: number,
      cornerY: number,
      flipX = 1,
      flipY = 1
    ) => {
      doc.setDrawColor(218, 175, 55);
      doc.setLineWidth(0.2);
      doc.setFillColor(218, 175, 55);
      const p = (lx: number, ly: number) => ({
        x: cornerX + lx * flipX,
        y: cornerY + ly * flipY,
      });

      // Tangkai horizontal melengkung organik
      const h0 = p(0, 0), h1 = p(6, 1.5), h2 = p(13, 1.8), h3 = p(20, 1.2);
      doc.lines(
        [[h1.x - h0.x, h1.y - h0.y, h2.x - h0.x, h2.y - h0.y, h3.x - h0.x, h3.y - h0.y]],
        h0.x, h0.y, [1, 1], "S", false
      );

      // Tangkai vertikal melengkung organik
      const v0 = p(0, 0), v1 = p(1.5, 6), v2 = p(1.8, 13), v3 = p(1.2, 20);
      doc.lines(
        [[v1.x - v0.x, v1.y - v0.y, v2.x - v0.x, v2.y - v0.y, v3.x - v0.x, v3.y - v0.y]],
        v0.x, v0.y, [1, 1], "S", false
      );

      // Daun sepanjang ranting horizontal (bergantian naik-turun seperti sulur alami)
      drawBotanicalLeaf(p(4, 1.3).x, p(4, 1.3).y, p(7, -1.2).x, p(7, -1.2).y, 0.85);
      drawBotanicalLeaf(p(8, 1.6).x, p(8, 1.6).y, p(11, 3.8).x, p(11, 3.8).y, 0.80);
      drawBotanicalLeaf(p(12.5, 1.7).x, p(12.5, 1.7).y, p(15.5, -0.5).x, p(15.5, -0.5).y, 0.78);
      drawBotanicalLeaf(p(16.5, 1.5).x, p(16.5, 1.5).y, p(19.5, 3.5).x, p(19.5, 3.5).y, 0.68);
      drawBotanicalLeaf(p(20, 1.2).x, p(20, 1.2).y, p(23.5, 1.0).x, p(23.5, 1.0).y, 0.6);

      // Daun sepanjang ranting vertikal
      drawBotanicalLeaf(p(1.3, 4).x, p(1.3, 4).y, p(-1.2, 7).x, p(-1.2, 7).y, 0.85);
      drawBotanicalLeaf(p(1.6, 8).x, p(1.6, 8).y, p(3.8, 11).x, p(3.8, 11).y, 0.80);
      drawBotanicalLeaf(p(1.7, 12.5).x, p(1.7, 12.5).y, p(-0.5, 15.5).x, p(-0.5, 15.5).y, 0.78);
      drawBotanicalLeaf(p(1.5, 16.5).x, p(1.5, 16.5).y, p(3.5, 19.5).x, p(3.5, 19.5).y, 0.68);
      drawBotanicalLeaf(p(1.2, 20).x, p(1.2, 20).y, p(1.0, 23.5).x, p(1.0, 23.5).y, 0.6);

      // Aksen titik berry kecil di ujung ranting & diagonal
      const berries = [
        { from: p(6.5, 1.5), to: p(7.5, 3.5) },
        { from: p(14.5, 1.6), to: p(15.5, -0.8) },
        { from: p(1.5, 6.5), to: p(3.5, 7.5) },
        { from: p(1.6, 14.5), to: p(-0.8, 15.5) },
      ];
      berries.forEach((b) => {
        doc.line(b.from.x, b.from.y, b.to.x, b.to.y);
        doc.circle(b.to.x, b.to.y, 0.42, "FD");
      });

      // Aksen titik kecil di sudut (bead)
      doc.circle(p(0.8, 0.8).x, p(0.8, 0.8).y, 0.55, "FD");
    };

    // Render ornamen di 4 sudut bagian dalam bingkai
    drawBotanicalCorner(11, 11, 1, 1);               // Kiri Atas
    drawBotanicalCorner(width - 11, 11, -1, 1);      // Kanan Atas
    drawBotanicalCorner(11, height - 11, 1, -1);     // Kiri Bawah
    drawBotanicalCorner(width - 11, height - 11, -1, -1); // Kanan Bawah

    const cx2 = width / 2;

    // ── DIVIDER: GARIS TIPIS + WAJIK OUTLINE DI TENGAH ───────────────────────
    const drawEditorialDivider = (y: number) => {
      doc.setDrawColor(218, 175, 55);
      doc.setLineWidth(0.25);
      doc.setFillColor(11, 37, 64);
      const dw = 2.4;
      const dh = 1.4;
      // Garis kiri & kanan
      doc.line(16, y, cx2 - dw - 2.5, y);
      doc.line(cx2 + dw + 2.5, y, width - 16, y);
      // Wajik outline kecil di tengah (vektor dx, dy 2 titik garis)
      doc.lines(
        [
          [dw, dh],
          [-dw, dh],
          [-dw, -dh],
          [dw, -dh],
        ],
        cx2,
        y - dh,
        [1, 1],
        "D",
        true
      );
    };

    // ── TIPOGRAFI HALAMAN 2 ───────────────────────────────────────────────────
    // Salam pembuka
    doc.setFont("times", "italic");
    doc.setFontSize(10.5);
    doc.setTextColor(255, 255, 255);
    doc.text(salamOpening, cx2, 27, { align: "center" });

    drawEditorialDivider(31.5);

    // Kutipan ayat — times italic 7.5pt, maxWidth 105mm
    doc.setFont("times", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(195, 220, 245);
    const quote = doc.splitTextToSize(quoteArRum, 105);
    doc.text(quote, cx2, 36, { align: "center" });

    drawEditorialDivider(53);

    // Sub-judul
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(165, 200, 230);
    doc.text(
      "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan:",
      cx2,
      59,
      { align: "center", maxWidth: 110 }
    );

    // Nama mempelai wanita — times bold 17pt (focal point)
    doc.setFont("times", "bold");
    doc.setFontSize(17);
    doc.setTextColor(255, 255, 255);
    doc.text(brideFullName, cx2, 68, { align: "center" });

    // Nama orang tua — helvetica normal 7.5pt, rapat 4mm di bawah nama
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(185, 210, 235);
    doc.text(brideParents, cx2, 72.5, { align: "center", maxWidth: 110 });

    // Simbol & — times italic 13pt, jarak 6.5mm dari kedua nama
    doc.setFont("times", "italic");
    doc.setFontSize(13);
    doc.setTextColor(218, 175, 55);
    doc.text("&", cx2, 79, { align: "center" });

    // Nama mempelai pria — times bold 17pt
    doc.setFont("times", "bold");
    doc.setFontSize(17);
    doc.setTextColor(255, 255, 255);
    doc.text(groomFullName, cx2, 87.5, { align: "center" });

    // Nama orang tua — helvetica normal 7.5pt
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(185, 210, 235);
    doc.text(groomParents, cx2, 92, { align: "center", maxWidth: 110 });

    drawEditorialDivider(97.5);

    // ── JADWAL: EDITORIAL GRID (tanpa rounded card) ───────────────────────────
    const schedY = 100;
    const schedColW = (width - 32) / 2; // lebar tiap kolom, margin 16mm kiri-kanan
    const leftColCx = 16 + schedColW / 2;
    const rightColCx = width - 16 - schedColW / 2;

    // Garis horizontal atas dan bawah blok jadwal
    doc.setDrawColor(218, 175, 55);
    doc.setLineWidth(0.2);
    doc.line(16, schedY, width - 16, schedY);
    doc.line(16, schedY + 29, width - 16, schedY + 29);

    // Garis vertikal pemisah di tengah
    doc.line(cx2, schedY + 2, cx2, schedY + 27);

    // Kolom kiri: Akad Nikah
    doc.setFont("times", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(220, 235, 252);
    doc.text(akadTitle.toUpperCase(), leftColCx, schedY + 8, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`${akadDay}, ${akadDate}`, leftColCx, schedY + 15.5, { align: "center", maxWidth: schedColW - 4 });
    doc.text(`Pukul ${akadStart}–${akadEnd} WIB`, leftColCx, schedY + 22, { align: "center", maxWidth: schedColW - 4 });

    // Kolom kanan: Resepsi
    doc.setFont("times", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(220, 235, 252);
    doc.text(resepsiTitle.toUpperCase(), rightColCx, schedY + 8, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`${resepsiDay}, ${resepsiDate}`, rightColCx, schedY + 15.5, { align: "center", maxWidth: schedColW - 4 });
    doc.text(`Pukul ${resepsiStart}–${resepsiEnd} WIB`, rightColCx, schedY + 22, { align: "center", maxWidth: schedColW - 4 });

    drawEditorialDivider(132.5);

    // ── QR CODE GOOGLE MAPS: bingkai putih + garis emas tipis ─────────────────
    const qrMapSize = 22;
    const qrMapY = 136;
    // Bingkai putih
    doc.setFillColor(255, 255, 255);
    doc.rect(cx2 - qrMapSize / 2 - 1.5, qrMapY - 1.5, qrMapSize + 3, qrMapSize + 3, "F");
    // Garis emas tipis di luar bingkai putih
    doc.setDrawColor(218, 175, 55);
    doc.setLineWidth(0.3);
    doc.rect(cx2 - qrMapSize / 2 - 1.5, qrMapY - 1.5, qrMapSize + 3, qrMapSize + 3);
    doc.addImage(qrMapsImg, "PNG", cx2 - qrMapSize / 2, qrMapY, qrMapSize, qrMapSize);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(185, 210, 240);
    doc.text("Scan Google Maps Menuju Lokasi Acara", cx2, qrMapY + qrMapSize + 6, { align: "center" });

    drawEditorialDivider(169);

    // ── TEKS PENUTUP ──────────────────────────────────────────────────────────
    const closeY = 174;
    doc.setFont("times", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(195, 220, 245);
    const closeLines = doc.splitTextToSize(closingText, 105);
    doc.text(closeLines, cx2, closeY, { align: "center" });

    // Salam penutup — times italic 10.5pt
    doc.setFont("times", "italic");
    doc.setFontSize(10.5);
    doc.setTextColor(255, 255, 255);
    doc.text(salamClosing, cx2, closeY + 11, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(165, 200, 230);
    doc.text(signature, cx2, closeY + 17, { align: "center" });

    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(`${brideName} & ${groomName}`, cx2, closeY + 23, { align: "center" });

    return doc;
  };

  const generatePDFDoc = async (guest: GuestData): Promise<jsPDF> => {
    if (selectedModel === "navy_floral") {
      return await generateNavyFloralPDF(guest);
    }
    return await generateClassicFloralPDF(guest);
  };

  const handlePreview = async () => {
    setIsPreviewing(true);
    try {
      const target = singleData.name?.trim()
        ? singleData
        : { name: "Nama Tamu Undangan", address: "Di Tempat" };
      const doc = await generatePDFDoc(target);
      setPreviewUri(doc.output("datauristring"));
    } catch (err) {
      console.error("Gagal preview PDF:", err);
      alert("Terjadi kesalahan saat memproses preview PDF: " + (err as Error)?.message);
    } finally {
      setIsPreviewing(false);
    }
  };

  const downloadSingle = async () => {
    setIsDownloadingSingle(true);
    try {
      const target = singleData.name?.trim()
        ? singleData
        : { name: "Tamu_Undangan", address: "Di Tempat" };
      const doc = await generatePDFDoc(target);
      const modelTag =
        selectedModel === "navy_floral" ? "Navy_Floral" : currentTheme.id;
      handleSaveAs(
        doc.output("blob"),
        `Inv_${target.name.replace(/[^a-zA-Z0-9]/g, "_")}_${modelTag}.pdf`
      );
    } catch (err) {
      console.error("Gagal download PDF:", err);
      alert("Terjadi kesalahan saat mengunduh PDF: " + (err as Error)?.message);
    } finally {
      setIsDownloadingSingle(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      "Nama Tamu,Alamat (Opsional)\nBapak Jokowi & Ibu Iriana,Jakarta\nTeman-teman Alumni SMA 1,Di Tempat\nKeluarga Besar H. Syarif,Bandung";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    handleSaveAs(blob, "template_undangan_pdf.csv");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsReadingCsv(true);
    setTimeout(() => {
      Papa.parse(file, {
        complete: (results) => {
          const guests: GuestData[] = [];
          results.data.forEach((row: any) => {
            const name = row[0];
            const address = row[1] || "Di Tempat";
            if (name && typeof name === "string" && name.trim() !== "") {
              if (!name.toLowerCase().includes("nama tamu")) {
                guests.push({ name: name.trim(), address: address.trim() });
              }
            }
          });
          setBulkData(guests);
          setIsReadingCsv(false);
        },
        header: false,
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
      const modelTag =
        selectedModel === "navy_floral" ? "Navy_Floral" : currentTheme.id;
      const folder = zip.folder(`Undangan_${modelTag}`);
      const CHUNK_SIZE = 10;
      for (let i = 0; i < bulkData.length; i += CHUNK_SIZE) {
        const chunk = bulkData.slice(i, i + CHUNK_SIZE);
        setStatusMsg(
          `Generating PDF ${i + 1} - ${Math.min(i + chunk.length, bulkData.length)} dari ${bulkData.length}...`
        );
        await Promise.all(
          chunk.map(async (guest, idx) => {
            const doc = await generatePDFDoc(guest);
            const blob = doc.output("blob");
            const safeName = guest.name
              .replace(/[^a-zA-Z0-9]/g, "_")
              .substring(0, 50);
            folder?.file(`${i + idx + 1}_${safeName}.pdf`, blob);
          })
        );
        setProgress(
          Math.round(
            (Math.min(i + CHUNK_SIZE, bulkData.length) / bulkData.length) * 100
          )
        );
        await new Promise((r) => setTimeout(r, 20));
      }
      setStatusMsg("Mengompres ZIP...");
      const content = await zip.generateAsync({ type: "blob" });
      handleSaveAs(
        content,
        `Undangan-${modelTag}-${new Date().toISOString().slice(0, 10)}.zip`
      );
      setStatusMsg("Selesai!");
    } catch (error) {
      console.error("Gagal generate bulk:", error);
      alert("Terjadi kesalahan sistem saat memproses PDF.");
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        setStatusMsg("");
      }, 1000);
    }
  };

  return (
    <div className="animate-reveal space-y-8">
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-1.5 shadow-sm dark:from-slate-800 dark:to-slate-900">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
          <span className="text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
            Premium Edition
          </span>
        </div>
        <h3 className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text font-serif text-3xl font-bold text-transparent dark:from-white dark:to-slate-300">
          Wedding PDF Invitation
        </h3>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Pilih model desain undangan PDF, sesuaikan data nama tamu & download satuan atau banyak sekaligus dalam format ZIP.
        </p>
      </div>

      {/* Pilihan Model Desain Undangan */}
      <div className="space-y-3">
        <div className="text-center">
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            Pilih Model Desain Undangan
          </span>
        </div>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Card Model 2: Navy Floral Modern */}
          <button
            type="button"
            onClick={() => {
              setSelectedModel("navy_floral");
              setPreviewUri(null);
            }}
            className={`group relative flex flex-col justify-between rounded-2xl border-2 p-4 text-left transition-all ${selectedModel === "navy_floral"
              ? "border-blue-600 bg-blue-50/70 shadow-lg ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-950/30"
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow dark:border-slate-700 dark:bg-slate-800"
              }`}
          >
            <div>
              <div className="mb-2 flex w-full items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm dark:bg-blue-500">
                  <Sparkles className="h-3 w-3" /> Model Baru
                </span>
                {selectedModel === "navy_floral" && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}
              </div>
              <div className="font-bold text-slate-900 dark:text-white">
                Navy & Floral Elegance
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Desain split-card mewah: sisi kiri floral watercolor biru & aksen daun emas, sisi kanan midnight navy dengan badge tanggal lingkaran dan kartu nama tamu.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-blue-700 dark:text-blue-300 font-medium">
              <div className="h-3.5 w-3.5 rounded-full bg-[#0b2540] border border-blue-400"></div>
              <span>2 Halaman A5 (Cover Split & Rincian Acara)</span>
            </div>
          </button>

          {/* Card Model 1: Classic Floral */}
          <button
            type="button"
            onClick={() => {
              setSelectedModel("classic");
              setPreviewUri(null);
            }}
            className={`group relative flex flex-col justify-between rounded-2xl border-2 p-4 text-left transition-all ${selectedModel === "classic"
              ? "border-emerald-600 bg-emerald-50/70 shadow-lg ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/30"
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow dark:border-slate-700 dark:bg-slate-800"
              }`}
          >
            <div>
              <div className="mb-2 flex w-full items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  Model Bawaan
                </span>
                {selectedModel === "classic" && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}
              </div>
              <div className="font-bold text-slate-900 dark:text-white">
                Classic Floral (Original)
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Template 4 Halaman A5 dengan ornamen vektor bunga mawar klasik, bingkai ukir, dan dukungan 4 pilihan tema warna.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
              <div className="h-3.5 w-3.5 rounded-full bg-[#556b2f] border border-emerald-400"></div>
              <span>4 Halaman A5 (Buku Undangan Lengkap)</span>
            </div>
          </button>
        </div>
      </div>

      {selectedModel === "classic" ? (
        <div className="flex flex-col items-center gap-4">
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            Pilih Nuansa Warna
          </span>
          <div className="flex gap-4">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setCurrentTheme(theme);
                  setPreviewUri(null);
                }}
                className={`group relative flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${currentTheme.id === theme.id
                  ? "scale-110 border-slate-800 ring-4 ring-slate-200 dark:border-white dark:ring-slate-700"
                  : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                style={{
                  backgroundColor: `rgb(${theme.bg[0]},${theme.bg[1]},${theme.bg[2]})`,
                }}
                title={theme.name}
              >
                <div className="relative h-9 w-9">
                  <div
                    className="absolute top-0 right-0 h-6 w-6 rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-110 dark:border-slate-900"
                    style={{
                      backgroundColor: `rgb(${theme.primary[0]},${theme.primary[1]},${theme.primary[2]})`,
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 h-6 w-6 rounded-tl-xl rounded-br-xl border-2 border-white shadow-md transition-transform group-hover:scale-110 dark:border-slate-900"
                    style={{
                      backgroundColor: `rgb(${theme.secondary[0]},${theme.secondary[1]},${theme.secondary[2]})`,
                    }}
                  />
                </div>
                {currentTheme.id === theme.id && (
                  <div className="absolute -bottom-3 rounded-lg bg-gradient-to-r from-slate-800 to-slate-700 px-3 py-1 text-[10px] font-bold whitespace-nowrap text-white shadow-lg dark:from-white dark:to-slate-100 dark:text-slate-900">
                    {theme.name}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50/80 px-4 py-2 text-xs font-semibold text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
            <span>Palet Warna: Midnight Navy Blue & Periwinkle Blue Floral (Sesuai Referensi Gambar)</span>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
          <button
            onClick={() => setActiveTab("single")}
            className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === "single"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
          >
            Manual (Satuan)
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === "bulk"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
          >
            Import CSV (Banyak)
          </button>
        </div>
      </div>

      {activeTab === "single" && (
        <div className="grid items-start gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Nama Tamu
                </label>
                <input
                  type="text"
                  value={singleData.name}
                  onChange={(e) =>
                    setSingleData({ ...singleData, name: e.target.value })
                  }
                  placeholder="Contoh: Bpk. Habibie & Keluarga"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-lg focus:ring-2 focus:ring-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Alamat / Kota (Opsional)
                </label>
                <input
                  type="text"
                  value={singleData.address}
                  onChange={(e) =>
                    setSingleData({ ...singleData, address: e.target.value })
                  }
                  placeholder="Jakarta Selatan"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base focus:ring-2 focus:ring-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePreview}
                disabled={!singleData.name || isPreviewing}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold uppercase hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
              >
                {isPreviewing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Memuat...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" /> Preview
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={downloadSingle}
                disabled={!singleData.name || isDownloadingSingle}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-xs font-bold text-white uppercase shadow-lg hover:bg-slate-900 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                {isDownloadingSingle ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Mengunduh...
                  </>
                ) : (
                  <>
                    <Printer className="h-4 w-4" /> Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-slate-200 p-4 dark:bg-slate-900/50">
            {previewUri ? (
              <iframe
                src={previewUri}
                className="h-[500px] w-full rounded-lg bg-white shadow-2xl"
                title="PDF Preview"
              />
            ) : (
              <div className="text-center text-slate-400">
                <FileSpreadsheet className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p className="text-sm">Masukkan data & klik Preview</p>
                <p className="mt-1 text-xs text-slate-500">
                  (Ornamen bunga dirender menggunakan vektor PDF)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "bulk" && (
        <div className="animate-reveal space-y-8">
          {bulkData.length === 0 ? (
            <div className="space-y-6 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {isReadingCsv ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <Upload className="h-8 w-8" />
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  {isReadingCsv
                    ? "Membaca File CSV..."
                    : "Upload Database Tamu"}
                </h3>
                <p className="mx-auto max-w-md text-sm text-slate-500">
                  Siapkan file CSV dengan format:
                  <br />
                  <strong>Kolom 1: Nama Tamu</strong> |{" "}
                  <strong>Kolom 2: Alamat/Kota (Opsional)</strong>
                </p>
                <div className="flex justify-center pt-2">
                  <button
                    onClick={downloadTemplate}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Download Template CSV
                  </button>
                </div>
              </div>
              <label
                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:opacity-90 dark:bg-white dark:text-slate-900 ${isReadingCsv ? "pointer-events-none opacity-50" : ""}`}
              >
                Pilih File CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isReadingCsv}
                />
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 md:flex-row md:items-center md:justify-between dark:border-blue-900/30 dark:bg-blue-900/10">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                    {bulkData.length}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 dark:text-blue-100">
                      Tamu Terdeteksi
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Tema:{" "}
                      <span className="font-bold">{currentTheme.name}</span>
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (confirm("Yakin ingin menghapus semua data?"))
                        setBulkData([]);
                    }}
                    className="group flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-5 py-2.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100 hover:shadow-sm active:scale-95 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    <RefreshCcw className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" />
                    Reset Data
                  </button>
                  <button
                    onClick={processBulk}
                    disabled={isProcessing}
                    className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-slate-900 px-8 py-2.5 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    <div className="relative z-10 flex items-center gap-2">
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      <span>
                        {isProcessing ? "Memproses..." : "Download ZIP"}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {isProcessing && (
                <div className="animate-reveal space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>{statusMsg}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="custom-scrollbar grid max-h-[400px] grid-cols-1 gap-3 overflow-y-auto pr-2 md:grid-cols-2 lg:grid-cols-3">
                {bulkData.map((guest, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-slate-700">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-300">
                          {guest.name}
                        </p>
                        <p className="truncate text-[10px] text-slate-400">
                          {guest.address}
                        </p>
                      </div>
                    </div>
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvitationManager;
