import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, List, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { BottomNav } from '../../components/BottomNav';

interface Stats {
  totalSubmissions: number;
  totalEarned: number;
  pending: number;
  scoutTier: string;
}

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalSubmissions: 0,
    totalEarned: 0,
    pending: 0,
    scoutTier: 'New Scout',
  });
  const [userName, setUserName] = useState('Scout');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, scout_tier')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        setUserName(profile.full_name || 'Scout');
        setStats((prev) => ({ ...prev, scoutTier: profile.scout_tier }));
      }

      const { data: submissions } = await supabase
        .from('submissions')
        .select('status')
        .eq('user_id', user.id);

      const totalSubmissions = submissions?.length || 0;
      const pending = submissions?.filter((s) => s.status === 'pending').length || 0;

      const { data: earnings } = await supabase
        .from('earnings')
        .select('amount')
        .eq('user_id', user.id);

      const totalEarned = earnings?.reduce((sum, e) => sum + e.amount, 0) || 0;

      setStats({
        totalSubmissions,
        totalEarned,
        pending,
        scoutTier: profile?.scout_tier || 'New Scout',
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f1] pb-24">
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#2a2a3e] text-white px-6 py-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦉</span>
            <span className="text-2xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>
              Scoutly
            </span>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
          >
            <User size={20} />
          </button>
        </div>
        <h1 className="text-2xl font-semibold">Hey {userName}! 👋</h1>
      </div>

      <div className="px-6 -mt-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <p className="text-gray-500 text-sm mb-1">Total Submissions</p>
            <p className="text-3xl font-bold text-[#1a1a2e]">{stats.totalSubmissions}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <p className="text-gray-500 text-sm mb-1">Total Earned</p>
            <p className="text-3xl font-bold text-[#5a9367]">${stats.totalEarned}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <p className="text-gray-500 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-[#d4875c]">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <p className="text-gray-500 text-sm mb-1">Scout Tier</p>
            <p className="text-lg font-bold text-[#c9a227]">{stats.scoutTier}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/submit')}
          className="w-full bg-gradient-to-r from-[#c9a227] to-[#d4875c] text-white py-5 rounded-[35px] font-bold text-lg shadow-lg hover:opacity-90 mb-4 flex items-center justify-center gap-2"
        >
          <Camera size={24} />
          New Submission
        </button>

        <button
          onClick={() => navigate('/activity')}
          className="w-full bg-white text-[#1a1a2e] py-4 rounded-[35px] font-semibold border-2 border-gray-200 hover:border-[#c9a227] flex items-center justify-center gap-2"
        >
          <List size={20} />
          View My Submissions
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
