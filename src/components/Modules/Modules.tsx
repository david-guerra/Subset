import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { Module } from '../../data/mockData';
import { ModuleCard } from './ModuleCard';
import { ModuleDetailsModal } from './ModuleDetailsModal';
import { calculateScore } from '../../utils/matching';


interface ModulesProps {
    currentUser: any;
}

export function Modules({ currentUser }: ModulesProps) {
    const [modules, setModules] = useState<Module[]>([]);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('/api/modules')
            .then(res => res.json())
            .then(data => setModules(data));
    }, []);


    const filteredModules = modules.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const recommendedModules = filteredModules
        .filter(m => !currentUser.courses?.includes(m.title))
        .map(m => ({
            ...m,
            score: calculateScore(m.tags, currentUser.interests)
        }))
        .sort((a, b) => b.score - a.score);

    return (
        <div className="max-w-[1000px] mx-auto py-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">Kursempfehlungen</h2>
                <p className="text-muted-foreground mb-6">Diese Wahlpflichtmodule passen zu deinem Profil.</p>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Kurse suchen..."
                        className="w-full pl-10 pr-4 py-2 bg-card text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* My Modules Section */}
            {currentUser.courses && currentUser.courses.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
                        Meine Module
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredModules
                            .filter(m => currentUser.courses.includes(m.title))
                            .map(module => (
                                <ModuleCard
                                    key={module.id}
                                    module={module}
                                    score={0} // No score needed for own modules
                                    onViewDetails={setSelectedModule}
                                />
                            ))}
                    </div>
                </div>
            )}

            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                Empfohlene Kurse
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedModules.map(module => (
                    <ModuleCard
                        key={module.id}
                        module={module}
                        score={module.score}
                        onViewDetails={setSelectedModule}
                    />
                ))}
            </div>

            {selectedModule && (
                <ModuleDetailsModal
                    module={selectedModule}
                    isEnrolled={currentUser.courses?.includes(selectedModule.title)}
                    onClose={() => setSelectedModule(null)}
                />
            )}
        </div>
    );
}
