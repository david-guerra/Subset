import { useState } from 'react';
import { Navbar, type NavTab } from './components/Layout/Navbar';
import { Feed } from './components/Feed/Feed';
import { INITIAL_DATA, type Post } from './data/mockData';
import { Explore } from './components/Explore/Explore';
import { Groups } from './components/Groups/Groups';

function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('feed');
  const [posts, setPosts] = useState<Post[]>(INITIAL_DATA.posts);
  const [currentUser, setCurrentUser] = useState({
    name: "David Guerra", // Simulating logged in user
    email: "david@uni.de",
    major: "Informatik",
    year: 2024,
    interests: ["Coding", "KI", "Design", "Startups"],
    myGroups: [] as number[]
  });

  const handlePostCreate = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleJoinGroup = (groupId: number) => {
    if (currentUser.myGroups.includes(groupId)) return;
    setCurrentUser(prev => ({
      ...prev,
      myGroups: [...prev.myGroups, groupId]
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <Feed posts={posts} onPostCreate={handlePostCreate} currentUser={currentUser} />;
      case 'explore':
        return <Explore currentUser={currentUser} />;
      case 'groups':
        return <Groups currentUser={currentUser} onJoinGroup={handleJoinGroup} />;
      case 'clubs':
        return <Placeholder title="Studenten Clubs" desc="Engagiere dich in Clubs und Initiativen." />;
      case 'modules':
        return <Placeholder title="Modul-Empfehlungen" desc="Entdecke Wahlpflichtfächer, die zu dir passen." />;
      case 'chats':
        return <Placeholder title="Nachrichten" desc="Deine privaten Chats." />;
      case 'profile':
        return <Placeholder title="Dein Profil" desc="Bearbeite deine Interessen und Daten." />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-body font-sans text-text-main pb-20">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4">
        {renderContent()}
      </main>
    </div>
  );
}

function Placeholder({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-primary">
        <span className="text-4xl">🚧</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-md">{desc}</p>
      <button className="mt-8 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
        Coming Soon
      </button>
    </div>
  );
}

export default App;
