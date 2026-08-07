import { useState, useEffect } from 'react';
import { QrCode, Scan, Smartphone, Tablet, Monitor, Pencil, Trash2, X } from 'lucide-react';
import { workspaceService, type DeviceSchema } from '../../services/homeworkService';
import QRCode from 'react-qr-code';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function FamilyWorkspace() {
  const [devices, setDevices] = useState<DeviceSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [pairingToken, setPairingToken] = useState<{token_id: string, expires_at: string} | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  
  const currentDeviceId = localStorage.getItem('hwai_device_id');

  const fetchDevices = async () => {
    try {
      const workspaceId = localStorage.getItem('hwai_workspace_id');
      if (!workspaceId) {
        setTimeout(fetchDevices, 1000);
        return;
      }
      const data = await workspaceService.listDevices();
      setDevices(data);
    } catch (e) {
      console.error("Failed to fetch devices", e);
      setLoading(false);
    } finally {
      if (localStorage.getItem('hwai_workspace_id')) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Timer for QR code
  useEffect(() => {
    if (!pairingToken) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(pairingToken.expires_at).getTime();
      const diff = Math.floor((expires - now) / 1000);
      if (diff <= 0) {
        setPairingToken(null);
        setShowQR(false);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pairingToken]);

  const handleGenerateQR = async () => {
    try {
      const token = await workspaceService.generatePairingToken();
      setPairingToken(token);
      setShowQR(true);
    } catch (e) {
      console.error(e);
      alert("Failed to generate QR");
    }
  };

  const handleScan = async (result: string) => {
    if (!result) return;
    setShowScanner(false);
    if (window.confirm("Join this Family Workspace?")) {
      try {
        const platform = "Phone"; // Simplified for this example, could use ua-parser
        const res = await workspaceService.joinWorkspace(result, currentDeviceId || '', "New Device", platform);
        localStorage.setItem('hwai_workspace_id', res.workspace_id);
        window.location.reload(); // Refresh app to load new workspace
      } catch (e) {
        console.error(e);
        alert("Failed to join workspace. The token might be expired.");
      }
    }
  };

  const handleRemove = async (deviceId: string) => {
    if (window.confirm("Remove this device?")) {
      await workspaceService.removeDevice(deviceId);
      fetchDevices();
    }
  };

  const handleRenameSubmit = async (deviceId: string) => {
    if (!editName.trim()) return;
    await workspaceService.renameDevice(deviceId, editName.trim());
    setEditingId(null);
    fetchDevices();
  };

  const getPlatformIcon = (platform: string) => {
    if (platform.toLowerCase().includes('tablet')) return <Tablet className="w-5 h-5" />;
    if (platform.toLowerCase().includes('desktop') || platform.toLowerCase().includes('mac') || platform.toLowerCase().includes('windows')) return <Monitor className="w-5 h-5" />;
    return <Smartphone className="w-5 h-5" />;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Family Workspace</h2>
      </div>
      
      <div className="bg-card border border-border rounded-xl overflow-hidden p-4">
        <div className="flex gap-3 mb-6">
          <button 
            onClick={handleGenerateQR}
            className="flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <QrCode className="w-6 h-6" />
            <span className="text-sm font-medium">Generate QR</span>
          </button>
          <button 
            onClick={() => setShowScanner(true)}
            className="flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
          >
            <Scan className="w-6 h-6" />
            <span className="text-sm font-medium">Scan QR</span>
          </button>
        </div>

        <h3 className="text-sm font-medium mb-3 flex justify-between items-center">
          Connected Devices
          <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">{devices.length}</span>
        </h3>
        
        {loading ? (
          <div className="text-center text-sm text-gray-500 py-4">Loading devices...</div>
        ) : (
          <div className="space-y-3">
            {devices.map(device => {
              const isCurrent = device.device_id === currentDeviceId;
              const isEditing = editingId === device.device_id;
              return (
                <div key={device.id} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400">
                      {getPlatformIcon(device.platform)}
                    </div>
                    <div>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input 
                            autoFocus
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleRenameSubmit(device.device_id)}
                            className="bg-transparent border-b border-primary text-sm outline-none"
                          />
                          <button onClick={() => handleRenameSubmit(device.device_id)} className="text-primary text-xs">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-gray-500 text-xs">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-white">{device.device_name}</span>
                          {isCurrent && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm uppercase tracking-wide">This Device</span>}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-0.5">
                        {device.platform} • Active recently
                      </div>
                    </div>
                  </div>
                  {!isEditing && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingId(device.device_id); setEditName(device.device_name); }} className="p-1.5 text-gray-400 hover:text-white transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      {!isCurrent && (
                        <button onClick={() => handleRemove(device.device_id)} className="p-1.5 text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQR && pairingToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e2e] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl flex flex-col items-center relative">
            <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-2">Pair Device</h2>
            <p className="text-sm text-gray-400 mb-6 text-center">Scan this code from another device to join the Family Workspace.</p>
            
            <div className="bg-white p-4 rounded-xl mb-6">
              <QRCode value={pairingToken.token_id} size={200} />
            </div>
            
            <div className="text-sm font-medium text-primary">
              Expires in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      )}

      {/* Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          <div className="flex justify-between items-center p-4 bg-black/50 absolute top-0 w-full z-10">
            <h2 className="text-white font-medium">Scan Pairing Code</h2>
            <button onClick={() => setShowScanner(false)} className="p-2 text-white"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 flex items-center justify-center w-full h-full">
            <Scanner 
              onScan={(result) => handleScan(result[0]?.rawValue || '')} 
              components={{ finder: true }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
