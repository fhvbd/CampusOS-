import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Sparkles, 
  Settings2, 
  CheckCircle2, 
  Flame, 
  Volume2, 
  VolumeX, 
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Brain,
  Lightbulb
} from 'lucide-react';

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroTimerProps {
  onSuggestBreak?: (breakMinutes: number) => void;
  className?: string;
  defaultMinutes?: number;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  onSuggestBreak,
  className = '',
  defaultMinutes = 25,
}) => {
  // Configurable durations (in minutes)
  const [workDuration, setWorkDuration] = useState<number>(defaultMinutes);
  const [shortBreakDuration, setShortBreakDuration] = useState<number>(5);
  const [longBreakDuration, setLongBreakDuration] = useState<number>(15);

  const [mode, setMode] = useState<PomodoroMode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(defaultMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showBreakSuggestion, setShowBreakSuggestion] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const totalTimeForMode = 
    mode === 'work' ? workDuration * 60 : 
    mode === 'shortBreak' ? shortBreakDuration * 60 : 
    longBreakDuration * 60;

  const progressPercent = Math.min(100, Math.max(0, ((totalTimeForMode - timeLeft) / totalTimeForMode) * 100));

  // Audio tone synthesizer using Web Audio API
  const playAlertSound = (type: 'finish' | 'tick') => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      if (type === 'finish') {
        // Melodic chime: C5 -> E5 -> G5
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.15);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + index * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.15 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + index * 0.15);
          osc.stop(ctx.currentTime + index * 0.15 + 0.5);
        });
      }
    } catch (e) {
      console.warn('Audio Context tone not permitted', e);
    }
  };

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playAlertSound('finish');

      if (mode === 'work') {
        const nextCompleted = completedSessions + 1;
        setCompletedSessions(nextCompleted);
        setShowBreakSuggestion(true);

        // Auto transition to appropriate break
        const isLong = nextCompleted % 4 === 0;
        const nextMode: PomodoroMode = isLong ? 'longBreak' : 'shortBreak';
        const breakTime = isLong ? longBreakDuration : shortBreakDuration;

        if (onSuggestBreak) {
          onSuggestBreak(breakTime);
        }
      } else {
        // Break finished, ready for next work session
        setMode('work');
        setTimeLeft(workDuration * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, workDuration, shortBreakDuration, longBreakDuration, completedSessions]);

  // Switch Mode
  const switchMode = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    setShowBreakSuggestion(false);
    if (newMode === 'work') {
      setTimeLeft(workDuration * 60);
    } else if (newMode === 'shortBreak') {
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setTimeLeft(longBreakDuration * 60);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setShowBreakSuggestion(false);
    if (mode === 'work') {
      setTimeLeft(workDuration * 60);
    } else if (mode === 'shortBreak') {
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setTimeLeft(longBreakDuration * 60);
    }
  };

  const startBreakDirectly = (isLong: boolean = false) => {
    setShowBreakSuggestion(false);
    const targetMode: PomodoroMode = isLong ? 'longBreak' : 'shortBreak';
    setMode(targetMode);
    setTimeLeft((isLong ? longBreakDuration : shortBreakDuration) * 60);
    setIsRunning(true);
  };

  const formatMinutes = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Custom Quick Presets (15m, 25m, 45m, 60m)
  const setQuickWorkDuration = (mins: number) => {
    setWorkDuration(mins);
    if (mode === 'work') {
      setIsRunning(false);
      setTimeLeft(mins * 60);
    }
  };

  return (
    <div className={`glass-panel rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm border border-white/80 ${className}`}>
      
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-linear-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/25 border border-white/40">
            <Timer className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <span>番茄钟深度专注</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 border border-rose-500/20">
                {mode === 'work' ? '专注学习中' : mode === 'shortBreak' ? '短暂休息' : '深度放松'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">科学高效的 25/5 节奏·保持高效学习心流</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="h-8 w-8 rounded-xl bg-white/60 hover:bg-white/95 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all border border-white/80 cursor-pointer shadow-2xs"
            title={isMuted ? '开启提示音' : '静音模式'}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-slate-400" /> : <Volume2 className="h-4 w-4 text-indigo-600" />}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all border border-white/80 cursor-pointer shadow-2xs ${
              showSettings ? 'bg-indigo-600 text-white' : 'bg-white/60 hover:bg-white/95 text-slate-600'
            }`}
            title="自定义时长"
          >
            <Settings2 className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 rounded-xl bg-white/60 hover:bg-white/95 text-slate-600 flex items-center justify-center transition-all border border-white/80 cursor-pointer shadow-2xs"
            title={isExpanded ? '收起' : '展开'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          
          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white/60 rounded-2xl border border-white/80 backdrop-blur-xs">
            <button
              onClick={() => switchMode('work')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'work'
                  ? 'bg-linear-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25 border border-white/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Brain className="h-3.5 w-3.5" />
              <span>专注 ({workDuration}m)</span>
            </button>

            <button
              onClick={() => switchMode('shortBreak')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'shortBreak'
                  ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 border border-white/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Coffee className="h-3.5 w-3.5" />
              <span>短休 ({shortBreakDuration}m)</span>
            </button>

            <button
              onClick={() => switchMode('longBreak')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'longBreak'
                  ? 'bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/25 border border-white/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>长休 ({longBreakDuration}m)</span>
            </button>
          </div>

          {/* Settings Drawer */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-white/80 border border-white/90 backdrop-blur-md space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>自定义专注与休息时长 (分钟)</span>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-indigo-600 hover:text-indigo-800 text-[11px]"
                    >
                      完成设置
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] text-slate-500 font-semibold mb-1">专注时长</label>
                      <input
                        type="number"
                        min="1"
                        max="180"
                        value={workDuration}
                        onChange={e => {
                          const v = Math.max(1, parseInt(e.target.value) || 1);
                          setWorkDuration(v);
                          if (mode === 'work' && !isRunning) setTimeLeft(v * 60);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-white/90 bg-white font-mono font-bold text-slate-800 text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 font-semibold mb-1">短休时长</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={shortBreakDuration}
                        onChange={e => {
                          const v = Math.max(1, parseInt(e.target.value) || 1);
                          setShortBreakDuration(v);
                          if (mode === 'shortBreak' && !isRunning) setTimeLeft(v * 60);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-white/90 bg-white font-mono font-bold text-slate-800 text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 font-semibold mb-1">长休时长</label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={longBreakDuration}
                        onChange={e => {
                          const v = Math.max(1, parseInt(e.target.value) || 1);
                          setLongBreakDuration(v);
                          if (mode === 'longBreak' && !isRunning) setTimeLeft(v * 60);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-white/90 bg-white font-mono font-bold text-slate-800 text-center"
                      />
                    </div>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-400 font-bold shrink-0">快捷预设:</span>
                    {[15, 25, 45, 60].map(mins => (
                      <button
                        key={mins}
                        onClick={() => setQuickWorkDuration(mins)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          workDuration === mins
                            ? 'bg-rose-500 text-white border-rose-500'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {mins}分钟
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Break Suggestion Banner when completed */}
          <AnimatePresence>
            {showBreakSuggestion && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 rounded-2xl bg-linear-to-r from-emerald-500/15 via-teal-500/15 to-blue-500/15 border border-emerald-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                    <Coffee className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-emerald-950">
                      🎉 恭喜完成 1 轮深度专注！
                    </div>
                    <div className="text-[11px] text-emerald-800 font-medium">
                      大脑已消耗一定糖原，建议进行 {shortBreakDuration} 分钟短暂休息、眺望远方或喝一杯温水。
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => startBreakDirectly(false)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black transition-all cursor-pointer shadow-xs"
                  >
                    立即开始休息
                  </button>
                  <button
                    onClick={() => setShowBreakSuggestion(false)}
                    className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    暂不休息
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Display & Controls Area */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-white/70 to-white/40 border border-white/90 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
            
            {/* Progress Arc background bar */}
            <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden mb-4 max-w-xs border border-white/60">
              <motion.div 
                className={`h-full transition-all duration-300 ${
                  mode === 'work' ? 'bg-linear-to-r from-rose-500 to-amber-500' :
                  mode === 'shortBreak' ? 'bg-linear-to-r from-emerald-500 to-teal-500' :
                  'bg-linear-to-r from-indigo-500 to-purple-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Giant Countdown Digits */}
            <div className="flex items-baseline gap-1 font-mono font-black tracking-tight text-slate-900 drop-shadow-xs">
              <span className="text-4xl sm:text-5xl">{formatMinutes(timeLeft)}</span>
            </div>

            <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-500">
              <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>今日已累计完成 <strong className="text-slate-800 font-bold">{completedSessions}</strong> 个专注周期</span>
            </div>

            {/* Play/Pause/Reset Action Buttons */}
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-lg active:scale-95 border border-white/40 ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30'
                    : mode === 'work'
                    ? 'bg-linear-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white shadow-rose-500/30'
                    : 'bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/30'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4.5 w-4.5 fill-current" />
                    <span>暂停计时</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4.5 w-4.5 fill-current" />
                    <span>开始专注</span>
                  </>
                )}
              </button>

              <button
                onClick={resetTimer}
                className="h-11 w-11 rounded-2xl bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-white/90 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                title="重置当前计时"
              >
                <RotateCcw className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
