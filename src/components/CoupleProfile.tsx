import { SiInstagram } from "@icons-pack/react-simple-icons";
import { Heart, Sparkles, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import type { AppConfig } from "../types";

// Botanical line-art flourish SVG (subtle luxury botanical branch)
const BotanicalBranch: React.FC<{ className?: string; flip?: boolean }> = ({
  className = "",
  flip = false,
}) => (
  <svg
    viewBox="0 0 160 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${flip ? "-scale-x-100" : ""} ${className}`}
  >
    {/* Batang Utama Melengkung Organik */}
    <path
      d="M20 250 C 30 190, 60 120, 140 30"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      className="opacity-70"
    />
    <path
      d="M65 140 C 90 120, 115 110, 135 115"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
      className="opacity-60"
    />
    <path
      d="M45 190 C 70 180, 95 185, 110 200"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
      className="opacity-60"
    />

    {/* Daun-daun Halus (Organic Leaf Shapes) */}
    <path
      d="M140 30 C 135 15, 120 18, 115 28 C 110 38, 125 40, 140 30 Z"
      fill="currentColor"
      className="opacity-35"
    />
    <path
      d="M105 75 C 90 60, 75 68, 80 82 C 85 95, 100 90, 105 75 Z"
      fill="currentColor"
      className="opacity-35"
    />
    <path
      d="M125 90 C 140 85, 148 95, 142 108 C 135 120, 120 110, 125 90 Z"
      fill="currentColor"
      className="opacity-35"
    />
    <path
      d="M75 130 C 60 115, 48 125, 55 138 C 62 150, 75 142, 75 130 Z"
      fill="currentColor"
      className="opacity-35"
    />
    <path
      d="M135 115 C 148 112, 155 122, 148 132 C 140 142, 128 132, 135 115 Z"
      fill="currentColor"
      className="opacity-35"
    />
    <path
      d="M110 200 C 122 205, 125 218, 115 225 C 105 230, 100 215, 110 200 Z"
      fill="currentColor"
      className="opacity-35"
    />
    <path
      d="M45 190 C 35 178, 22 185, 28 198 C 34 208, 48 202, 45 190 Z"
      fill="currentColor"
      className="opacity-35"
    />

    {/* Aksen Butir Berry Emas */}
    <circle cx="142" cy="28" r="2.5" fill="currentColor" className="opacity-70" />
    <circle cx="106" cy="74" r="2" fill="currentColor" className="opacity-60" />
    <circle cx="136" cy="114" r="2" fill="currentColor" className="opacity-60" />
    <circle cx="111" cy="199" r="2" fill="currentColor" className="opacity-60" />
  </svg>
);

// Sparkle Star Deco
const SparkleStar: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className = "", style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`pointer-events-none select-none ${className}`}
    style={style}
  >
    <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
  </svg>
);

// Dynamic Ken-Burns & Slide Photo Carousel for Bride & Groom
const CouplePhotoSlider: React.FC<{
  images: string[];
  name: string;
  role: "groom" | "bride";
}> = ({ images, name, role }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isGroom = role === "groom";

  // Auto-slideshow loop every 3.8 seconds
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Aura Cahaya Ambient di Belakang Frame */}
      <div
        className={`absolute -inset-4 rounded-[120px] bg-gradient-to-tr blur-2xl opacity-60 transition-opacity duration-1000 group-hover:opacity-90 ${
          isGroom
            ? "from-blue-600/30 via-sky-400/20 to-amber-400/20"
            : "from-sky-500/30 via-accent/20 to-amber-300/20"
        }`}
      />

      {/* 2. Outer Decorative Frame Ring */}
      <div className="border-amber-400/30 dark:border-accent/25 pointer-events-none absolute -inset-3 rounded-[110px] border transition-transform duration-700 group-hover:scale-[1.02]" />

      {/* 3. Dashed Luxury Halo Line (Slow rotating or floating) */}
      <div className="border-sky-400/30 dark:border-white/20 pointer-events-none absolute -inset-1.5 animate-pulse-soft rounded-[102px] border border-dashed" />

      {/* 4. Arched / Pill Portrait Viewport (matching Leafitation aesthetic) */}
      <div className="border-accent/40 dark:border-white/15 relative h-[340px] w-[240px] overflow-hidden rounded-[95px] border-2 bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-700 sm:h-[400px] sm:w-[280px] md:h-[430px] md:w-[300px] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
        {/* Slides */}
        {images.map((src, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                isActive
                  ? "z-10 scale-100 opacity-100"
                  : isGroom
                  ? "z-0 -translate-x-8 scale-105 opacity-0"
                  : "z-0 translate-x-8 scale-105 opacity-0"
              }`}
            >
              <img
                src={src}
                alt={`${name} photo ${idx + 1}`}
                className={`h-full w-full object-cover transition-transform duration-[8000ms] ease-out ${
                  isActive ? "scale-108" : "scale-100"
                }`}
              />
              {/* Subtle Luxury Gradient Vignette from bottom and top */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/25" />
            </div>
          );
        })}

        {/* Shimmer Light Sweep (diagonal shine that passes across) */}
        <div className="animate-shimmer pointer-events-none absolute inset-0 z-20 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Floating Role Tag inside photo */}
        <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-slate-950/60 px-3.5 py-1 text-[9px] font-bold tracking-[0.25em] text-white uppercase shadow-md backdrop-blur-md">
            <Sparkles className="text-amber-300 dark:text-accent h-2.5 w-2.5" />
            {isGroom ? "The Groom" : "The Bride"}
          </span>
        </div>

        {/* Chevrons Navigation (Visible on hover if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous photo"
              className="hover:border-accent/50 absolute top-1/2 left-2.5 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/45 text-white opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-slate-950/80 group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next photo"
              className="hover:border-accent/50 absolute top-1/2 right-2.5 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/45 text-white opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-slate-950/80 group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Pagination Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-slate-950/50 px-2.5 py-1 backdrop-blur-md">
              {images.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(dotIdx);
                  }}
                  aria-label={`Jump to slide ${dotIdx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    dotIdx === currentIndex
                      ? "bg-amber-300 dark:bg-accent w-5 shadow-sm"
                      : "w-1.5 bg-white/40 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CoupleProfile: React.FC<{ config: AppConfig }> = ({ config }) => {
  const { bride, groom } = config.couple;

  // Build dynamic slide image lists for Groom and Bride
  const groomImages = useMemo(() => {
    const list = [groom.image];
    if (config.galleryImages && config.galleryImages.length > 1) {
      list.push(config.galleryImages[1]);
    }
    if (config.galleryImages && config.galleryImages.length > 3) {
      list.push(config.galleryImages[3]);
    }
    return list.filter(Boolean);
  }, [groom.image, config.galleryImages]);

  const brideImages = useMemo(() => {
    const list = [bride.image];
    if (config.galleryImages && config.galleryImages.length > 0) {
      list.push(config.galleryImages[0]);
    }
    if (config.galleryImages && config.galleryImages.length > 2) {
      list.push(config.galleryImages[2]);
    }
    return list.filter(Boolean);
  }, [bride.image, config.galleryImages]);

  return (
    <section
      id="couple"
      className="dark:bg-darkBg relative overflow-hidden bg-white py-24 transition-colors duration-1000 md:py-40"
    >
      {/* ================================================================= */}
      {/* 1. ATMOSPHERIC AMBIENT GLOWS & OVERLAYS                          */}
      {/* ================================================================= */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Glow Atas Tengah (Soft Sky/Azure Ambient) */}
        <div className="from-sky-400/15 via-accent/10 dark:from-sky-500/10 dark:via-accent/5 absolute -top-32 left-1/2 h-[420px] w-[90vw] max-w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b to-transparent blur-3xl"></div>

        {/* Glow Sisi Kiri (Warm Golden Touch) */}
        <div className="bg-amber-400/10 dark:bg-amber-300/5 absolute top-1/4 -left-36 h-[400px] w-[400px] rounded-full blur-[100px]"></div>

        {/* Glow Sisi Kanan (Deep Royal Azure) */}
        <div className="dark:bg-sky-400/5 absolute top-2/3 -right-36 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[110px]"></div>

        {/* Watermark Tipografi Mewah "The Wedding" di Latar Belakang */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] dark:opacity-[0.035]">
          <span className="select-none font-serif text-[24vw] font-bold italic tracking-tighter text-slate-900 whitespace-nowrap dark:text-white">
            The Wedding
          </span>
        </div>

        {/* =============================================================== */}
        {/* 2. BOTANICAL LINE-ART FLOURISHES (Sisi Kiri & Kanan)           */}
        {/* =============================================================== */}
        {/* Sulur Pojok Kiri Atas */}
        <div className="text-accentDark/40 dark:text-accent/30 animate-float absolute -top-6 -left-6 h-56 w-36 opacity-80 sm:h-72 sm:w-48 md:h-96 md:w-64">
          <BotanicalBranch className="h-full w-full" />
        </div>

        {/* Sulur Pojok Kanan Atas (Flipped) */}
        <div
          className="text-accentDark/40 dark:text-accent/30 animate-float absolute -top-6 -right-6 h-56 w-36 opacity-80 sm:h-72 sm:w-48 md:h-96 md:w-64"
          style={{ animationDelay: "2s" }}
        >
          <BotanicalBranch flip className="h-full w-full" />
        </div>

        {/* Sulur Tengah Kiri & Kanan Pembungkus Profil */}
        <div
          className="text-amber-500/20 dark:text-accent/15 animate-float absolute top-1/2 -left-12 hidden h-96 w-60 -translate-y-1/2 md:block"
          style={{ animationDelay: "1s" }}
        >
          <BotanicalBranch className="h-full w-full" />
        </div>
        <div
          className="text-amber-500/20 dark:text-accent/15 animate-float absolute top-1/2 -right-12 hidden h-96 w-60 -translate-y-1/2 md:block"
          style={{ animationDelay: "3s" }}
        >
          <BotanicalBranch flip className="h-full w-full" />
        </div>

        {/* =============================================================== */}
        {/* 3. FLOATING SPARKLE STARS (Animasi Cahaya Bintang Berkelip)    */}
        {/* =============================================================== */}
        <SparkleStar
          className="text-amber-400/40 dark:text-accent/40 animate-pulse-soft absolute top-20 left-[12%] h-3.5 w-3.5"
          style={{ animationDelay: "0.5s" }}
        />
        <SparkleStar
          className="text-amber-400/40 dark:text-accent/40 animate-pulse-soft absolute top-36 right-[15%] h-3 w-3"
          style={{ animationDelay: "1.8s" }}
        />
        <SparkleStar
          className="text-amber-400/40 dark:text-accent/40 animate-pulse-soft absolute top-1/2 left-[8%] h-4 w-4"
          style={{ animationDelay: "2.4s" }}
        />
        <SparkleStar
          className="text-amber-400/40 dark:text-accent/40 animate-pulse-soft absolute top-3/5 right-[10%] h-3.5 w-3.5"
          style={{ animationDelay: "1.2s" }}
        />
        <SparkleStar
          className="text-amber-400/40 dark:text-accent/40 animate-pulse-soft absolute bottom-24 left-[20%] h-3 w-3"
          style={{ animationDelay: "3s" }}
        />
        <SparkleStar
          className="text-amber-400/40 dark:text-accent/40 animate-pulse-soft absolute bottom-36 right-[25%] h-3.5 w-3.5"
          style={{ animationDelay: "0.8s" }}
        />
      </div>

      {/* ================================================================= */}
      {/* 4. KONTEN UTAMA: KUTIPAN & PASANGAN MEMPELAI                      */}
      {/* ================================================================= */}
      <div className="relative z-10 container mx-auto max-w-6xl px-6">
        {/* KARTU KUTIPAN AR-RUM DENGAN GLASSMORPHISM EDITORIAL ELEGAN */}
        <div className="relative mx-auto mb-20 max-w-4xl overflow-hidden rounded-[2.5rem] border border-slate-200/70 bg-gradient-to-b from-white/80 via-white/50 to-slate-50/60 p-8 text-center shadow-xl backdrop-blur-md transition-all duration-700 sm:p-12 md:mb-28 dark:border-white/10 dark:from-slate-900/70 dark:via-slate-900/40 dark:to-slate-950/60 dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          {/* Garis Aksen Emas Hairline Atas */}
          <div className="dark:via-accent/40 absolute top-0 right-1/4 left-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>

          {/* Ikon Hati Utama dengan Lingkaran Berdenyut */}
          <div className="relative mx-auto mb-6 flex h-12 w-12 items-center justify-center">
            <div className="border-accent/30 dark:border-accent/20 absolute inset-0 animate-ping rounded-full border opacity-30"></div>
            <div className="border-accent/30 dark:border-accent/20 flex h-10 w-10 items-center justify-center rounded-full border bg-white/80 shadow-sm dark:bg-white/5">
              <Heart className="text-accentDark dark:text-accent h-4 w-4 animate-pulse fill-current" />
            </div>
          </div>

          {/* Salam Pembuka */}
          <span className="text-accentDark dark:text-accent mb-2 block font-serif text-base tracking-wide italic sm:text-lg">
            {config.text.opening.salam}
          </span>

          {/* Judul Utama "Pasangan Mempelai" */}
          <h2 className="mb-6 font-serif text-3xl font-medium tracking-tight text-slate-900 italic sm:text-5xl md:text-6xl dark:text-white">
            Pasangan Mempelai
          </h2>

          {/* Garis Pembatas Cantik dengan Aksen Wajik (Diamond) Emas di Tengah */}
          <div className="relative mx-auto mb-8 flex w-48 items-center justify-center">
            <div className="dark:to-accent/40 h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-400/50"></div>
            <div className="mx-3 flex items-center justify-center">
              <div className="border-accent/50 dark:bg-accent/20 h-2 w-2 rotate-45 border bg-amber-400/20"></div>
            </div>
            <div className="dark:to-accent/40 h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-400/50"></div>
          </div>

          {/* Teks Kutipan Ayat (Ar-Rum: 21) */}
          <div className="relative mx-auto max-w-2xl px-2 sm:px-6">
            <Quote className="text-accentDark/15 dark:text-accent/10 absolute -top-3 -left-2 h-8 w-8 -scale-x-100 sm:-left-4" />
            <p className="font-serif text-base leading-relaxed font-light text-slate-700 italic sm:text-lg md:text-xl dark:text-slate-200">
              "{config.text.quote.ar_rum}"
            </p>
          </div>

          {/* Sumber Ayat (QS. AR-RUM: 21) dalam Badge Mewah */}
          <div className="mt-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/60 px-5 py-1.5 text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase shadow-xs dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              <Sparkles className="text-accentDark dark:text-accent h-3 w-3" />
              {config.text.quote.source}
            </span>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 5. GRID DUA MEMPELAI (Pria & Wanita)                            */}
        {/* =============================================================== */}
        <div className="grid items-start gap-16 md:grid-cols-2 md:gap-24">
          {/* Mempelai Pria (Groom) */}
          <div className="group flex flex-col items-center space-y-8 text-center md:items-end md:text-right">
            {/* Foto Mempelai dengan Frame Arched Dinamis & Slideshow Animasi */}
            <CouplePhotoSlider
              images={groomImages}
              name={groom.name}
              role="groom"
            />

            {/* Keterangan Biodata Mempelai Pria */}
            <div className="space-y-4">
              <div className="flex justify-center md:justify-end">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-50/80 px-3.5 py-1 text-[10px] font-bold tracking-widest text-blue-700 uppercase shadow-xs dark:border-blue-400/20 dark:bg-blue-950/40 dark:text-blue-300">
                  Mempelai Pria
                </span>
              </div>
              <h3 className="font-serif text-3xl font-medium tracking-tight text-slate-900 md:text-5xl dark:text-white">
                {groom.fullName}
              </h3>
              <p className="max-w-xs text-[11px] font-medium tracking-widest text-balance text-slate-500 uppercase md:ml-auto md:max-w-sm md:text-[12px] dark:text-slate-400">
                {groom.parents}
              </p>
              <div className="pt-2">
                <a
                  href={`https://instagram.com/${groom.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:border-accent/40 hover:text-accentDark inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/70 px-6 py-2.5 text-xs text-slate-600 shadow-sm backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-white/25 dark:hover:text-white"
                >
                  <SiInstagram className="h-3.5 w-3.5" color="currentColor" />
                  <span className="font-bold tracking-wider">
                    @{groom.instagram}
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Mempelai Wanita (Bride) */}
          <div className="group flex flex-col items-center space-y-8 text-center md:items-start md:text-left">
            {/* Foto Mempelai dengan Frame Arched Dinamis & Slideshow Animasi */}
            <CouplePhotoSlider
              images={brideImages}
              name={bride.name}
              role="bride"
            />

            {/* Keterangan Biodata Mempelai Wanita */}
            <div className="space-y-4">
              <div className="flex justify-center md:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-50/80 px-3.5 py-1 text-[10px] font-bold tracking-widest text-rose-700 uppercase shadow-xs dark:border-rose-400/20 dark:bg-rose-950/40 dark:text-rose-300">
                  Mempelai Wanita
                </span>
              </div>
              <h3 className="font-serif text-3xl font-medium tracking-tight text-slate-900 md:text-5xl dark:text-white">
                {bride.fullName}
              </h3>
              <p className="max-w-xs text-[11px] font-medium tracking-widest text-balance text-slate-500 uppercase md:max-w-sm md:text-[12px] dark:text-slate-400">
                {bride.parents}
              </p>
              <div className="pt-2">
                <a
                  href={`https://instagram.com/${bride.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:border-rose-400/40 hover:text-rose-600 inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/70 px-6 py-2.5 text-xs text-slate-600 shadow-sm backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-white/25 dark:hover:text-white"
                >
                  <SiInstagram className="h-3.5 w-3.5" color="currentColor" />
                  <span className="font-bold tracking-wider">
                    @{bride.instagram}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoupleProfile;
