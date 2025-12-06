import type { Module } from '../../data/mockData';
import { BookOpen } from 'lucide-react';

interface ModuleCardProps {
    module: Module;
    score: number;
    onViewDetails: (module: Module) => void;
}

export function ModuleCard({ module, score, onViewDetails }: ModuleCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-border p-5 flex flex-col h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-indigo-200">
            <div className="flex justify-between items-start mb-3">
                <div className="text-lg font-bold text-gray-900 leading-tight">
                    {module.title}
                </div>
                {score > 0 && (
                    <div className="bg-indigo-50 text-primary text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ml-2">
                        {score}% Match
                    </div>
                )}
            </div>

            <p className="text-gray-600 text-sm mb-4 flex-grow">
                {module.desc}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
                {module.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
                        {tag}
                    </span>
                ))}
            </div>

            <button
                onClick={() => onViewDetails(module)}
                className="w-full flex items-center justify-center gap-2 mt-auto py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
            >
                <BookOpen size={16} />
                <span>Details ansehen</span>
            </button>
        </div>
    );
}
