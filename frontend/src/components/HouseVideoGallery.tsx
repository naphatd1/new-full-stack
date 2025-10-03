"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { VideoCameraIcon, PlayIcon } from "@heroicons/react/24/outline";

interface Video {
  filename: string;
  url: string;
}

interface HouseVideoGalleryProps {
  houseId: string;
  className?: string;
}

const HouseVideoGallery: React.FC<HouseVideoGalleryProps> = ({
  houseId,
  className = ""
}) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<number>(0);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/houses/${houseId}/videos`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }

        const data = await response.json();
        if (data.success) {
          setVideos(data.data.videos);
        } else {
          throw new Error(data.message || "Failed to load videos");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการโหลดวิดีโอ");
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [houseId]);



  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('Video gallery error:', error);
    return null;
  }

  if (videos.length === 0) {
    console.log('No videos found for house:', houseId);
    return null;
  }

  console.log('Videos loaded:', videos);

  return (
    <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <CardContent className="p-0">
        {/* Main Video Player */}
        <div className="relative bg-black rounded-t-lg overflow-hidden">
          <video
            key={`video-${currentVideo}-${videos[currentVideo]?.filename}`}
            className="w-full h-64 md:h-80 lg:h-96 object-contain"
            controls
            controlsList="nodownload"
            preload="auto"
            playsInline
            muted
            src={`http://localhost:4000${videos[currentVideo]?.url}`}
            onError={(e) => {
              console.error('Video error:', e);
              console.log('Video URL:', `http://localhost:4000${videos[currentVideo]?.url}`);
            }}
            onLoadStart={() => console.log('Video loading started')}
            onCanPlay={() => console.log('Video can play')}
          >
            เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
          </video>
        </div>

        {/* Video Thumbnails */}
        {videos.length > 1 && (
          <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {videos.map((video, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVideo(index)}
                  className={`relative group rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
                    currentVideo === index
                      ? "ring-2 ring-red-500 shadow-lg"
                      : "hover:shadow-md"
                  }`}
                >
                  <div className="w-full h-16 bg-gray-200 flex items-center justify-center">
                    <VideoCameraIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors duration-200">
                    <div className="bg-white/90 rounded-full p-1.5">
                      <PlayIcon className="h-3 w-3 text-gray-800" />
                    </div>
                  </div>

                  {/* Video Number */}
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>

                  {/* Current Video Indicator */}
                  {currentVideo === index && (
                    <div className="absolute inset-0 ring-2 ring-red-500 rounded-lg"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HouseVideoGallery;