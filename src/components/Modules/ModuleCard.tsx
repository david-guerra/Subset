import type { Module } from '../../data/mockData';
import { BookOpen } from 'lucide-react';
import { ReportMenu } from '../UI/ReportMenu';

interface ModuleCardProps {
    module: Module;
    score: number;
    onViewDetails: (module: Module) => void;
}

export function ModuleCard({ module, score, onViewDetails }: ModuleCardProps) {
    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-5 flex flex-col h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-800 relative">
            <div className="absolute top-4 right-4 z-10">
                <ReportMenu onReport={() => alert("Modul gemeldet.")} itemType="Modul" />
            </div>

            <div className="flex justify-between items-start mb-3 pr-8">
                <div className="text-lg font-bold text-card-foreground leading-tight">
                    {module.title}
                </div>
                {score > 0 && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ml-2">
                        {score}% Match
                    </div>
                )}
            </div>

            <p className="text-muted-foreground text-sm mb-4 flex-grow">
                {module.desc}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
                {module.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                        {tag}
                    </span>
                ))}
            </div>

            <button
                onClick={() => onViewDetails(module)}
                className="w-full flex items-center justify-center gap-2 mt-auto py-2 border border-input rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
                <BookOpen size={16} />
                <span>Details ansehen</span>
            </button>
        </div>
    );
}
