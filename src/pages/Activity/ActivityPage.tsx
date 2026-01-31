import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { BottomNav } from '../../components/BottomNav';

interface Submission {
  id: string;
  photo_url: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  created_at: string;
  actual_earnings: number | null;
}

export function ActivityPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, [user]);

  const loadSubmissions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-[#d4875c] text-white';
      case 'matched':
        return 'bg-blue-500 text-white';
      case 'closed':
        return 'bg-[#5a9367] text-white';
      case 'expired':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
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
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>Activity</h1>
        </div>
      </div>

      <div className="px-6 mt-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-md">
            <p className="text-6xl mb-4">🏠</p>
            <p className="text-xl font-bold text-[#1a1a2e] mb-2">No submissions yet</p>
            <p className="text-gray-600 mb-6">Spot your first property!</p>
            <button
              onClick={() => navigate('/submit')}
              className="bg-gradient-to-r from-[#c9a227] to-[#d4875c] text-white px-8 py-3 rounded-[35px] font-semibold hover:opacity-90"
            >
              New Submission
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={submission.photo_url}
                      alt="Property"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 font-medium truncate">
                        {submission.address ||
                          `${submission.latitude?.toFixed(4)}, ${submission.longitude?.toFixed(4)}`}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{formatDate(submission.created_at)}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                          submission.status
                        )}`}
                      >
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                      {submission.actual_earnings && (
                        <span className="text-sm font-bold text-[#5a9367]">
                          ${submission.actual_earnings}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
