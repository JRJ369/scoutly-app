import { useState } from 'react';
import { ArrowLeft, MapPin, Loader } from 'lucide-react';
import { SubmissionData } from '../SubmitPage';

interface Props {
  data: SubmissionData;
  onSubmit: () => Promise<void>;
  onBack: () => void;
}

export function ReviewStep({ data, onSubmit, onBack }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Failed to submit. Please try again.');
      setSubmitting(false);
    }
  };

  const allSignals = [...data.contractorSignals, ...data.realEstateSignals];

  return (
    <div className="min-h-screen bg-[#f8f6f1] flex flex-col">
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            disabled={submitting}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 mx-4">
            <div className="bg-gray-200 h-1 rounded-full overflow-hidden">
              <div className="bg-[#c9a227] h-full" style={{ width: '100%' }} />
            </div>
          </div>
          <span className="text-sm text-gray-600">Step 5/5</span>
        </div>

        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
          Review & Submit
        </h1>
        <p className="text-gray-600 text-sm">Check your submission details</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
          {data.photo && (
            <img src={data.photo} alt="Property" className="w-full h-48 object-cover rounded-xl mb-4" />
          )}

          <div className="flex items-start gap-2 mb-4">
            <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-700">Location</p>
              <p className="text-sm text-gray-600">
                {data.latitude?.toFixed(4)}, {data.longitude?.toFixed(4)}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Signals ({allSignals.length})</p>
            <div className="flex flex-wrap gap-2">
              {allSignals.map((signal) => (
                <span
                  key={signal}
                  className="px-3 py-1 bg-[#c9a227]/10 text-[#c9a227] text-xs font-medium rounded-full"
                >
                  {signal}
                </span>
              ))}
            </div>
          </div>

          {data.occupancyStatus && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700">Occupancy Status</p>
              <p className="text-sm text-gray-600">{data.occupancyStatus}</p>
            </div>
          )}

          {data.notes && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Notes</p>
              <p className="text-sm text-gray-600">{data.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-[#5a9367] to-[#4a8357] rounded-2xl p-6 text-white text-center">
          <p className="text-sm opacity-90 mb-1">Potential Earnings</p>
          <p className="text-4xl font-bold">$50 - $250</p>
          <p className="text-sm opacity-75 mt-2">Based on submission quality</p>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4 space-y-3">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-[#c9a227] to-[#d4875c] text-white py-4 rounded-[35px] font-semibold hover:opacity-90 disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader className="animate-spin" size={20} />
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </button>
        <button
          onClick={onBack}
          disabled={submitting}
          className="w-full bg-white text-[#1a1a2e] py-4 rounded-[35px] font-semibold border-2 border-gray-200 hover:border-[#c9a227] disabled:opacity-50"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
