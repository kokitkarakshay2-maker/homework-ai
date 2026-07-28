import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { homeworkService, type HistoryResponseSchema, type HistoryListResponse } from '../services/homeworkService';

export const useAnalyzeHomework = () => {
  const queryClient = useQueryClient();
  return useMutation<HistoryResponseSchema, Error, { file: File; signal?: AbortSignal }>({
    mutationFn: ({ file, signal }) => homeworkService.analyze(file, signal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
};

export const useHistoryQuery = (skip: number = 0, limit: number = 20) => {
  return useQuery<HistoryListResponse, Error>({
    queryKey: ['history', skip, limit],
    queryFn: () => homeworkService.getHistoryList(skip, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useHistoryDetailQuery = (id: string | null) => {
  return useQuery<HistoryResponseSchema, Error>({
    queryKey: ['historyDetail', id],
    queryFn: () => homeworkService.getHistoryDetail(id!),
    enabled: !!id,
  });
};

export const useDeleteHistoryMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => homeworkService.deleteHistory(id),
    onMutate: async (deletedId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['history'] });
      
      // Snapshot previous value
      const previousHistory = queryClient.getQueriesData<HistoryListResponse>({ queryKey: ['history'] });
      
      // Optimistically update caches
      queryClient.setQueriesData<HistoryListResponse>({ queryKey: ['history'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter(item => item.id !== deletedId),
          total: Math.max(0, old.total - 1)
        };
      });
      
      return { previousHistory };
    },
    onError: (_err, _deletedId, context: any) => {
      // Rollback on error
      if (context?.previousHistory) {
        context.previousHistory.forEach(([queryKey, data]: any) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure sync
      queryClient.invalidateQueries({ queryKey: ['history'] });
    }
  });
};
