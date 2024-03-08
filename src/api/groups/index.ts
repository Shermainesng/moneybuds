import { supabase } from "@/src/lib/supabase";
import {useQuery} from '@tanstack/react-query'

export const useGetGroups= (userId:any) => {
    return useQuery({
        queryKey: ['groups', userId], 
        queryFn:async () => {
            const { data, error } = await supabase
                .from('groups')
                .select('friend_id')
                .eq('user_id', userId);
        
            // console.log("friends list", data);
        
            if (error) {
                throw new Error(error.message);
            }
        
            return data.map(d => d.friend_id)
        }
    });
  };