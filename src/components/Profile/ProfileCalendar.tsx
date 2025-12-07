import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import type { Event } from '../../data/mockData';

interface ProfileCalendarProps {
    events: Event[];
}

export function ProfileCalendar({ events }: ProfileCalendarProps) {
    if (events.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
                <Calendar className="mx-auto text-muted-foreground mb-3 opacity-50" size={32} />
                <p className="text-muted-foreground text-sm font-medium">Keine anstehenden Events.</p>
                <p className="text-xs text-muted-foreground mt-1">Melde dich für Events an, um sie hier zu sehen.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {events.map((event) => {
                // Formatting date logic for "Morgen" vs "14.10.2024"
                const isSpecialDate = !event.date.includes('.');
                const [day, month] = event.date.split('.');

                return (
                    <div key={event.id} className="flex gap-4 p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all group items-center">
                        {/* Date Box */}
                        <div className={`flex-shrink-0 w-16 h-16 flex flex-col items-center justify-center rounded-xl p-1 text-center border ${isSpecialDate ? 'bg-primary/10 border-primary/20' : 'bg-muted border-border'}`}>
                            {isSpecialDate ? (
                                <span className="text-[10px] font-bold text-primary uppercase whitespace-nowrap">{event.date}</span>
                            ) : (
                                <>
                                    <span className="text-lg font-bold text-foreground leading-none">{day}/{month}</span>
                                </>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors text-base">
                                    {event.title}
                                </h4>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1.5 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} className="text-primary/70" />
                                    <span>{event.time} Uhr</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={14} className="text-primary/70" />
                                    <span className="line-clamp-1">{event.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
                            <ArrowRight size={20} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
