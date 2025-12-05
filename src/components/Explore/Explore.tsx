import { useState, useMemo } from 'react';
import { INITIAL_DATA } from '../../data/mockData';
import { calculateMatch } from '../../utils/matching';
import { StudentCard } from './StudentCard';

interface ExploreProps {
    currentUser: {
        year: number;
        interests?: string[];
    };
}

export function Explore({ currentUser }: ExploreProps) {
    const [yearFilter, setYearFilter] = useState<string>("");
    const [majorFilter, setMajorFilter] = useState<string>("");
    const [minScoreFilter, setMinScoreFilter] = useState<number>(0);

    // Get unique majors for dropdown
    const allMajors = useMemo(() => {
        return Array.from(new Set(INITIAL_DATA.students.map(s => s.major))).sort();
    }, []);

    // Filter and Sort Students
    const processedStudents = useMemo(() => {
        let students = INITIAL_DATA.students.map(student => ({
            ...student,
            score: calculateMatch(student, currentUser)
        }));

        // Filter by Year
        if (yearFilter) {
            if (yearFilter === 'same') {
                students = students.filter(s => s.year === currentUser.year);
            } else {
                students = students.filter(s => s.year === parseInt(yearFilter));
            }
        }

        // Filter by Major
        if (majorFilter) {
            students = students.filter(s => s.major === majorFilter);
        }

        // Filter by Score
        if (minScoreFilter > 0) {
            students = students.filter(s => s.score >= minScoreFilter);
        }

        // Sort by Score (Desc) then by Year Diff (Asc)
        return students.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            const diffA = Math.abs(a.year - currentUser.year);
            const diffB = Math.abs(b.year - currentUser.year);
            return diffA - diffB;
        });
    }, [currentUser, yearFilter, majorFilter, minScoreFilter]);

    return (
        <div className="max-w-[1000px] mx-auto py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Passende Studenten finden</h2>
                    <p className="text-gray-500">Basierend auf deinen Interessen & Jahrgang</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <select
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                    >
                        <option value="">Alle Jahrgänge</option>
                        <option value="same">Gleicher Jahrgang ({currentUser.year})</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                    </select>

                    <select
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                        value={majorFilter}
                        onChange={(e) => setMajorFilter(e.target.value)}
                    >
                        <option value="">Alle Studiengänge</option>
                        {allMajors.map(major => (
                            <option key={major} value={major}>{major}</option>
                        ))}
                    </select>

                    <select
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                        value={minScoreFilter}
                        onChange={(e) => setMinScoreFilter(parseInt(e.target.value))}
                    >
                        <option value="0">Alle Matches</option>
                        <option value="30">Min. 30% Match</option>
                        <option value="50">Min. 50% Match</option>
                        <option value="70">Min. 70% Match</option>
                    </select>
                </div>
            </div>

            {processedStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {processedStudents.map(student => (
                        <StudentCard
                            key={student.id}
                            student={student}
                            score={student.score}
                            currentUserYear={currentUser.year}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500">Keine Studenten gefunden.</p>
                    <button
                        className="mt-2 text-primary font-medium hover:underline"
                        onClick={() => {
                            setYearFilter("");
                            setMajorFilter("");
                            setMinScoreFilter(0);
                        }}
                    >
                        Filter zurücksetzen
                    </button>
                </div>
            )}
        </div>
    );
}
