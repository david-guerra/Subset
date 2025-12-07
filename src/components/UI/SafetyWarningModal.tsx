import { ShieldAlert } from 'lucide-react';

interface SafetyWarningModalProps {
    onCancel: () => void;
    onConfirm: () => void;
}

export function SafetyWarningModal({ onCancel, onConfirm }: SafetyWarningModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl border border-border animate-in zoom-in-95 duration-200 p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <ShieldAlert size={48} className="text-red-600 dark:text-red-400" />
                    </div>

                    <h3 className="text-xl font-bold text-foreground">AI-Sicherheitswarnung</h3>

                    <p className="text-muted-foreground leading-relaxed">
                        Dein Post scheint gegen unsere Richtlinien zur akademischen Integrität zu verstoßen (z.B. Ghostwriting oder Plagiat).
                    </p>

                    <div className="p-4 bg-muted/50 rounded-xl text-sm text-left w-full border border-border">
                        <div className="font-semibold text-foreground mb-1">Mögliche Konsequenzen:</div>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            <li>Der Post wird <strong>unsichtbar</strong> geschaltet.</li>
                            <li>Er wird zur manuellen Prüfung markiert (Flagged).</li>
                            <li>Wiederholte Verstöße können zur Sperrung führen.</li>
                        </ul>
                    </div>

                    <div className="flex gap-3 w-full pt-2">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/90 transition-colors"
                        >
                            Bearbeiten
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                        >
                            Trotzdem posten
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
