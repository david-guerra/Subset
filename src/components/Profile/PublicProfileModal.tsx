import { X, MessageCircle, BookOpen, Hash } from 'lucide-react';
import { ReportMenu } from '../UI/ReportMenu';
import type { Student } from '../../data/mockData';

interface PublicProfileModalProps {
    student: Student;
    onClose: () => void;
    onMessage: (studentId: number) => void;
}

export function PublicProfileModal({ student, onClose, onMessage }: PublicProfileModalProps) {
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300 border border-border">
                <div className="sticky top-0 bg-card border-b border-border p-4 flex justify-between items-center z-10">
                    <h3 className="text-xl font-bold text-foreground">Profil</h3>
                    <div className="flex items-center gap-2">
                        <ReportMenu onReport={() => alert("Profil gemeldet.")} itemType="Profil" />
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <X size={20} className="text-muted-foreground" />
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                        <img
                            src={avatarUrl}
                            alt={student.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-primary/10 bg-muted"
                        />
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-foreground mb-1">{student.name}</h2>
                            <p className="text-xl text-muted-foreground mb-4">{student.major} • {student.year}</p>

                            <button
                                onClick={() => {
                                    onMessage(student.id);
                                    onClose();
                                }}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/30 font-medium transition-all hover:-translate-y-0.5"
                            >
                                <MessageCircle size={18} />
                                <span>Nachricht senden</span>
                            </button>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="font-bold text-foreground mb-2 text-lg">Über mich</h4>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {student.bio || "Keine Biografie angegeben."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-muted/50 p-5 rounded-xl border border-border">
                            <div className="flex items-center gap-2 mb-3">
                                <Hash size={20} className="text-primary" />
                                <h4 className="font-bold text-foreground">Interessen</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {student.interests.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-background text-foreground text-sm font-medium rounded-lg shadow-sm border border-border">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {(student.courses && student.courses.length > 0) && (
                            <div className="bg-muted/50 p-5 rounded-xl border border-border">
                                <div className="flex items-center gap-2 mb-3">
                                    <BookOpen size={20} className="text-primary" />
                                    <h4 className="font-bold text-foreground">Seminare</h4>
                                </div>
                                <div className="space-y-2">
                                    {student.courses.map((course, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-2 bg-background rounded-lg border border-border">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                            <span className="text-sm font-medium text-foreground">{course}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
