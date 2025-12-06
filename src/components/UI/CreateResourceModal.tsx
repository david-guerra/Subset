import { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';

interface CreateResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    type: 'group' | 'club' | 'module';
}

export function CreateResourceModal({ isOpen, onClose, onSubmit, type }: CreateResourceModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        desc: '',
        tags: '',
        course: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Process tags
        const processedData = {
            ...formData,
            title: formData.name, // For module, we map name to title if needed, or handle in parent
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        };

        try {
            await onSubmit(processedData);
            setFormData({ name: '', desc: '', tags: '', course: '' }); // Reset
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const titles = {
        group: "Neue Lerngruppe erstellen",
        club: "Neuen Club gründen",
        module: "Neues Modul hinzufügen"
    };

    const descriptions = {
        group: "Finde Kommilitonen für gemeinsame Lernsessions.",
        club: "Starte eine Community für deine Interessen.",
        module: "Füge einen Kurs oder ein Modul hinzu."
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{titles[type]}</h3>
                        <p className="text-sm text-gray-500 mt-1">{descriptions[type]}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {type === 'module' ? 'Titel' : 'Name'}
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder={type === 'group' ? 'z.B. AI Klausur Vorbereitung' : 'Name eingeben...'}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Beschreibung
                        </label>
                        <textarea
                            required
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            placeholder="Worum geht es?"
                            value={formData.desc}
                            onChange={e => setFormData({ ...formData, desc: e.target.value })}
                        />
                    </div>

                    {type === 'group' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Zugehöriger Kurs (Optional)
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="z.B. Einführung in KI"
                                value={formData.course}
                                onChange={e => setFormData({ ...formData, course: e.target.value })}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags (mit Komma trennen)
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="z.B. Coding, Lernen, Spaß"
                            value={formData.tags}
                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                            Erstellen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
