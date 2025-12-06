import { X, Users, Hash, Info } from 'lucide-react';
import type { Group } from '../../data/mockData';
import clsx from 'clsx';

interface GroupDetailsModalProps {
    group: Group;
    isMember: boolean;
    onClose: () => void;
    onJoin: (id: number) => void;
    onLeave: (id: number) => void;
}

export function GroupDetailsModal({ group, isMember, onClose, onJoin, onLeave }: GroupDetailsModalProps) {
    const isFull = group.members >= group.maxMembers;
    const canJoin = !isMember && !isFull;

    const handleAction = () => {
        if (isMember) {
            onLeave(group.id);
        } else if (canJoin) {
            onJoin(group.id);
        }
        // Optional: Close on action or keep open?
        // Usually better to keep open so they see the result, but maybe close if it's "Leaves"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
                    <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    {group.course && (
                        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-primary rounded-full text-sm font-medium">
                            <Info size={16} />
                            <span>{group.course}</span>
                        </div>
                    )}

                    <h4 className="font-bold text-gray-900 mb-2 text-lg">Beschreibung</h4>
                    <p className="text-gray-700 mb-8 leading-relaxed whitespace-pre-line">
                        {group.desc}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg text-gray-500 shadow-sm"><Users size={20} /></div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase font-semibold">Mitglieder</div>
                                <div className="font-bold text-gray-900">
                                    {group.members} / {group.maxMembers}
                                    <span className={clsx("ml-2 text-sm font-normal", isFull ? "text-red-500" : "text-green-600")}>
                                        ({isFull ? 'Voll' : 'Plätze frei'})
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg text-gray-500 shadow-sm"><Hash size={20} /></div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase font-semibold">Tags</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {group.tags.map(tag => (
                                        <span key={tag} className="text-sm font-medium text-gray-700 bg-gray-200 px-1.5 py-0.5 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button onClick={onClose} className="px-6 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                            Schließen
                        </button>
                        {isMember && (
                            <button
                                onClick={() => alert("Chat coming soon!")}
                                className="px-6 py-2.5 border border-indigo-100 bg-indigo-50 text-indigo-600 rounded-xl font-medium hover:bg-indigo-100 transition-colors"
                            >
                                Chat öffnen
                            </button>
                        )}
                        <button
                            onClick={handleAction}
                            disabled={!isMember && !canJoin}
                            className={clsx(
                                "px-6 py-2.5 rounded-xl font-medium shadow-lg transition-all hover:-translate-y-0.5",
                                isMember
                                    ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-red-100"
                                    : isFull
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                        : "bg-primary text-white hover:bg-primary-hover shadow-primary/30"
                            )}
                        >
                            {isMember ? 'Gruppe verlassen' : isFull ? 'Gruppe ist voll' : 'Gruppe beitreten'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
