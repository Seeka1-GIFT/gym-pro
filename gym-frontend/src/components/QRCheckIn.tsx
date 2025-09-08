import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface CheckInRecord {
  id: string;
  memberId: string;
  memberName: string;
  checkInTime: string;
  status: 'success' | 'error' | 'pending';
}

export default function QRCheckIn() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([]);
  const [showQR, setShowQR] = useState(false);

  // Generate QR code for member check-in
  const generateQRCode = () => {
    setIsGenerating(true);
    setShowQR(false);
    
    // Simulate QR generation delay
    setTimeout(() => {
      const memberId = user?.id || 'guest';
      const timestamp = Date.now();
      const qrData = JSON.stringify({
        memberId,
        timestamp,
        type: 'checkin'
      });
      
      setQrValue(qrData);
      setShowQR(true);
      setIsGenerating(false);
    }, 1000);
  };

  // Simulate QR code scan and check-in
  const simulateCheckIn = () => {
    if (!user) return;
    
    const newRecord: CheckInRecord = {
      id: Date.now().toString(),
      memberId: user.id,
      memberName: user.name,
      checkInTime: new Date().toLocaleTimeString(),
      status: 'success'
    };
    
    setCheckInRecords(prev => [newRecord, ...prev.slice(0, 9)]); // Keep last 10 records
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setCheckInRecords(prev => 
        prev.map(record => 
          record.id === newRecord.id 
            ? { ...record, status: 'pending' }
            : record
        )
      );
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* QR Code Generation */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            QR Code Check-In
          </h3>
          <button
            onClick={generateQRCode}
            disabled={isGenerating}
            className="btn"
          >
            {isGenerating ? 'Generating...' : 'Generate QR Code'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Generating QR Code...</p>
            </motion.div>
          ) : showQR ? (
            <motion.div
              key="qr"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="p-4 bg-white rounded-2xl shadow-lg">
                <div className="w-[200px] h-[200px] bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📱</div>
                    <div className="text-sm text-slate-600">QR Code</div>
                    <div className="text-xs text-slate-500 mt-1">Scan to check-in</div>
                    <div className="text-xs text-slate-400 mt-2 font-mono">
                      {qrValue ? qrValue.substring(0, 20) + '...' : ''}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Scan this QR code to check in
                </p>
                <button
                  onClick={simulateCheckIn}
                  className="btn-secondary"
                >
                  Simulate Scan (Demo)
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                <div className="text-4xl text-slate-400">📱</div>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                Click "Generate QR Code" to create a check-in QR code
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Check-ins */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
          Recent Check-ins
        </h3>
        
        {checkInRecords.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No check-ins yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {checkInRecords.map((record) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    record.status === 'success'
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    record.status === 'success'
                      ? 'bg-green-100 dark:bg-green-900/40'
                      : 'bg-slate-100 dark:bg-slate-700'
                  }`}>
                    {record.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Clock className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {record.memberName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {record.checkInTime}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    record.status === 'success'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}>
                    {record.status === 'success' ? 'Checked In' : 'Pending'}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
