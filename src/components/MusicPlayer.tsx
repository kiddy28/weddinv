import React, { useEffect, useRef, useState } from "react";
import { Disc3, Volume2, VolumeX } from "lucide-react";

interface MusicPlayerProps {
  url: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ url }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      setIsPlaying(true);
      setHasInteracted(true);
    };
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    const handleTriggerPlay = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch(() => {
          // Autoplay policy prevented playback until user interaction
          setIsPlaying(false);
        });
    };

    window.addEventListener("play-wedding-music", handleTriggerPlay);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      window.removeEventListener("play-wedding-music", handleTriggerPlay);
    };
  }, []);

  const togglePlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="auto" className="hidden" />

      {/* Floating Music Control Button */}
      <div className="fixed bottom-24 right-4 z-[95] md:bottom-8 md:right-8 transition-all duration-500">
        <button
          type="button"
          onClick={togglePlayback}
          className={`group relative flex h-12 w-12 items-center justify-center rounded-full border shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-110 active:scale-95 md:h-14 md:w-14 ${
            isPlaying
              ? "border-accent/40 bg-white/90 text-slate-800 dark:border-accent/30 dark:bg-slate-900/90 dark:text-white"
              : "border-slate-300 bg-white/80 text-slate-400 opacity-80 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-500"
          }`}
          aria-label={isPlaying ? "Jeda Musik Latar" : "Putar Musik Latar"}
          title={isPlaying ? "Klik untuk Jeda Musik" : "Klik untuk Putar Musik"}
        >
          {/* Animated pulsing halo when music is playing */}
          {isPlaying && (
            <span className="absolute -inset-1 animate-ping rounded-full bg-accent/20 opacity-75 duration-1000"></span>
          )}

          {/* Vinyl Disc Icon (Spinning when playing) */}
          <div className="relative flex items-center justify-center">
            <Disc3
              className={`h-6 w-6 transition-transform duration-300 md:h-7 md:w-7 ${
                isPlaying ? "animate-spin-slow text-accentDark dark:text-accent" : ""
              }`}
            />

            {/* Center icon indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isPlaying ? (
                <Volume2 className="h-3 w-3 text-slate-700 dark:text-slate-200" />
              ) : (
                <VolumeX className="h-3 w-3 text-slate-400" />
              )}
            </div>
          </div>

          {/* Active status indicator dot */}
          <span
            className={`absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 ${
              isPlaying ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
            }`}
          />

          {/* Tooltip on desktop */}
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-slate-900/90 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity group-hover:opacity-100 hidden md:block dark:bg-white/90 dark:text-slate-900">
            {isPlaying ? "Jeda Musik" : "Putar Musik"}
          </span>
        </button>
      </div>
    </>
  );
};

export default MusicPlayer;
