import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Flag } from 'lucide-react';

interface ReportMenuProps {
    onReport: () => void;
    className?: string;
    itemType?: string; // e.g. "Post", "User", "Content"
}

export function ReportMenu({ onReport, className = "", itemType = "Inhalt" }: ReportMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleReport = () => {
        // Simple mock alert/confirm
        if (window.confirm(`${itemType} wirklich melden?`)) {
            onReport();
            setIsOpen(false);
        }
    };

    return (
        <div className={`relative ${className}`} ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-1.5 text-muted-foreground hover:bg-muted rounded-full transition-colors"
            >
                <MoreVertical size={18} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReport();
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors"
                    >
                        <Flag size={14} />
                        <span>Melden</span>
                    </button>
                </div>
            )}
        </div>
    );
}
