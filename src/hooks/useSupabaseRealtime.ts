import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useSupabaseRealtime() {
  const queryClient = useQueryClient();
  const [workspaceId, setWorkspaceId] = useState<string | null>(
    localStorage.getItem('hwai_workspace_id')
  );

  useEffect(() => {
    // Poll for workspaceId changes (especially during first load)
    const interval = setInterval(() => {
      const current = localStorage.getItem('hwai_workspace_id');
      if (current !== workspaceId) {
        setWorkspaceId(current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [workspaceId]);

  useEffect(() => {
    if (!supabase) {
      console.log('Supabase realtime not initialized (missing environment variables).');
      return;
    }

    if (!workspaceId) return;

    console.log('[Realtime] Setting up subscription for workspace_id:', workspaceId);

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
  }, [queryClient, workspaceId]);
}
