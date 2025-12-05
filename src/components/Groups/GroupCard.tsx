import type { Group } from '../../data/mockData';
import { Users, BookOpen } from 'lucide-react';
import clsx from 'clsx';

interface GroupCardProps {
    group: Group;
    score: number;
    isMember: boolean;
    onJoin: (id: number) => void;
}

export function GroupCard({ group, score, isMember, onJoin }: GroupCardProps) {
    const isFull = group.members >= group.maxMembers;
    const canJoin = !isMember && !isFull;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-border p-5 flex flex-col h-full transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-2">
                <div className="text-lg font-bold text-gray-900 leading-tight">
                    {group.name}
                </div>
                {score > 30 && !isMember && (
                    <div className="bg-indigo-50 text-primary text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ml-2">
                        {score}% Match
                    </div>
                )}
            </div>

            {group.course && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3 font-medium">
                    <BookOpen size={14} className="text-indigo-400" />
                    <span>{group.course}</span>
                </div>
            )}

            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                {group.desc}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
                {group.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-auto">
                <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                    <Users size={16} />
                    <span>{group.members}/{group.maxMembers}</span>
                    <span className="text-gray-300 mx-1">|</span>
                    <span className={clsx(isFull && !isMember ? "text-red-500" : "text-gray-500")}>
                        {isFull ? 'Voll' : 'Offen'}
                    </span>
                </div>

                <button
                    onClick={() => onJoin(group.id)}
                    disabled={!canJoin}
                    className={clsx(
                        "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                        isMember
                            ? "bg-green-100 text-green-700 cursor-default"
                            : isFull
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-primary-hover shadow-sm"
                    )}
                >
                    {isMember ? 'Beigetreten' : isFull ? 'Voll' : 'Beitreten'}
                </button>
            </div>
        </div>
    );
}
