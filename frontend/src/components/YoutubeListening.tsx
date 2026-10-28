import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Youtube, Headphones, ExternalLink, PlayCircle } from 'lucide-react';
import { DictationMode } from './DictationMode';
import { videoApi } from '../services/api';
import { VideoItem } from '../types';

const LEVEL_COLORS: Record<number, string> = {
  0: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
  1: 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400',
  2: 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400',
  3: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400',
  4: 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400',
  5: 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400',
  6: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400',
};

interface Props {
  selectedLevel: number;
}

export const YoutubeListening: React.FC<Props> = ({ selectedLevel }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<number>(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    videoApi.list().then(data => {
      setVideos(data);
      setVideosLoading(false);
    }).catch(() => setVideosLoading(false));
  }, []);

  useEffect(() => {
    setLevelFilter(selectedLevel === 0 ? 0 : selectedLevel);
  }, [selectedLevel]);

  const filtered = useMemo(
    () => levelFilter === 0 ? videos : videos.filter(v => v.hsk_level === levelFilter),
    [videos, levelFilter]
  );
  const activeVideo = useMemo(
    () => activeVideoId ? videos.find(v => v.video_id === activeVideoId) ?? null : null,
    [videos, activeVideoId]
  );

  return (
    <div className="max-w-7xl mx-auto my-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Headphones className="w-6 h-6 text-red-500" />
          <span>Luyện Nghe Qua YouTube</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Chọn video → transcript tự tải → luyện chép chính tả từng câu
        </p>
      </div>

      {/* Channel banner */}
      <a
        href="https://www.youtube.com/@ChineseDailyPodcast/playlists"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 hover:border-red-400 transition-colors group"
      >
        <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
          <Youtube className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-red-700 dark:text-red-300 group-hover:underline">
            Chinese Daily Podcast
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {videos.length} video tuyển chọn • Podcast tiếng Trung HSK 1–6
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-red-400 flex-shrink-0" />
      </a>

      {/* Level filter tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[0, 1, 2, 3, 4, 5, 6].map((lvl) => {
          const count = lvl === 0 ? videos.length : videos.filter((v) => v.hsk_level === lvl).length;
          return (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                levelFilter === lvl
                  ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-red-300'
              }`}
            >
              {lvl === 0 ? `Tất Cả (${count})` : `HSK ${lvl} (${count})`}
            </button>
          );
        })}
      </div>

      {/* Main layout: Player + list */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Player Column */}
        <div className="lg:col-span-3">
          {activeVideoId && activeVideo ? (
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
              {/* Video iframe */}
              <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  ref={iframeRef}
                  key={activeVideoId}
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&enablejsapi=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Compact info bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex-1 min-w-0 pr-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                    {activeVideo.title}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                    <Youtube className="w-3 h-3 text-red-400" />
                    <span>{activeVideo.channel}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${LEVEL_COLORS[activeVideo.hsk_level]}`}>
                    HSK {activeVideo.hsk_level}
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Mở trên YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* DictationMode inline — auto-fetches transcript on mount */}
              <div className="p-5">
                <DictationMode
                  key={activeVideoId}
                  videoId={activeVideoId}
                  videoTitle={activeVideo.title}
                  hskLevel={activeVideo.hsk_level}
                  iframeRef={iframeRef}
                  autoFetch
                  onClose={() => setActiveVideoId(null)}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center p-16 space-y-4 min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center">
                <PlayCircle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300">Chọn một video để bắt đầu</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Nhấp vào video bên phải → transcript tự tải → luyện nghe từng câu
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Video List Column */}
        <div className="lg:col-span-2 space-y-2 max-h-[760px] overflow-y-auto pr-1">
          {videosLoading ? (
            <div className="text-center py-10 text-slate-400 text-sm">Đang tải danh sách video...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Chưa có video cho cấp độ này.
            </div>
          ) : (
            filtered.map((video) => {
              const isActive = video.video_id === activeVideoId;
              return (
                <div
                  key={video.id}
                  onClick={() => setActiveVideoId(video.video_id)}
                  className={`group relative p-4 rounded-2xl border cursor-pointer transition-all ${
                    isActive
                      ? 'border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-950/30 shadow-md shadow-red-500/10'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-300 dark:hover:border-red-900/60 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                      <img
                        src={`https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`}
                        alt={video.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-red-600/70 flex items-center justify-center">
                          <PlayCircle className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-semibold line-clamp-2 leading-snug ${
                        isActive ? 'text-red-700 dark:text-red-300' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {video.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center space-x-1">
                        <Youtube className="w-3 h-3 text-red-400" />
                        <span className="truncate">{video.channel}</span>
                      </p>
                      <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${LEVEL_COLORS[video.hsk_level]}`}>
                        HSK {video.hsk_level}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
