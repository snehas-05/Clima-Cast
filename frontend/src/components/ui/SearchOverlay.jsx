import React from 'react';

export default function SearchOverlay({ results, loading, onClose, onQueryChange }) {
  if (!results && !loading) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="glass-card rounded-[2rem] shadow-2xl border-white/10 overflow-hidden bg-surface-container-high/90 backdrop-blur-xl">
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center py-8 space-y-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-on-surface-variant animate-pulse font-medium">Processing your query...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Answer Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span className="text-[10px] font-black tracking-widest uppercase">AI INSIGHT</span>
                </div>
                <p className="text-body-lg text-on-surface font-semibold leading-relaxed">
                  {results.answer}
                </p>
              </div>

              {/* Data Preview if available */}
              {results.data && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">Current State</p>
                    <p className="text-h3-card-title text-on-surface">{results.data.temp}°</p>
                  </div>
                  <span className="material-symbols-outlined text-4xl text-primary">{results.data.icon}</span>
                </div>
              )}

              {/* Related Questions */}
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-3 tracking-wider">Related Questions</p>
                <div className="flex flex-wrap gap-2">
                  {results.related_questions?.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => onQueryChange(q)}
                      className="px-4 py-2 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/10 text-body-sm text-primary transition-all hover:scale-[1.02] text-left flex items-center gap-2 group/btn"
                    >
                      <span className="material-symbols-outlined text-sm opacity-50 group-hover/btn:opacity-100 transition-opacity">search</span>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-3 bg-white/5 border-t border-white/5 flex justify-between items-center">
          <p className="text-[10px] text-on-surface-variant italic">Powered by Clima-Cast Intelligence</p>
          <button 
            onClick={onClose}
            className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
