import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import type { Group } from '../../data/mockData';
import { GroupCard } from './GroupCard';
import { calculateScore } from '../../utils/matching';
import { CreateResourceModal } from '../UI/CreateResourceModal';
import { GroupDetailsModal } from './GroupDetailsModal';


interface GroupsProps {
    currentUser: any;
    onJoinGroup: (id: number) => void;
}

export function Groups({ currentUser, onJoinGroup }: GroupsProps) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetch('/api/groups')
            .then(res => res.json())
            .then(data => setGroups(data));
    }, []);

    const handleCreateGroup = async (data: any) => {
        const res = await fetch('/api/groups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            const newGroup = await res.json();
            setGroups(prev => [...prev, newGroup]);
        }
    };

    const handleLeaveGroup = async (groupId: number) => {
        const res = await fetch('/api/groups/leave', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId })
        });
        if (res.ok) {
            onJoinGroup(groupId); // Trigger parent refresh or update local state? 
            // Actually onJoinGroup likely refreshes the parent's user state.
            // But we also need to update the groups list to reflect member count changes?
            // For now, let's assume onJoinGroup (which is likely handleJoinGroup in App.tsx) handles refreshing current user.
            // We should reload groups here to get updated member counts.
            const updatedGroups = await fetch('/api/groups').then(r => r.json());
            setGroups(updatedGroups);
        }
    };

    const myGroups = groups.filter(g => currentUser.myGroups.includes(g.id));

    const otherGroups = groups
        .filter(g => {
            // 1. Exclude joined groups
            if (currentUser.myGroups.includes(g.id)) return false;

            // 2. Filter by Course/Module
            // If the group is linked to a course, only show it if the user is in that course
            if (g.course && !currentUser.courses?.includes(g.course)) {
                return false;
            }

            return true;
        })
        .map(g => ({
            ...g,
            score: calculateScore(g.tags, currentUser.interests),
            members: g.members || 1
        }))
        .sort((a, b) => b.score - a.score);

    const recommendedGroups = otherGroups.filter(g => g.score >= 50);
    const allGroups = otherGroups; // Or remaining

    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    return (
        <div className="max-w-[1000px] mx-auto py-6 relative">
            <CreateResourceModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateGroup}
                type="group"
            />

            {selectedGroup && (
                <GroupDetailsModal
                    group={selectedGroup}
                    isMember={currentUser.myGroups.includes(selectedGroup.id)}
                    onClose={() => setSelectedGroup(null)}
                    onJoin={(id) => {
                        onJoinGroup(id);
                        // Optimistic update of local state
                        if (selectedGroup && selectedGroup.id === id) {
                            // Force close or update state?
                        }
                        // We rely on onJoinGroup to refresh parent.
                    }}
                    onLeave={handleLeaveGroup}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Lerngruppen</h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-medium shadow-sm hover:shadow hover:bg-primary-dark transition-all"
                >
                    <Plus size={18} />
                    <span>Gruppe erstellen</span>
                </button>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Gruppen suchen..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
            </div>

            {myGroups.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
                        Meine Gruppen
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myGroups.map(group => (
                            <GroupCard
                                key={group.id}
                                group={group}
                                score={0}
                                isMember={true}
                                onJoin={onJoinGroup}
                                onLeave={handleLeaveGroup}
                                onViewDetails={setSelectedGroup}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="mb-10">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    Empfohlene Gruppen
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedGroups.map(group => (
                        <GroupCard
                            key={group.id}
                            group={group}
                            score={group.score}
                            isMember={false}
                            onJoin={onJoinGroup}
                            onLeave={handleLeaveGroup}
                            onViewDetails={setSelectedGroup}
                        />
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gray-300 rounded-full"></span>
                    Alle Gruppen
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allGroups.map(group => (
                        <GroupCard
                            key={group.id}
                            group={group}
                            score={group.score}
                            isMember={false}
                            onJoin={onJoinGroup}
                            onLeave={handleLeaveGroup}
                            onViewDetails={setSelectedGroup}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
