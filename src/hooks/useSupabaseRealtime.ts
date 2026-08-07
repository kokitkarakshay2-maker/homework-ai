import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useSupabaseRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!supabase) {
      console.log('Supabase realtime not initialized (missing environment variables).');
      return;
    }

    const workspaceId = localStorage.getItem('hwai_workspace_id');
    if (!workspaceId) return;

    // Listen to changes on the homework_history table for this specific workspace
    const channel = supabase
      .channel('history-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'homework_history',
          filter: `workspace_id=eq.${workspaceId}`
        },
        (payload) => {
          console.log('[Realtime] Change received!', payload);
          // Invalidate the history query to trigger a refetch
          queryClient.invalidateQueries({ queryKey: ['history'] });
        }
      )
      .subscribe((status) => {
        console.log(`[Realtime] Subscription status: ${status}`);
      });

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [queryClient]);
}
