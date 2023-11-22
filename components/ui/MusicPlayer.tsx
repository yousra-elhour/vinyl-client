"use client";

import React, { useState, useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { SkipBack, SkipForward, Play, Pause } from "lucide-react";

interface Track {
  title: string;
  artist: string;
  preview_url: string;
}

interface MusicPlayerProps {
  albumTracks: Track[];
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ albumTracks }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<AudioPlayer | null>(null);

  const playNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % albumTracks.length);
    setIsPlaying(true);
    if (audioRef.current && audioRef.current.audio.current) {
      audioRef.current.audio.current.pause();
      audioRef.current.audio.current.currentTime = 0;
    }
  };

  const playPreviousTrack = () => {
    setCurrentTrackIndex(
      (prevIndex) => (prevIndex - 1 + albumTracks.length) % albumTracks.length
    );
    setIsPlaying(true);
    if (audioRef.current && audioRef.current.audio.current) {
      audioRef.current.audio.current.pause();
      audioRef.current.audio.current.currentTime = 0;
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current && audioRef.current.audio.current) {
      if (isPlaying) {
        audioRef.current.audio.current.pause();
      } else {
        audioRef.current.audio.current.play();
      }
    }
  };

  const currentTrack = albumTracks[currentTrackIndex];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-4">
        {/* Previous Button */}
        <button title="previous" onClick={playPreviousTrack}>
          <SkipBack className="h-6 w-6 text-gray-200" />
        </button>

        {/* Play Button (Custom) */}
        <button title={isPlaying ? "pause" : "play"} onClick={togglePlayPause}>
          {isPlaying ? (
            <Pause className="h-6 w-6 text-gray-200" />
          ) : (
            <Play className="h-6 w-6 text-gray-200" />
          )}
        </button>

        {/* Next Button */}
        <button title="next" onClick={playNextTrack}>
          <SkipForward className="h-6 w-6 text-gray-200" />
        </button>
      </div>
      <div className="text-center w-full">
        <div className="audio-container w-full">
          {/* Use a unique class name for the play button */}
          <AudioPlayer
            ref={audioRef}
            src={currentTrack?.preview_url}
            autoPlay={isPlaying}
            showJumpControls={false}
            layout="horizontal-reverse"
            customVolumeControls={[]}
            customAdditionalControls={[]}
            customIcons={{
              play: <></>, // Use an empty element to replace the play button
            }}
            className="custom-audio-player" // Add a unique class name here
          />
        </div>
        <div className="flex text-center justify-center gap-2">
          <h2 className="text-sm text-gray-200">{currentTrack?.artist} - </h2>
          <h1 className="text-sm text-gray-200">&nbsp;{currentTrack?.title}</h1>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
