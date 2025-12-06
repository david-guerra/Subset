import { useState } from 'react';
import clsx from 'clsx';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

interface TagSelectorProps {
    tags?: string[];
    selectedTags: string[];
    onToggle: (tag: string) => void;
    allowCustom?: boolean;
}

const AVAILABLE_TAGS = [
    "KI", "Coding", "Design", "Marketing", "Startups",
    "Sport", "Musik", "Gaming", "Fotografie", "Reisen",
    "Lesen", "Kunst", "Fussball", "Yoga", "Kochen",
    "Politik", "Nachhaltigkeit"
];

export function TagSelector({ tags = AVAILABLE_TAGS, selectedTags, onToggle }: TagSelectorProps) {
    const [showAll, setShowAll] = useState(false);
    const visibleTags = showAll ? tags : tags.slice(0, 7); // Show 7 initially

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
                {visibleTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                        <button
                            key={tag}
                            onClick={() => onToggle(tag)}
                            className={clsx(
                                "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
                                isSelected
                                    ? "bg-primary text-white border-primary"
                                    : "bg-gray-100 text-gray-600 border-transparent hover:bg-indigo-50 hover:border-indigo-200"
                            )}
                        >
                            {tag}
                        </button>
                    );
                })}

                {tags.length > 7 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-3 py-1.5 rounded-full text-sm font-medium text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
                    >
                        {showAll ? (
                            <>
                                <ChevronUp size={16} />
                                <span>Weniger</span>
                            </>
                        ) : (
                            <>
                                <ChevronDown size={16} />
                                <span>+{tags.length - 7} weitere</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

interface TagBadgeProps {
    tag: string;
    onRemove?: () => void;
}

export function TagBadge({ tag, onRemove }: TagBadgeProps) {
    return (
        <span
            className={clsx(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800",
                onRemove && "pr-1"
            )}
        >
            {tag}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="ml-1 text-indigo-600 hover:text-indigo-900 focus:outline-none"
                >
                    <X size={12} />
                </button>
            )}
        </span>
    );
}
