import { useState } from 'react';
import { MapPin, Calendar, Clock, User, Bookmark } from 'lucide-react';
import { type Event } from '../../data/mockData';

interface EventCardProps {
    event: Event;
    isSaved?: boolean;
    onToggleSave?: (id: number) => void;
    currentUserId?: number;
    onJoinEvent?: (eventId: number) => Promise<void>;
    onLeaveEvent?: (eventId: number) => Promise<void>;
}

export function EventCard({ event, isSaved, onToggleSave, currentUserId, onJoinEvent, onLeaveEvent }: EventCardProps) {
    const [imgError, setImgError] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    // Check if current user is registered
    const isRegistered = currentUserId ? event.attendeeIds?.includes(currentUserId) : false;

    const handleJoinClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!currentUserId || isJoining) return;

        setIsJoining(true);
        try {
            if (isRegistered) {
                await onLeaveEvent?.(event.id);
            } else {
                await onJoinEvent?.(event.id);
            }
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
            {/* Image Section */}
            <div className="relative h-48 bg-muted">
                {event.image && !imgError ? (
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 bg-muted"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-accent/50">
                        <Calendar size={48} className="opacity-20" />
                    </div>
                )}

                {/* Overlay Badge for Type */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-background/90 text-foreground shadow-sm backdrop-blur-sm">
                        {event.organizer.type === 'university' ? 'Campus' : event.organizer.type}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide shadow-sm backdrop-blur-sm ${event.isPublic ? 'bg-green-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>
                        {event.isPublic ? 'Open' : 'Private'}
                    </span>
                </div>

                {/* Save Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave?.(event.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background text-foreground shadow-sm backdrop-blur-sm transition-all"
                >
                    <Bookmark size={18} className={isSaved ? "fill-primary text-primary" : "text-muted-foreground"} />
                </button>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-primary">{event.date}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {event.attendees} Teilnehmer
                    </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {event.title}
                </h3>

                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                    {event.description}
                </p>

                {/* Details */}
                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-primary/70" />
                        <span>{event.time} Uhr</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-primary/70" />
                        <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-primary/70" />
                        <span className="line-clamp-1">
                            Organisiert von <span className="font-medium text-foreground">{event.organizer.name}</span>
                        </span>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-3">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 flex-1">
                        {event.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] rounded-sm font-medium">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Join Button */}
                    <button
                        onClick={handleJoinClick}
                        disabled={isJoining}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all shadow-sm ${isRegistered
                                ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                            }`}
                    >
                        {isJoining ? '...' : isRegistered ? 'Angemeldet' : 'Anmelden'}
                    </button>
                </div>
            </div>
        </div>
    );
}
