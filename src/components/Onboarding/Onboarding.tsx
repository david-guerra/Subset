import { useState } from 'react';
import { TagSelector } from '../UI/TagSelector';
import { ArrowRight, BookOpen, GraduationCap, User } from 'lucide-react';

interface OnboardingProps {
    onComplete: (userData: any) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        major: "",
        year: "WiSe 24/25",
        bio: "",
        interests: [] as string[]
    });

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else handleSubmit();
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const newUser = await res.json();
            onComplete(newUser);
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center mb-8">
                    <div className="text-4xl font-black text-primary tracking-tight select-none mb-2">
                        Subs<span className="text-secondary">⊂</span>t
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Willkommen! Richte dein Profil ein.</h2>
                </div>

                <div className="bg-white py-8 px-4 shadow rounded-2xl sm:px-10 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-primary' : 'bg-gray-100'}`} />
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Dein Name</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3"
                                        placeholder="Max Mustermann"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Dein Studiengang</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BookOpen className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 bg-white"
                                        value={formData.major}
                                        onChange={e => setFormData({ ...formData, major: e.target.value })}
                                    >
                                        <option value="">Bitte wählen...</option>
                                        <option value="Informatik">Informatik</option>
                                        <option value="BWL">BWL</option>
                                        <option value="Design">Design</option>
                                        <option value="Psychologie">Psychologie</option>
                                        <option value="Maschinenbau">Maschinenbau</option>
                                        <option value="Medizin">Medizin</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Uni-Email</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        type="email"
                                        className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl py-3 pl-4"
                                        placeholder="name@uni-beispiel.de"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Username</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-400 font-bold">@</span>
                                        </div>
                                        <input
                                            type="text"
                                            className="focus:ring-primary focus:border-primary block w-full pl-8 sm:text-sm border-gray-300 rounded-xl py-3"
                                            placeholder="username"
                                            value={formData.username}
                                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Passwort</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type="password"
                                            className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl py-3 pl-4"
                                            placeholder="******"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Dein Jahrgang</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <GraduationCap className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 bg-white"
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
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
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Erzähl etwas über dich (Bio)</label>
                                <div className="mt-1">
                                    <textarea
                                        rows={4}
                                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-xl p-3"
                                        placeholder="Ich studiere Informatik und interessiere mich für..."
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">Wähle mindestens 3 Interessen</label>
                                <TagSelector
                                    selectedTags={formData.interests}
                                    onToggle={(tag) => {
                                        const newInterests = formData.interests.includes(tag)
                                            ? formData.interests.filter(t => t !== tag)
                                            : [...formData.interests, tag];
                                        setFormData({ ...formData, interests: newInterests });
                                    }}
                                />
                                <div className="mt-2 text-xs text-gray-500 text-right">
                                    {formData.interests.length} ausgewählt
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8">
                        <button
                            onClick={handleNext}
                            disabled={
                                (step === 1 && (!formData.name || !formData.major || !formData.email || !formData.username || !formData.password)) ||
                                (step === 2 && !formData.bio) ||
                                (step === 3 && formData.interests.length < 3)
                            }
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {step === 3 ? "Los geht's!" : (
                                <span className="flex items-center gap-2">Weiter <ArrowRight size={16} /></span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
