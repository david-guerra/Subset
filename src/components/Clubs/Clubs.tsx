import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import type { Club } from '../../data/mockData';
import { ClubCard } from './ClubCard';
import { calculateMatchScore } from '../../utils/matching';
import { CreateResourceModal } from '../UI/CreateResourceModal';
import { ClubDetailsModal } from './ClubDetailsModal';


interface ClubsProps {
    currentUser: any;
    onJoinClub: (id: number) => void;
}

export function Clubs({ currentUser, onJoinClub }: ClubsProps) {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetch('/api/clubs')
            .then(res => res.json())
            .then(data => setClubs(data));
    }, []);

    const handleCreateClub = async () => {
        // Mock submission
        setIsCreateModalOpen(false);
        // We can add a toast here if we had a toast system, or simple alert for prototype
        alert("✅ Antrag eingereicht!\n\nDein Vorschlag für den Club wurde an die Studierendenvertretung übermittelt. Wir melden uns bei dir, sobald er genehmigt wurde.");

        // Do NOT create the club or update state immediately
    };

    const [selectedClub, setSelectedClub] = useState<Club | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredClubs = clubs.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const myClubs = filteredClubs.filter(c => currentUser.myClubs.includes(c.id));

    const otherClubs = filteredClubs
        .filter(c => !currentUser.myClubs.includes(c.id))
        .map(c => ({
            ...c,
            score: calculateMatchScore(c.tags, currentUser.interests)
        }))
        .sort((a, b) => b.score - a.score);

    let recommendedClubs = otherClubs.filter(c => c.score >= 30);
    if (recommendedClubs.length === 0 && otherClubs.length > 0) {
        recommendedClubs = [otherClubs[0]];
    }
    const allClubs = otherClubs;

    const handleLeaveClub = async (clubId: number) => {
        const res = await fetch('/api/clubs/leave', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clubId })
        });
        if (res.ok) {
            onJoinClub(clubId); // Refresh parent/user state
            // Also need to refresh local clubs list to update member counts
            const updatedClubs = await fetch('/api/clubs').then(r => r.json());
            setClubs(updatedClubs);
        }
    };

    return (
        <div className="max-w-[1000px] mx-auto py-6 relative">
            <CreateResourceModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateClub}
                type="club"
            />

            {selectedClub && (
                <ClubDetailsModal
                    club={selectedClub}
                    isMember={currentUser.myClubs?.includes(selectedClub.id)}
                    onClose={() => setSelectedClub(null)}
                    onJoin={(id) => {
                        onJoinClub(id);
                        // Optimistic or refresh?
                    }}
                    onLeave={handleLeaveClub}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Campus Clubs</h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-full font-medium shadow-sm hover:shadow hover:bg-secondary/90 transition-all"
                >
                    <Plus size={18} />
                    <span>Club gründen</span>
                </button>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                    type="text"
                    placeholder="Clubs suchen..."
                    className="w-full pl-10 pr-4 py-2 bg-card text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {myClubs.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
                        Meine Clubs
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myClubs.map(club => (
                            <ClubCard
                                key={club.id}
                                club={club}
                                score={0}
                                isMember={true}
                                onJoin={onJoinClub}
                                onLeave={handleLeaveClub}
                                onViewDetails={setSelectedClub}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="mb-10">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                    Empfohlene Clubs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedClubs.map(club => (
                        <ClubCard
                            key={club.id}
                            club={club}
                            score={club.score}
                            isMember={false}
                            onJoin={onJoinClub}
                            onLeave={handleLeaveClub}
                            onViewDetails={setSelectedClub}
                        />
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-muted rounded-full"></span>
                    Alle Clubs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allClubs.map(club => (
                        <ClubCard
                            key={club.id}
                            club={club}
                            score={club.score}
                            isMember={false}
                            onJoin={onJoinClub}
                            onLeave={handleLeaveClub}
                            onViewDetails={setSelectedClub}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
