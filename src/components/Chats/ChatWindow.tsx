import type { Chat } from '../../data/mockData';
import { Send } from 'lucide-react';
import clsx from 'clsx';
import { useRef, useEffect } from 'react';

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
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white z-10 w-full">
                <button onClick={onBack} className="md:hidden text-gray-500 hover:text-gray-900 mr-2">
                    ←
                </button>

                {image ? (
                    <img src={image} className="w-10 h-10 rounded-full object-cover" alt={name} />
                ) : partner?.icon ? (
                    <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white", partner.bg || "bg-gray-400")}>
                        {partner.icon}
                    </div>
                ) : (
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`} className="w-10 h-10 rounded-full" alt={name} />
                )}

                <div>
                    <div className="font-bold text-gray-900">{name}</div>
                    {chat.type === 'direct' && <div className="text-xs text-green-500 font-medium">Online</div>}
                    {chat.type === 'group' && <div className="text-xs text-gray-500">{chat.messages.length} Nachrichten</div>}
                    {chat.type === 'club' && <div className="text-xs text-pink-500 font-medium">Club Channel</div>}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
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
                                    ? "bg-primary text-white rounded-br-none"
                                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                            )}>
                                {msg.text}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1 px-1">
                                {msg.timestamp}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form
                    className="flex gap-2"
                    onSubmit={handleSubmit}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Schreibe eine Nachricht..."
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                    <button
                        type="submit"
                        className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors shadow-sm"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
