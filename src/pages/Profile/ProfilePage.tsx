import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { BottomNav } from '../../components/BottomNav';

interface ProfileData {
  full_name: string | null;
  email: string;
  scout_tier: string;
  created_at: string;
}

interface Stats {
  totalSubmissions: number;
  closedDeals: number;
  successRate: number;
}

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<Stats>({ totalSubmissions: 0, closedDeals: 0, successRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      const { data: submissions } = await supabase
        .from('submissions')
        .select('status')
        .eq('user_id', user.id);

      const totalSubmissions = submissions?.length || 0;
      const closedDeals = submissions?.filter((s) => s.status === 'closed').length || 0;
      const successRate = totalSubmissions > 0 ? Math.round((closedDeals / totalSubmissions) * 100) : 0;

      setStats({ totalSubmissions, closedDeals, successRate });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitial = () => {
    if (profile?.full_name) {
      return profile.full_name.charAt(0).toUpperCase();
    }
    if (profile?.email) {
      return profile.email.charAt(0).toUpperCase();
    }
    return 'S';
  };

  const getTierColor = (tier: string) => {
    if (tier === 'Super Scout') return 'from-purple-500 to-pink-500';
    if (tier === 'Senior Scout') return 'from-blue-500 to-indigo-500';
    if (tier === 'Scout') return 'from-[#c9a227] to-[#d4875c]';
    return 'from-gray-400 to-gray-500';
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
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>Profile</h1>
        </div>
      </div>

      <div className="px-6 -mt-12">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c9a227] to-[#d4875c] flex items-center justify-center text-white text-3xl font-bold">
              {getInitial()}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#1a1a2e]">{profile?.full_name || 'Scout'}</h2>
              <p className="text-gray-600 text-sm">{profile?.email}</p>
            </div>
          </div>

          <div className={`bg-gradient-to-r ${getTierColor(profile?.scout_tier || 'New Scout')} rounded-xl p-4 text-white text-center`}>
            <p className="text-sm opacity-90 mb-1">Scout Tier</p>
            <p className="text-2xl font-bold">{profile?.scout_tier || 'New Scout'}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Submissions</span>
              <span className="text-xl font-bold text-[#1a1a2e]">{stats.totalSubmissions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Deals Closed</span>
              <span className="text-xl font-bold text-[#5a9367]">{stats.closedDeals}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Success Rate</span>
              <span className="text-xl font-bold text-[#c9a227]">{stats.successRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden">
          <button
            onClick={() => alert('Add payment method coming soon!')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <span className="text-gray-700 font-medium">Payment Method</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Add payment method</span>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </button>

          <button
            onClick={() => alert('Service area settings coming soon!')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <span className="text-gray-700 font-medium">Service Area</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Pensacola, FL</span>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </button>

          <button
            onClick={() => alert('Notification settings coming soon!')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <span className="text-gray-700 font-medium">Notifications</span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <button
            onClick={() => alert('Help & Support coming soon!')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-700 font-medium">Help & Support</span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 py-4 rounded-[35px] font-semibold border-2 border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
