import type { Club } from '../../data/mockData';
import { Users, Calendar, Clock } from 'lucide-react';
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
        <div className="bg-white rounded-xl shadow-sm border border-border p-5 flex flex-col h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="flex justify-between items-start mb-2">
                <div
                    className="text-lg font-bold text-gray-900 leading-tight cursor-pointer hover:text-primary transition-colors"
                    onClick={() => onViewDetails(club)}
                >
                    {club.name}
                </div>
                {score > 0 && !isMember && (
                    <div className="bg-pink-50 text-primary-pink text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ml-2">
                        {score}% Match
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3 font-medium">
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
                className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow cursor-pointer"
                onClick={() => onViewDetails(club)}
            >
                {club.desc}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
                {club.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-auto gap-3">
                <button
                    onClick={() => onViewDetails(club)}
                    className="text-sm font-medium text-gray-500 hover:text-primary transition-colors whitespace-nowrap"
                >
                    Details
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Users size={14} />
                        <span>{club.members}</span>
                    </div>

                    <button
                        onClick={() => isMember ? onLeave(club.id) : onJoin(club.id)}
                        className={clsx(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                            isMember
                                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                : "bg-primary-pink text-white hover:bg-pink-600 shadow-sm"
                        )}
                    >
                        {isMember ? 'Verlassen' : 'Beitreten'}
                    </button>
                </div>
            </div>
        </div>
    );
}
