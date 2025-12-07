import { useState, useRef, useEffect } from 'react';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import clsx from 'clsx';

interface UserMenuProps {
    currentUser: any;
    onLogout: () => void;
}

export function UserMenu({ currentUser, onLogout }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { setTheme, theme } = useTheme();

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || "User")}&background=random`;

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
                <img
                    src={avatarUrl}
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-full border border-border"
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-card border border-border py-1 animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="p-3 border-b border-border/50">
                        <p className="text-sm font-semibold text-foreground">{currentUser?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{currentUser?.email || "student@university.edu"}</p>
                    </div>

                    <div className="p-1">
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Einstellungen
                        </div>

                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="w-full flex items-center justify-between px-2 py-2 text-sm text-foreground rounded-lg hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                                <span>Dark Mode</span>
                            </div>
                            <div className={clsx(
                                "w-9 h-5 rounded-full relative transition-colors",
                                theme === 'dark' ? "bg-primary" : "bg-muted"
                            )}>
                                <div className={clsx(
                                    "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200",
                                    theme === 'dark' ? "left-[18px]" : "left-0.5"
                                )} />
                            </div>
                        </button>
                    </div>

                    <div className="h-px bg-border/50 my-1" />

                    <div className="p-1">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onLogout();
                            }}
                            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                            <LogOut size={16} />
                            <span>Abmelden</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
