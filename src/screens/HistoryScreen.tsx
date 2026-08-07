import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Trash2, Image as ImageIcon } from 'lucide-react';
import { useHistoryQuery, useDeleteHistoryMutation, useDeleteAllHistoryMutation } from '../hooks/useHomework';
import { AppShell, AppContent } from '../components/layout/AppShell';

export default function HistoryScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, isLoading, isError, refetch } = useHistoryQuery(0, 50);
  const deleteMutation = useDeleteHistoryMutation();
  const deleteAllMutation = useDeleteAllHistoryMutation();

  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const historyItems = data?.items || [];
  
  const filteredHistory = historyItems.filter(item => {
    const title = item.processed_response?.worksheet_title || item.subject || 'Unknown';
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (item.subject && item.subject.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this history item?")) {
      deleteMutation.mutate(id);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteAll = () => {
    deleteAllMutation.mutate(undefined, {
      onSuccess: () => {
        setShowModal(false);
        showToast("History deleted successfully.", "success");
      },
      onError: () => {
        showToast("Unable to delete history.\nPlease try again.", "error");
      }
    });
  };

  const handleOpen = (id: string) => {
    // Navigate to a new route that fetches history detail, 
    // or just pass it in state for now to reuse ResultScreen logic.
    // ResultScreen currently uses `location.state.resultData`.
    // Wait, let's fetch detail instead, but for now we have the full data from list anyway, except questions are inside `processed_response`.
    const item = historyItems.find(h => h.id === id);
    if (item) {
      navigate(`/history/${item.id}`, { state: { resultData: item } });
    }
  };

  return (
    <AppShell>
      {/* Header */}
      <header className="px-6 pt-12 pb-4 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">History</h1>
          {historyItems.length > 0 && (
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete All
            </button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-white border border-transparent rounded-[12px] text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all text-black placeholder:text-gray-500"
          />
        </div>
      </header>

      {/* List */}
      <AppContent className="px-6">
        {isLoading && (
          <div className="space-y-4 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-surface/50 border border-white/5 rounded-[16px] animate-pulse">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-white/5 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-white/10 w-24 rounded mb-2"></div>
                    <div className="h-4 bg-white/10 w-48 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {isError && (
          <div className="text-center py-12 text-destructive text-sm flex flex-col items-center gap-2">
            Failed to load history.
            <button onClick={() => refetch()} className="px-4 py-2 bg-white/5 rounded-md text-foreground hover:bg-white/10 transition-colors mt-2">Retry</button>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-4 mt-2">
            {filteredHistory.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleOpen(item.id)}
                className="flex items-center justify-between p-4 bg-surface border border-white/5 rounded-[16px] cursor-pointer hover:bg-card-hover hover:border-white/10 transition-all shadow-sm group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                  <div className="w-12 h-12 rounded-lg bg-card border border-white/5 shrink-0 flex items-center justify-center overflow-hidden">
                    {item.thumbnail_url ? (
                       <img src={item.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                    ) : (
                       <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                        {item.subject || 'Unknown'}
                      </span>
                      <span className="text-xs text-muted-foreground/50">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                      <p className="font-medium text-sm text-foreground line-clamp-1">{item.processed_response?.worksheet_title || item.subject || 'Untitled Worksheet'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-2 hover:bg-destructive/10 rounded-full text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
                </div>
              </div>
            ))}
            {filteredHistory.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm border border-white/5 border-dashed rounded-[16px] bg-surface/30 mt-4">
                No history found.
              </div>
            )}
          </div>
        )}
      </AppContent>

      {/* Delete All Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e2e] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Delete all history?</h2>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              This will permanently remove all saved homework history. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowModal(false)}
                disabled={deleteAllMutation.isPending}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAll}
                disabled={deleteAllMutation.isPending}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {deleteAllMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete All'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`px-4 py-3 rounded-xl shadow-lg border text-sm font-medium text-center whitespace-pre-line ${
            toast.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {toast.message}
          </div>
        </div>
      )}
    </AppShell>
  );
}
