import type { Club } from '../../data/mockData';
import { Users, Calendar, Clock } from 'lucide-react';
import { ReportMenu } from '../UI/ReportMenu';
import clsx from 'clsx';

interface ClubCardProps {
    club: Club;
    score: number;
    isMember: boolean;
    onJoin: (id: number) => void;
    onLeave: (id: number) => void;
    onViewDetails: (club: Club) => void;
}

export function ClubCard({ club, score, isMember, onJoin, onLeave, onViewDetails }: ClubCardProps) {
    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-5 flex flex-col h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative">
            <div className="absolute top-4 right-4 z-10" onClick={e => e.stopPropagation()}>
                <ReportMenu onReport={() => alert("Club gemeldet.")} itemType="Club" />
            </div>

            <div className="flex justify-between items-start mb-2">
                <div
                    className="text-lg font-bold text-card-foreground leading-tight cursor-pointer hover:text-primary transition-colors pr-8 relative"
                    onClick={() => onViewDetails(club)}
                >
                    {club.name}
                </div>
                {score > 0 && !isMember && (
                    <div className="bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ml-2">
                        {score}% Match
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3 font-medium">
                <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-secondary" />
                    <span>{club.meetingDay}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-secondary" />
                    <span>{club.meetingTime}</span>
                </div>
            </div>

            <p
                className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow cursor-pointer"
                onClick={() => onViewDetails(club)}
            >
                {club.desc}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
                {club.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3 mt-auto gap-3">
                <button
                    onClick={() => onViewDetails(club)}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                >
                    Details
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Users size={14} />
                        <span>{club.members}</span>
                    </div>

                    <button
                        onClick={() => isMember ? onLeave(club.id) : onJoin(club.id)}
                        className={clsx(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                            isMember
                                ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm"
                        )}
                    >
                        {isMember ? 'Verlassen' : 'Beitreten'}
                    </button>
                </div>
            </div>
        </div>
    );
}
