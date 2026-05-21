import React from "react";
import { AbsoluteFill, Video, useCurrentFrame, useVideoConfig, spring } from "remotion";

type Word = { word: string; start: number; end: number };
type Style = {
  fontFamily?: string;
  fontSize?: number;
  activeColor?: string;
  inactiveColor?: string;
  activeScale?: number;
  wordsPerLine?: number;
};

export const KaraokeSubtitles: React.FC<{ videoUrl: string; words: Word[]; style: Style }> = ({ videoUrl, words, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeSec = frame / fps;

  const activeIdx = words.findIndex((w) => timeSec >= w.start && timeSec < w.end);
  const perLine = style.wordsPerLine || 3;
  const windowStart = Math.max(0, activeIdx - 1);
  const visibleWords = words.slice(windowStart, windowStart + perLine);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {videoUrl ? <Video src={videoUrl} /> : null}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: 50 }}>
        <div style={{ background: "rgba(0,0,0,0.45)", borderRadius: 14, padding: "12px 22px" }}>
          {visibleWords.map((w, i) => {
            const isActive = windowStart + i === activeIdx;
            const pulse = isActive
              ? spring({ frame, fps, from: 1, to: style.activeScale || 1.12, durationInFrames: 6 })
              : 1;
            return (
              <span
                key={`${w.word}-${i}`}
                style={{
                  marginRight: 8,
                  color: isActive ? style.activeColor || "#FFDD57" : style.inactiveColor || "#FFFFFF",
                  fontFamily: style.fontFamily || "Arial",
                  fontSize: (style.fontSize || 64) * pulse,
                  fontWeight: isActive ? 800 : 600,
                  textShadow: "0 2px 8px rgba(0,0,0,0.45)"
                }}
              >
                {w.word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
