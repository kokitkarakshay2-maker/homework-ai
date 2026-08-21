import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { workspaceService } from '../services/homeworkService';
import { getDeviceId } from '../lib/device';
import { Loader2, CheckCircle2, XCircle, Users } from 'lucide-react';
import { UAParser } from 'ua-parser-js';

export default function PairScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('This pairing link is invalid or has expired.');
    }
  }, [token]);

  const handleJoin = async () => {
    if (!token) return;
    setStatus('loading');
    try {
      const deviceId = getDeviceId();
      const parser = new UAParser();
      const result = parser.getResult();
      const platform = result.device.type === 'tablet' ? 'Tablet' : result.device.type === 'mobile' ? 'Phone' : 'Desktop';
      const browser = result.browser.name || 'Unknown';
      const deviceName = `${browser} on ${platform}`;

      const res = await workspaceService.joinWorkspace(token, deviceId, deviceName, platform);
      
      if (res.workspace_id) {
        localStorage.setItem('hwai_workspace_id', res.workspace_id);
        setStatus('success');
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error("Failed to pair device via link:", err);
      setStatus('error');
      // Hide technical errors and show clean user-facing error
      setErrorMsg('This pairing link is invalid or has expired.');
    }
  };

  const handleContinue = () => {
    // Force a full reload to ensure the new workspace id is loaded globally
    // and history fetches the synchronized data.
    window.location.href = '/home';
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background h-full text-center">
      {status === 'idle' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 bg-card border border-border p-6 rounded-2xl w-full max-w-sm shadow-xl"
        >
          <div className="p-4 bg-primary/10 rounded-full mb-2">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Join Family Workspace</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">
            You've been invited to join this Family Workspace. <br/><br/>
            This device will be connected to the shared workspace.
          </p>
          <div className="w-full flex flex-col gap-3 mt-4">
            <button
              onClick={handleJoin}
              className="px-6 py-3.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-full"
            >
              Join Workspace
            </button>
            <button
              onClick={() => navigate('/home', { replace: true })}
              className="px-6 py-3.5 bg-transparent border border-border text-foreground rounded-lg font-medium hover:bg-muted/30 transition-colors w-full"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {status === 'loading' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 bg-card border border-border p-8 rounded-2xl w-full max-w-sm shadow-xl"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-2" />
          <h2 className="text-xl font-medium text-foreground">Pairing Device...</h2>
          <p className="text-muted-foreground text-sm">Connecting you to the Family Workspace.</p>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 bg-card border border-border p-6 rounded-2xl w-full max-w-sm shadow-xl"
        >
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
          <h2 className="text-xl font-bold text-foreground">Connected Successfully</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            This device is now connected to the Family Workspace.<br/><br/>
            Your homework history will now be synchronized across devices.
          </p>
          <button
            onClick={handleContinue}
            className="mt-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-full"
          >
            Continue to Home
          </button>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 bg-card border border-border p-6 rounded-2xl w-full max-w-sm shadow-xl"
        >
          <XCircle className="w-12 h-12 text-destructive mb-2" />
          <h2 className="text-xl font-bold text-foreground">Unable to Join Workspace</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{errorMsg}</p>
          <button
            onClick={() => navigate('/home', { replace: true })}
            className="mt-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-full"
          >
            Go Home
          </button>
        </motion.div>
      )}
    </div>
  );
}
