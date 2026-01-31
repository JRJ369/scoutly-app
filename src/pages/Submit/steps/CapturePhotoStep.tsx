import { useState, useRef } from 'react';
import { ArrowLeft, Camera, Upload } from 'lucide-react';
import { SubmissionData } from '../SubmitPage';

interface Props {
  data: SubmissionData;
  updateData: (updates: Partial<SubmissionData>) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function CapturePhotoStep({ data, updateData, onNext, onCancel }: Props) {
  const [preview, setPreview] = useState<string | null>(data.photo);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      alert('Unable to access camera. Please allow camera access or upload a photo instead.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);
            setPreview(url);
            updateData({ photo: url, photoFile: file });
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      updateData({ photo: url, photoFile: file });
      stopCamera();
    }
  };

  const handleRetake = () => {
    setPreview(null);
    updateData({ photo: null, photoFile: null });
  };

  const handleNext = () => {
    if (preview) {
      stopCamera();
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={() => {
            stopCamera();
            onCancel();
          }}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 mx-4">
          <div className="bg-white/10 h-1 rounded-full overflow-hidden">
            <div className="bg-[#c9a227] h-full" style={{ width: '20%' }} />
          </div>
        </div>
        <span className="text-sm">Step 1/5</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {!preview && !cameraActive && (
          <div className="text-center">
            <div className="text-6xl mb-6">📸</div>
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
              Capture Property Photo
            </h1>
            <p className="text-white/70 mb-8">Take a clear photo of the property</p>

            <button
              onClick={startCamera}
              className="w-full bg-gradient-to-r from-[#c9a227] to-[#d4875c] text-white py-4 rounded-[35px] font-semibold mb-4 flex items-center justify-center gap-2"
            >
              <Camera size={20} />
              Open Camera
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white/10 text-white py-4 rounded-[35px] font-semibold flex items-center justify-center gap-2 hover:bg-white/20"
            >
              <Upload size={20} />
              Upload from Gallery
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {cameraActive && !preview && (
          <div className="w-full max-w-lg">
            <div className="relative rounded-2xl overflow-hidden mb-6">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto"
              />
              <div className="absolute inset-0 border-4 border-[#c9a227]/50 rounded-2xl pointer-events-none" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-sm">
                Center the property in frame
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={stopCamera}
                className="px-6 py-3 bg-white/10 rounded-[35px] font-semibold hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                className="w-20 h-20 bg-gradient-to-r from-[#c9a227] to-[#d4875c] rounded-full flex items-center justify-center hover:opacity-90 shadow-lg"
              >
                <div className="w-16 h-16 bg-white rounded-full" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-white/10 rounded-[35px] font-semibold hover:bg-white/20 flex items-center gap-2"
              >
                <Upload size={20} />
                Upload
              </button>
            </div>
          </div>
        )}

        {preview && (
          <div className="w-full max-w-lg">
            <div className="rounded-2xl overflow-hidden mb-6">
              <img src={preview} alt="Preview" className="w-full h-auto" />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRetake}
                className="flex-1 bg-white/10 text-white py-4 rounded-[35px] font-semibold hover:bg-white/20"
              >
                Retake
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-[#c9a227] to-[#d4875c] text-white py-4 rounded-[35px] font-semibold hover:opacity-90"
              >
                Use This Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
