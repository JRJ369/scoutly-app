import { ArrowLeft } from 'lucide-react';
import { SubmissionData } from '../SubmitPage';

interface Props {
  data: SubmissionData;
  updateData: (updates: Partial<SubmissionData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CONTRACTOR_SIGNALS = [
  'Roof Damage',
  'Overgrown Lawn',
  'Peeling Paint',
  'Old HVAC Unit',
  'Broken Fence',
  'Clogged Gutters',
  'Broken Windows',
  'Damaged Siding',
];

const REALESTATE_SIGNALS = [
  'Appears Vacant',
  'Mail Piling Up',
  'FSBO Sign',
  'Code Violation Notice',
  'Foreclosure Notice',
  'Boarded Up',
  'For Rent Sign',
  'Estate Sale Sign',
];

export function SelectSignalsStep({ data, updateData, onNext, onBack }: Props) {
  const toggleContractorSignal = (signal: string) => {
    const current = data.contractorSignals;
    const updated = current.includes(signal)
      ? current.filter((s) => s !== signal)
      : [...current, signal];
    updateData({ contractorSignals: updated });
  };

  const toggleRealEstateSignal = (signal: string) => {
    const current = data.realEstateSignals;
    const updated = current.includes(signal)
      ? current.filter((s) => s !== signal)
      : [...current, signal];
    updateData({ realEstateSignals: updated });
  };

  const totalSignals = data.contractorSignals.length + data.realEstateSignals.length;

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
              <div className="bg-[#c9a227] h-full" style={{ width: '60%' }} />
            </div>
          </div>
          <span className="text-sm text-gray-600">Step 3/5</span>
        </div>

        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
          Select Signals
        </h1>
        <p className="text-gray-600 text-sm">
          {totalSignals === 0 ? (
            'Choose what you noticed about this property'
          ) : (
            <>
              {totalSignals} signal{totalSignals !== 1 ? 's' : ''} selected •{' '}
              <span className="text-[#5a9367] font-semibold">More signals = higher potential payout</span>
            </>
          )}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
            🔨 Contractor Signals
          </h2>
          <div className="flex flex-wrap gap-3">
            {CONTRACTOR_SIGNALS.map((signal) => (
              <button
                key={signal}
                onClick={() => toggleContractorSignal(signal)}
                className={`px-4 py-2.5 rounded-full font-medium transition-all ${
                  data.contractorSignals.includes(signal)
                    ? 'bg-gradient-to-r from-[#c9a227] to-[#d4875c] text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#c9a227]'
                }`}
              >
                {signal}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
            🏠 Real Estate Signals
          </h2>
          <div className="flex flex-wrap gap-3">
            {REALESTATE_SIGNALS.map((signal) => (
              <button
                key={signal}
                onClick={() => toggleRealEstateSignal(signal)}
                className={`px-4 py-2.5 rounded-full font-medium transition-all ${
                  data.realEstateSignals.includes(signal)
                    ? 'bg-gradient-to-r from-[#c9a227] to-[#d4875c] text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#c9a227]'
                }`}
              >
                {signal}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <button
          onClick={onNext}
          disabled={totalSignals === 0}
          className="w-full bg-gradient-to-r from-[#c9a227] to-[#d4875c] text-white py-4 rounded-[35px] font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          Continue {totalSignals > 0 && `(${totalSignals} selected)`}
        </button>
      </div>
    </div>
  );
}
