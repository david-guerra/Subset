import type { Student } from '../../data/mockData';
import { UserPlus, Check, X, MessageCircle, User } from 'lucide-react';

interface StudentCardProps {
    student: Student;
    score: number;
    currentUserYear: string;
    isMe?: boolean;
    isConnected?: boolean;
    isPending?: boolean;
    isIncoming?: boolean;
    onMessage?: () => void;
    onViewProfile?: () => void;
    onConnect?: () => void;
    onCancel?: () => void;
    onAccept?: () => void;
}

export function StudentCard({ student, score, currentUserYear, isMe, isConnected, isPending, isIncoming, onMessage, onViewProfile, onConnect, onCancel, onAccept }: StudentCardProps) {
    const isSameYear = student.year === currentUserYear;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`;

    return (
        <div className={`rounded-xl shadow-sm border p-5 flex flex-col h-full transition-transform hover:-translate-y-1 ${isMe ? 'bg-primary/5 border-primary border-2' : 'bg-card border-border'} relative`}>

            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                    <button onClick={onViewProfile} className="hover:opacity-80 transition-opacity">
                        <img src={avatarUrl} alt={student.name} className="w-14 h-14 rounded-full object-cover bg-muted" />
                    </button>
                    <div>
                        <div className="font-bold text-foreground flex items-center gap-2">
                            <button onClick={onViewProfile} className="hover:text-primary transition-colors text-left">
                                {student.name}
                            </button>
                            {isMe && (
                                <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
                                    Du
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-muted-foreground">{student.major}</div>
                    </div>
                </div>
                {score > 0 && !isMe && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ml-2">
                        {score}% Match
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6 flex-1 content-start">
                {student.interests.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="pt-4 border-t border-border">
                {isMe ? (
                    <div className="text-sm font-bold text-primary w-full text-center">
                        Das ist dein Profil ✨
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {(isSameYear || student.year) && (
                            <div className="flex">
                                {isSameYear ? (
                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold whitespace-nowrap">
                                        Gleicher Jahrgang
                                    </span>
                                ) : (
                                    <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
                                        {student.year}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="flex gap-2 w-full">
                            <button
                                onClick={isIncoming ? onAccept : isPending ? onCancel : onConnect}
                                disabled={isConnected}
                                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 border text-xs font-semibold rounded-lg transition-colors 
                                    ${isConnected
                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                                        : isPending
                                            ? 'bg-muted text-muted-foreground border-input hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                                            : isIncoming
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                                                : 'bg-card border-input text-foreground hover:bg-accent hover:text-accent-foreground'}`}
                            >
                                {isConnected ? 'Verbunden' : isPending ? 'Angefragt' : isIncoming ? 'Annehmen' : 'Vernetzen'}
                            </button>
                            <button
                                onClick={onMessage}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-card border border-input text-foreground text-xs font-semibold rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                <MessageCircle size={14} />
                                <span>Nachricht</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
