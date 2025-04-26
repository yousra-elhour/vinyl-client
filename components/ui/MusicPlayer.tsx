"use client";

import React, { useState, useRef, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { SkipBack, SkipForward, Play, Pause, AlertCircle } from "lucide-react";

interface Track {
  title: string;
  artist: string;
  preview_url: string | null;
}

export interface MusicPlayerProps {
  albumTracks: Track[];
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ albumTracks }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPreviewUrls, setHasPreviewUrls] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    // Log Spotify API response
    console.log("Spotify API Response - Album Tracks:", albumTracks);

    // Check if there are any tracks with preview URLs
    const tracksWithPreviews = albumTracks?.filter(
      (track) => track.preview_url !== null
    );
    setHasPreviewUrls(tracksWithPreviews.length > 0);

    // If no preview URLs, set error message
    if (albumTracks?.length > 0 && tracksWithPreviews.length === 0) {
      setError("No preview available for this album");
    } else if (!albumTracks || albumTracks.length === 0) {
      setError("Track information unavailable");
    } else {
      setError(null);
    }

    // Start with a track that has a preview URL if possible
    if (tracksWithPreviews.length > 0) {
      const firstTrackWithPreview = albumTracks.findIndex(
        (track) => track.preview_url !== null
      );
      if (firstTrackWithPreview !== -1) {
        setCurrentTrackIndex(firstTrackWithPreview);
      }
    }
  }, [albumTracks]);

  const playNextTrack = () => {
    // Find the next track with a preview URL
    let nextIndex = (currentTrackIndex + 1) % albumTracks.length;
    let attempts = 0;

    // Try to find a track with a preview URL, but don't loop forever
    while (
      !albumTracks[nextIndex].preview_url &&
      attempts < albumTracks.length
    ) {
      nextIndex = (nextIndex + 1) % albumTracks.length;
      attempts++;
    }

    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);

    if (audioRef.current && audioRef.current.audio.current) {
      audioRef.current.audio.current.pause();
      audioRef.current.audio.current.currentTime = 0;
      // Only try to play if there's a preview URL
      if (albumTracks[nextIndex].preview_url) {
        setTimeout(() => {
          audioRef.current?.audio.current?.play().catch((err) => {
            console.error("Failed to play audio:", err);
            setError("Audio playback was blocked");
          });
        }, 100);
      }
    }
  };

  const playPreviousTrack = () => {
    // Find the previous track with a preview URL
    let prevIndex =
      (currentTrackIndex - 1 + albumTracks.length) % albumTracks.length;
    let attempts = 0;

    // Try to find a track with a preview URL, but don't loop forever
    while (
      !albumTracks[prevIndex].preview_url &&
      attempts < albumTracks.length
    ) {
      prevIndex = (prevIndex - 1 + albumTracks.length) % albumTracks.length;
      attempts++;
    }

    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);

    if (audioRef.current && audioRef.current.audio.current) {
      audioRef.current.audio.current.pause();
      audioRef.current.audio.current.currentTime = 0;
      // Only try to play if there's a preview URL
      if (albumTracks[prevIndex].preview_url) {
        setTimeout(() => {
          audioRef.current?.audio.current?.play().catch((err) => {
            console.error("Failed to play audio:", err);
            setError("Audio playback was blocked");
          });
        }, 100);
      }
    }
  };

  const togglePlayPause = () => {
    if (!currentTrack?.preview_url) {
      setError("No preview available for this track");
      return;
    }

    setIsPlaying(!isPlaying);
    if (audioRef.current && audioRef.current.audio.current) {
      if (isPlaying) {
        audioRef.current.audio.current.pause();
      } else {
        audioRef.current.audio.current.play().catch((err) => {
          console.error("Failed to play audio:", err);
          setError("Audio playback was blocked");
        });
      }
    }
  };

  const currentTrack = albumTracks[currentTrackIndex] || {
    title: "Unknown",
    artist: "Unknown",
    preview_url: null,
  };

  if (!albumTracks || albumTracks.length === 0) {
    return (
      <div className="flex flex-col items-center w-full p-4 text-gray-400">
        <AlertCircle className="h-6 w-6 mb-2" />
        <p>Track information unavailable</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {error && (
        <div className="text-yellow-400 text-sm mb-2 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      <div className="flex gap-4">
        {/* Previous Button */}
        <button
          title="previous"
          onClick={playPreviousTrack}
          disabled={!hasPreviewUrls}
          className={!hasPreviewUrls ? "opacity-50 cursor-not-allowed" : ""}
        >
          <SkipBack className="h-6 w-6 text-gray-200" />
        </button>

        {/* Play Button (Custom) */}
        <button
          title={isPlaying ? "pause" : "play"}
          onClick={togglePlayPause}
          disabled={!currentTrack?.preview_url}
          className={
            !currentTrack?.preview_url ? "opacity-50 cursor-not-allowed" : ""
          }
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-gray-200" />
          ) : (
            <Play className="h-6 w-6 text-gray-200" />
          )}
        </button>

        {/* Next Button */}
        <button
          title="next"
          onClick={playNextTrack}
          disabled={!hasPreviewUrls}
          className={!hasPreviewUrls ? "opacity-50 cursor-not-allowed" : ""}
        >
          <SkipForward className="h-6 w-6 text-gray-200" />
        </button>
      </div>
      <div className="text-center w-full">
        <div className="audio-container w-full">
          {/* Spotify Player */}
          {currentTrack?.preview_url ? (
            <AudioPlayer
              ref={audioRef}
              src={currentTrack.preview_url}
              autoPlay={isPlaying}
              showJumpControls={false}
              layout="horizontal-reverse"
              customVolumeControls={[]}
              customAdditionalControls={[]}
              customIcons={{
                play: <></>, // Use an empty element to replace the play button
              }}
              className="custom-audio-player" // Add a unique class name here
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={(e) => {
                console.error("Audio player error:", e);
                setError("Error playing track");
              }}
            />
          ) : (
            <div className="h-12 flex items-center justify-center text-sm text-gray-400">
              No preview available for this track
            </div>
          )}
        </div>
        <div className="flex text-center justify-center gap-2 mt-2">
          <h2 className="text-sm text-gray-200">
            {`${currentTrack?.artist || "Unknown"} - ${
              currentTrack?.title || "Unknown"
            }`}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
