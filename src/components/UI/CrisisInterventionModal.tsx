import { HeartHandshake, Phone, ArrowLeft } from 'lucide-react';

interface CrisisInterventionModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

export function CrisisInterventionModal({ onClose, onConfirm }: CrisisInterventionModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-card rounded-2xl w-full max-w-lg shadow-2xl border-2 border-indigo-500/50 animate-in zoom-in-95 duration-300 p-8 relative overflow-hidden">

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-16 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                    <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full ring-4 ring-indigo-50 dark:ring-indigo-900/10">
                        <HeartHandshake size={56} className="text-indigo-600 dark:text-indigo-400" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-foreground">Wir sind für dich da.</h3>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            Es klingt, als würdest du eine schwere Zeit durchmachen. Du bist nicht allein. Wir möchten sicherstellen, dass du die Unterstützung bekommst, die du verdienst.
                        </p>
                    </div>

                    <div className="w-full space-y-3">
                        <div className="p-4 bg-muted/50 rounded-xl border border-border flex items-center gap-4 text-left hover:bg-muted transition-colors cursor-pointer group">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full group-hover:scale-110 transition-transform">
                                <Phone size={24} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <div className="font-bold text-foreground">Telefonseelsorge (24/7)</div>
                                <div className="text-sm text-muted-foreground">0800 111 0 111</div>
                            </div>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-xl border border-border flex items-center gap-4 text-left hover:bg-muted transition-colors cursor-pointer group">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full group-hover:scale-110 transition-transform">
                                <HeartHandshake size={24} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <div className="font-bold text-foreground">Campus Psychologische Beratung</div>
                                <div className="text-sm text-muted-foreground">Mo-Fr, 8-16 Uhr • Gebäude A, Raum 204</div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 w-full space-y-3">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            <ArrowLeft size={16} />
                            Ich bin sicher, zurück zum Feed
                        </button>

                        <button
                            onClick={onConfirm}
                            className="w-full py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                        >
                            Trotzdem posten
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
