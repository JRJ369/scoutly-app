import { useNavigate } from 'react-router-dom';

export function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f6f1] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="text-6xl mb-6">🦉</div>
        <h1 className="text-4xl font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: 'Fraunces, serif' }}>
          Welcome to Scoutly!
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          You're now a Scout! Start spotting properties that need help and earn money when deals close.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">How it works:</h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start">
              <span className="text-2xl mr-3">📸</span>
              <div>
                <h3 className="font-semibold text-gray-900">1. Spot Properties</h3>
                <p className="text-gray-600 text-sm">Take photos of properties that need repairs or appear vacant</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <h3 className="font-semibold text-gray-900">2. Tag Signals</h3>
                <p className="text-gray-600 text-sm">Mark what you see: damaged roof, overgrown lawn, etc.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">💰</span>
              <div>
                <h3 className="font-semibold text-gray-900">3. Earn Money</h3>
                <p className="text-gray-600 text-sm">Get paid when your submission leads to a closed deal</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-gradient-to-r from-[#c9a227] to-[#d4875c] text-white py-4 rounded-[35px] font-semibold hover:opacity-90 transition-opacity"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
