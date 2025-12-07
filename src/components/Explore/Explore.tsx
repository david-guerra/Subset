import { useState } from 'react';
import { Users, BookOpen, Layers, GraduationCap, Calendar } from 'lucide-react';
import { ExploreStudents } from './ExploreStudents';
import { Groups } from '../Groups/Groups';
import { Clubs } from '../Clubs/Clubs';
import { Modules } from '../Modules/Modules';
import { Events } from '../Events/Events';
import clsx from 'clsx';

interface ExploreProps {
    currentUser: any;
    onMessage: (studentId: number) => void;
    onJoinGroup: (groupId: number) => void;
    onJoinClub: (clubId: number) => void;
}

type ExploreTab = 'students' | 'groups' | 'clubs' | 'modules' | 'events';

export function Explore({ currentUser, onMessage, onJoinGroup, onJoinClub }: ExploreProps) {
    const [activeTab, setActiveTab] = useState<ExploreTab>('students');

    const tabs = [
        { id: 'students', label: 'Studierende', icon: Users },
        { id: 'groups', label: 'Gruppen', icon: Layers },
        { id: 'clubs', label: 'Clubs', icon: GraduationCap },
        { id: 'modules', label: 'Module', icon: BookOpen },
        { id: 'events', label: 'Events', icon: Calendar },
    ] as const;

    return (
        <div className="flex flex-col min-h-screen">
            {/* Sub-Navigation */}
            {/* Sub-Navigation */}
            <div className="sticky top-16 bg-background z-40 rounded-b-3xl shadow-sm border-t border-border/50 animate-in slide-in-from-top-4 fade-in duration-500 ease-out">
                <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-2 overflow-x-auto py-3 px-4 no-scrollbar">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as ExploreTab)}
                                className={clsx(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <Icon size={18} className={clsx(isActive && "stroke-[2.5px]")} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 animate-in fade-in duration-300">
                {activeTab === 'students' && (
                    <ExploreStudents currentUser={currentUser} onMessage={onMessage} />
                )}
                {activeTab === 'groups' && (
                    <Groups currentUser={currentUser} onJoinGroup={onJoinGroup} />
                )}
                {activeTab === 'clubs' && (
                    <Clubs currentUser={currentUser} onJoinClub={onJoinClub} />
                )}
                {activeTab === 'modules' && (
                    <Modules currentUser={currentUser} />
                )}
                {activeTab === 'events' && (
                    <Events currentUser={currentUser} />
                )}
            </div>
        </div>
    );
}
