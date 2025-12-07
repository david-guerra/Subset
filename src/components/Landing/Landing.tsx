import { useState } from 'react';
import { ArrowRight, User, Globe } from 'lucide-react';
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

    const handleSSOLogin = async () => {
        // Simulate SSO Login by auto-logging in as Alice Smith (ID: 1)
        // In a real app, this would redirect to an OAuth provider.
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: "alicesmith", password: "admin" })
            });

            if (res.ok) {
                const data = await res.json();
                onLoginSuccess(data.user);
            } else {
                console.error("Mock SSO failed: Alice credentials invalid?");
                // Fallback if DB is completely empty/broken, though reset-db should fix it.
                // We'll keep the hardcoded fallback just in case, but populated.
                const fallbackAlice = {
                    id: 1,
                    name: "Alice Smith",
                    major: "Informatik",
                    year: "WiSe 23/24",
                    interests: ["Coding", "AI", "Gaming"],
                    bio: "Hi, ich bin Alice! (Offline Mode)",
                    courses: ["Einführung in KI"],
                    connections: [2, 3, 5],
                    myClubs: [201, 207],
                    myGroups: [301]
                };
                onLoginSuccess(fallbackAlice);
            }
        } catch (err) {
            console.error("SSO Error:", err);
        }
    };

    if (view === 'register') {
        return <Onboarding onComplete={onLoginSuccess} />;
    }

    if (view === 'login') {
        return (
            <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
                        Anmelden
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Gib deinen Nutzernamen ein, um fortzufahren.
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-sm font-medium text-foreground">Username</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-input bg-background text-foreground rounded-md py-2"
                                        placeholder="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground">Passwort</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        type="password"
                                        required
                                        className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-input bg-background text-foreground rounded-md py-2 pl-4"
                                        placeholder="******"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-destructive text-sm font-medium">{error}</div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none transition-colors"
                                >
                                    Verbinden
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-card text-muted-foreground">Oder</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={handleSSOLogin}
                                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-accent focus:outline-none transition-colors gap-2"
                                >
                                    <Globe size={18} />
                                    <span>Mit Uni-Account anmelden (SSO)</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => setView('home')}
                                className="w-full flex justify-center py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-accent transition-colors"
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
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="inline-block mb-6">
                    <img src="/logo.svg?v=4" alt="SubSet" className="h-16 w-auto" />
                </div>

                <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl mb-4">
                    Dein Campus.<br />
                    <span className="text-primary">Deine Community.</span>
                </h1>

                <p className="text-lg text-muted-foreground mb-12">
                    Vernetze dich mit Studenten, finde Lerngruppen und entdecke Events an deiner Uni.
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => setView('register')}
                        className="w-full py-3.5 px-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        Neu hier? Registrieren <ArrowRight size={20} />
                    </button>

                    <button
                        onClick={() => setView('login')}
                        className="w-full py-3.5 px-4 bg-card text-foreground border border-border rounded-xl font-bold text-lg hover:bg-accent hover:border-accent-foreground transition-all"
                    >
                        Ich habe bereits einen Account
                    </button>
                </div>

                <p className="mt-8 text-xs text-muted-foreground">
                    Ein Projekt für Studenten.
                </p>
            </div>
        </div>
    );
}
