import { useState, useEffect } from 'react';
import { TagSelector } from '../UI/TagSelector';
import { Users, BookOpen, Tent, Pencil, Save, X } from 'lucide-react';
import { ProfileCalendar } from './ProfileCalendar';
import type { Event } from '../../data/mockData';

interface ProfileProps {
    currentUser: {
        id: number; // Added id
        name: string;
        email: string;
        major: string;
        year: string;
        interests: string[];
        bio: string;
        courses?: string[];
        myGroups: number[];
        myClubs: number[];
        connections: number[];
    };
    onUpdateProfile: (updates: Partial<ProfileProps['currentUser']>) => void;
}

export function Profile({ currentUser, onUpdateProfile }: ProfileProps) {
    const [isEditing, setIsEditing] = useState(false);

    const [events, setEvents] = useState<Event[]>([]);

    const [editForm, setEditForm] = useState({
        year: currentUser.year,
        bio: currentUser.bio,
        interests: currentUser.interests
    });

    // Fetch Events for calendar
    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then((data: Event[]) => {
                // Filter events where current user is an attendee
                const myEvents = data.filter(e => e.attendeeIds?.includes(currentUser.id));
                setEvents(myEvents);
            })
            .catch(err => console.error("Failed to fetch profile events:", err));
    }, [currentUser.id]);

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
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8 mb-8 relative">



                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <img
                        src={avatarUrl}
                        alt="Profil"
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary/10 bg-muted"
                    />

                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground mb-1">{currentUser.name}</h2>
                                <p className="text-xl text-muted-foreground">{currentUser.major} • {currentUser.year}</p>
                            </div>

                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 border border-input rounded-xl hover:bg-muted transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
                                >
                                    <Pencil size={16} />
                                    <span>Bearbeiten</span>
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            <>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    {currentUser.bio}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {currentUser.interests.map((tag: string) => (
                                        <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                {currentUser.courses && currentUser.courses.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-border">
                                        <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                            <BookOpen size={16} className="text-primary" />
                                            Meine Kurse (aktuelles Semester)
                                        </h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            {currentUser.courses.map((course: string, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm font-medium text-foreground">{course}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-muted/30 p-6 rounded-xl animate-in fade-in border border-border">
                                <div className="grid gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">Jahrgang</label>
                                        <select
                                            value={editForm.year}
                                            onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                                            className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:border-primary text-foreground"
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
                                        <label className="block text-sm font-medium text-foreground mb-1">Bio</label>
                                        <textarea
                                            value={editForm.bio}
                                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:border-primary text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Interessen</label>
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
                                        className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground font-medium"
                                    >
                                        <X size={18} />
                                        Abbrechen
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 shadow-sm font-medium transition-colors"
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Stats & Calendar */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Dashboard Stats */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-foreground px-1 border-l-4 border-indigo-500 pl-3">Dein Dashboard</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center hover:translate-y-[-2px] transition-transform">
                                <div className="text-3xl font-extrabold text-green-600 dark:text-green-500 mb-1">{totalGroups}</div>
                                <div className="text-muted-foreground text-sm font-medium flex items-center gap-1.5">
                                    <BookOpen size={16} />
                                    Gruppen
                                </div>
                            </div>
                            <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center hover:translate-y-[-2px] transition-transform">
                                <div className="text-3xl font-extrabold text-pink-500 dark:text-pink-400 mb-1">{totalClubs}</div>
                                <div className="text-muted-foreground text-sm font-medium flex items-center gap-1.5">
                                    <Tent size={16} />
                                    Clubs
                                </div>
                            </div>
                            <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center hover:translate-y-[-2px] transition-transform">
                                <div className="text-3xl font-extrabold text-blue-500 dark:text-blue-400 mb-1">{currentUser.connections?.length || 0}</div>
                                <div className="text-muted-foreground text-sm font-medium flex items-center gap-1.5">
                                    <Users size={16} />
                                    Netzwerk
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-foreground px-1 border-l-4 border-orange-500 pl-3">Dein Kalender</h3>
                            {events.length > 0 && (
                                <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full">
                                    {events.length} Events
                                </span>
                            )}
                        </div>
                        <ProfileCalendar events={events} />
                    </div>

                </div>

                {/* Sidebar (Placeholder for now, keeping layout balanced) */}
                <div className="hidden lg:block space-y-8">
                    {/* Could add "Suggested Events" or "Pending Requests" here later */}
                </div>
            </div>

        </div >
    );
}
