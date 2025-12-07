import { X, Clock, Award, BookOpen, Users, MessageSquare, ExternalLink, Globe } from 'lucide-react';
import type { Module } from '../../data/mockData';

interface ModuleDetailsModalProps {
    module: Module;
    onClose: () => void;
    isEnrolled?: boolean;
}

export function ModuleDetailsModal({ module, onClose, isEnrolled = false }: ModuleDetailsModalProps) {
    // Mock data for social proof
    const enrolledFriends = [
        { name: 'Sarah', avatar: 'https://ui-avatars.com/api/?name=Sarah&background=random' },
        { name: 'Tom', avatar: 'https://ui-avatars.com/api/?name=Tom&background=random' },
        { name: 'Lisa', avatar: 'https://ui-avatars.com/api/?name=Lisa&background=random' }
    ];
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300 border border-border">
                <div className="sticky top-0 bg-card border-b border-border p-4 flex justify-between items-center z-10">
                    <h3 className="text-xl font-bold text-foreground">{module.title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X size={20} className="text-muted-foreground" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                        {module.desc}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl flex items-center gap-3">
                            <div className="bg-background p-2 rounded-lg text-primary shadow-sm"><Award size={20} /></div>
                            <div>
                                <div className="text-xs text-muted-foreground uppercase font-semibold">ECTS</div>
                                <div className="font-bold text-foreground">5 Cr</div>
                            </div>
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl flex items-center gap-3">
                            <div className="bg-background p-2 rounded-lg text-primary shadow-sm"><Clock size={20} /></div>
                            <div>
                                <div className="text-xs text-muted-foreground uppercase font-semibold">Dauer</div>
                                <div className="font-bold text-foreground">1 Semester</div>
                            </div>
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl flex items-center gap-3">
                            <div className="bg-background p-2 rounded-lg text-primary shadow-sm"><BookOpen size={20} /></div>
                            <div>
                                <div className="text-xs text-muted-foreground uppercase font-semibold">Sprache</div>
                                <div className="font-bold text-foreground">Deutsch</div>
                            </div>
                        </div>
                    </div>

                    <h4 className="font-bold text-foreground mb-3 text-lg">Inhalte</h4>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>

                    <h4 className="font-bold text-foreground mb-3 text-lg">Prüfungsleistung</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-8">
                        <li>Klausur (90 min)</li>
                        <li>Projektarbeit</li>
                    </ul>

                    {/* Dynamic Footer Actions */}
                    <div className="pt-6 border-t border-border">
                        {isEnrolled ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                                    <div className="flex -space-x-2">
                                        {enrolledFriends.map((friend, i) => (
                                            <img
                                                key={i}
                                                src={friend.avatar}
                                                alt={friend.name}
                                                className="w-8 h-8 rounded-full border-2 border-background"
                                            />
                                        ))}
                                        <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold">
                                            +12
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        <span className="font-semibold text-foreground">Sarah, Tom</span> und weitere sind eingeschrieben
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-xl font-medium hover:bg-indigo-100 transition-colors">
                                        <Globe size={18} />
                                        <span>Community</span>
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-xl font-medium hover:bg-indigo-100 transition-colors">
                                        <MessageSquare size={18} />
                                        <span>Gruppenchat</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                                    <div className="flex -space-x-2">
                                        {enrolledFriends.slice(0, 2).map((friend, i) => (
                                            <img
                                                key={i}
                                                src={friend.avatar}
                                                alt={friend.name}
                                                className="w-8 h-8 rounded-full border-2 border-background"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        Deine Freunde planen diesen Kurs für nächstes Semester
                                    </span>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button onClick={onClose} className="px-6 py-2.5 border border-input text-foreground rounded-xl font-medium hover:bg-muted transition-colors">
                                        Schließen
                                    </button>
                                    <a
                                        href="https://campus.uni-hamburg.de"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
                                    >
                                        <span>Zur Anmeldung</span>
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
