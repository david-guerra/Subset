import { ShieldAlert, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SystemToastProps {
    message: string;
    subMessage?: string;
    onClose: () => void;
}

export function SystemToast({ message, subMessage, onClose }: SystemToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 right-4 z-[60] transition-all duration-300 transform ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="bg-slate-900 text-white rounded-lg shadow-2xl p-4 border-l-4 border-red-500 max-w-sm flex items-start gap-3">
                <div className="p-2 bg-red-500/20 rounded-full animate-pulse">
                    <Activity size={20} className="text-red-400" />
                </div>
                <div>
                    <div className="font-mono text-xs text-red-400 mb-1 uppercase tracking-wider font-bold flex items-center gap-1">
                        <ShieldAlert size={10} />
                        System Alert
                    </div>
                    <div className="font-medium text-sm text-slate-100 mb-0.5">{message}</div>
                    {subMessage && <div className="text-xs text-slate-400">{subMessage}</div>}
                </div>
            </div>
        </div>
    );
}
