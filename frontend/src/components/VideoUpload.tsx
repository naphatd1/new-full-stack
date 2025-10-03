"use client";

import React, { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  VideoCameraIcon, 
  XMarkIcon, 
  ArrowUpTrayIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface VideoUploadProps {
  videos: File[];
  setVideos: (videos: File[]) => void;
  videoPreviews: string[];
  setVideoPreviews: (previews: string[]) => void;
  quality: "low" | "medium" | "high";
  setQuality: (quality: "low" | "medium" | "high") => void;
  errors?: Record<string, string>;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  videos,
  setVideos,
  videoPreviews,
  setVideoPreviews,
  quality,
  setQuality,
  errors = {}
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const qualityOptions = [
    { 
      value: "low" as const, 
      label: "ต่ำ (500k)", 
      description: "ไฟล์เล็กที่สุด, เหมาะสำหรับแสดงตัวอย่าง",
      color: "text-green-600"
    },
    { 
      value: "medium" as const, 
      label: "กลาง (1000k)", 
      description: "สมดุลระหว่างคุณภาพและขนาดไฟล์",
      color: "text-blue-600"
    },
    { 
      value: "high" as const, 
      label: "สูง (2000k)", 
      description: "คุณภาพดีที่สุด, ไฟล์ใหญ่กว่า",
      color: "text-purple-600"
    }
  ];

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // ตรวจสอบจำนวนไฟล์
    if (files.length + videos.length > 5) {
      toast.error("สามารถอัพโหลดวิดีโอได้สูงสุด 5 ไฟล์");
      return;
    }

    // ตรวจสอบขนาดไฟล์
    const oversizedFiles = files.filter(file => file.size > 500 * 1024 * 1024); // 500MB
    if (oversizedFiles.length > 0) {
      toast.error(`ไฟล์ ${oversizedFiles[0].name} มีขนาดใหญ่เกิน 500MB`);
      return;
    }

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/mkv', 'video/x-matroska'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      toast.error(`ไฟล์ ${invalidFiles[0].name} ไม่ใช่วิดีโอที่รองรับ`);
      return;
    }

    const newVideos = [...videos, ...files];
    setVideos(newVideos);

    // สร้าง preview
    const newPreviews = [...videoPreviews];
    files.forEach((file, index) => {
      const url = URL.createObjectURL(file);
      newPreviews.push(url);
      
      // จำลอง progress
      const fileId = `${file.name}_${Date.now()}_${index}`;
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      // จำลอง progress animation
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      }, 200);
    });
    
    setVideoPreviews(newPreviews);

    // เคลียร์ input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    const newPreviews = videoPreviews.filter((_, i) => i !== index);
    
    // ลบ URL object เพื่อป้องกัน memory leak
    if (videoPreviews[index]) {
      URL.revokeObjectURL(videoPreviews[index]);
    }
    
    setVideos(newVideos);
    setVideoPreviews(newPreviews);
    toast.success("ลบวิดีโอแล้ว");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };



  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-xl">
          <div className="bg-white/20 rounded-full p-2 mr-3">
            <VideoCameraIcon className="h-6 w-6" />
          </div>
          วิดีโอ (ไม่บังคับ)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* คุณภาพการบีบอัด */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            <Cog6ToothIcon className="h-5 w-5 inline mr-2" />
            คุณภาพการบีบอัด
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {qualityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setQuality(option.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:scale-105 ${
                  quality === option.value
                    ? "border-red-500 bg-red-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-red-300"
                }`}
              >
                <div className={`font-semibold ${option.color}`}>
                  {option.label}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* อัพโหลดวิดีโอ */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            อัพโหลดวิดีโอ (สูงสุด 5 ไฟล์, แต่ละไฟล์ไม่เกิน 500MB)
          </label>
          <div className="border-3 border-dashed border-red-300 rounded-xl p-8 text-center hover:border-red-500 hover:bg-red-50 transition-all duration-300 bg-gradient-to-br from-red-50 to-pink-50">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="video/*"
              onChange={handleVideoChange}
              className="hidden"
            />
            <VideoCameraIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              เพิ่มวิดีโอของบ้าน
            </h3>
            <p className="text-red-600 mb-4">
              รองรับไฟล์ MP4, AVI, MOV, WebM, MKV
            </p>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              เลือกไฟล์วิดีโอ
            </Button>
            <div className="mt-4 text-sm text-gray-500">
              <p>💡 วิดีโอจะถูกบีบอัดอัตโนมัติเพื่อลดขนาดไฟล์</p>
              <p>🎬 แนะนำ: วิดีโอแสดงมุมมองภายใน-ภายนอก และสิ่งอำนวยความสะดวก</p>
            </div>
          </div>
          {errors.videos && (
            <p className="mt-2 text-sm text-red-600">{errors.videos}</p>
          )}
        </div>

        {/* แสดงวิดีโอที่เลือก */}
        {videos.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
              <VideoCameraIcon className="h-6 w-6 mr-2" />
              วิดีโอที่เลือก ({videos.length}/5)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <div className="relative">
                    {videoPreviews[index] && (
                      <video
                        src={videoPreviews[index]}
                        className="w-full h-40 object-cover rounded-lg"
                        controls
                        preload="metadata"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="font-medium text-gray-800 truncate" title={video.name}>
                      {video.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      📁 ขนาด: {formatFileSize(video.size)}
                    </p>
                    <p className="text-sm text-gray-600">
                      🎬 ประเภท: {video.type}
                    </p>
                    
                    {/* Progress bar สำหรับการอัพโหลด */}
                    {Object.entries(uploadProgress).map(([fileId, progress]) => {
                      if (fileId.startsWith(video.name)) {
                        return (
                          <div key={fileId} className="mt-2">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>กำลังประมวลผล...</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* สถิติรวม */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-red-200">
              <h5 className="font-semibold text-red-800 mb-2">📊 สถิติรวม</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">จำนวนไฟล์:</span>
                  <div className="font-semibold text-red-600">{videos.length} ไฟล์</div>
                </div>
                <div>
                  <span className="text-gray-600">ขนาดรวม:</span>
                  <div className="font-semibold text-red-600">
                    {formatFileSize(videos.reduce((sum, video) => sum + video.size, 0))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">คุณภาพ:</span>
                  <div className="font-semibold text-red-600">
                    {qualityOptions.find(q => q.value === quality)?.label}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">ประมาณการบีบอัด:</span>
                  <div className="font-semibold text-green-600">
                    {quality === 'low' ? '~70%' : quality === 'medium' ? '~50%' : '~30%'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* คำแนะนำ */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
            <span className="text-xl mr-2">💡</span>
            เคล็ดลับการถ่ายวิดีโอ
          </h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• ถ่ายวิดีโอในแสงสว่างเพียงพอ</li>
            <li>• แสดงมุมมองห้องต่างๆ และพื้นที่สำคัญ</li>
            <li>• ความยาววิดีโอ 30 วินาที - 2 นาที ต่อไฟล์</li>
            <li>• หลีกเลี่ยงการสั่นไหวมากเกินไป</li>
            <li>• แสดงจุดเด่นและสิ่งอำนวยความสะดวก</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoUpload;