import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Image as ImageIcon,
  Play,
  Pause,
} from "lucide-react";
import type { AppConfig } from "../types";

const Gallery: React.FC<{ config: AppConfig }> = ({ config }) => {
  const images = config.galleryImages || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const featuredCardRef = useRef<HTMLDivElement>(null);
  const AUTOPLAY_INTERVAL = 5000; // 5 seconds per slide

  // 1. Auto-slideshow for the featured large image
  useEffect(() => {
    if (images.length <= 1 || isPaused || lightboxIndex !== null) return;

    setProgress(0);
    const stepMs = 50;
    const increment = (stepMs / AUTOPLAY_INTERVAL) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          setActiveIndex((current) => (current + 1) % images.length);
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => clearInterval(progressTimer);
  }, [images.length, isPaused, lightboxIndex, activeIndex]);

  // 2. Lightbox Open & Close Handlers
  const openLightbox = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex(index);
    setIsClosing(false);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsClosing(true);
    setTimeout(() => {
      setLightboxIndex(null);
      setIsClosing(false);
      document.body.style.overflow = "unset";
    }, 400);
  };

  // 3. Navigation Controls for Lightbox & Large Featured View
  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(
        lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1
      );
    } else {
      setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setProgress(0);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(
        lightboxIndex === images.length - 1 ? 0 : lightboxIndex + 1
      );
    } else {
      setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      setProgress(0);
    }
  };

  // 4. Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  // 5. Select thumbnail
  const handleSelectThumbnail = (index: number) => {
    if (activeIndex === index) {
      // If already active, open lightbox on click
      openLightbox(index);
    } else {
      setActiveIndex(index);
      setProgress(0);
      // Smoothly scroll into view if featured card is far above
      if (featuredCardRef.current) {
        const rect = featuredCardRef.current.getBoundingClientRect();
        if (rect.top < -100) {
          featuredCardRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section
      id="gallery"
      className="dark:bg-darkBg relative overflow-hidden bg-white py-24 transition-colors duration-1000 md:py-40"
    >
      {/* Background Ambient Glows (Deep Midnight Navy) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="from-sky-500/10 via-accent/5 absolute top-10 left-1/2 h-[500px] w-[80vw] max-w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b to-transparent blur-3xl"></div>
        <div className="dark:bg-sky-500/5 absolute bottom-20 -left-36 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[100px]"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6">
        {/* =============================================================== */}
        {/* SECTION HEADER                                                  */}
        {/* =============================================================== */}
        <div className="mb-14 space-y-4 text-center md:mb-20 md:space-y-6">
          <div className="text-accentDark dark:text-accent flex items-center justify-center gap-4 opacity-50">
            <div className="bg-accentDark dark:bg-accent h-[1px] w-8 md:w-16"></div>
            <ImageIcon className="h-5 w-5 md:h-7 md:w-7" />
            <div className="bg-accentDark dark:bg-accent h-[1px] w-8 md:w-16"></div>
          </div>
          <h2 className="font-serif text-4xl font-medium tracking-tight text-slate-900 italic sm:text-6xl md:text-7xl lg:text-8xl dark:text-white">
            Galeri Foto
          </h2>
          <p className="tracking-luxury text-[10px] font-bold text-balance text-slate-400 uppercase md:text-[12px] dark:text-slate-400">
            Momen-momen indah yang terpatri abadi dalam perjalanan cinta kami
          </p>
          <p className="text-accentDark/80 dark:text-accent/80 font-serif text-sm tracking-wide italic sm:text-base">
            "A moment is better when shared with you."
          </p>
        </div>

        {/* =============================================================== */}
        {/* 1. TIER ATAS: DARI FOTO BESAR (FEATURED SHOWCASE CAROUSEL)       */}
        {/* =============================================================== */}
        <div
          ref={featuredCardRef}
          className="group/main border-accent/30 dark:border-white/10 relative mx-auto mb-14 h-[350px] max-w-5xl overflow-hidden rounded-[2.2rem] border-2 bg-slate-950 shadow-[0_25px_60px_rgba(0,0,0,0.35)] select-none transition-all duration-700 sm:h-[480px] sm:rounded-[3.2rem] md:h-[580px] lg:h-[630px] dark:shadow-[0_30px_70px_rgba(0,0,0,0.7)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Slide Images with Ken Burns & Smooth Fade */}
          {images.map((src, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={idx}
                className={`absolute inset-0 cursor-pointer transition-all duration-1000 ease-out ${
                  isActive
                    ? "z-10 scale-100 opacity-100"
                    : "pointer-events-none z-0 scale-105 opacity-0"
                }`}
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={src}
                  alt={`Prewedding Moment ${idx + 1}`}
                  className={`h-full w-full object-cover transition-transform duration-[10000ms] ease-out ${
                    isActive ? "scale-108" : "scale-100"
                  }`}
                />
              </div>
            );
          })}

          {/* GRADASI LUXURY (Gradient Overlays) */}
          {/* Top Vignette for Contrast */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Bottom Luxury Deep Navy Gradient */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent px-6 pt-32 pb-6 sm:px-10 sm:pb-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-amber-300 dark:text-accent mb-1 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.25em] uppercase sm:text-xs">
                  <Sparkles className="h-3 w-3" />
                  Momen Bahagia #{activeIndex + 1}
                </span>
                <h3 className="font-serif text-xl text-white italic sm:text-2xl md:text-3xl">
                  "A moment is better when shared with you."
                </h3>
              </div>

              {/* Click to Expand Prompt */}
              <div className="pointer-events-auto">
                <button
                  onClick={() => openLightbox(activeIndex)}
                  className="hover:border-accent/50 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Lihat Layar Penuh</span>
                </button>
              </div>
            </div>
          </div>

          {/* TOP CONTROLS */}
          {/* Top-Left: Counter Badge */}
          <div className="absolute top-4 left-4 z-30 sm:top-6 sm:left-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/60 px-4 py-1.5 text-xs text-white shadow-lg backdrop-blur-md">
              <span className="text-amber-300 dark:text-accent font-serif text-sm font-bold italic">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="opacity-40">/</span>
              <span className="text-[11px] opacity-70">
                {String(images.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Top-Right: Play/Pause indicator & Fullscreen Icon */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2 sm:top-6 sm:right-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused(!isPaused);
              }}
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-slate-950/60 text-white shadow-lg backdrop-blur-md transition-transform hover:scale-110 hover:bg-slate-950/80 active:scale-95"
            >
              {isPaused ? (
                <Play className="h-4 w-4 fill-current" />
              ) : (
                <Pause className="h-4 w-4 fill-current" />
              )}
            </button>
            <button
              onClick={() => openLightbox(activeIndex)}
              aria-label="Open fullscreen lightbox"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-slate-950/60 text-white shadow-lg backdrop-blur-md transition-transform hover:scale-110 hover:bg-slate-950/80 active:scale-95"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          {/* FLOATING NAVIGATION ARROWS */}
          <button
            onClick={handlePrev}
            aria-label="Previous image"
            className="hover:border-accent/50 absolute top-1/2 left-3 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/50 text-white opacity-80 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-slate-950/85 hover:opacity-100 active:scale-95 sm:left-6 sm:h-12 sm:w-12 md:opacity-0 md:group-hover/main:opacity-100"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next image"
            className="hover:border-accent/50 absolute top-1/2 right-3 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/50 text-white opacity-80 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-slate-950/85 hover:opacity-100 active:scale-95 sm:right-6 sm:h-12 sm:w-12 md:opacity-0 md:group-hover/main:opacity-100"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* SLIDESHOW PROGRESS BAR (Hairline Gold / Azure at the bottom edge) */}
          <div className="absolute inset-x-0 bottom-0 z-30 h-1 bg-white/10">
            <div
              className="bg-accent h-full transition-[width] duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* =============================================================== */}
        {/* 2. TIER BAWAH: KOLASE FOTO LEBIH KECIL DENGAN GRADASI           */}
        {/* =============================================================== */}
        <div className="space-y-6">
          {/* Subheader Label & Divider */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <span className="border-accent/40 bg-accent/20 h-2 w-2 rotate-45 border" />
              <span className="text-accentDark dark:text-accent text-[11px] font-bold tracking-[0.25em] uppercase">
                Koleksi Foto & Momen
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 italic dark:text-slate-500">
              Sentuh foto untuk memilih atau memperbesar
            </span>
          </div>

          {/* Responsive Editorial Collage Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((src, index) => {
              const isCurrent = index === activeIndex;
              return (
                <div
                  key={index}
                  onClick={() => handleSelectThumbnail(index)}
                  className={`group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl bg-slate-950 transition-all duration-500 sm:rounded-3xl ${
                    isCurrent
                      ? "ring-accent shadow-accent/25 border-transparent shadow-xl ring-2 scale-[1.02]"
                      : "border border-slate-200/80 shadow-md hover:-translate-y-1.5 hover:shadow-xl dark:border-white/10"
                  }`}
                >
                  {/* Photo Thumbnail with Hover Zoom */}
                  <img
                    src={src}
                    alt={`Moment thumbnail ${index + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* GRADASI GELAP (Luxury Gradient Overlay on every collage item) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent transition-opacity duration-300" />

                  {/* Top-Right: Quick Zoom Button (Appears on Hover) */}
                  <div className="absolute top-2.5 right-2.5 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                      onClick={(e) => openLightbox(index, e)}
                      aria-label="Zoom in"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-slate-950/70 text-white shadow-md backdrop-blur-sm transition-transform hover:scale-110"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Bottom Content inside Gradient */}
                  <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xs font-medium tracking-wider text-white sm:text-sm">
                        Momen {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Active Status Badge */}
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-500/20 px-2 py-0.5 text-[9px] font-bold tracking-wider text-sky-200 uppercase backdrop-blur-xs">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
                          Tampil
                        </span>
                      ) : (
                        <span className="text-[10px] text-white/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          Pilih
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =============================================================== */}
      {/* 3. FULLSCREEN LIGHTBOX MODAL (MATCHING LUXURY NAVY VIBE)        */}
      {/* =============================================================== */}
      {lightboxIndex !== null && (
        <div
          className={`fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden transition-all duration-500 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Backdrop Blur */}
          <div
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl transition-opacity duration-700"
            onClick={closeLightbox}
          />

          {/* Fullscreen Photo Container */}
          <div className="pointer-events-none relative z-[1010] flex h-full w-full items-center justify-center p-4 sm:p-8">
            <div className="relative flex max-h-[82vh] max-w-[92vw] items-center justify-center md:max-h-[88vh]">
              <img
                src={images[lightboxIndex]}
                alt="Lightbox Fullscreen View"
                className={`pointer-events-auto max-h-full max-w-full rounded-[1.5rem] border border-white/10 object-contain shadow-[0_50px_120px_rgba(0,0,0,0.9)] transition-all duration-700 sm:rounded-[2.5rem] md:rounded-[3.5rem] ${
                  isClosing
                    ? "translate-y-20 scale-90 blur-xl"
                    : "animate-reveal scale-100 blur-0"
                }`}
              />

              {/* Prev & Next Floating Buttons */}
              <div className="pointer-events-auto fixed top-1/2 left-3 z-[1020] -translate-y-1/2 sm:left-6 md:left-12">
                <button
                  onClick={(e) => handlePrev(e)}
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 shadow-2xl backdrop-blur-2xl transition-all hover:scale-110 hover:bg-white/20 hover:text-white active:scale-95 sm:h-14 sm:w-14 md:h-20 md:w-20"
                >
                  <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1 sm:h-7 sm:w-7 md:h-10 md:w-10" />
                </button>
              </div>
              <div className="pointer-events-auto fixed top-1/2 right-3 z-[1020] -translate-y-1/2 sm:right-6 md:right-12">
                <button
                  onClick={(e) => handleNext(e)}
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 shadow-2xl backdrop-blur-2xl transition-all hover:scale-110 hover:bg-white/20 hover:text-white active:scale-95 sm:h-14 sm:w-14 md:h-20 md:w-20"
                >
                  <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1 sm:h-7 sm:w-7 md:h-10 md:w-10" />
                </button>
              </div>
            </div>
          </div>

          {/* Close Button Top-Right */}
          <div className="absolute top-5 right-5 z-[1030] sm:top-8 sm:right-8">
            <button
              onClick={closeLightbox}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:rotate-90 hover:bg-white/25 hover:text-white active:scale-95 sm:h-14 sm:w-14"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* Bottom Info Pill */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[1030] flex flex-col items-center sm:bottom-10">
            <div className="animate-reveal flex items-center gap-4 rounded-full border border-white/15 bg-slate-900/80 px-6 py-2.5 shadow-2xl backdrop-blur-2xl sm:gap-6 sm:px-10 sm:py-3.5">
              <div className="h-[1px] w-6 bg-white/20 sm:w-10"></div>
              <p className="font-serif text-sm tracking-[0.2em] text-white uppercase italic sm:text-lg md:text-xl md:tracking-[0.3em]">
                Foto{" "}
                <span className="text-amber-300 dark:text-accent font-sans font-bold">
                  {lightboxIndex + 1}
                </span>{" "}
                dari {images.length}
              </p>
              <div className="h-[1px] w-6 bg-white/20 sm:w-10"></div>
              <Sparkles className="text-amber-300 dark:text-accent hidden h-4 w-4 animate-pulse sm:block" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
