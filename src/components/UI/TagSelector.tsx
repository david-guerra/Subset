import clsx from 'clsx';
import { X } from 'lucide-react';

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
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
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
