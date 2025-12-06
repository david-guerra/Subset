import type { Post } from '../../data/mockData';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';
import { TrendingUp } from 'lucide-react';

interface FeedProps {
    posts: Post[];
    onPostCreate: (post: Post) => void;
    currentUser: { name: string };
    students: any[];
}

export function Feed({ posts, onPostCreate, currentUser, students }: FeedProps) {
    return (
        <div className="max-w-[600px] mx-auto py-6">
            {/* Trend Bar */}
            <div className="mb-6 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 text-indigo-900 font-medium">
                    <TrendingUp size={18} className="text-indigo-600" />
                    <span>Trend of the day:</span>
                    <span className="font-bold text-indigo-700">#blutspende</span>
                </div>

            </div>

            <CreatePost onPostCreate={onPostCreate} currentUser={currentUser} />

            <div className="space-y-6">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} currentUser={currentUser} students={students} />
                ))}
                {posts.length === 0 && (
                    <div className="text-center text-gray-400 py-10">
                        Keine Posts vorhanden. Sei der Erste!
                    </div>
                )}
            </div>
        </div>
    );
}
