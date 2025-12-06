import { X, MessageCircle, BookOpen, Hash } from 'lucide-react';
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
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
                    <h3 className="text-xl font-bold text-gray-900">Profil</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                        <img
                            src={avatarUrl}
                            alt={student.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-50"
                        />
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-gray-900 mb-1">{student.name}</h2>
                            <p className="text-xl text-gray-500 mb-4">{student.major} • {student.year}</p>

                            <button
                                onClick={() => {
                                    onMessage(student.id);
                                    onClose();
                                }}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/30 font-medium transition-all hover:-translate-y-0.5"
                            >
                                <MessageCircle size={18} />
                                <span>Nachricht senden</span>
                            </button>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Über mich</h4>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {student.bio || "Keine Biografie angegeben."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-5 rounded-xl">
                            <div className="flex items-center gap-2 mb-3">
                                <Hash size={20} className="text-indigo-600" />
                                <h4 className="font-bold text-gray-900">Interessen</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {student.interests.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white text-gray-700 text-sm font-medium rounded-lg shadow-sm border border-gray-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {(student.courses && student.courses.length > 0) && (
                            <div className="bg-gray-50 p-5 rounded-xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <BookOpen size={20} className="text-indigo-600" />
                                    <h4 className="font-bold text-gray-900">Seminare</h4>
                                </div>
                                <div className="space-y-2">
                                    {student.courses.map((course, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                            <span className="text-sm font-medium text-gray-700">{course}</span>
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
