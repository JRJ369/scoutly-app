import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { BottomNav } from '../../components/BottomNav';

interface EarningWithSubmission {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  submission: {
    address: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
}

export function EarningsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [availableAmount, setAvailableAmount] = useState(0);
  const [earnings, setEarnings] = useState<EarningWithSubmission[]>([]);
  const [signupDate, setSignupDate] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, [user]);

  const loadEarnings = async () => {
    if (!user) return;

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setSignupDate(new Date(profileData.created_at).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }));
      }

      const { data: earningsData, error } = await supabase
        .from('earnings')
        .select(`
          id,
          amount,
          status,
          created_at,
          submission_id
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (earningsData) {
        const enrichedEarnings = await Promise.all(
          earningsData.map(async (earning) => {
            const { data: submissionData } = await supabase
              .from('submissions')
              .select('address, latitude, longitude')
              .eq('id', earning.submission_id)
              .maybeSingle();

            return {
              ...earning,
              submission: submissionData,
            };
          })
        );

        setEarnings(enrichedEarnings);

        const total = earningsData.reduce((sum, e) => sum + e.amount, 0);
        const pending = earningsData
          .filter((e) => e.status === 'pending')
          .reduce((sum, e) => sum + e.amount, 0);
        const available = earningsData
          .filter((e) => e.status === 'available')
          .reduce((sum, e) => sum + e.amount, 0);

        setTotalEarnings(total);
        setPendingAmount(pending);
        setAvailableAmount(available);
      }
    } catch (error) {
      console.error('Error loading earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = () => {
    alert('Withdrawals coming soon!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#f8f6f1] pb-24">
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#2a2a3e] text-white px-6 py-6 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>Earnings</h1>
        </div>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-gradient-to-br from-[#5a9367] to-[#4a8357] rounded-2xl p-6 shadow-lg mb-4 text-white">
          <p className="text-sm opacity-90 mb-1">Total Earnings</p>
          <p className="text-5xl font-bold mb-2">${totalEarnings}</p>
          <p className="text-sm opacity-75">Since {signupDate || 'joining'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-[#d4875c]/20">
            <p className="text-gray-500 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-[#d4875c]">${pendingAmount}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-[#5a9367]/20">
            <p className="text-gray-500 text-sm mb-1">Available</p>
            <p className="text-3xl font-bold text-[#5a9367]">${availableAmount}</p>
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          className="w-full bg-[#5a9367] text-white py-4 rounded-[35px] font-semibold shadow-md hover:opacity-90 transition-opacity mb-8"
        >
          Withdraw
        </button>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading earnings...</p>
          </div>
        ) : earnings.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-md">
            <p className="text-6xl mb-4">💰</p>
            <p className="text-xl font-bold text-[#1a1a2e] mb-2">No earnings yet</p>
            <p className="text-gray-600">Your earnings will appear here when deals close.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-[#1a1a2e] mb-4">Recent Earnings</h2>
            <div className="space-y-3">
              {earnings.map((earning) => (
                <div key={earning.id} className="bg-white rounded-2xl p-4 shadow-md flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-1">
                      <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 font-medium">
                        {earning.submission?.address ||
                          `${earning.submission?.latitude?.toFixed(4)}, ${earning.submission?.longitude?.toFixed(4)}` ||
                          'Property'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">{formatDate(earning.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#5a9367]">${earning.amount}</p>
                    <p className={`text-xs ${earning.status === 'available' ? 'text-[#5a9367]' : 'text-[#d4875c]'}`}>
                      {earning.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
