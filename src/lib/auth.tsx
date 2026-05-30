import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase-browser";

type Role = "admin" | "membro" | null;

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  role: Role;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const loadRole = async () => {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.rpc("get_my_role");
      if (error) {
        console.error("Erro ao carregar role:", error);
        setRole(null);
        return;
      }
      if (data === "admin") setRole("admin");
      else if (data) setRole("membro");
      else setRole(null);
    } catch (e) {
      console.error("Exceção ao carregar role:", e);
      setRole(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    getSupabase().then((supabase) => {
      if (!mounted) return;

      supabase.auth.getSession().then(({ data }) => {
        if (!mounted) return;
        setSession(data.session);
        setUser(data.session?.user ?? null);
        if (data.session?.user) {
          loadRole().finally(() => {
            if (mounted) setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });

      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          loadRole();
        } else {
          setRole(null);
        }
      });

      return () => sub.subscription.unsubscribe();
    });

    return () => { mounted = false; };
  }, []);

  const signIn = async (email: string, password: string) => {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
