import { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    __lofiAudio?: HTMLAudioElement;
  }
}

const STATIONS = [
  { id: 'lofi', label: 'Lofi', stream: 'https://ice2.somafm.com/groovesalad-256-mp3' },
  { id: 'chillhop', label: 'Chillhop', stream: 'https://ice2.somafm.com/beatblender-128-mp3' },
  { id: 'ambient', label: 'Ambient', stream: 'https://ice2.somafm.com/dronezone-256-mp3' },
] as const;

type StationId = (typeof STATIONS)[number]['id'];

const STORAGE_KEY = 'breakpoint:lofi';

function readPrefs(): { volume: number; stationId: StationId } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (typeof p.volume === 'number' && STATIONS.some(s => s.id === p.stationId)) return p;
    }
  } catch {}
  return { volume: 50, stationId: 'lofi' };
}

export default function LofiPlayer() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [playing, setPlaying] = useState(
    () => !!(window.__lofiAudio && !window.__lofiAudio.paused),
  );
  const [volume, setVolume] = useState<number>(() => readPrefs().volume);
  const [stationId, setStationId] = useState<StationId>(() => readPrefs().stationId);

  const volumeRef = useRef(volume);
  const stationIdRef = useRef(stationId);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { stationIdRef.current = stationId; }, [stationId]);

  useEffect(() => {
    if (window.__lofiAudio) {
      window.__lofiAudio.volume = volumeRef.current / 100;
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume, stationId }));
    } catch {}
  }, [volume, stationId]);

  const getAudio = useCallback(() => {
    const station = STATIONS.find(s => s.id === stationIdRef.current) ?? STATIONS[0];
    if (!window.__lofiAudio) {
      window.__lofiAudio = new Audio(station.stream);
      window.__lofiAudio.volume = volumeRef.current / 100;
    }
    return window.__lofiAudio;
  }, []);

  const togglePlay = useCallback(() => {
    const audio = getAudio();
    if (audio.paused) {
      setLoading(true);
      audio
        .play()
        .then(() => setLoading(false))
        .catch(() => { setLoading(false); setPlaying(false); });
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  }, [getAudio]);

  const changeStation = useCallback(
    (id: StationId) => {
      setStationId(id);
      const station = STATIONS.find(s => s.id === id);
      if (!station) return;

      const wasPlaying = window.__lofiAudio && !window.__lofiAudio.paused;

      if (window.__lofiAudio) {
        window.__lofiAudio.pause();
        window.__lofiAudio.src = station.stream;
        window.__lofiAudio.load();
        window.__lofiAudio.volume = volumeRef.current / 100;
      } else {
        window.__lofiAudio = new Audio(station.stream);
        window.__lofiAudio.volume = volumeRef.current / 100;
      }

      if (wasPlaying) {
        setLoading(true);
        window.__lofiAudio
          .play()
          .then(() => setLoading(false))
          .catch(() => { setLoading(false); setPlaying(false); });
        setPlaying(true);
      } else {
        setPlaying(false);
      }
    },
    [],
  );

  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (window.__lofiAudio) window.__lofiAudio.volume = v / 100;
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key !== 'm' && e.key !== 'M') || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) return;
      togglePlay();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePlay]);

  const currentStation = STATIONS.find(s => s.id === stationId) ?? STATIONS[0];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-60 rounded-xl border border-neutral-200 bg-white/95 shadow-xl backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/95">
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[11px] text-neutral-400">focus music</span>
              {playing && (
                <span className="flex items-end gap-0.5" style={{ height: '12px' }}>
                  {[0, 120, 60].map((delay, i) => (
                    <span
                      key={i}
                      className="inline-block w-0.5 animate-bounce rounded-full bg-emerald-500"
                      style={{ height: '100%', animationDelay: `${delay}ms` }}
                    />
                  ))}
                </span>
              )}
            </div>

            <div className="mb-4 flex gap-1">
              {STATIONS.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => changeStation(s.id)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                    stationId === s.id
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? 'Pause' : 'Play'}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                {loading ? (
                  <svg className="h-3 w-3 animate-spin" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
                    <path d="M6 1.5a4.5 4.5 0 014.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ) : playing ? (
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                    <rect x="1.5" y="1.5" width="3.5" height="9" rx="0.75" />
                    <rect x="7" y="1.5" width="3.5" height="9" rx="0.75" />
                  </svg>
                ) : (
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M2.5 1.8l8 4.2-8 4.2V1.8z" />
                  </svg>
                )}
              </button>

              <div className="flex flex-1 items-center gap-2">
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-neutral-400"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8.5 2.5v11a.5.5 0 01-.8.4L3.5 10.5H1.5A1.5 1.5 0 010 9V7a1.5 1.5 0 011.5-1.5h2L7.7 2.1a.5.5 0 01.8.4z" />
                  {volume > 0 && (
                    <path
                      d="M10.5 5.5a3 3 0 010 5"
                      strokeWidth="1.2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                    />
                  )}
                  {volume > 50 && (
                    <path
                      d="M12.5 3.5a5.5 5.5 0 010 9"
                      strokeWidth="1.2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={handleVolume}
                  aria-label="Volume"
                  className="h-1 w-full cursor-pointer accent-neutral-900 dark:accent-white"
                />
              </div>
            </div>

            <p className="mt-3 font-mono text-[10px] text-neutral-400 dark:text-neutral-600">
              press{' '}
              <kbd className="rounded bg-neutral-100 px-1 py-0.5 font-mono dark:bg-neutral-800">
                M
              </kbd>{' '}
              to toggle
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close music player' : 'Open music player'}
        className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium shadow-sm transition ${
          playing
            ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400'
            : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-700'
        }`}
      >
        {playing ? (
          <>
            <span className="flex items-end gap-0.5" style={{ height: '10px' }}>
              {[0, 120, 60].map((delay, i) => (
                <span
                  key={i}
                  className="inline-block w-0.5 animate-bounce rounded-full bg-emerald-500"
                  style={{ height: '100%', animationDelay: `${delay}ms` }}
                />
              ))}
            </span>
            {currentStation.label}
          </>
        ) : (
          <>
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.5 2.5v11a.5.5 0 01-.8.4L3.5 10.5H1.5A1.5 1.5 0 010 9V7a1.5 1.5 0 011.5-1.5h2L7.7 2.1a.5.5 0 01.8.4z" />
              <path
                d="M11 5.5a3 3 0 010 5M13 3.5a5.5 5.5 0 010 9"
                strokeWidth="1.4"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            Focus Music
          </>
        )}
      </button>
    </div>
  );
}
