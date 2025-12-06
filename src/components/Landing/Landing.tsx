import { useState } from 'react';
import { ArrowRight, User } from 'lucide-react';
import { Onboarding } from '../Onboarding/Onboarding';

interface LandingProps {
    onLoginSuccess: (user: any) => void;
}

export function Landing({ onLoginSuccess }: LandingProps) {
    const [view, setView] = useState<'home' | 'login' | 'register'>('home');
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                const data = await res.json();
                onLoginSuccess(data.user);
            } else {
                setError("Nutzer nicht gefunden. Bitte Namen prüfen.");
            }
        } catch (err) {
            setError("Fehler beim Anmelden.");
        }
    };

    if (view === 'register') {
        return <Onboarding onComplete={onLoginSuccess} />;
    }

    if (view === 'login') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Anmelden
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Gib deinen Nutzernamen ein, um fortzufahren.
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Username</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                                        placeholder="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Passwort</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        type="password"
                                        required
                                        className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md py-2 pl-4"
                                        placeholder="******"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm font-medium">{error}</div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none transition-colors"
                                >
                                    Verbinden
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <button
                                onClick={() => setView('home')}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                Zurück
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="inline-block mb-6">
                    <img src="/logo.svg?v=4" alt="SubSet" className="h-16 w-auto" />
                </div>

                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
                    Dein Campus.<br />
                    <span className="text-primary">Deine Community.</span>
                </h1>

                <p className="text-lg text-gray-500 mb-12">
                    Vernetze dich mit Studenten, finde Lerngruppen und entdecke Events an deiner Uni.
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => setView('register')}
                        className="w-full py-3.5 px-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        Neu hier? Registrieren <ArrowRight size={20} />
                    </button>

                    <button
                        onClick={() => setView('login')}
                        className="w-full py-3.5 px-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                        Ich habe bereits einen Account
                    </button>
                </div>

                <p className="mt-8 text-xs text-gray-400">
                    Ein Projekt für Studenten.
                </p>
            </div>
        </div>
    );
}
