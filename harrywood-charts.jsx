import React, { useState, useEffect, useRef } from 'react';
import { Play, Search, ChevronRight, ChevronLeft, MoreVertical, Share2, Star, TrendingUp } from 'lucide-react';

export default function HarryoodCharts() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('trending');
  const scrollContainers = useRef({});

  // Mock data - Replace with actual API calls
  const mockSongs = [
    { id: 1, title: 'Midnight Dreams', artist: 'Luna Echo', views: 2500000, category: 'trending', rank: 1, imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=450&fit=crop', ytId: 'dQw4w9WgXcQ' },
    { id: 2, title: 'Electric Love', artist: 'Neon Pulse', views: 2300000, category: 'trending', rank: 2, imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=300&h=450&fit=crop', ytId: 'dQw4w9WgXcQ' },
    { id: 3, title: 'Summer Vibes', artist: 'Golden Hour', views: 2100000, category: 'trending', rank: 3, imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=450&fit=crop', ytId: 'dQw4w9WgXcQ' },
    { id: 4, title: 'Neon Nights', artist: 'Synthwave Kings', views: 1950000, category: 'trending', rank: 4, imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=450&fit=crop', ytId: 'dQw4w9WgXcQ' },
    { id: 5, title: 'Urban Jungle', artist: 'City Lights', views: 1850000, category: 'trending', rank: 5, imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=450&fit=crop', ytId: 'dQw4w9WgXcQ' },
    { id: 6, title: 'Crystal Clear', artist: 'Echo Dreams', views: 1750000, category: 'trending', rank: 6, imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=300&h=450&fit=crop', ytId: 'dQw4w9WgXcQ' },
    { id: 7, title: 'Starlight', artist: 'Cosmic Waves', views: 1650000, category: 'newReleases', rank: 1, imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=450&fit=crop', ytId: 'dQw4w9WgXcQ' },
    { id: 8, title: 'Wavelength', artist: 'Frequency', views: 1550000, category: 'rising', rank: 1, imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=450&fit=crop', ytId: 'dQw4w9WgXcQ' },
    { id: 9, title: 'Horizon', artist: 'Solar Wind', views: 1450000, category: 'top100', rank: 7, imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=450&fit=crop', ytId: 'dQw4w9WgXcQ' },
    { id: 10, title: 'Cosmic Journey', artist: 'Space Echo', views: 1350000, category: 'mostViewed', rank: 1, imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=300&h=450&fit=crop', ytId: 'dQw4w9WgXcQ' },
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setSongs(mockSongs);
      setFilteredSongs(mockSongs);
      setLoading(false);
    }, 1000);

    // Auto-slide hero carousel
    const heroTimer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % mockSongs.length);
    }, 5000);

    return () => clearInterval(heroTimer);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = songs.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(songs);
    }
  }, [searchQuery, songs]);

  const scroll = (direction, category) => {
    const container = scrollContainers.current[category];
    if (container) {
      const scrollAmount = 400;
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const watchOnYoutube = (ytId) => {
    window.open(`https://www.youtube.com/watch?v=${ytId}`, '_blank');
  };

  const SongCard = ({ song, isTop10 = false, ranking = null }) => (
    <div className="flex-shrink-0 relative group cursor-pointer transition-all duration-300 hover:scale-105">
      <div className="relative overflow-hidden rounded-lg aspect-[3/4] shadow-2xl">
        <img
          src={song.imageUrl}
          alt={song.title}
          className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
        />
        
        {/* Ranking Number */}
        {isTop10 && ranking && (
          <div className="absolute top-3 left-3 text-9xl font-black text-red-600 opacity-20 select-none">
            {ranking}
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => watchOnYoutube(song.ytId)}
            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300"
          >
            <Play className="w-8 h-8 fill-current" />
          </button>
        </div>

        {/* Song Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-sm line-clamp-1">{song.title}</h3>
          <p className="text-gray-300 text-xs line-clamp-1">{song.artist}</p>
          <p className="text-red-400 text-xs mt-1">{(song.views / 1000000).toFixed(1)}M views</p>
        </div>
      </div>
    </div>
  );

  const SkeletonCard = () => (
    <div className="flex-shrink-0 w-32 h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg animate-pulse"></div>
  );

  const ScrollSection = ({ title, category, items }) => (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <ChevronRight className="text-red-600 w-6 h-6" />
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll('left', category)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div
          ref={(el) => (scrollContainers.current[category] = el)}
          className="overflow-x-auto scrollbar-hide scroll-smooth"
        >
          <div className="flex gap-6 pb-4 px-4">
            {loading ? (
              Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              items.map((song, idx) => (
                <SongCard
                  key={song.id}
                  song={song}
                  isTop10={category === 'top100' && idx < 10}
                  ranking={idx + 1 < 11 ? idx + 1 : null}
                />
              ))
            )}
          </div>
        </div>

        <button
          onClick={() => scroll('right', category)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  const heroSong = songs[heroIndex] || songs[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white overflow-x-hidden" style={{ backgroundColor: '#0B0B0B' }}>
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-black bg-opacity-95 backdrop-blur-lg border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-black text-red-600">HARRYWOOD</h1>
            <div className="hidden md:flex gap-6 text-sm font-semibold">
              <button className="hover:text-red-600 transition-colors duration-200">Home</button>
              <button className="hover:text-red-600 transition-colors duration-200">Trending</button>
              <button className="hover:text-red-600 transition-colors duration-200">Charts</button>
            </div>
          </div>

          {/* Animated Search Bar */}
          <div className="relative group flex-1 max-w-xs mx-8">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 rounded-full opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300"></div>
            <div className="relative flex items-center bg-gray-900 bg-opacity-90 rounded-full px-4 py-2 border border-gray-700 group-hover:border-red-600 transition-all duration-300">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search songs, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent ml-3 outline-none text-sm w-full placeholder-gray-500"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Carousel */}
      {!loading && heroSong && (
        <div className="relative h-96 md:h-screen overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={heroSong.imageUrl}
              alt={heroSong.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-12 text-white">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-bold">TRENDING NOW</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">{heroSong.title}</h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-2">{heroSong.artist}</p>
              <p className="text-gray-400 mb-8 max-w-xl">{(heroSong.views / 1000000).toFixed(1)}M Views • Rising Rapidly</p>

              <div className="flex gap-4">
                <button
                  onClick={() => watchOnYoutube(heroSong.ytId)}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Now
                </button>
                <button className="bg-gray-600 bg-opacity-50 hover:bg-opacity-75 text-white px-8 py-3 rounded-full font-bold transition-all duration-300">
                  + My List
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-12 flex gap-2">
            {songs.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${idx === heroIndex ? 'bg-red-600 w-8' : 'bg-gray-600 w-2 hover:bg-gray-400'}`}
              ></button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Top 10 Section */}
        <div className="mb-20">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-white mb-2">Top 10 This Week</h2>
            <div className="h-1 w-32 bg-gradient-to-r from-red-600 to-transparent rounded-full"></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(10).fill(0).map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 animate-pulse h-24"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {songs.slice(0, 10).map((song, idx) => (
                <div key={song.id} className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800 hover:border-red-600 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-red-600/20">
                  <div className="flex items-center gap-6">
                    <div className="text-7xl font-black text-red-600 opacity-30">{idx + 1}</div>
                    <div className="flex-1">
                      <div className="text-5xl font-black text-red-600 mb-2">{idx + 1}</div>
                      <h3 className="text-xl font-bold text-white mb-1">{song.title}</h3>
                      <p className="text-gray-400 mb-2">{song.artist}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-red-400 text-sm">{(song.views / 1000000).toFixed(1)}M views</span>
                        <button
                          onClick={() => watchOnYoutube(song.ytId)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-all duration-300"
                        >
                          Watch
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Sections */}
        <ScrollSection
          title="🔥 Trending Now"
          category="trending"
          items={songs.filter(s => s.category === 'trending')}
        />

        <ScrollSection
          title="🎵 Top 100"
          category="top100"
          items={songs.filter(s => s.category === 'top100')}
        />

        <ScrollSection
          title="✨ New Releases"
          category="newReleases"
          items={songs.filter(s => s.category === 'newReleases')}
        />

        <ScrollSection
          title="📺 Most Viewed"
          category="mostViewed"
          items={songs.filter(s => s.category === 'mostViewed')}
        />

        <ScrollSection
          title="📈 Fastest Rising"
          category="rising"
          items={songs.filter(s => s.category === 'rising')}
        />

        {/* Artist Profile Cards */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Top Artists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Luna Echo', verified: true, followers: '2.5M', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' },
              { name: 'Neon Pulse', verified: true, followers: '1.8M', image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=300&h=300&fit=crop' },
              { name: 'Golden Hour', verified: true, followers: '1.2M', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
            ].map((artist, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 via-gray-950 to-black p-8 border border-gray-800 hover:border-red-600 transition-all duration-300 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-red-600 group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  {artist.name}
                  {artist.verified && <Star className="w-5 h-5 text-red-600 fill-current" />}
                </h3>
                <p className="text-gray-400 mb-4">{artist.followers} Followers</p>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-full font-bold transition-all duration-300 transform group-hover:scale-105">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results Modal */}
      {searchQuery && (
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Search Results: "{searchQuery}"</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black border-t border-gray-900 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2024 Harrywood Charts. All rights reserved. | Powered by YouTube API</p>
          <p className="mt-2">Watch on YouTube • Real-time Rankings • Premium Music Charts</p>
        </div>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
