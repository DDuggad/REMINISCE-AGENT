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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 patient-view">
        
        {/* LEFT COLUMN: Memory Hub */}
        <div className="space-y-8">
          <section className="card-glass p-8 space-y-6">
            <h2 className="flex items-center gap-4 text-[#1C4D8D] font-black text-5xl">
              <Heart className="w-16 h-16 fill-current" />
              Memory Hub
            </h2>
            
            {latestMemory ? (
              <div className="space-y-8">
                <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden border-8 border-[#4988C4]/20 bg-black shadow-2xl">
                  <img 
                    src={latestMemory.imageUrl} 
                    alt="Memory" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="bg-[#E8F4F8] p-8 rounded-[32px] border-4 border-[#1C4D8D]/20 shadow-lg">
                  <p className="text-4xl md:text-5xl font-bold text-[#0F2854] leading-tight">
                    "{latestMemory.description}"
                  </p>
                  {latestMemory.aiQuestion && (
                    <div className="mt-8 pt-8 border-t-4 border-[#1C4D8D]/20">
                      <p className="text-2xl text-[#1C4D8D] font-black mb-4 uppercase tracking-wider">Think about this:</p>
                      <p className="text-3xl md:text-4xl text-[#0F2854] italic font-medium leading-relaxed">
                        {latestMemory.aiQuestion}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center bg-[#E8F4F8] rounded-[32px] border-4 border-dashed border-[#4988C4]/30 shadow-inner">
                <p className="text-4xl text-[#5D6D7E] font-bold">Waiting for memories...</p>
              </div>
            )}
          </section>

          <section className="card-glass p-8">
            <h2 className="text-5xl font-black text-[#1C4D8D] mb-8 uppercase tracking-tight">Today's Routine</h2>
            <div className="space-y-6">
              {routines?.map((routine) => (
                <button
                  key={routine.id}
                  onClick={() => toggleRoutine.mutate(routine.id)}
                  className={cn(
                    "w-full p-8 rounded-[32px] border-8 text-left transition-all flex items-center justify-between active-elevate-2",
                    routine.isCompleted 
                      ? "bg-[#D5F4E6]/50 border-[#27AE60]/50 opacity-60" 
                      : "bg-[#E8F4F8] border-[#4988C4]/30 hover:border-[#1C4D8D] hover:bg-white"
                  )}
                >
                  <span className={cn(
                    "text-4xl font-black",
                    routine.isCompleted ? "text-[#27AE60] line-through decoration-8" : "text-[#0F2854]"
                  )}>
                    {routine.task}
                  </span>
                  <div className={cn(
                    "w-16 h-16 rounded-full border-8 flex items-center justify-center",
                    routine.isCompleted 
                      ? "bg-[#27AE60] border-[#27AE60]" 
                      : "border-[#5D6D7E] group-hover:border-[#1C4D8D]"
                  )}>
                    {routine.isCompleted && <Check className="w-10 h-10 text-white stroke-[5px]" />}
                  </div>
                </button>
              ))}
              {routines?.length === 0 && (
                <p className="text-3xl text-[#5D6D7E] italic font-bold text-center py-10">All done for today! Good job!</p>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Action Center */}
        <div className="space-y-12 flex flex-col">
          
          {/* Voice Assistant */}
          <button 
            onClick={() => setShowVoiceUI(true)}
            className="patient-button-voice w-full p-12 shadow-2xl flex flex-col items-center gap-8 group active-elevate-2"
          >
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
            <span className="text-5xl font-black uppercase tracking-widest">Talk to Assistant</span>
          </button>

          {/* SOS Button */}
          <div className="flex-1 min-h-[400px]">
            <AnimatePresence mode="wait">
              {sosActive ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full w-full bg-[#E74C3C] rounded-[48px] p-12 flex flex-col items-center justify-center text-center border-[12px] border-white shadow-[0_0_80px_rgba(231,76,60,0.6)]"
                >
                  <AlertCircle className="w-48 h-48 text-white mb-8 animate-bounce" strokeWidth={3} />
                  <h2 className="text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                    HELP IS<br/>COMING
                  </h2>
                  <p className="text-3xl text-white font-black uppercase tracking-widest">Alert Sent!</p>
                </motion.div>
              ) : (
                <button
                  onClick={handleSOS}
                  disabled={triggerEmergency.isPending}
                  className="patient-button-sos h-full w-full rounded-[48px] flex flex-col items-center justify-center gap-10 shadow-[0_30px_60px_rgba(231,76,60,0.4)] active:translate-y-4"
                >
                  <AlertCircle className="w-48 h-48 md:w-56 md:h-56" strokeWidth={4} />
                  <span className="text-[120px] font-black tracking-tighter leading-none">
                    SOS
                  </span>
                  <span className="text-3xl font-black uppercase tracking-[1em] opacity-80">
                    HELP
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
