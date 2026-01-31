import { CheckCircle } from 'lucide-react';

interface Props {
  submissionId: string;
  onHome: () => void;
  onSubmitAnother: () => void;
}

export function SuccessStep({ submissionId, onHome, onSubmitAnother }: Props) {
  const displayId = `SC-2026-${submissionId.slice(0, 5).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-[#f8f6f1] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <CheckCircle className="text-[#5a9367] mx-auto mb-4" size={80} strokeWidth={1.5} />
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-3" style={{ fontFamily: 'Fraunces, serif' }}>
            Submission Received!
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Our AI is routing your submission to the right partners.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <p className="text-sm text-gray-500 mb-2">Submission ID</p>
          <p className="text-2xl font-bold text-[#c9a227] font-mono mb-4">{displayId}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              We'll notify you when your submission is matched with a partner. You'll earn money when deals close!
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onSubmitAnother}
            className="w-full bg-gradient-to-r from-[#c9a227] to-[#d4875c] text-white py-4 rounded-[35px] font-semibold hover:opacity-90 shadow-lg"
          >
            Submit Another
          </button>
          <button
            onClick={onHome}
            className="w-full bg-white text-[#1a1a2e] py-4 rounded-[35px] font-semibold border-2 border-gray-200 hover:border-[#c9a227] transition-colors"
          >
            Back to Home
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Keep scouting to increase your earnings! 🦉
          </p>
        </div>
      </div>
    </div>
  );
}
