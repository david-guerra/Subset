import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { type Post, INITIAL_DATA } from '../../data/mockData';
import { TagBadge } from '../UI/TagSelector';
import clsx from 'clsx';
import { useState } from 'react';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const [likes, setLikes] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(false);

    const author = INITIAL_DATA.students.find(s => s.id === post.authorId);
    const authorName = author?.name || "Unknown User";
    const authorMajor = author ? `${author.major} • Jahrgang ${author.year}` : "";
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

    return (
        <div className="bg-white rounded-xl shadow-sm p-5 mb-5 transition-transform duration-200 hover:-translate-y-1 border border-border">
            <div className="flex items-center gap-3 mb-4">
                <img src={avatarUrl} alt={authorName} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                <div>
                    <div className="font-bold text-gray-900 leading-tight">{authorName}</div>
                    <div className="text-sm text-gray-500">{authorMajor} • {post.timestamp}</div>
                </div>
            </div>

            <div className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                {post.content}
            </div>

            {post.tags.length > 0 && (
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
                    <Heart size={18} className={clsx(isLiked && "fill-current")} />
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
