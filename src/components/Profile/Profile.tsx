import { useState, useEffect } from 'react';
import { TagSelector } from '../UI/TagSelector';
import { Users, BookOpen, Tent, Pencil, Save, X, Settings, LogOut } from 'lucide-react';
import { calculateMatch } from '../../utils/matching';

interface ProfileProps {
    currentUser: {
        name: string;
        email: string;
        major: string;
        year: string; // Changed
        interests: string[];
        bio: string;
        courses?: string[];
        myGroups: number[];
        myClubs: number[];
    };
    onUpdateProfile: (updates: Partial<ProfileProps['currentUser']>) => void;
    onLogout: () => void;
}

export function Profile({ currentUser, onUpdateProfile, onLogout }: ProfileProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // We need students data for totalMatches. In typical app we'd fetch this or pass it.
    // For now, let's just make a simple call or mock it.
    // Ideally Profile should receive stats or fetch them.
    const [stats, setStats] = useState({ matches: 0 });
    const [editForm, setEditForm] = useState({
        year: currentUser.year,
        bio: currentUser.bio,
        interests: currentUser.interests
    });

    useEffect(() => {
        fetch('/api/students')
            .then(res => res.json())
            .then(data => {
                // Calculate matches locally for now
                const matches = data.filter((s: any) => s.id !== 999 && calculateMatch(s.interests, currentUser.interests, s.year, currentUser.year) > 50).length;
                setStats({ matches });
            });
    }, [currentUser.interests, currentUser.year]); // Recalculate when interests change

    // Calculate Stats
    const totalGroups = currentUser.myGroups.length;
    const totalClubs = currentUser.myClubs.length;

    const handleSave = () => {
        onUpdateProfile(editForm);
        setIsEditing(false);
    };

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=4f46e5&color=fff`;

    return (
        <div className="max-w-[800px] mx-auto py-8 relative">

            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 mb-8 relative">

                {/* Settings Button */}
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Settings size={20} />
                    </button>

                    {/* Settings Dropdown */}
                    {showSettings && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in slide-in-from-top-2">
                            <button
                                onClick={onLogout}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                            >
                                <LogOut size={16} />
                                Abmelden
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <img
                        src={avatarUrl}
                        alt="Profil"
                        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-50"
                    />

                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-1">{currentUser.name}</h2>
                                <p className="text-xl text-gray-500">{currentUser.major} • {currentUser.year}</p>
                            </div>

                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                                >
                                    <Pencil size={16} />
                                    <span>Bearbeiten</span>
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            <>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {currentUser.bio}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {currentUser.interests.map((tag: string) => (
                                        <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                {currentUser.courses && currentUser.courses.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <BookOpen size={16} className="text-indigo-600" />
                                            Meine Kurse (aktuelles Semester)
                                        </h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            {currentUser.courses.map((course: string, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm font-medium text-gray-700">{course}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-gray-50 p-6 rounded-xl animate-in fade-in">
                                <div className="grid gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Jahrgang</label>
                                        <select
                                            value={editForm.year}
                                            onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                        >
                                            <option value="WiSe 25/26">WiSe 25/26</option>
                                            <option value="SoSe 25">SoSe 25</option>
                                            <option value="WiSe 24/25">WiSe 24/25</option>
                                            <option value="SoSe 24">SoSe 24</option>
                                            <option value="WiSe 23/24">WiSe 23/24</option>
                                            <option value="SoSe 23">SoSe 23</option>
                                            <option value="WiSe 22/23">WiSe 22/23</option>
                                            <option value="SoSe 22">SoSe 22</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                        <textarea
                                            value={editForm.bio}
                                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Interessen</label>
                                        <TagSelector
                                            selectedTags={editForm.interests}
                                            onToggle={(tag) => {
                                                const newInterests = editForm.interests.includes(tag)
                                                    ? editForm.interests.filter(t => t !== tag)
                                                    : [...editForm.interests, tag];
                                                setEditForm({ ...editForm, interests: newInterests });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                                    >
                                        <X size={18} />
                                        Abbrechen
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover shadow-sm font-medium transition-colors"
                                    >
                                        <Save size={18} />
                                        Speichern
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dashboard Stats */}
            <h3 className="text-xl font-bold text-gray-800 mb-6 px-1 border-l-4 border-indigo-500 pl-3">Dein Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center hover:translate-y-[-2px] transition-transform">
                    <div className="text-4xl font-extrabold text-indigo-600 mb-2">{stats.matches}</div>
                    <div className="text-gray-500 font-medium flex items-center gap-2">
                        <Users size={18} />
                        Matches
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center hover:translate-y-[-2px] transition-transform">
                    <div className="text-4xl font-extrabold text-green-600 mb-2">{totalGroups}</div>
                    <div className="text-gray-500 font-medium flex items-center gap-2">
                        <BookOpen size={18} />
                        Gruppen
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center hover:translate-y-[-2px] transition-transform">
                    <div className="text-4xl font-extrabold text-pink-500 mb-2">{totalClubs}</div>
                    <div className="text-gray-500 font-medium flex items-center gap-2">
                        <Tent size={18} />
                        Clubs
                    </div>
                </div>
            </div>

        </div >
    );
}
