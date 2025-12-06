import { useState } from 'react';
import { Image, BarChart2, Calendar, MapPin, Paperclip } from 'lucide-react';
import { TagSelector } from '../UI/TagSelector';
import type { Post } from '../../data/mockData';

interface CreatePostProps {
    onPostCreate: (post: Post) => void;
    currentUser: { name: string };
}

export function CreatePost({ onPostCreate, currentUser }: CreatePostProps) {
    const [content, setContent] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handlePost = () => {
        if (!content.trim()) return;

        const newPost: Post = {
            id: Date.now(),
            authorId: 999, // Current User ID
            content: content,
            tags: selectedTags,
            likes: 0,
            comments: 0,
            timestamp: "Gerade eben",
            hasImage: false
        };

        onPostCreate(newPost);
        setContent("");
        setSelectedTags([]);
    };

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=4f46e5&color=fff`;

    return (
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
                <img src={avatarUrl} alt="Du" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                    <div className="font-bold text-gray-900">Was gibt's Neues?</div>
                    <div className="text-sm text-gray-500">Teile deine Gedanken mit der Community</div>
                </div>
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px] mb-4"
                placeholder="Was möchtest du teilen?"
            />

            <div className="mb-4">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                        <Image size={18} className="text-blue-500" />
                        <span>Foto/Video</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                        <BarChart2 size={18} className="text-green-500" />
                        <span>Umfrage</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                        <Calendar size={18} className="text-red-500" />
                        <span>Event</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                        <MapPin size={18} className="text-purple-500" />
                        <span>Ort</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                        <Paperclip size={18} className="text-gray-500" />
                        <span>Datei</span>
                    </button>
                </div>

                <TagSelector
                    selectedTags={selectedTags}
                    onToggle={(tag) => {
                        setSelectedTags(prev =>
                            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                        );
                    }}
                />
            </div>

            <div className="flex justify-between items-center">
                <div className="text-xs text-gray-400">
                    {content.length}/500 Zeichen
                </div>
                <button
                    onClick={handlePost}
                    disabled={!content.trim()}
                    className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Posten
                </button>
            </div>
        </div>
    );
}
