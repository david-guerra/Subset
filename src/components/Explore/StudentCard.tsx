import type { Student } from '../../data/mockData';
import { MessageCircle } from 'lucide-react';

interface StudentCardProps {
    student: Student;
    score: number;
    currentUserYear: string;
    isMe?: boolean;
    onMessage?: () => void;
    onViewProfile?: () => void;
}

export function StudentCard({ student, score, currentUserYear, isMe, onMessage, onViewProfile }: StudentCardProps) {
    const isSameYear = student.year === currentUserYear;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`;

    return (
        <div className={`rounded-xl shadow-sm border p-5 flex flex-col h-full transition-transform hover:-translate-y-1 ${isMe ? 'bg-indigo-50 border-primary border-2' : 'bg-white border-border'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                    <button onClick={onViewProfile} className="hover:opacity-80 transition-opacity">
                        <img src={avatarUrl} alt={student.name} className="w-14 h-14 rounded-full object-cover" />
                    </button>
                    <div>
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                            <button onClick={onViewProfile} className="hover:text-primary transition-colors text-left">
                                {student.name}
                            </button>
                            {isMe && (
                                <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
                                    Du
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-gray-500">{student.major}</div>
                    </div>
                </div>
                {score > 0 && !isMe && (
                    <div className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ml-2">
                        {score}% Match
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6 flex-1 content-start">
                {student.interests.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                {isMe ? (
                    <div className="text-sm font-bold text-primary w-full text-center">
                        Das ist dein Profil ✨
                    </div>
                ) : (
                    <>
                        <div>
                            {!isMe && isSameYear && (
                                <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
                                    Gleicher Jahrgang
                                </span>
                            )}
                            {!isMe && !isSameYear && (
                                <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
                                    {student.year}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={onMessage}

                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <MessageCircle size={14} />
                            <span>Nachricht</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
