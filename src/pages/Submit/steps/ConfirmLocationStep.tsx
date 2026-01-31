import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Loader } from 'lucide-react';
import { SubmissionData } from '../SubmitPage';

interface Props {
  data: SubmissionData;
  updateData: (updates: Partial<SubmissionData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ConfirmLocationStep({ data, updateData, onNext, onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!data.latitude || !data.longitude) {
      getLocation();
    }
  }, []);

  const getLocation = async () => {
    setLoading(true);
    setError('');

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      updateData({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (err) {
      setError('Unable to get location. Please enable location services or enter manually.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f1] flex flex-col">
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 mx-4">
            <div className="bg-gray-200 h-1 rounded-full overflow-hidden">
              <div className="bg-[#c9a227] h-full" style={{ width: '40%' }} />
            </div>
          </div>
          <span className="text-sm text-gray-600">Step 2/5</span>
        </div>

        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
          Confirm Location
        </h1>
        <p className="text-gray-600 text-sm">We'll use your current location for this property</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {loading ? (
          <div className="text-center">
            <Loader className="animate-spin text-[#c9a227] mx-auto mb-4" size={48} />
            <p className="text-gray-600">Getting your location...</p>
          </div>
        ) : error ? (
          <div className="w-full max-w-md">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
            <button
              onClick={getLocation}
              className="w-full bg-gradient-to-r from-[#c9a227] to-[#d4875c] text-white py-4 rounded-[35px] font-semibold hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        ) : data.latitude && data.longitude ? (
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#5a9367]/10 rounded-full flex items-center justify-center">
                  <MapPin className="text-[#5a9367]" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location captured</p>
                  <p className="text-lg font-bold text-[#1a1a2e]">
                    {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="text-gray-400 mx-auto mb-2" size={32} />
                  <p className="text-gray-500 text-sm">Map preview</p>
                </div>
              </div>
            </div>

            <button
              onClick={onNext}
              className="w-full bg-gradient-to-r from-[#c9a227] to-[#d4875c] text-white py-4 rounded-[35px] font-semibold hover:opacity-90 shadow-lg"
            >
              Confirm Location
            </button>
          </div>
        ) : (
          <div className="text-center">
            <MapPin className="text-[#c9a227] mx-auto mb-4" size={48} />
            <p className="text-gray-600">No location data</p>
          </div>
        )}
      </div>
    </div>
  );
}
