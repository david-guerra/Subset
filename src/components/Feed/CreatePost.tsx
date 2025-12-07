import { useState, useEffect } from 'react';
import { Image, BarChart2, Calendar, MapPin, Paperclip, ChevronDown, Globe, Users, BookOpen, Tent, Component, EyeOff } from 'lucide-react';
import { TagSelector } from '../UI/TagSelector';

import { SafetyWarningModal } from '../UI/SafetyWarningModal';
import { CrisisInterventionModal } from '../UI/CrisisInterventionModal';
import { SystemToast } from '../UI/SystemToast';
import type { Post } from '../../data/mockData';

interface CreatePostProps {
    onPostCreate: (post: Post) => void;
    currentUser: {
        name: string;
        myGroups?: number[];
        myClubs?: number[];
        courses?: string[];
    };
}

interface ContextOption {
    id: number | string;
    type: 'general' | 'connection' | 'group' | 'club' | 'module';
    name: string;
}

export function CreatePost({ onPostCreate, currentUser }: CreatePostProps) {
    const [content, setContent] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [scope, setScope] = useState<ContextOption>({ id: 'general', type: 'general', name: 'Öffentlichkeit' });
    const [availableScopes, setAvailableScopes] = useState<ContextOption[]>([]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [showSafetyWarning, setShowSafetyWarning] = useState(false);

    // Crisis features
    const [showCrisisModal, setShowCrisisModal] = useState(false);
    const [showSystemToast, setShowSystemToast] = useState(false);

    useEffect(() => {
        const fetchContexts = async () => {
            try {
                // Fetch basic info for proper naming
                const [groupsRes, clubsRes] = await Promise.all([
                    fetch('/api/groups'),
                    fetch('/api/clubs')
                ]);

                const groups = await groupsRes.json();
                const clubs = await clubsRes.json();

                const options: ContextOption[] = [
                    { id: 'general', type: 'general', name: 'Öffentlichkeit' },
                    { id: 'connection', type: 'connection', name: 'Meine Verbindungen' }
                ];

                // Add Groups
                currentUser.myGroups?.forEach(gid => {
                    const g = groups.find((i: any) => i.id === gid);
                    if (g) options.push({ id: g.id, type: 'group', name: g.name });
                });

                // Add Clubs
                currentUser.myClubs?.forEach(cid => {
                    const c = clubs.find((i: any) => i.id === cid);
                    if (c) options.push({ id: c.id, type: 'club', name: c.name });
                });

                // Add Modules
                currentUser.courses?.forEach(courseName => {
                    // ID mapping would be better, but mock schema uses names for courses often
                    // We'll use a hash or just pass name if backend supports it. 
                    // Backend PostSchema uses name for context.
                    options.push({ id: 0, type: 'module', name: courseName });
                });

                setAvailableScopes(options);

            } catch (err) {
                console.error("Failed context load", err);
            }
        };
        fetchContexts();
    }, [currentUser]);

    const executePost = (isFlagged: boolean, flagReason?: 'integrity' | 'crisis') => {
        const newPost: Post = {
            id: Date.now(),
            authorId: 999, // Current User ID
            content: content,
            tags: selectedTags,
            likes: 0,
            comments: 0,
            timestamp: "Gerade eben",
            hasImage: false,
            isAnonymous: isAnonymous,
            isFlagged: isFlagged,
            flagReason: flagReason,
            context: {
                type: scope.type,
                name: scope.type === 'general' || scope.type === 'connection' ? undefined : scope.name,
                id: typeof scope.id === 'number' ? scope.id : undefined
            }
        };

        onPostCreate(newPost);
        setContent("");
        setSelectedTags([]);
        setIsAnonymous(false);
        setScope({ id: 'general', type: 'general', name: 'Öffentlichkeit' }); // Reset
    };

    const handlePost = () => {
        if (!content.trim()) return;

        // Mock AI Nudge Logic
        const lowerContent = content.toLowerCase();

        // Crisis Intervention Trigger (Immediate Interruption)
        if (lowerContent.includes('depresive') || lowerContent.includes('depressive') || lowerContent.includes('depressiv') || lowerContent.includes('suicide') || lowerContent.includes('selbstmord')) {
            setShowCrisisModal(true);
            setShowSystemToast(true); // Simulate simultaneous backend alert
            return;
        }

        // Simplified trigger as requested
        if (lowerContent.includes('hausarbeit')) {
            setShowSafetyWarning(true);
            return;
        }

        executePost(false, undefined);
    };

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=4f46e5&color=fff`;

    const getIcon = (type: string) => {
        switch (type) {
            case 'general': return <Globe size={14} />;
            case 'connection': return <Users size={14} />;
            case 'group': return <BookOpen size={14} />;
            case 'club': return <Tent size={14} />;
            case 'module': return <Component size={14} />;
            default: return <Globe size={14} />;
        }
    };

    return (
        <div className="bg-card rounded-xl shadow-sm p-5 mb-6 border border-border relative">
            <div className="flex items-center gap-3 mb-4">
                <img src={avatarUrl} alt="Du" className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="font-bold text-card-foreground">Was gibt's Neues?</div>

                        {/* Scope Selector */}
                        <div className="relative">
                            <select
                                value={scope.type === 'general' ? 'general' : scope.type === 'connection' ? 'connection' : `${scope.type}-${scope.id || scope.name}`}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const selected = availableScopes.find(s =>
                                        (s.type === 'general' && val === 'general') ||
                                        (s.type === 'connection' && val === 'connection') ||
                                        (`${s.type}-${s.id || s.name}` === val)
                                    );
                                    if (selected) setScope(selected);
                                }}
                                className="appearance-none bg-muted/50 border border-input text-foreground text-xs font-semibold py-1.5 pl-8 pr-8 rounded-full focus:outline-none focus:border-primary cursor-pointer hover:bg-accent transition-colors"
                            >
                                {availableScopes.filter(s => s.type === 'general' || s.type === 'connection').map((s, idx) => (
                                    <option key={`basic-${idx}`} value={s.type === 'general' ? 'general' : s.type === 'connection' ? 'connection' : `${s.type}-${s.id || s.name}`}>
                                        {s.name}
                                    </option>
                                ))}

                                {availableScopes.some(s => s.type === 'group') && (
                                    <optgroup label="Meine Gruppen">
                                        {availableScopes.filter(s => s.type === 'group').map((s, idx) => (
                                            <option key={`group-${idx}`} value={`${s.type}-${s.id || s.name}`}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}

                                {availableScopes.some(s => s.type === 'club') && (
                                    <optgroup label="Meine Clubs">
                                        {availableScopes.filter(s => s.type === 'club').map((s, idx) => (
                                            <option key={`club-${idx}`} value={`${s.type}-${s.id || s.name}`}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}

                                {availableScopes.some(s => s.type === 'module') && (
                                    <optgroup label="Meine Kurse">
                                        {availableScopes.filter(s => s.type === 'module').map((s, idx) => (
                                            <option key={`module-${idx}`} value={`${s.type}-${s.id || s.name}`}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}
                            </select>
                            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                {getIcon(scope.type)}
                            </div>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                <ChevronDown size={14} />
                            </div>
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">Teile deine Gedanken mit der Community</div>
                </div>
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 bg-muted/30 rounded-lg border border-input text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px] mb-4 placeholder:text-muted-foreground"
                placeholder={`Was möchtest du ${scope.type !== 'general' ? `in "${scope.name}" ` : ''}teilen?`}
            />

            <div className="mb-4">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted transition-colors whitespace-nowrap">
                        <Image size={18} className="text-blue-500" />
                        <span>Foto/Video</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted transition-colors whitespace-nowrap">
                        <BarChart2 size={18} className="text-green-500" />
                        <span>Umfrage</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted transition-colors whitespace-nowrap">
                        <Calendar size={18} className="text-red-500" />
                        <span>Event</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted transition-colors whitespace-nowrap">
                        <MapPin size={18} className="text-purple-500" />
                        <span>Ort</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted transition-colors whitespace-nowrap">
                        <Paperclip size={18} className="text-muted-foreground" />
                        <span>Datei</span>
                    </button>
                    <button
                        onClick={() => setIsAnonymous(!isAnonymous)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${isAnonymous ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-muted-foreground bg-muted/50 hover:bg-muted'}`}
                    >
                        <EyeOff size={18} className={isAnonymous ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"} />
                        <span>Anonym</span>
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

            {showSafetyWarning && (
                <SafetyWarningModal
                    onCancel={() => setShowSafetyWarning(false)}
                    onConfirm={() => {
                        setShowSafetyWarning(false);
                        executePost(true, 'integrity');
                    }}
                />
            )}

            {showCrisisModal && (
                <CrisisInterventionModal
                    onClose={() => setShowCrisisModal(false)}
                    onConfirm={() => {
                        setShowCrisisModal(false);
                        executePost(true, 'crisis');
                    }}
                />
            )}

            {showSystemToast && (
                <SystemToast
                    message="Crisis Pattern Detected"
                    onClose={() => setShowSystemToast(false)}
                />
            )}
        </div>
    );
}
