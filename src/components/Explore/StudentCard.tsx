import type { Student } from '../../data/mockData';
import { MessageCircle } from 'lucide-react';

interface StudentCardProps {
    student: Student;
    score: number;
    currentUserYear: number;
}

export function StudentCard({ student, score, currentUserYear }: StudentCardProps) {
    const isSameYear = student.year === currentUserYear;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-border p-5 flex flex-col h-full transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
                <img src={avatarUrl} alt={student.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                        {student.name}
                        {isSameYear ? (
                            <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
                                Gleicher Jahrgang
                            </span>
                        ) : (
                            <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
                                Jahrgang {student.year}
                            </span>
                        )}
                    </div>
                    <div className="text-sm text-gray-500">{student.major}</div>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6 flex-1 content-start">
                {student.interests.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                {score > 0 ? (
                    <div className="text-sm font-bold text-primary">
                        {score}% Match
                    </div>
                ) : (
                    <div className="text-xs text-gray-400">Kein Match</div>
                )}

                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 hover:text-primary transition-colors">
                    <MessageCircle size={14} />
                    <span>Nachricht</span>
                </button>
            </div>
        </div>
    );
}
