import { useState, useEffect } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { type Student } from '../../data/mockData';
import { StudentCard } from './StudentCard';
import { PublicProfileModal } from '../Profile/PublicProfileModal';
import { calculateMatch } from '../../utils/matching';


interface ExploreProps {
    currentUser: any;
    onMessage?: (studentId: number) => void;
}

export function Explore({ currentUser, onMessage }: ExploreProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [filterYear, setFilterYear] = useState<string>("");
    const [filterMajor, setFilterMajor] = useState<string>("");
    const [minScore, setMinScore] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterInterest, setFilterInterest] = useState<string>("");
    const [aiMode, setAiMode] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    useEffect(() => {
        fetch('/api/students')
            .then(res => res.json())
            .then(data => {
                setStudents(data);
            });
    }, [currentUser]);

    // Filter logic
    const filteredStudents = students.filter(student => {
        if (student.id === currentUser.id) return false;

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matchesName = student.name.toLowerCase().includes(term);
            const matchesMajor = student.major.toLowerCase().includes(term);
            const matchesInterest = student.interests.some(i => i.toLowerCase().includes(term));
            if (!matchesName && !matchesMajor && !matchesInterest) return false;
        }

        // Dropdown filters
        if (filterInterest && !student.interests.includes(filterInterest)) return false;
        if (filterYear && student.year !== filterYear) return false;
        if (filterMajor && student.major !== filterMajor) return false;

        return true;
    });

    // Calculate match scores
    const mappedStudents = filteredStudents.map(student => {
        // Calculate commonalities
        const commonClubs = student.myClubs?.filter(c => currentUser.myClubs.includes(c)).length || 0;
        const commonModules = student.courses?.filter(c => currentUser.courses?.includes(c)).length || 0;

        let score = calculateMatch(
            student.interests,
            currentUser.interests,
            student.year,
            currentUser.year,
            commonClubs,
            commonModules
        );

        // AI Mock Adjustment
        if (aiMode) {
            const pseudoRandom = (student.id * 17) % 20;
            score = Math.min(100, score + pseudoRandom);
        }

        return { ...student, matchScore: score };
    });

    // Sort
    const sortedStudents = mappedStudents.sort((a, b) => b.matchScore - a.matchScore);

    // Filter by Score AFTER calculation
    const finalStudents = sortedStudents.filter(s => minScore === 0 || s.matchScore >= minScore);

    return (
        <div className="max-w-[1200px] mx-auto py-8 px-4">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Entdecke Studenten</h2>
                    <p className="text-gray-500">Finde Kommilitonen, die zu dir passen.</p>
                </div>

                {/* AI Toggle */}
                <button
                    onClick={() => setAiMode(!aiMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${aiMode
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
                        }`}
                >
                    <Sparkles size={18} className={aiMode ? 'fill-white/20' : ''} />
                    {aiMode ? 'KI Matching Aktiv' : 'KI Matching aktivieren'}
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Suche nach Namen, Interessen oder Studiengängen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
                <select
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    onChange={(e) => setFilterMajor(e.target.value)}
                >
                    <option value="">Alle Studiengänge</option>
                    <option value="Informatik">Informatik</option>
                    <option value="BWL">BWL</option>
                    <option value="Design">Design</option>
                    <option value="Psychologie">Psychologie</option>
                </select>
                <select
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    onChange={(e) => setFilterYear(e.target.value)}
                >
                    <option value="">Alle Jahrgänge</option>
                    <option value="WiSe 23/24">WiSe 23/24</option>
                    <option value="SoSe 24">SoSe 24</option>
                    <option value="WiSe 24/25">WiSe 24/25</option>
                </select>
                <select
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    onChange={(e) => setFilterInterest(e.target.value)}
                >
                    <option value="">Alle Interessen</option>
                    <option value="Coding">Coding</option>
                    <option value="Sport">Sport</option>
                    <option value="Musik">Musik</option>
                    <option value="Reisen">Reisen</option>
                </select>
                <select
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    onChange={(e) => setMinScore(parseInt(e.target.value))}
                    value={minScore}
                >
                    <option value="0">Alle Matches</option>
                    <option value="30">Min. 30% Match</option>
                    <option value="50">Min. 50% Match</option>
                    <option value="70">Min. 70% Match</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* You Card */}
                <StudentCard
                    student={currentUser}
                    score={0}
                    currentUserYear={currentUser.year}
                    isMe={true}
                />

                {finalStudents.map(student => (
                    <StudentCard
                        key={student.id}
                        student={student}
                        score={student.matchScore}
                        currentUserYear={currentUser.year}
                        isMe={student.id === currentUser.id}
                        onMessage={() => onMessage?.(student.id)}
                        onViewProfile={() => setSelectedStudent(student)}
                    />
                ))}
            </div>

            {selectedStudent && (
                <PublicProfileModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    onMessage={(id) => {
                        onMessage?.(id);
                        setSelectedStudent(null);
                    }}
                />
            )}
        </div>
    );
}
