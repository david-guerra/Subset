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

    useEffect(() => {
        fetch('/api/modules')
            .then(res => res.json())
            .then(data => setModules(data));
    }, []);


    const recommendedModules = modules
        .filter(m => !currentUser.courses?.includes(m.title))
        .map(m => ({
            ...m,
            score: calculateScore(m.tags, currentUser.interests)
        }))
        .sort((a, b) => b.score - a.score);

    return (
        <div className="max-w-[1000px] mx-auto py-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Kursempfehlungen</h2>
                <p className="text-gray-500 mb-6">Diese Wahlpflichtmodule passen zu deinem Profil.</p>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Kurse suchen..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>
            </div>

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
                    onClose={() => setSelectedModule(null)}
                />
            )}
        </div>
    );
}
