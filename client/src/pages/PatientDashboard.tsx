import { useState, useEffect } from "react";
import { Layout } from "@/components/ui/Layout";
import { useMemories, useRoutines, useToggleRoutine, useTriggerEmergency } from "@/hooks/use-resources";
import { Mic, Heart, Check, Play, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function PatientDashboard() {
  const { data: memories } = useMemories();
  const { data: routines } = useRoutines();
  const toggleRoutine = useToggleRoutine();
  const triggerEmergency = useTriggerEmergency();
  
  const [sosActive, setSosActive] = useState(false);
  const [showVoiceUI, setShowVoiceUI] = useState(false);

  // Get the most recent memory
  const latestMemory = memories && memories.length > 0 ? memories[memories.length - 1] : null;

  const handleSOS = () => {
    triggerEmergency.mutate(undefined, {
      onSuccess: () => {
        setSosActive(true);
        // In a real app, this would persist until resolved by caretaker
        setTimeout(() => setSosActive(false), 5000); 
      }
    });
  };

  return (
    <Layout variant="patient">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: Memory Hub */}
        <div className="space-y-8">
          <section className="patient-card space-y-6">
            <h2 className="patient-text flex items-center gap-4 text-primary">
              <Heart className="w-10 h-10 fill-current" />
              Memory of the Day
            </h2>
            
            {latestMemory ? (
              <div className="space-y-6">
                <div className="aspect-[4/3] w-full rounded-xl overflow-hidden border-4 border-primary/20 bg-black">
                  <img 
                    src={latestMemory.imageUrl} 
                    alt="Memory" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="bg-muted p-6 rounded-2xl border-2 border-primary/10">
                  <p className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed">
                    "{latestMemory.description}"
                  </p>
                  {latestMemory.aiQuestion && (
                    <div className="mt-6 pt-6 border-t border-primary/20">
                      <p className="text-xl text-primary font-bold mb-2">Think about this:</p>
                      <p className="text-xl md:text-2xl text-foreground/90 italic">
                        {latestMemory.aiQuestion}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-muted rounded-2xl border-2 border-dashed border-muted-foreground/30">
                <p className="text-2xl text-muted-foreground">No photos yet.</p>
              </div>
            )}
          </section>

          <section className="patient-card">
            <h2 className="patient-text mb-6 text-primary">My Daily List</h2>
            <div className="space-y-4">
              {routines?.map((routine) => (
                <button
                  key={routine.id}
                  onClick={() => toggleRoutine.mutate(routine.id)}
                  className={cn(
                    "w-full p-6 rounded-2xl border-4 text-left transition-all flex items-center justify-between group",
                    routine.isCompleted 
                      ? "bg-green-900/30 border-green-500/50 opacity-60" 
                      : "bg-muted border-muted-foreground/30 hover:border-primary hover:bg-muted/80"
                  )}
                >
                  <span className={cn(
                    "text-2xl md:text-3xl font-medium",
                    routine.isCompleted ? "text-green-500 line-through decoration-4" : "text-foreground"
                  )}>
                    {routine.task}
                  </span>
                  <div className={cn(
                    "w-12 h-12 rounded-full border-4 flex items-center justify-center transition-colors",
                    routine.isCompleted 
                      ? "bg-green-500 border-green-500" 
                      : "border-muted-foreground group-hover:border-primary"
                  )}>
                    {routine.isCompleted && <Check className="w-8 h-8 text-black font-bold" />}
                  </div>
                </button>
              ))}
              {routines?.length === 0 && (
                <p className="text-xl text-muted-foreground italic">Nothing to do today! Relax.</p>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Action Center */}
        <div className="space-y-8 flex flex-col">
          
          {/* Voice Assistant */}
          <button 
            onClick={() => setShowVoiceUI(true)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-3xl p-8 shadow-xl transform active:scale-95 transition-all flex flex-col items-center gap-4 group border-b-8 border-blue-800 active:border-b-0 active:translate-y-2"
          >
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-12 h-12 text-white" />
            </div>
            <span className="text-4xl font-bold tracking-wide">Talk to me</span>
          </button>

          {/* SOS Button - Takes up remaining vertical space or is massive */}
          <div className="flex-1 min-h-[300px]">
            <AnimatePresence mode="wait">
              {sosActive ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full w-full bg-red-600 rounded-3xl p-8 flex flex-col items-center justify-center text-center animate-pulse-slow border-4 border-red-400 shadow-[0_0_50px_rgba(220,38,38,0.5)]"
                >
                  <AlertCircle className="w-32 h-32 text-white mb-6" />
                  <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-wider mb-4">
                    HELP IS ON<br/>THE WAY
                  </h2>
                  <p className="text-2xl text-white/90 font-medium">Notified Caretaker</p>
                </motion.div>
              ) : (
                <button
                  onClick={handleSOS}
                  disabled={triggerEmergency.isPending}
                  className="h-full w-full bg-destructive hover:bg-red-500 text-destructive-foreground rounded-3xl p-8 shadow-2xl transform active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-6 border-b-[12px] border-red-900 active:border-b-0 active:translate-y-3"
                >
                  <AlertCircle className="w-32 h-32 md:w-40 md:h-40" />
                  <span className="text-6xl md:text-8xl font-black tracking-widest uppercase">
                    SOS
                  </span>
                  <span className="text-2xl font-bold opacity-80 uppercase tracking-widest">
                    Emergency Help
                  </span>
                </button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Voice UI Overlay Placeholder */}
      <AnimatePresence>
        {showVoiceUI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-8 backdrop-blur-xl"
          >
            <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 animate-pulse flex items-center justify-center mb-12 shadow-[0_0_100px_rgba(59,130,246,0.5)]">
              <Mic className="w-20 h-20 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-white mb-8 text-center">I'm listening...</h2>
            <p className="text-2xl text-blue-200 mb-12 text-center max-w-2xl">
              "What day is it today?" <br/>
              "Show me photos of my grandkids."
            </p>
            <button 
              onClick={() => setShowVoiceUI(false)}
              className="px-12 py-6 bg-white/10 border-2 border-white/30 text-white text-2xl font-bold rounded-2xl hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
