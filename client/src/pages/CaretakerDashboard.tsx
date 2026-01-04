import { useState } from "react";
import { Layout } from "@/components/ui/Layout";
import { useMemories, useCreateMemory, useRoutines, useCreateRoutine, useMedications, useCreateMedication, useEmergencyLogs } from "@/hooks/use-resources";
import { format } from "date-fns";
import { Plus, Upload, CheckCircle, Clock, AlertTriangle, Pill, Activity, Calendar } from "lucide-react";
import { motion } from "framer-motion";

// --- Components for specific sections ---

function MemorySection() {
  const { data: memories } = useMemories();
  const createMemory = useCreateMemory();
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMemory.mutate({ imageUrl, description, aiQuestion: "Who is in this photo?" }, {
      onSuccess: () => {
        setIsOpen(false);
        setImageUrl("");
        setDescription("");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Upload className="w-6 h-6 text-primary" />
          Memory Bank
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Photo
        </button>
      </div>

      {isOpen && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
            <input
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description / Context</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none"
              placeholder="Who is this? When was it taken?"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMemory.isPending}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {createMemory.isPending ? "Uploading..." : "Save Memory"}
            </button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories?.map((memory) => (
          <div key={memory.id} className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
            <img src={memory.imageUrl} alt={memory.description || "Memory"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <p className="text-white font-medium">{memory.description}</p>
              <p className="text-white/70 text-sm mt-1">AI Prompt: {memory.aiQuestion}</p>
            </div>
          </div>
        ))}
        {memories?.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
            <Upload className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No memories uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RoutineSection() {
  const { data: routines } = useRoutines();
  const createRoutine = useCreateRoutine();
  const [task, setTask] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;
    createRoutine.mutate({ task, isCompleted: false }, {
      onSuccess: () => setTask("")
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
        <CheckCircle className="w-5 h-5 text-emerald-500" />
        Daily Routine
      </h2>
      
      <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px]">
        {routines?.map((routine) => (
          <div key={routine.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${routine.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
              {routine.isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-sm font-medium ${routine.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
              {routine.task}
            </span>
          </div>
        ))}
        {routines?.length === 0 && <p className="text-center text-slate-400 text-sm py-4">No routines set.</p>}
      </div>

      <form onSubmit={handleAdd} className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add new task..."
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button 
          disabled={createRoutine.isPending || !task.trim()}
          className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

function MedicationSection() {
  const { data: medications } = useMedications();
  const createMed = useCreateMedication();
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !time.trim()) return;
    createMed.mutate({ name, time, taken: false }, {
      onSuccess: () => { setName(""); setTime(""); }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
        <Pill className="w-5 h-5 text-indigo-500" />
        Medication
      </h2>

      <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px]">
        {medications?.map((med) => (
          <div key={med.id} className="flex items-center justify-between p-3 rounded-lg bg-indigo-50/50 border border-indigo-100">
            <div>
              <p className="font-semibold text-slate-800 text-sm">{med.name}</p>
              <div className="flex items-center gap-1 text-xs text-indigo-600 mt-1">
                <Clock className="w-3 h-3" />
                {med.time}
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-bold ${med.taken ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {med.taken ? 'TAKEN' : 'PENDING'}
            </div>
          </div>
        ))}
        {medications?.length === 0 && <p className="text-center text-slate-400 text-sm py-4">No medications scheduled.</p>}
      </div>

      <form onSubmit={handleAdd} className="mt-4 pt-4 border-t border-slate-100 space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Medication name..."
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <div className="flex gap-2">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button 
            disabled={createMed.isPending}
            className="px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium text-sm"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

function EmergencyLogSection() {
  const { data: logs } = useEmergencyLogs();

  return (
    <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 col-span-1 lg:col-span-2">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        Emergency Log
      </h2>
      <div className="bg-red-50/50 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-red-100/50 text-red-900 font-semibold">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-100">
            {logs?.map((log) => (
              <tr key={log.id}>
                <td className="p-3 text-slate-700">
                  {log.timestamp ? format(new Date(log.timestamp), "MMM d, h:mm a") : "Unknown"}
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${log.resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800 animate-pulse'}`}>
                    {log.resolved ? 'Resolved' : 'ACTIVE SOS'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {!log.resolved && (
                    <button className="text-xs font-bold text-red-600 hover:text-red-800 underline">
                      Mark Resolved
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {logs?.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-400">
                  No emergency alerts recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CaretakerDashboard() {
  const { toast } = useToast();
  const [activePatientId, setActivePatientId] = useState<number | null>(null);

  // Fetch all patients linked to this caretaker
  const { data: users } = useQuery<any[]>({
    queryKey: ["/api/user/patients"],
  });

  const patientId = activePatientId || (users?.[0]?.id);

  const { data: memories } = useQuery<Memory[]>({
    queryKey: [api.memories.list.path, { patientId }],
    enabled: !!patientId,
  });

  const { data: routines } = useQuery<Routine[]>({
    queryKey: [api.routines.list.path, { patientId }],
    enabled: !!patientId,
  });

  const { data: medications } = useQuery<Medication[]>({
    queryKey: [api.medications.list.path, { patientId }],
    enabled: !!patientId,
  });

  const { data: logs } = useQuery<EmergencyLog[]>({
    queryKey: [api.emergency.list.path, { patientId }],
    enabled: !!patientId,
  });

  const uploadMemory = useMutation({
    mutationFn: async (url: string) => {
      return await apiRequest("POST", api.memories.create.path, { imageUrl: url, patientId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.memories.list.path, { patientId }] });
      toast({ title: "Memory uploaded" });
    }
  });

  return (
    <Layout variant="caretaker">
      <div className="min-h-screen" style={{ 
        background: 'linear-gradient(135deg, #F8FBFD 0%, #E8F4F8 100%)',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <main className="space-y-8">
          {/* Patient Selection Card */}
          <div className="card-glass p-6 border-2 border-[#E8F4F8] shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-block px-3 py-1 rounded-full mb-3 bg-[#E8F4F8]">
                  <p className="text-xs font-bold text-[#1C4D8D]">SELECT PATIENT</p>
                </div>
                <div className="flex gap-4">
                  {users?.map(u => (
                    <Button 
                      key={u.id}
                      onClick={() => setActivePatientId(u.id)}
                      variant={patientId === u.id ? "default" : "outline"}
                      className={`rounded-xl px-6 ${patientId === u.id ? 'btn-primary' : 'border-[#4988C4] text-[#1C4D8D]'}`}
                    >
                      {u.username}
                    </Button>
                  ))}
                  {users?.length === 0 && <p className="text-sm text-slate-500">No patients linked to your account.</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency Section */}
            <div className="card-glass p-8 border-2 border-[#E74C3C] shadow-xl hover-elevate transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#FADBD8] flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-8 h-8 text-[#E74C3C]" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0F2854]">Emergency Protocol</h3>
                  <p className="text-sm text-[#5D6D7E]">Active alerts and critical info</p>
                </div>
              </div>
              <div className="space-y-3">
                {logs?.length ? logs.slice(0, 3).map(log => (
                  <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#FADBD8]/50 border-2 border-[#E74C3C]/20">
                    <span className="font-bold text-[#C0392B]">SOS TRIGGERED</span>
                    <span className="text-sm font-medium text-[#5D6D7E]">{new Date(log.timestamp!).toLocaleString()}</span>
                  </div>
                )) : (
                  <p className="text-[#5D6D7E] font-medium">No recent emergency alerts.</p>
                )}
              </div>
            </div>

            {/* Routine Tracker */}
            <div className="card-glass p-8 border-2 border-[#4988C4] shadow-xl hover-elevate transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F4F8] flex items-center justify-center shadow-lg">
                  <Activity className="w-8 h-8 text-[#1C4D8D]" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0F2854]">Daily Routine</h3>
                  <p className="text-sm text-[#5D6D7E]">Track patient daily activities</p>
                </div>
              </div>
              <div className="space-y-4">
                {routines?.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border-2 border-[#E8F4F8]">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${r.isCompleted ? 'bg-[#27AE60]' : 'bg-[#E67E22]'}`} />
                      <span className="font-bold text-[#0F2854]">{r.task}</span>
                    </div>
                    <span className={`text-sm font-bold ${r.isCompleted ? 'text-[#27AE60]' : 'text-[#E67E22]'}`}>
                      {r.isCompleted ? "Completed" : "Pending"}
                    </span>
                  </div>
                ))}
                {routines?.length === 0 && <p className="text-slate-400 text-sm italic">No routines scheduled.</p>}
              </div>
            </div>
          </div>

          {/* Medicine Scheduler */}
          <div className="card-glass p-8 border-2 border-[#27AE60] shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#D5F4E6] flex items-center justify-center shadow-lg">
                <Pill className="w-8 h-8 text-[#27AE60]" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#0F2854]">Medicine Scheduler</h3>
                <p className="text-sm text-[#5D6D7E]">Manage dosage and schedules</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {medications?.map(m => (
                <div key={m.id} className="p-6 rounded-3xl bg-white border-2 border-[#D5F4E6] shadow-md hover-elevate transition-all">
                  <p className="text-xs font-bold text-[#1E8449] mb-1">TIME: {m.time}</p>
                  <p className="text-xl font-bold text-[#0F2854] mb-2">{m.name}</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${m.taken ? 'bg-[#27AE60]' : 'bg-[#E74C3C]'}`} />
                    <p className={`text-sm font-bold ${m.taken ? 'text-[#27AE60]' : 'text-[#E74C3C]'}`}>
                      {m.taken ? "Taken" : "Missed"}
                    </p>
                  </div>
                </div>
              ))}
              {medications?.length === 0 && <p className="text-slate-400 text-sm italic">No medications scheduled.</p>}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
