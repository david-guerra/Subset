import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import type { Club } from '../../data/mockData';
import { ClubCard } from './ClubCard';
import { calculateScore } from '../../utils/matching';
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

    const handleCreateClub = async (data: any) => {
        const res = await fetch('/api/clubs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            const newClub = await res.json();
            setClubs(prev => [...prev, newClub]);
        }
    };

    const myClubs = clubs.filter(c => currentUser.myClubs.includes(c.id));

    const otherClubs = clubs
        .filter(c => !currentUser.myClubs.includes(c.id))
        .map(c => ({
            ...c,
            score: calculateScore(c.tags, currentUser.interests)
        }))
        .sort((a, b) => b.score - a.score);

    const [selectedClub, setSelectedClub] = useState<Club | null>(null);

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

    const recommendedClubs = otherClubs.filter(c => c.score >= 30);
    const allClubs = otherClubs;

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
                <h2 className="text-2xl font-bold text-gray-900">Campus Clubs</h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-pink text-white rounded-full font-medium shadow-sm hover:shadow hover:bg-pink-600 transition-all"
                >
                    <Plus size={18} />
                    <span>Club gründen</span>
                </button>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Clubs suchen..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink/20 transition-all font-medium"
                />
            </div>

            {myClubs.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
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
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary-pink rounded-full"></span>
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
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gray-300 rounded-full"></span>
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
