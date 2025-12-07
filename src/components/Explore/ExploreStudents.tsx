import { useState, useEffect } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { type Student } from '../../data/mockData';
import { StudentCard } from './StudentCard';
import { PublicProfileModal } from '../Profile/PublicProfileModal';
import { calculateMatch } from '../../utils/matching';

interface ExploreStudentsProps {
    currentUser: any;
    onMessage?: (studentId: number) => void;
}

export function ExploreStudents({ currentUser, onMessage }: ExploreStudentsProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [filterYear, setFilterYear] = useState<string>("");
    const [filterMajor, setFilterMajor] = useState<string>("");
    const [minScore, setMinScore] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterInterest, setFilterInterest] = useState<string>("");
    const [filterConnection, setFilterConnection] = useState<string>("all");
    const [aiMode, setAiMode] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [myConnections, setMyConnections] = useState<number[]>(currentUser.connections || []);
    const [myOutgoing, setMyOutgoing] = useState<number[]>(currentUser.outgoingRequests || []);
    const [myIncoming, setMyIncoming] = useState<number[]>(currentUser.incomingRequests || []);

    useEffect(() => {
        setMyConnections(currentUser.connections || []);
        setMyOutgoing(currentUser.outgoingRequests || []);
        setMyIncoming(currentUser.incomingRequests || []);
    }, [currentUser]);

    useEffect(() => {
        fetch('/api/students')
            .then(res => res.json())
            .then(data => {
                setStudents(data);
            });
    }, [currentUser]);

    const handleConnect = async (targetId: number) => {
        try {
            const res = await fetch('/api/users/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUserId: targetId })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'pending') {
                    setMyOutgoing(prev => [...prev, targetId]);
                } else if (data.status === 'connected') {
                    setMyConnections(prev => [...prev, targetId]);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAccept = async (targetId: number) => {
        try {
            const res = await fetch('/api/users/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUserId: targetId })
            });
            if (res.ok) {
                setMyConnections(prev => [...prev, targetId]);
                setMyIncoming(prev => prev.filter(id => id !== targetId));
            }
        } catch (error) {
            console.error(error);
        }
    };



    const handleCancelRequest = async (targetId: number) => {
        try {
            await fetch('/api/users/cancel-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUserId: targetId })
            });
            setMyOutgoing(prev => prev.filter(id => id !== targetId));
        } catch (error) {
            console.error(error);
        }
    };

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
        if (filterInterest && !student.interests.includes(filterInterest)) return false;
        if (filterYear && student.year !== filterYear) return false;
        if (filterMajor && student.major !== filterMajor) return false;

        // Connection filter
        const isConnected = myConnections.includes(student.id);
        if (filterConnection === "connected" && !isConnected) return false;
        if (filterConnection === "not_connected" && isConnected) return false;

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
        <div className="max-w-[1000px] mx-auto py-6 px-4">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Entdecke Studierende</h2>
                    <p className="text-muted-foreground">Finde Studierende, die zu dir passen.</p>
                </div>

                {/* AI Toggle */}
                <button
                    onClick={() => setAiMode(!aiMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${aiMode
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                        : 'bg-card text-muted-foreground border border-input hover:border-primary/50'
                        }`}
                >
                    <Sparkles size={18} className={aiMode ? 'fill-white/20' : ''} />
                    {aiMode ? 'KI Matching Aktiv' : 'KI Matching aktivieren'}
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-lg leading-5 bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:placeholder-muted-foreground/70 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Suche nach Namen, Interessen oder Studiengängen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
                <select
                    className="px-4 py-2 bg-card text-foreground border border-input rounded-lg text-sm focus:outline-none focus:border-primary"
                    onChange={(e) => setFilterMajor(e.target.value)}
                    value={filterMajor}
                >
                    <option value="">Alle Studiengänge</option>
                    {Array.from(new Set(students.map(s => s.major))).sort().map(major => (
                        <option key={major} value={major}>{major}</option>
                    ))}
                </select>
                <select
                    className="px-4 py-2 bg-card text-foreground border border-input rounded-lg text-sm focus:outline-none focus:border-primary"
                    onChange={(e) => setFilterYear(e.target.value)}
                    value={filterYear}
                >
                    <option value="">Alle Jahrgänge</option>
                    {Array.from(new Set([
                        ...students.map(s => s.year),
                        "SoSe 25",
                        "WiSe 25/26",
                        "SoSe 26",
                        "WiSe 26/27"
                    ])).sort().map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <select
                    className="px-4 py-2 bg-card text-foreground border border-input rounded-lg text-sm focus:outline-none focus:border-primary"
                    onChange={(e) => setFilterInterest(e.target.value)}
                    value={filterInterest}
                >
                    <option value="">Alle Interessen</option>
                    {Array.from(new Set(students.flatMap(s => s.interests))).sort().map(interest => (
                        <option key={interest} value={interest}>{interest}</option>
                    ))}
                </select>
                <select
                    className="px-4 py-2 bg-card text-foreground border border-input rounded-lg text-sm focus:outline-none focus:border-primary"
                    onChange={(e) => setMinScore(parseInt(e.target.value))}
                    value={minScore}
                >
                    <option value="0">Alle Matches</option>
                    <option value="30">Min. 30% Match</option>
                    <option value="50">Min. 50% Match</option>
                    <option value="70">Min. 70% Match</option>
                </select>
                <select
                    className="px-4 py-2 bg-card text-foreground border border-input rounded-lg text-sm focus:outline-none focus:border-primary"
                    onChange={(e) => setFilterConnection(e.target.value)}
                    value={filterConnection}
                >
                    <option value="all">Alle Verbindungen</option>
                    <option value="connected">Meine Verbindungen</option>
                    <option value="not_connected">Noch keine Verbindung</option>
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
                        isConnected={myConnections.includes(student.id)}
                        isPending={myOutgoing.includes(student.id)}
                        isIncoming={myIncoming.includes(student.id)}
                        onMessage={() => onMessage?.(student.id)}
                        onConnect={() => handleConnect(student.id)}
                        onCancel={() => handleCancelRequest(student.id)}
                        onAccept={() => handleAccept(student.id)}
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
