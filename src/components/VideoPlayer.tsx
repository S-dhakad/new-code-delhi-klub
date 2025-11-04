'use client';

import React, { useRef, useState, useEffect } from 'react';

type VideoPlayerProps = {
  src: string;
  width?: string;
  height?: string;
  className?: string;
  poster?: string;
  borderRadius?: string;
};

export default function VideoPlayer({
  src,
  width,
  height,
  className,
  poster,
  borderRadius,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;

    try {
      if (v.paused) {
        await v.play();
        setIsPlaying(true);
      } else {
        v.pause();
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(!v.paused);
    }
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);

    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
    };
  }, []);

  return (
    <div
      className={`relative ${className}`}
      style={{ width, height, borderRadius }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        controls
      />

      {/* Center overlay button */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          aria-label="Play"
          className="absolute inset-0 flex items-center justify-center focus:outline-none"
          style={{ background: 'transparent' }}
        >
          <div
            className="rounded-full p-3"
            style={{
              background: 'rgba(0,0,0,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden
            >
              <path d="M5 3v18l15-9z" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
