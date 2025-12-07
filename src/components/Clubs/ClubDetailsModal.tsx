import { X, Users, Hash, Calendar, Clock } from 'lucide-react';
import type { Club } from '../../data/mockData';
import clsx from 'clsx';

interface ClubDetailsModalProps {
    club: Club;
    isMember: boolean;
    onClose: () => void;
    onJoin: (id: number) => void;
    onLeave: (id: number) => void;
}

export function ClubDetailsModal({ club, isMember, onClose, onJoin, onLeave }: ClubDetailsModalProps) {
    // Clubs generally don't have a hard limit displayed in the modal currently
    // MockData definitions don't explicitly have maxMembers for clubs usually, often implied or high.
    // Based on previous code, random member counts were used. Let's assume clubs are open unless very full.
    // However, to keep it consistent with GroupCard logic if we want "Full" state, we'd need a limit.
    // For now, let's assume clubs are generally open.

    const handleAction = () => {
        if (isMember) {
            onLeave(club.id);
        } else {
            onJoin(club.id);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300 border border-border">
                <div className="sticky top-0 bg-card border-b border-border p-4 flex justify-between items-center z-10">
                    <h3 className="text-xl font-bold text-foreground">{club.name}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X size={20} className="text-muted-foreground" />
                    </button>
                </div>

                <div className="p-6">
                    {(club.meetingDay || club.meetingTime) && (
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {club.meetingDay && (
                                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl">
                                    <div className="bg-background p-2 rounded-lg text-primary shadow-sm"><Calendar size={18} /></div>
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase font-semibold">Tag</div>
                                        <div className="font-bold text-foreground">{club.meetingDay}</div>
                                    </div>
                                </div>
                            )}
                            {club.meetingTime && (
                                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl">
                                    <div className="bg-background p-2 rounded-lg text-primary shadow-sm"><Clock size={18} /></div>
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase font-semibold">Zeit</div>
                                        <div className="font-bold text-foreground">{club.meetingTime}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <h4 className="font-bold text-foreground mb-2 text-lg">Beschreibung</h4>
                    <p className="text-muted-foreground mb-8 leading-relaxed whitespace-pre-line">
                        {club.desc}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="bg-muted/50 p-4 rounded-xl flex items-center gap-3">
                            <div className="bg-background p-2 rounded-lg text-muted-foreground shadow-sm"><Users size={20} /></div>
                            <div>
                                <div className="text-xs text-muted-foreground uppercase font-semibold">Mitglieder</div>
                                <div className="font-bold text-foreground">
                                    {club.members}
                                </div>
                            </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl flex items-center gap-3">
                            <div className="bg-background p-2 rounded-lg text-muted-foreground shadow-sm"><Hash size={20} /></div>
                            <div>
                                <div className="text-xs text-muted-foreground uppercase font-semibold">Tags</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {club.tags.map(tag => (
                                        <span key={tag} className="text-sm font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-border">
                        <button onClick={onClose} className="px-6 py-2.5 border border-input text-foreground rounded-xl font-medium hover:bg-muted transition-colors">
                            Schließen
                        </button>
                        {isMember && (
                            <button
                                onClick={() => alert("Chat coming soon!")}
                                className="px-6 py-2.5 border border-indigo-100 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-xl font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                            >
                                Chat öffnen
                            </button>
                        )}
                        <button
                            onClick={handleAction}
                            className={clsx(
                                "px-6 py-2.5 rounded-xl font-medium shadow-lg transition-all hover:-translate-y-0.5",
                                isMember
                                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/30"
                            )}
                        >
                            {isMember ? 'Club verlassen' : 'Club beitreten'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
