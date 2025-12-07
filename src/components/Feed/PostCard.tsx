import { Heart, MessageCircle, Share2, Users, BookOpen, Globe, User, HelpCircle } from 'lucide-react';
import { type Post } from '../../data/mockData';
import { TagBadge } from '../UI/TagSelector';
import { ReportMenu } from '../UI/ReportMenu';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

import { INITIAL_DATA } from '../../data/mockData';

interface PostCardProps {
    post: Post;
    currentUser: { name: string };
    students: any[];
}

export function PostCard({ post, currentUser, students }: PostCardProps) {
    const [likes, setLikes] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        setLikes(post.likes);
    }, [post.likes]);


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

    // Anonymous Overrides
    if (post.isAnonymous) {
        authorName = "Anonym";
    }

    const avatarUrl = post.isAnonymous
        ? null
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;

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
                    <div className={clsx(badgeClasses, "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300")}>
                        <Users size={12} />
                        <span>Club: {name}</span>
                    </div>
                );
            case 'module':
                return (
                    <div className={clsx(badgeClasses, "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300")}>
                        <BookOpen size={12} />
                        <span>Module: {name}</span>
                    </div>
                );
            case 'group':
                return (
                    <div className={clsx(badgeClasses, "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300")}>
                        <Users size={12} />
                        <span>Group: {name}</span>
                    </div>
                );
            case 'connection':
                return (
                    <div className={clsx(badgeClasses, "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300")}>
                        <User size={12} />
                        <span>Connection</span>
                    </div>
                );
            case 'general':
                return (
                    <div className={clsx(badgeClasses, "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300")}>
                        <Globe size={12} />
                        <span>Uniweit</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-card rounded-xl shadow-sm p-5 mb-5 transition-transform duration-300 hover:-translate-y-1 border border-border">
            {getContextBadge()}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    {post.isAnonymous ? (
                        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <HelpCircle size={24} className="text-slate-400" />
                        </div>
                    ) : (
                        <img src={avatarUrl!} alt={authorName} className="w-12 h-12 rounded-full object-cover bg-muted" />
                    )}
                    <div>
                        <div className="font-bold text-foreground leading-tight">{authorName}</div>
                        <div className="text-sm text-muted-foreground">{post.timestamp}</div>
                    </div>
                </div>
                <ReportMenu onReport={() => alert("Post wurde gemeldet. Danke für deinen Hinweis!")} itemType="Post" />
            </div>

            {post.isFlagged ? (
                <div className={clsx("p-4 mb-4 border rounded-lg flex items-center gap-3",
                    post.flagReason === 'crisis' ? "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-900/30" : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30"
                )}>
                    <div className={clsx("p-2 rounded-full",
                        post.flagReason === 'crisis' ? "bg-indigo-100 dark:bg-indigo-900/30" : "bg-red-100 dark:bg-red-900/30"
                    )}>
                        <HelpCircle size={20} className={post.flagReason === 'crisis' ? "text-indigo-600 dark:text-indigo-400" : "text-red-600 dark:text-red-400"} />
                    </div>
                    <div>
                        <div className={clsx("font-bold text-sm",
                            post.flagReason === 'crisis' ? "text-indigo-800 dark:text-indigo-300" : "text-red-800 dark:text-red-300"
                        )}>Post ausgeblendet</div>
                        <div className={clsx("text-xs mt-0.5",
                            post.flagReason === 'crisis' ? "text-indigo-600 dark:text-indigo-400" : "text-red-600 dark:text-red-400"
                        )}>
                            {post.flagReason === 'crisis'
                                ? "Dieser Beitrag wurde aufgrund von potenziell gefährdenden Inhalten ausgeblendet. Wir haben Hilfe angeboten."
                                : "Dieser Beitrag wurde von unserer KI als potenzieller Richtlinienverstoß markiert (Akademische Integrität)."
                            }
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-card-foreground leading-relaxed mb-4 whitespace-pre-wrap">
                    {post.content}
                </div>
            )}

            {!post.isFlagged && post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
                </div>
            )}

            {!post.isFlagged && post.hasImage && post.imageUrl && (
                <img src={post.imageUrl} alt="Post Attachment" className="w-full rounded-lg mb-4 max-h-96 object-cover bg-muted" />
            )}

            <div className="flex gap-6 pt-4 border-t border-border mt-2">
                <button
                    onClick={handleLike}
                    className={clsx("flex items-center gap-1.5 text-sm font-medium transition-colors", isLiked ? "text-secondary" : "text-muted-foreground hover:text-primary")}
                >
                    <Heart size={18} className={clsx("transition-transform duration-300", isLiked && "fill-current scale-110")} />
                    <span>{likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary text-sm font-medium transition-colors">
                    <MessageCircle size={18} />
                    <span>{post.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary text-sm font-medium transition-colors ml-auto">
                    <Share2 size={18} />
                    <span>Teilen</span>
                </button>
            </div>

            {/* Comments Section */}
            {post.commentsList && post.commentsList.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                    {post.commentsList.map(comment => (
                        <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                                    {comment.authorName.charAt(0)}
                                </span>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-3 text-sm flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-foreground">{comment.authorName}</span>
                                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                </div>
                                <div className="text-foreground/90">{comment.content}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
