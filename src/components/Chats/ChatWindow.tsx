import type { Chat } from '../../data/mockData';
import { Send } from 'lucide-react';
import clsx from 'clsx';
import { useRef, useEffect } from 'react';
import { ReportMenu } from '../UI/ReportMenu';

interface ChatWindowProps {
    chat: Chat;
    onSendMessage: (text: string) => void;
    currentUserId: number;
    partner: {
        name: string;
        image?: string | null;
        icon?: React.ReactNode;
        bg?: string;
    };
    onBack: () => void;
}

export function ChatWindow({ chat, onSendMessage, currentUserId, partner, onBack }: ChatWindowProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat.messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputRef.current?.value.trim()) {
            onSendMessage(inputRef.current.value);
            inputRef.current.value = '';
        }
    };

    const name = partner?.name || "Unbekannt";
    const image = partner?.image;

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3 bg-card z-10 w-full">
                <button onClick={onBack} className="md:hidden text-muted-foreground hover:text-foreground mr-2">
                    ←
                </button>

                {image ? (
                    <img src={image} className="w-10 h-10 rounded-full object-cover bg-muted" alt={name} />
                ) : partner?.icon ? (
                    <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white", partner.bg || "bg-muted")}>
                        {partner.icon}
                    </div>
                ) : (
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`} className="w-10 h-10 rounded-full bg-muted" alt={name} />
                )}

                <div className="flex-1">
                    <div className="font-bold text-foreground">{name}</div>
                    {chat.type === 'direct' && <div className="text-xs text-green-500 font-medium">Online</div>}
                    {chat.type === 'group' && <div className="text-xs text-muted-foreground">{chat.messages.length} Nachrichten</div>}
                    {chat.type === 'club' && <div className="text-xs text-pink-500 font-medium">Club Channel</div>}
                </div>

                <ReportMenu onReport={() => alert("Chat/Nutzer gemeldet.")} itemType="Chat" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                {chat.messages.map((msg) => {
                    // Adjust logic to correctly identify "Me" vs others
                    // Assuming currentUserId is passed and message has senderId
                    // If senderId is 'me' string (legacy mock) or matches currentUserId
                    const isMe = msg.senderId === 'me' || msg.senderId === currentUserId;

                    return (
                        <div key={msg.id} className={clsx("flex flex-col max-w-[75%]", isMe ? "ml-auto items-end" : "mr-auto items-start")}>
                            <div className={clsx(
                                "px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                                isMe
                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                    : "bg-card text-foreground border border-border rounded-bl-none"
                            )}>
                                {msg.text}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-1 px-1">
                                {msg.timestamp}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-card border-t border-border">
                <form
                    className="flex gap-2"
                    onSubmit={handleSubmit}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Schreibe eine Nachricht..."
                        className="flex-1 px-4 py-2.5 bg-muted/50 border border-input text-foreground rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
                    />
                    <button
                        type="submit"
                        className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
