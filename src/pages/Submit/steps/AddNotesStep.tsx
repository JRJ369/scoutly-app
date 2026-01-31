import { ArrowLeft } from 'lucide-react';
import { SubmissionData } from '../SubmitPage';

interface Props {
  data: SubmissionData;
  updateData: (updates: Partial<SubmissionData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AddNotesStep({ data, updateData, onNext, onBack }: Props) {
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
              <div className="bg-[#c9a227] h-full" style={{ width: '80%' }} />
            </div>
          </div>
          <span className="text-sm text-gray-600">Step 4/5</span>
        </div>

        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
          Add Notes
        </h1>
        <p className="text-gray-600 text-sm">Optional: Add any additional details</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-3">Additional Notes</label>
          <textarea
            value={data.notes}
            onChange={(e) => updateData({ notes: e.target.value })}
            placeholder="Describe what you noticed..."
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#c9a227] focus:outline-none min-h-32 resize-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-3">Occupancy Status</label>
          <div className="space-y-3">
            {['Occupied', 'Vacant', 'Unsure'].map((status) => (
              <button
                key={status}
                onClick={() => updateData({ occupancyStatus: status })}
                className={`w-full px-6 py-4 rounded-2xl font-medium transition-all ${
                  data.occupancyStatus === status
                    ? 'bg-gradient-to-r from-[#c9a227] to-[#d4875c] text-white shadow-md'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#c9a227]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Pro tip:</span> More details help us match your submission with the right partners faster!
          </p>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-[#c9a227] to-[#d4875c] text-white py-4 rounded-[35px] font-semibold hover:opacity-90 shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
