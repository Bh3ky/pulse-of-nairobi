### example for the sticky clock

```code
import React from 'react';
import { motion } from 'framer-motion';

interface StickyClockProps {
  startTime: string;
  endTime: string;
  progress: number; // 0 to 1
  quote: string;
}

const StickyClock: React.FC<StickyClockProps> = ({ startTime, endTime, progress, quote }) => {
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
      {/* Clock Pill */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl p-1.5 shadow-2xl flex items-center gap-4">
        
        {/* Start Time */}
        <div className="px-4 py-1.5 bg-slate-800 rounded-lg min-w-[100px] text-center">
          <span className="font-mono text-lg text-slate-100 font-bold tracking-tight">{startTime}</span>
        </div>

        {/* Scrubber Track */}
        <div className="relative w-48 h-8 flex items-center">
          {/* Ticks */}
          <div className="absolute inset-0 flex justify-between items-center px-1">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className={`w-[1px] ${i % 5 === 0 ? 'h-4 bg-slate-500' : 'h-2 bg-slate-700'}`} 
              />
            ))}
          </div>
          
          {/* Active Indicator (The "Orange" part mentioned) */}
           {/* Note: In the prompt image, it looks like a bubble above the track. Let's replicate that style. */}
           <div className="absolute top-1/2 -translate-y-1/2 w-full px-1">
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 -mt-7 -ml-6 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap z-10 shadow-lg"
                style={{ left: `${progress * 100}%` }}
              >
                 Now
              </motion.div>
              <motion.div 
                className="h-full w-[2px] bg-orange-500 absolute top-0 h-4 -mt-2 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                style={{ left: `${progress * 100}%` }}
              />
           </div>
        </div>

        {/* End Time */}
        <div className="px-4 py-1.5 bg-slate-800 rounded-lg min-w-[100px] text-center">
          <span className="font-mono text-lg text-slate-100 font-bold tracking-tight">{endTime}</span>
        </div>
      </div>

      {/* Context Quote */}
      <motion.div 
        key={quote}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 bg-black/50 backdrop-blur-sm px-4 py-1 rounded-full border border-white/10"
      >
        <p className="text-xs text-orange-200/80 font-medium uppercase tracking-widest text-center">
          {quote}
        </p>
      </motion.div>
    </div>
  );
};

export default StickyClock;
```

### example code