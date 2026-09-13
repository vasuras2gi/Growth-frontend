// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, LayoutDashboard, Target, PlayCircle, CheckCircle, Clock, Check, Star, Download, Puzzle, Info } from 'lucide-react';

// const API_BASE = 'http://localhost:5002/api/playlist';
const API_BASE = 'https://growth-backend-voda.onrender.com/api/playlist';
const USER_ID = 'test_user_123'; // Replace with actual auth later

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [playlists, setPlaylists] = useState([]);
  const [activePlaylistId, setActivePlaylistId] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showExtensionInfo, setShowExtensionInfo] = useState(false);

  // Form State
  const [url, setUrl] = useState('');
  const [days, setDays] = useState(10);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchPlaylists();
    fetchActiveStatus();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const res = await axios.get(`${API_BASE}/all/${USER_ID}`);
      setPlaylists(res.data.playlists || []);
    } catch (error) {
      console.error('Failed to fetch playlists', error);
    }
  };

  const fetchActiveStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/${USER_ID}`);
      if (res.data.playlist) {
        setActivePlaylistId(res.data.playlist._id);
      }
    } catch (error) {
      console.error('Failed to fetch active status', error);
    }
  };

  const handleGenerateSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/generate`, {
        userId: USER_ID,
        url,
        goalDays: days,
        title: title || `Roadmap - ${days} Days`
      });
      setUrl('');
      setTitle('');
      setDays(10);
      await fetchPlaylists();
      await fetchActiveStatus();
      setActiveTab('dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Error generating schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleSetActive = async (playlistId, e) => {
    e.stopPropagation();
    try {
      await axios.patch(`${API_BASE}/switch`, { userId: USER_ID, playlistId });
      setActivePlaylistId(playlistId);
    } catch (error) {
      alert('Failed to set active roadmap');
    }
  };

  const downloadExtensionfromfront = () => {
    // In a real app, you would host the .zip on your backend or a cloud storage (like AWS S3/Cloudinary)
    // For now, this is a placeholder URL. You should zip your 'extension' folder and put it in your frontend/public folder.
    const link = document.createElement('a');
    link.href = '/Growth_Chrome_Extension.zip';
    link.download = 'Growth_Chrome_Extension.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExtensionInfo(true);
  };

  const downloadExtension = () => {
    const link = document.createElement('a');
    // Replace with your actual Render backend URL
    link.href = 'https://your-backend-api.onrender.com/api/download-extension';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExtensionInfo(true);
  };


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] border-r border-gray-800 flex flex-col p-4">
        <div className="flex items-center gap-3 mb-10 px-2 mt-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">
            G
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">Growth</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'hover:bg-gray-800/50 text-gray-400'}`}
          >
            <LayoutDashboard size={20} />
            My Roadmaps
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'create' ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'hover:bg-gray-800/50 text-gray-400'}`}
          >
            <Plus size={20} />
            Create Goal
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto">

            {/* NEW: Chrome Extension Banner */}
            <div className="mb-10 bg-gradient-to-r from-indigo-900/40 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-indigo-900/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                 <Puzzle size={120} />
              </div>
              <div className="relative z-10 flex-1">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Puzzle size={20} className="text-indigo-400" /> Supercharge with Chrome Extension
                </h3>
                <p className="text-gray-400 text-sm max-w-2xl">
                  Turn every new tab into a learning opportunity. Download the official Growth Chrome Extension to see your active daily tasks instantly whenever you open a new tab.
                </p>
                
                {showExtensionInfo && (
                  <div className="mt-4 bg-black/40 p-4 rounded-lg border border-gray-800 text-sm text-gray-300">
                    <p className="font-semibold text-indigo-400 mb-2 flex items-center gap-2"><Info size={16}/> How to install:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Extract the downloaded ZIP file.</li>
                      <li>Go to <span className="bg-gray-800 px-2 py-0.5 rounded text-white">chrome://extensions/</span> in your browser.</li>
                      <li>Turn on <strong>Developer mode</strong> (top right).</li>
                      <li>Click <strong>Load unpacked</strong> and select the extracted folder.</li>
                    </ol>
                  </div>
                )}
              </div>
              <div className="relative z-10 w-full md:w-auto">
                <button 
                  onClick={downloadExtension}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-600/20"
                >
                  <Download size={18} /> Download Extension
                </button>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-8">Your Learning Goals</h2>
            
            {playlists.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-800 rounded-2xl">
                <Target size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Roadmaps Yet</h3>
                <p className="text-gray-500 mb-6">Create your first goal to start tracking your daily progress.</p>
                <button onClick={() => setActiveTab('create')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium transition">
                  Create First Goal
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists.map(pl => {
                  const isActive = pl._id === activePlaylistId;
                  return (
                    <div 
                      key={pl._id} 
                      onClick={() => { setSelectedPlaylist(pl); setActiveTab('detail'); }}
                      className={`group cursor-pointer bg-[#111] border ${isActive ? 'border-indigo-500/50' : 'border-gray-800'} p-6 rounded-2xl hover:border-gray-600 transition-all relative overflow-hidden`}
                    >
                      {isActive && <div className="absolute top-0 right-0 bg-indigo-600 text-xs font-bold px-3 py-1 rounded-bl-lg text-white">ACTIVE IN EXTENSION</div>}
                      
                      <h3 className="text-xl font-bold text-white mb-2 pr-12 line-clamp-1">{pl.title}</h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 mt-4">
                        <div className="flex items-center gap-1.5"><Clock size={16}/> {pl.goalDays} Days</div>
                        <div className="flex items-center gap-1.5"><PlayCircle size={16}/> {pl.totalVideos} Videos</div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span className="flex items-center gap-1.5 text-orange-400 font-medium">
                          <Star size={16} fill="currentColor" /> Streak: {pl.streakCount || 0}
                        </span>
                        
                        {!isActive ? (
                          <button 
                            onClick={(e) => handleSetActive(pl._id, e)}
                            className="opacity-0 group-hover:opacity-100 bg-gray-800 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded text-sm transition-all text-gray-300"
                          >
                            Set Active
                          </button>
                        ) : (
                          <span className="text-indigo-400 text-sm flex items-center gap-1"><Check size={16}/> Extension Set</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-xl mx-auto mt-10">
            <div className="bg-[#111] border border-gray-800 p-8 rounded-3xl shadow-xl">
              <div className="mb-8 text-center">
                <div className="w-12 h-12 bg-indigo-600/20 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Design New Roadmap</h2>
                <p className="text-gray-400 text-sm mt-2">Break down any YouTube playlist into daily achievable tasks.</p>
              </div>

              <form onSubmit={handleGenerateSchedule} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Roadmap Name</label>
                  <input 
                    type="text" placeholder="e.g. Master MERN Stack" value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Playlist URL <span className="text-red-500">*</span></label>
                  <input 
                    type="url" required placeholder="https://youtube.com/playlist?list=..." value={url} onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Completion Goal (Days)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" min="1" max="100" value={days} onChange={(e) => setDays(Number(e.target.value))}
                      className="flex-1 accent-indigo-500"
                    />
                    <span className="w-16 text-center bg-[#0a0a0a] border border-gray-800 rounded-lg py-2 font-mono text-indigo-400">{days}</span>
                  </div>
                </div>

                <button 
                  type="submit" disabled={loading}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
                >
                  {loading ? 'Processing Videos...' : 'Generate Roadmap'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'detail' && selectedPlaylist && (
          <div className="max-w-4xl mx-auto pb-20">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 transition"
            >
              ← Back to Roadmaps
            </button>
            
            <div className="flex items-end justify-between border-b border-gray-800 pb-6 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedPlaylist.title}</h2>
                <a href={selectedPlaylist.playlistUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline text-sm flex items-center gap-2">
                  <PlayCircle size={16}/> Original Source
                </a>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{selectedPlaylist.goalDays}</div>
                <div className="text-gray-500 text-sm">Total Days</div>
              </div>
            </div>

            <div className="space-y-6">
              {selectedPlaylist.dailySchedule.map((day, idx) => (
                <div key={idx} className="bg-[#111] border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <div className="bg-indigo-600/20 text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      {day.day}
                    </div>
                    Day {day.day}
                  </h3>
                  
                  <div className="space-y-3">
                    {day.videos.map((video, vIdx) => (
                      <div key={vIdx} className={`flex items-center gap-4 p-3 rounded-xl border ${video.isCompleted ? 'bg-gray-900/50 border-green-500/30' : 'bg-[#0a0a0a] border-gray-800'}`}>
                        <img src={video.thumbnail} alt="thumb" className={`w-24 h-14 object-cover rounded-lg ${video.isCompleted ? 'opacity-50 grayscale' : ''}`} />
                        <div className="flex-1">
                          <p className={`font-medium line-clamp-1 text-sm ${video.isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                            {video.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{Math.floor(video.durationSec / 60)} mins</p>
                        </div>
                        {video.isCompleted && <CheckCircle size={20} className="text-green-500 mr-2" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}