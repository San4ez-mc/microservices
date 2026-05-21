import { registerRoot, Composition } from "remotion";
import React from "react";
import { KaraokeSubtitles } from "./KaraokeSubtitles";

const Root: React.FC = () => {
  return (
    <Composition
      id="Karaoke"
      component={KaraokeSubtitles}
      durationInFrames={30 * 60}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        videoUrl: "",
        words: [],
        style: {}
      }}
    />
  );
};

registerRoot(Root);
