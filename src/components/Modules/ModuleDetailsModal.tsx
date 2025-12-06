import { X, Clock, Award, BookOpen } from 'lucide-react';
import type { Module } from '../../data/mockData';

interface ModuleDetailsModalProps {
    module: Module;
    onClose: () => void;
}

export function ModuleDetailsModal({ module, onClose }: ModuleDetailsModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
                    <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        {module.desc}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-indigo-50 p-4 rounded-xl flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg text-primary shadow-sm"><Award size={20} /></div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase font-semibold">ECTS</div>
                                <div className="font-bold text-gray-900">5 Cr</div>
                            </div>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-xl flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg text-primary shadow-sm"><Clock size={20} /></div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase font-semibold">Dauer</div>
                                <div className="font-bold text-gray-900">1 Semester</div>
                            </div>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-xl flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg text-primary shadow-sm"><BookOpen size={20} /></div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase font-semibold">Sprache</div>
                                <div className="font-bold text-gray-900">Deutsch</div>
                            </div>
                        </div>
                    </div>

                    <h4 className="font-bold text-gray-900 mb-3 text-lg">Inhalte</h4>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>

                    <h4 className="font-bold text-gray-900 mb-3 text-lg">Prüfungsleistung</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-8">
                        <li>Klausur (90 min)</li>
                        <li>Projektarbeit</li>
                    </ul>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button onClick={onClose} className="px-6 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                            Schließen
                        </button>
                        <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5">
                            Modul wählen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
