import { Heart, MessageCircle, Share2, Users, BookOpen, Globe, User } from 'lucide-react';
import { type Post } from '../../data/mockData';
import { TagBadge } from '../UI/TagSelector';
import clsx from 'clsx';
import { useState } from 'react';

import { INITIAL_DATA } from '../../data/mockData';

interface PostCardProps {
    post: Post;
    currentUser: { name: string };
    students: any[];
}

export function PostCard({ post, currentUser, students }: PostCardProps) {
    const [likes, setLikes] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(false);


    // Resolve Author Name
    let authorName = "Unknown";

    // First try the passed students list (contains DB users)
    const author = students.find(s => s.id === post.authorId);
    if (author) {
        authorName = author.name;
    } else if (post.authorId === 999 && currentUser) {
        // Fallback for immediate "Me" posts if not yet in students list
        authorName = currentUser.name;
    } else {
        // Fallback to Mock Data (should be covered by students list usually)
        const student = INITIAL_DATA.students.find(s => s.id === post.authorId);
        authorName = student ? student.name : `Student ${post.authorId}`;
    }

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;

    const handleLike = () => {
        if (isLiked) {
            setLikes(l => l - 1);
            setIsLiked(false);
        } else {
            setLikes(l => l + 1);
            setIsLiked(true);
        }
    };

    const getContextBadge = () => {
        if (!post.context) return null;

        const { type, name } = post.context;

        const badgeClasses = "flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full mb-2 w-fit";

        switch (type) {
            case 'club':
                return (
                    <div className={clsx(badgeClasses, "bg-purple-50 text-purple-700")}>
                        <Users size={12} />
                        <span>Club: {name}</span>
                    </div>
                );
            case 'module':
                return (
                    <div className={clsx(badgeClasses, "bg-blue-50 text-blue-700")}>
                        <BookOpen size={12} />
                        <span>Module: {name}</span>
                    </div>
                );
            case 'group':
                return (
                    <div className={clsx(badgeClasses, "bg-indigo-50 text-indigo-700")}>
                        <Users size={12} />
                        <span>Group: {name}</span>
                    </div>
                );
            case 'connection':
                return (
                    <div className={clsx(badgeClasses, "bg-green-50 text-green-700")}>
                        <User size={12} />
                        <span>Connection</span>
                    </div>
                );
            case 'general':
                return (
                    <div className={clsx(badgeClasses, "bg-gray-100 text-gray-700")}>
                        <Globe size={12} />
                        <span>Uniweit</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-5 mb-5 transition-transform duration-300 hover:-translate-y-1 border border-border">
            {getContextBadge()}
            <div className="flex items-center gap-3 mb-4">
                <img src={avatarUrl} alt={authorName} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                <div>
                    <div className="font-bold text-gray-900 leading-tight">{authorName}</div>
                    <div className="text-sm text-gray-500">{post.timestamp}</div>
                </div>
            </div>

            <div className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                {post.content}
            </div>

            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
                </div>
            )}

            {post.hasImage && post.imageUrl && (
                <img src={post.imageUrl} alt="Post Attachment" className="w-full rounded-lg mb-4 max-h-96 object-cover" />
            )}

            <div className="flex gap-6 pt-4 border-t border-gray-100 mt-2">
                <button
                    onClick={handleLike}
                    className={clsx("flex items-center gap-1.5 text-sm font-medium transition-colors", isLiked ? "text-secondary" : "text-gray-500 hover:text-primary")}
                >
                    <Heart size={18} className={clsx("transition-transform duration-300", isLiked && "fill-current scale-110")} />
                    <span>{likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-primary text-sm font-medium transition-colors">
                    <MessageCircle size={18} />
                    <span>{post.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-primary text-sm font-medium transition-colors ml-auto">
                    <Share2 size={18} />
                    <span>Teilen</span>
                </button>
            </div>
        </div>
    );
}
