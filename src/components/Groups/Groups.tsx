import { useMemo } from 'react';
import { INITIAL_DATA } from '../../data/mockData';
import { calculateScore } from '../../utils/matching';
import { GroupCard } from './GroupCard';
import { Plus } from 'lucide-react';

interface GroupsProps {
    currentUser: {
        year: number;
        interests?: string[];
        myGroups: number[];
    };
    onJoinGroup: (id: number) => void;
}

export function Groups({ currentUser, onJoinGroup }: GroupsProps) {

    const processedGroups = useMemo(() => {
        return INITIAL_DATA.groups.map(group => ({
            ...group,
            score: calculateScore(group.tags, currentUser, undefined)
        }));
    }, [currentUser]);

    const myGroups = processedGroups.filter(g => currentUser.myGroups.includes(g.id));
    const recommendedGroups = processedGroups
        .filter(g => !currentUser.myGroups.includes(g.id) && g.score > 30)
        .sort((a, b) => b.score - a.score);
    const allGroups = processedGroups.sort((a, b) => b.score - a.score);

    return (
        <div className="max-w-[1000px] mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Lerngruppen</h2>
                    <p className="text-gray-500">Finde Gruppen für deine Kurse & Interessen</p>
                </div>
                <button
                    onClick={() => alert("Funktion 'Gruppe erstellen' kommt bald! (Modal implementation pending)")}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-hover shadow-sm font-medium transition-all"
                >
                    <Plus size={18} />
                    <span>Gruppe erstellen</span>
                </button>
            </div>

            {myGroups.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 px-1 border-l-4 border-success pl-3">Meine Gruppen</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myGroups.map(group => (
                            <GroupCard
                                key={group.id}
                                group={group}
                                score={group.score}
                                isMember={true}
                                onJoin={onJoinGroup}
                            />
                        ))}
                    </div>
                </div>
            )}

            {recommendedGroups.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 px-1 border-l-4 border-indigo-400 pl-3">Empfohlen für dich</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedGroups.map(group => (
                            <GroupCard
                                key={group.id}
                                group={group}
                                score={group.score}
                                isMember={false}
                                onJoin={onJoinGroup}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="mb-10">
                <h3 className="text-lg font-bold text-gray-800 mb-4 px-1 border-l-4 border-gray-300 pl-3">Alle Gruppen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allGroups.map(group => (
                        <GroupCard
                            key={group.id}
                            group={group}
                            score={group.score}
                            isMember={currentUser.myGroups.includes(group.id)}
                            onJoin={onJoinGroup}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
