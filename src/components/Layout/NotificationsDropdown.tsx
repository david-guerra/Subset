import { useState, useEffect } from 'react';

interface Notification {
    id: number;
    title: string;
    text: string;
    time: string;
    read: boolean;
    type: 'info' | 'message' | 'event' | 'success';
}

interface NotificationsDropdownProps {
    currentUser: any;
    onClose: () => void;
}

export function NotificationsDropdown({ currentUser, onClose }: NotificationsDropdownProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Generate Mock Notifications based on user context
        const mocks: Notification[] = [];

        // Mock Group Updates
        if (currentUser.myGroups && currentUser.myGroups.length > 0) {
            mocks.push({
                id: 2,
                title: "Neue Nachricht",
                text: "Lisa hat in 'Lern-Gruppe Informatik' geschrieben: 'Wann treffen wir uns?'",
                time: "Vor 10 Min.",
                read: false,
                type: 'message'
            });
        }

        // Mock Club Updates
        if (currentUser.myClubs && currentUser.myClubs.length > 0) {
            mocks.push({
                id: 3,
                title: "Event Erinnerung",
                text: "Das Treffen vom 'Uni Sport Club' beginnt morgen um 18:00 Uhr.",
                time: "Vor 1 Std.",
                read: false,
                type: 'event'
            });
        }

        // Mock Course Updates
        if (currentUser.courses && currentUser.courses.length > 0) {
            mocks.push({
                id: 4,
                title: "Neues Material",
                text: `Ein neues Skript wurde in '${currentUser.courses[0]}' hochgeladen.`,
                time: "Vor 2 Std.",
                read: true,
                type: 'info'
            });
        }

        setNotifications(mocks);
    }, [currentUser]);

    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-popover rounded-xl shadow-xl border border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
            <div className="p-3 border-b border-border flex justify-between items-center bg-muted/30">
                <span className="font-semibold text-sm">Benachrichtigungen</span>
                <button className="text-[10px] text-primary font-medium hover:underline">
                    Alle als gelesen markieren
                </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div key={n.id} className={`p-3 border-b border-border/50 hover:bg-muted/50 transition-colors flex gap-3 ${!n.read ? 'bg-primary/5' : ''}`}>
                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-0.5">
                                    <span className="text-sm font-semibold text-foreground">{n.title}</span>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{n.time}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {n.text}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        Keine Benachrichtigungen
                    </div>
                )}
            </div>

            <div className="p-2 border-t border-border bg-muted/30 text-center">
                <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">
                    Schließen
                </button>
            </div>
        </div>
    );
}
