import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { getContents } from '../lib/api';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const data = await getContents();
        if (data.data && data.data.length > 0) {
          const fetchedMusic = data.data
            .filter(item => item.category_id === 3)
            .map((item) => {
              let artist = 'Musik';
              let lyrics = '';
              if (item.description) {
                if (item.description.includes('Artis:')) {
                  const parts = item.description.split('\n');
                  artist = parts[0].replace('Artis: ', '').trim();
                  if (parts.length > 1) {
                    lyrics = parts.slice(1).join('\n').replace('Deskripsi: ', '').trim();
                  }
                } else {
                  artist = item.description.substring(0, 50) + '...';
                  lyrics = item.description;
                }
              }
              return {
                id: item.id,
                slug: item.id.toString(),
                title: item.title,
                artist: artist,
                lyrics: lyrics,
                image: item.thumbnail || '/lagutaklagisama.svg',
                audioUrl: item.url !== '#' ? item.url : ''
              };
            });
          setPlaylist(fetchedMusic);
        }
      } catch (err) {
        console.error("Failed to load playlist", err);
      }
    }
    fetchPlaylist();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Audio play failed:", e);
          if (e.name !== 'AbortError') {
            setIsPlaying(false);
          }
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const playTrack = (track) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert("Silakan login terlebih dahulu untuk memutar musik.");
        window.location.href = '/login';
        return;
      }
    }
    if (currentTrack && currentTrack.id === track.id) {
      setIsPlaying(true);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const stopTrack = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
  };

  const nextTrack = () => {
    if (playlist.length === 0 || !currentTrack) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % playlist.length;
      playTrack(playlist[nextIndex]);
    }
  };

  const previousTrack = () => {
    if (playlist.length === 0 || !currentTrack) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      playTrack(playlist[prevIndex]);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const seek = (time) => {
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      playlist,
      playTrack,
      togglePlay,
      stopTrack,
      nextTrack,
      previousTrack,
      seek
    }}>
      {children}
      {currentTrack && currentTrack.audioUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={nextTrack}
        />
      )}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
