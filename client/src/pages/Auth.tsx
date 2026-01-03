import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["caretaker", "patient"]).optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const [_, setLocation] = useLocation();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "caretaker",
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isLogin) {
        await login.mutateAsync({ username: data.username, password: data.password });
      } else {
        await register.mutateAsync({ 
          username: data.username, 
          password: data.password, 
          role: data.role || "caretaker" 
        });
      }
    } catch (error) {
      // Error is handled by the mutation and toast
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 opacity-90" />
        <div className="absolute inset-0 opacity-10 pattern-dots" />
        
        {/* Abstract decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <span className="text-4xl font-display font-bold">R</span>
          </div>
          <h1 className="text-5xl font-display font-bold leading-tight">
            Preserving memories, <br/>
            <span className="text-blue-200">connecting hearts.</span>
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed font-light">
            Reminisce AI bridges the gap between care and connection. Empowering patients with independence and caretakers with peace of mind.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-display font-bold text-slate-900">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin 
                ? "Enter your credentials to access the dashboard." 
                : "Join us to start managing care effectively."}
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Username</label>
                <input
                  {...form.register("username")}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-slate-400"
                  placeholder="e.g. sarah_connor"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  {...form.register("password")}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>

              <AnimatePresence initial={false}>
                {!isLogin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 pt-2">
                      <label className="text-sm font-medium text-slate-700">I am a...</label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="cursor-pointer">
                          <input
                            type="radio"
                            value="caretaker"
                            {...form.register("role")}
                            className="peer sr-only"
                          />
                          <div className="p-4 rounded-xl border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 transition-all text-center">
                            <span className="font-semibold block text-slate-900 peer-checked:text-primary">Caretaker</span>
                          </div>
                        </label>
                        <label className="cursor-pointer">
                          <input
                            type="radio"
                            value="patient"
                            {...form.register("role")}
                            className="peer sr-only"
                          />
                          <div className="p-4 rounded-xl border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 transition-all text-center">
                            <span className="font-semibold block text-slate-900 peer-checked:text-primary">Patient</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={login.isPending || register.isPending}
              className="w-full py-4 px-6 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {login.isPending || register.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-500 hover:text-primary font-medium transition-colors"
            >
              {isLogin ? "New to Reminisce? Create an account" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
