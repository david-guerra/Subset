import { useState } from 'react';
import { TagSelector } from '../UI/TagSelector';
import type { Post } from '../../data/mockData';

interface CreatePostProps {
    onPostCreate: (post: Post) => void;
    currentUser: { name: string };
}

export function CreatePost({ onPostCreate, currentUser }: CreatePostProps) {
    const [content, setContent] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const charCount = content.length;
    const isOverLimit = charCount > 500;

    const handleToggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = () => {
        if (!content.trim() || isOverLimit) return;

        // Create new post object
        const newPost: Post = {
            id: Date.now(),
            authorId: 999, // Mock ID for current user
            content: content,
            tags: selectedTags,
            likes: 0,
            comments: 0,
            timestamp: "gerade eben",
            hasImage: false
        };

        onPostCreate(newPost);
        setContent("");
        setSelectedTags([]);
    };

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || "User")}&background=4f46e5&color=fff`;

    return (
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
                <img src={avatarUrl} alt="Du" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                    <div className="font-semibold text-gray-900">Was gibt's Neues?</div>
                    <div className="text-xs text-gray-500">Teile deine Gedanken mit der Community</div>
                </div>
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Was möchtest du teilen?"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors min-h-[100px] text-gray-800 resize-none mb-4"
            />

            <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Tags hinzufügen:</div>
                <TagSelector selectedTags={selectedTags} onToggle={handleToggleTag} />
            </div>

            <div className="flex justify-between items-center pt-2">
                <div className={`text-xs ${isOverLimit ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                    {charCount}/500 Zeichen
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={!content.trim() || isOverLimit}
                    className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                    Posten
                </button>
            </div>
        </div>
    );
}
