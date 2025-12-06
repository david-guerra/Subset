import { useState, useEffect } from 'react';
import { Navbar, type NavTab } from './components/Layout/Navbar';
import { Feed } from './components/Feed/Feed';
import { type Post } from './data/mockData';
import { Explore } from './components/Explore/Explore';
import { Groups } from './components/Groups/Groups';
import { Clubs } from './components/Clubs/Clubs';
import { Modules } from './components/Modules/Modules';
import { Chats } from './components/Chats/Chats';
import { Profile } from './components/Profile/Profile';
import { Landing } from './components/Landing/Landing';

function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [students, setStudents] = useState<any[]>([]); // Store all students for name lookup
  const [currentUser, setCurrentUser] = useState<any>(null); // Type 'any' for speed in prototype
  const [isLoading, setIsLoading] = useState(true);
  const [targetChatId, setTargetChatId] = useState<number | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, meRes, studentsRes] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/me'),
          fetch('/api/students')
        ]);

        if (postsRes.ok) setPosts(await postsRes.json());
        if (studentsRes.ok) setStudents(await studentsRes.json());

        if (meRes.ok) {
          setCurrentUser(await meRes.json());
        } else {
          // 401 or 404 -> Not logged in
          setCurrentUser(null);
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        setPosts(await res.json());
      }
    } catch (err) {
      console.error("Failed to refresh posts:", err);
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setCurrentUser(userData);
    // Ensure we have minimal arrays
    if (!userData.myGroups) userData.myGroups = [];
    if (!userData.myClubs) userData.myClubs = [];
    // Refetch posts to get personalized feed
    fetchPosts();
  };

  const handlePostCreate = async (newPost: Post) => {
    // Optimistic update
    setPosts([newPost, ...posts]);

    // Sync to backend
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    });
  };

  const handleJoinGroup = async (groupId: number) => {
    if (currentUser.myGroups.includes(groupId)) return;

    // Optimistic update
    setCurrentUser((prev: any) => ({
      ...prev,
      myGroups: [...prev.myGroups, groupId]
    }));

    await fetch('/api/groups/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupId })
    });

    // Refresh posts to show group content
    fetchPosts();
  };

  const handleJoinClub = async (clubId: number) => {
    if (currentUser.myClubs.includes(clubId)) return;

    // Optimistic update
    setCurrentUser((prev: any) => ({
      ...prev,
      myClubs: [...prev.myClubs, clubId]
    }));

    await fetch('/api/clubs/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clubId })
    });

    // Refresh posts to show club content
    fetchPosts();
  };

  const handleUpdateProfile = async (updates: Partial<typeof currentUser>) => {
    setCurrentUser((prev: any) => ({ ...prev, ...updates }));

    await fetch('/api/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-primary">Laden...</div>;
  }

  if (!currentUser) {
    return <Landing onLoginSuccess={handleAuthSuccess} />;
  }

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setCurrentUser(null);
  };

  const handleMessage = async (partnerId: number) => {
    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId })
      });
      if (res.ok) {
        const chat = await res.json();
        setTargetChatId(chat.id);
        setActiveTab('chats');
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <Feed posts={posts} onPostCreate={handlePostCreate} currentUser={currentUser} students={students} />;
      case 'explore':
        return <Explore currentUser={currentUser} onMessage={handleMessage} />;
      case 'groups':
        return <Groups currentUser={currentUser} onJoinGroup={handleJoinGroup} />;
      case 'clubs':
        return <Clubs currentUser={currentUser} onJoinClub={handleJoinClub} />;
      case 'modules':
        return <Modules currentUser={currentUser} />;
      case 'chats':
        return <Chats initialChatId={targetChatId} currentUserId={currentUser.id} />;
      case 'profile':
        return <Profile currentUser={currentUser} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-body font-sans text-text-main pb-20">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4">
        <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
