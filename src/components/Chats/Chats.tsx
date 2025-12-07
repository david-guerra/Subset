import { useState, useEffect } from 'react';
import type { Chat, Student, Group, Club } from '../../data/mockData';
import { ChatWindow } from './ChatWindow';
import clsx from 'clsx';
import { Search, Users, Hash } from 'lucide-react';

interface ChatsProps {
    initialChatId?: number | null;
    currentUserId: number;
}

export function Chats({ initialChatId, currentUserId }: ChatsProps) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<number | null>(initialChatId || null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        Promise.all([
            fetch('/api/chats').then(res => res.json()),
            fetch('/api/students').then(res => res.json()),
            fetch('/api/groups').then(res => res.json()),
            fetch('/api/clubs').then(res => res.json())
        ]).then(([chatsData, studentsData, groupsData, clubsData]) => {
            setChats(chatsData);
            setStudents(studentsData);
            setGroups(groupsData);
            setClubs(clubsData);
            if (initialChatId) {
                setSelectedChatId(initialChatId);
            }
        }).catch(err => console.error("Failed to load chats:", err));
    }, [initialChatId]);

    const getChatMeta = (chat: Chat) => {
        if (chat.type === 'group') {
            const group = groups.find(g => g.id === chat.contextId);
            return {
                name: group?.name || 'Unbekannte Gruppe',
                image: null,
                icon: <Hash size={24} className="text-white" />,
                bg: 'bg-indigo-500'
            };
        } else if (chat.type === 'club') {
            const club = clubs.find(c => c.id === chat.contextId);
            return {
                name: club?.name || 'Unbekannter Club',
                image: null,
                icon: <Users size={24} className="text-white" />,
                bg: 'bg-pink-500'
            };
        } else {
            const partner = students.find(s => s.id === chat.partnerId);
            return {
                name: partner?.name || 'Unbekannt',
                image: partner ? `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=random` : null,
                bg: 'bg-gray-200'
            };
        }
    };

    const filteredChats = chats.filter(chat => {
        const meta = getChatMeta(chat);
        return meta.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const selectedChat = chats.find(c => c.id === selectedChatId);

    return (
        <div className="max-w-[1000px] mx-auto py-6 h-[calc(100vh-100px)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">

                {/* Chat List */}
                <div className={clsx("bg-card rounded-2xl shadow-sm border border-border flex flex-col overflow-hidden h-full", selectedChatId ? "hidden md:flex" : "flex")}>
                    <div className="p-4 border-b border-border">
                        <h2 className="text-xl font-bold text-foreground mb-3">Nachrichten</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Suchen..."
                                className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-input rounded-lg text-sm text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredChats.map(chat => {
                            const meta = getChatMeta(chat);
                            const isSelected = selectedChatId === chat.id;

                            return (
                                <button
                                    key={chat.id}
                                    onClick={() => setSelectedChatId(chat.id)}
                                    className={clsx(
                                        "w-full p-4 flex items-center gap-3 hover:bg-accent/50 transition-colors text-left border-b border-border/50 last:border-0",
                                        isSelected && "bg-primary/5 hover:bg-primary/10"
                                    )}
                                >
                                    <div className="relative">
                                        {meta.image ? (
                                            <img
                                                src={meta.image}
                                                className="w-12 h-12 rounded-full object-cover bg-muted"
                                                alt={meta.name}
                                            />
                                        ) : (
                                            <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center shrink-0", meta.bg)}>
                                                {meta.icon}
                                            </div>
                                        )}

                                        {chat.unread > 0 && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <span className={clsx("font-semibold truncate", chat.unread > 0 ? "text-foreground" : "text-muted-foreground")}>
                                                {meta.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{chat.timestamp}</span>
                                        </div>
                                        <p className={clsx("text-sm truncate", chat.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                                            {chat.type === 'direct' ? '' : <span className="font-semibold mr-1">{chat.messages[0]?.senderId === 'me' ? 'Ich:' : 'User:'}</span>}
                                            {/* Ideally resolve sender name for groups */}
                                            {chat.unread > 0 ? `• ${chat.lastMessage}` : chat.lastMessage}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}

                        {filteredChats.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                Keine Chats gefunden
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className={clsx("md:col-span-2 h-full", !selectedChatId ? "hidden md:block" : "block")}>
                    {selectedChat ? (
                        <ChatWindow
                            key={selectedChat.id}
                            chat={selectedChat}
                            partner={getChatMeta(selectedChat)}
                            currentUserId={currentUserId}
                            onSendMessage={(text) => {
                                console.log("Sending message:", text);
                                // TODO: Implement API call
                            }}
                            onBack={() => setSelectedChatId(null)}
                        />
                    ) : (
                        <div className="h-full bg-card rounded-2xl shadow-sm border border-border flex flex-col items-center justify-center text-muted-foreground p-8">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Search size={32} className="text-muted-foreground/50" />
                            </div>
                            <p>Wähle einen Chat aus, um zu beginnen</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
