import type { Group } from '../../data/mockData';
import { Users, BookOpen } from 'lucide-react';
import { ReportMenu } from '../UI/ReportMenu';
import clsx from 'clsx';

interface GroupCardProps {
    group: Group;
    score: number;
    isMember: boolean;
    onJoin: (id: number) => void;
    onLeave: (id: number) => void;
    onViewDetails: (group: Group) => void;
}

export function GroupCard({ group, score, isMember, onJoin, onLeave, onViewDetails }: GroupCardProps) {
    const isFull = group.members >= group.maxMembers;
    const canJoin = !isMember && !isFull;

    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-5 flex flex-col h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative">
            <div className="absolute top-4 right-4 z-10" onClick={e => e.stopPropagation()}>
                <ReportMenu onReport={() => alert("Gruppe gemeldet.")} itemType="Gruppe" />
            </div>

            <div className="flex justify-between items-start mb-2 pr-8">
                <div
                    className="text-lg font-bold text-foreground leading-tight cursor-pointer hover:text-primary transition-colors"
                    onClick={() => onViewDetails(group)}
                >
                    {group.name}
                </div>
                {score > 0 && !isMember && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ml-2">
                        {score}% Match
                    </div>
                )}
            </div>

            {group.course && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3 font-medium">
                    <BookOpen size={14} className="text-indigo-400" />
                    <span>{group.course}</span>
                </div>
            )}

            <p
                className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow cursor-pointer"
                onClick={() => onViewDetails(group)}
            >
                {group.desc}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
                {group.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3 mt-auto gap-3">
                <button
                    onClick={() => onViewDetails(group)}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                >
                    Details
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Users size={14} />
                        <span>{group.members}/{group.maxMembers}</span>
                    </div>

                    <button
                        onClick={() => isMember ? onLeave(group.id) : onJoin(group.id)}
                        disabled={!isMember && !canJoin}
                        className={clsx(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                            isMember
                                ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800"
                                : isFull
                                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                        )}
                    >
                        {isMember ? 'Verlassen' : isFull ? 'Voll' : 'Beitreten'}
                    </button>
                </div>
            </div>
        </div>
    );
}
