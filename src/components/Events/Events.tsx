import { useState, useEffect } from 'react';
import { Search, Calendar } from 'lucide-react';
import type { Event } from '../../data/mockData';
import { EventCard } from './EventCard';

interface EventsProps {
    currentUser?: any;
}

export function Events({ currentUser }: EventsProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [savedEvents, setSavedEvents] = useState<number[]>([]);

    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then(data => setEvents(data));
    }, []);

    const handleToggleSave = (id: number) => {
        setSavedEvents(prev =>
            prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
        );
    };

    const handleJoinEvent = async (eventId: number) => {
        try {
            const res = await fetch('/api/events/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId })
            });
            if (res.ok) {
                const { event: updatedEvent } = await res.json();
                setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
            }
        } catch (error) {
            console.error("Failed to join event", error);
        }
    };

    const handleLeaveEvent = async (eventId: number) => {
        try {
            const res = await fetch('/api/events/leave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId })
            });
            if (res.ok) {
                const { event: updatedEvent } = await res.json();
                setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
            }
        } catch (error) {
            console.error("Failed to leave event", error);
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch =
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType = filterType === 'all' || event.organizer.type === filterType;

        return matchesSearch && matchesType;
    });

    // Sort by date (mock simplistic sort)
    const sortedEvents = filteredEvents;

    return (
        <div className="max-w-[1000px] mx-auto py-6 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Campus Events</h2>
                    <p className="text-muted-foreground">Verpasse keine Veranstaltungen, Partys und Workshops.</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Events suchen..."
                        className="w-full pl-10 pr-4 py-2 bg-card text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {['all', 'university', 'club', 'group'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterType === type
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card border border-input text-foreground hover:bg-accent'
                                }`}
                        >
                            {type === 'all' ? 'Alle' :
                                type === 'university' ? 'Campus' :
                                    type === 'club' ? 'Clubs' : 'Gruppen'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Event Grid */}
            {sortedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedEvents.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                            isSaved={savedEvents.includes(event.id)}
                            onToggleSave={handleToggleSave}
                            currentUserId={currentUser?.id}
                            onJoinEvent={handleJoinEvent}
                            onLeaveEvent={handleLeaveEvent}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
                    <Calendar size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-bold text-foreground mb-1">Keine Events gefunden</h3>
                    <p className="text-muted-foreground">Versuche es mit einer anderen Suche oder Filterung.</p>
                </div>
            )}
        </div>
    );
}
