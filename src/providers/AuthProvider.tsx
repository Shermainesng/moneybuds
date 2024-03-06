import { supabase } from "../lib/supabase";
import {Session} from '@supabase/supabase-js'
import { PropsWithChildren, createContext, useEffect, useState, useContext} from "react"

type AuthData = {
    session: Session | null;
    profile: any;
    loading: boolean;
  };
  
  const AuthContext = createContext<AuthData>({
    session: null,
    loading: true,
    profile: null,
  });
  

  export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //when auth provider is mounted
        const fetchSession = async () => {
            const {
              data: { session },
            } = await supabase.auth.getSession();
      
            setSession(session);

            
            if (session) {
                // fetch profile
                const { data } = await supabase
                  .from('')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();
                setProfile(data || null);
              }
        
              setLoading(false);
            };

        fetchSession()

        //subscribe to session updates
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
          });
        }, []);
        return (
            <AuthContext.Provider
              value={{ session, loading, profile }}
            >
              {children}
            </AuthContext.Provider>
          );}

export const useAuth = () => useContext(AuthContext);