import type { Post } from '../../data/mockData';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';

interface FeedProps {
    posts: Post[];
    onPostCreate: (post: Post) => void;
    currentUser: { name: string };
}

export function Feed({ posts, onPostCreate, currentUser }: FeedProps) {
    return (
        <div className="max-w-[600px] mx-auto py-6">
            <CreatePost onPostCreate={onPostCreate} currentUser={currentUser} />

            <div className="space-y-6">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
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
