import clsx from 'clsx';
import { Home, Compass, Users, Tent, BookOpen, MessageSquare, UserCircle } from 'lucide-react';

export type NavTab = 'feed' | 'explore' | 'groups' | 'clubs' | 'modules' | 'chats' | 'profile';

interface NavbarProps {
    activeTab: NavTab;
    onTabChange: (tab: NavTab) => void;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'groups', label: 'Gruppen', icon: Users },
    { id: 'clubs', label: 'Clubs', icon: Tent },
    { id: 'modules', label: 'Module', icon: BookOpen },
    { id: 'chats', label: 'Chats', icon: MessageSquare },
    { id: 'profile', label: 'Profil', icon: UserCircle },
];

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-[1000px] mx-auto px-5 h-16 flex justify-between items-center">
                <div className="flex items-center">
                    <img src="/logo.svg?v=4" alt="SubSet" className="h-8 w-auto" />
                </div>

                <div className="flex gap-2">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                activeTab === item.id
                                    ? "bg-indigo-50 text-primary"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon size={18} className={clsx(activeTab === item.id && "stroke-[2.5px]")} />
                            <span className="hidden md:inline">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
