import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Home, Compass, MessageSquare, UserCircle, Bell } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { NotificationsDropdown } from './NotificationsDropdown';

export type NavTab = 'feed' | 'explore' | 'chats' | 'profile';

interface NavbarProps {
    activeTab: NavTab;
    onTabChange: (tab: NavTab) => void;
    currentUser?: any;
    onLogout: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'chats', label: 'Chats', icon: MessageSquare },
    { id: 'profile', label: 'Profil', icon: UserCircle },
];

export function Navbar({ activeTab, onTabChange, currentUser, onLogout }: NavbarProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className={clsx(
            "bg-background sticky top-0 z-50 transition-all duration-300",
            activeTab === 'explore'
                ? "border-b-0"
                : "shadow-sm border-b border-border"
        )}>
            <div className="max-w-[1000px] mx-auto px-5 h-16 flex justify-between items-center">
                <div className="flex items-center">
                    <img src="/logo.svg?v=4" alt="SubSet" className="h-8 w-auto" />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={clsx(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    activeTab === item.id
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon size={18} className={clsx(activeTab === item.id && "stroke-[2.5px]")} />
                                <span className="hidden md:inline">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-border mx-2"></div>

                    {/* Notification Bell */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={clsx(
                                "p-2 rounded-lg transition-colors relative",
                                showNotifications ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <Bell size={20} />
                            {/* Mock Unread Dot */}
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
                        </button>

                        {showNotifications && currentUser && (
                            <NotificationsDropdown
                                currentUser={currentUser}
                                onClose={() => setShowNotifications(false)}
                            />
                        )}
                    </div>

                    {currentUser && (
                        <UserMenu currentUser={currentUser} onLogout={onLogout} />
                    )}
                </div>
            </div>
        </nav>
    );
}
