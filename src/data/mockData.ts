export interface Student {
    id: number;
    name: string;
    major: string;
    year: string;
    interests: string[];
    bio?: string;
    courses?: string[];
    myClubs?: number[];
    email?: string;
    username?: string;
    password?: string;
    connections?: number[];
    incomingRequests?: number[];
    outgoingRequests?: number[];
}

export interface Comment {
    id: number;
    authorName: string;
    content: string;
    timestamp: string;
}

export interface Post {
    id: number;
    authorId: number;
    content: string;
    tags: string[];
    likes: number;
    comments: number;
    commentsList?: Comment[];
    timestamp: string;
    hasImage: boolean;
    imageUrl?: string;
    context?: {
        type?: string;
        name?: string;
        id?: number;
    };
    isAnonymous?: boolean;
    isFlagged?: boolean;
    flagReason?: 'integrity' | 'crisis';
}

export interface Group {
    id: number;
    name: string;
    desc: string;
    course?: string;
    tags: string[];
    maxMembers: number;
    members: number;
    createdBy: number;
    isPublic: boolean;
}

export interface Module {
    id: number;
    title: string;
    desc: string;
    tags: string[];
}

export interface Club {
    id: number;
    name: string;
    desc: string;
    tags: string[];
    members: number;
    meetingDay?: string;
    meetingTime?: string;
}

export interface Message {
    id: number;
    senderId: number | 'me';
    text: string;
    timestamp: string;
}

export interface Chat {
    id: number;
    partnerId: number; // For direct chats, this is studentId. For group/club, this might be 0 or unused if we rely on contextId
    type: 'direct' | 'group' | 'club';
    contextId?: number; // groupId or clubId
    lastMessage: string;
    timestamp: string;
    unread: number;
    messages: Message[];
}

export interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    organizer: {
        type: 'club' | 'group' | 'module' | 'university';
        name: string;
        id?: number;
    };
    tags: string[];
    image?: string;
    attendees?: number;
    attendeeIds?: number[];
    isPublic?: boolean;
}

export const INITIAL_DATA = {
    students: [
        { id: 1, name: "Alice Smith", major: "Informatik", year: "WiSe 23/24", interests: ["Coding", "AI", "Gaming"], bio: "Hi, ich bin Alice!", courses: ["Einführung in KI"], connections: [] },
        { id: 2, name: "Bob Jones", major: "BWL", year: "SoSe 24", interests: ["Startups", "Finance", "Tennis"], courses: ["Digitales Marketing"] },
        { id: 3, name: "Charlie Brown", major: "Design", year: "WiSe 22/23", interests: ["UI/UX", "Art", "Photography"], courses: ["User Experience Design"] },
        { id: 4, name: "Diana Prince", major: "Psychologie", year: "SoSe 23", interests: ["Mindfulness", "Yoga", "Reading"], courses: ["Psychologie Einführung"] },
        { id: 5, name: "Evan Wright", major: "Maschinenbau", year: "WiSe 24/25", interests: ["Robotics", "Cars", "Engineering"], courses: ["Robotics Lab"] },
        { id: 6, name: "Fiona Gallagher", major: "Soziale Arbeit", year: "SoSe 22", interests: ["Volunteering", "Travel", "Music"], courses: ["Soziale Arbeit Grundlagen"] },
        { id: 7, name: "George Miller", major: "Geschichte", year: "WiSe 21/22", interests: ["History", "Museums", "Writing"], courses: ["Geschichtswissenschaften I"] },
        { id: 8, name: "Hannah Lee", major: "Informatik", year: "SoSe 23", interests: ["Hacking", "Security", "Crypto"], bio: "Cybersecurity Enthusiast.", courses: [] },
        { id: 9, name: "Ian Chen", major: "Informatik", year: "WiSe 24/25", interests: ["Game Dev", "Unity", "Anime"], bio: "Indie Game Developer.", courses: [] },
        { id: 10, name: "Julia Bauer", major: "Informatik", year: "WiSe 22/23", interests: ["Data Science", "Python", "Chess"], bio: "Daten sind das neue Öl.", courses: [] },
        { id: 11, name: "Kevin Klein", major: "BWL", year: "WiSe 23/24", interests: ["Consulting", "Golf", "Reisen"], bio: "Future CEO.", courses: [] },
        { id: 12, name: "Laura Weber", major: "BWL", year: "SoSe 22", interests: ["Marketing", "Fashion", "Instagram"], bio: "Social Media Manager in spe.", courses: [] },
        { id: 13, name: "Max Mustermann", major: "BWL", year: "WiSe 24/25", interests: ["Accounting", "Numbers", "Running"], bio: "Zahlen lügen nicht.", courses: [] },
        { id: 14, name: "Nina Hagen", major: "Design", year: "SoSe 24", interests: ["Fashion", "Sewing", "Sustainability"], bio: "Eco-Design ist die Zukunft.", courses: [] },
        { id: 15, name: "Oscar Wilde", major: "Design", year: "WiSe 21/22", interests: ["Typography", "Vintage", "Books"], bio: "Schriften-Nerd.", courses: [] },
        { id: 16, name: "Paula Paint", major: "Design", year: "WiSe 23/24", interests: ["Illustration", "Comics", "Drawing"], bio: "Ich zeichne den ganzen Tag.", courses: [] },
        { id: 17, name: "Quinn Quinn", major: "Psychologie", year: "SoSe 23", interests: ["Neuroscience", "Brain", "Research"], bio: "Das Gehirn ist faszinierend.", courses: [] },
        { id: 18, name: "Rachel Green", major: "Psychologie", year: "WiSe 22/23", interests: ["Therapy", "Friends", "Coffee"], bio: "Werde Therapeutin.", courses: [] },
        { id: 19, name: "Steve Jobs", major: "Psychologie", year: "WiSe 24/25", interests: ["Behavior", "Tech", "Simplicity"], bio: "Warum tun wir, was wir tun?", courses: [] }
    ] as Student[],

    posts: [
        {
            id: 1,
            authorId: 2,
            content: "Hat jemand Erfahrung mit TensorFlow? Brauche Hilfe bei meinem KI-Projekt für die Uni. Würde mich über Tipps oder eine Lerngruppe freuen! 🚀",
            tags: ["KI", "Coding", "TensorFlow"],
            likes: 12,
            comments: 3,
            timestamp: "vor 2 Stunden",
            hasImage: false,
            context: { type: 'module', name: 'Einführung in KI', id: 101 }
        },
        {
            id: 2,
            authorId: 3,
            content: "Mein neues Design-Portfolio ist fertig! Feedback wäre super. Besonders stolz auf die UI/UX Projekte.",
            tags: ["Design", "UI/UX", "Portfolio"],
            likes: 24,
            comments: 8,
            timestamp: "vor 5 Stunden",
            hasImage: true,
            imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
            context: { type: 'group', name: 'Design Portfolio Review', id: 303 }
        },
        {
            id: 3,
            authorId: 1,
            content: "Suche noch Mitgründer für mein Startup im Bereich Social Media Marketing. Wer hat Lust? 💼",
            tags: ["Startups", "Marketing", "Social Media"],
            likes: 18,
            comments: 5,
            timestamp: "vor 8 Stunden",
            hasImage: false,
            context: { type: 'club', name: 'Tech Innovators', id: 201 }
        },
        {
            id: 4,
            authorId: 4,
            content: "Uni-Fußball Training heute Abend um 18 Uhr! Alle sind willkommen, auch Anfänger. Kommt vorbei! ⚽",
            tags: ["Sport", "Fussball"],
            likes: 31,
            comments: 12,
            timestamp: "vor 1 Tag",
            hasImage: false,
            context: { type: 'club', name: 'Uni Sport Fussball', id: 203 }
        },
        {
            id: 5,
            authorId: 5,
            content: "Buchempfehlung: 'Thinking, Fast and Slow' von Daniel Kahneman. Absolut faszinierend für alle, die sich für Psychologie interessieren! 📚",
            tags: ["Lesen", "Psychologie"],
            likes: 15,
            comments: 7,
            timestamp: "vor 1 Tag",
            hasImage: false,
            context: { type: 'connection', name: 'Evan Wright' }
        },
        {
            id: 6,
            authorId: 6,
            content: "Wer ist dabei für eine Coding-Session heute Abend? Wir machen ein kleines Hackathon-Projekt. Discord-Link in den Kommentaren! 💻",
            tags: ["Coding", "Gaming", "Hackathon"],
            likes: 22,
            comments: 9,
            timestamp: "vor 2 Tagen",
            hasImage: false,
            context: { type: 'general', name: 'Campus News' }
        }
    ] as Post[],

    groups: [
        { id: 301, name: "KI-Kurs Lerngruppe", desc: "Wir lernen zusammen für die KI-Klausur.", course: "Einführung in KI", tags: ["KI", "Coding", "Lernen"], maxMembers: 8, members: 3, createdBy: 2, isPublic: true },
        { id: 302, name: "Marketing Projekt", desc: "Gruppe für das Marketing-Projekt.", course: "Digitales Marketing", tags: ["Marketing", "Projekt"], maxMembers: 5, members: 2, createdBy: 1, isPublic: true },
        { id: 303, name: "Design Portfolio Review", desc: "Wir geben uns Feedback zu unseren Portfolios.", tags: ["Design", "UI/UX", "Kunst"], maxMembers: 6, members: 4, createdBy: 3, isPublic: true }
    ] as Group[],

    modules: [
        { id: 101, title: "Einführung in KI", desc: "Grundlagen neuronaler Netze.", tags: ["KI", "Coding", "Technik", "Informatik"] },
        { id: 102, title: "Digitales Marketing", desc: "SEO, SEA und Social Media Strategien.", tags: ["Marketing", "Social Media", "BWL"] },
        { id: 103, title: "User Experience Design", desc: "Wie man nutzerzentrierte Produkte baut.", tags: ["UI/UX", "Design", "Psychologie"] },
        { id: 104, title: "Entrepreneurship 101", desc: "Vom MVP zum Unicorn.", tags: ["Startups", "BWL", "Management"] },
        { id: 105, title: "Robotics Lab", desc: "Bau deinen eigenen Roboter.", tags: ["Technik", "Maschinenbau", "Coding"] }
    ] as Module[],

    clubs: [
        { id: 201, name: "Tech Innovators", desc: "Wir bauen coole Software Projekte.", tags: ["Coding", "Technik", "KI", "Startups"], members: 12 },
        { id: 202, name: "Debattierclub", desc: "Lerne zu argumentieren.", tags: ["Politik", "Rhetorik", "Menschen"], members: 25 },
        { id: 203, name: "Uni Sport Fussball", desc: "Jeden Dienstag Kicken.", tags: ["Sport", "Fussball"], members: 40 },
        { id: 204, name: "Art Collective", desc: "Zusammen malen und Ausstellungen besuchen.", tags: ["Kunst", "Design", "Fotografie"], members: 8 },
        { id: 205, name: "Uni Orchester", desc: "Klassische Musik und Konzerte.", tags: ["Musik", "Kunst", "Kultur"], members: 35 },
        { id: 206, name: "Invest & Finance", desc: "Alles über Aktien und Börse.", tags: ["Finance", "BWL", "Startups"], members: 18 },
        { id: 207, name: "E-Sports League", desc: "Competitive Gaming am Campus.", tags: ["Gaming", "Coding", "Technik"], members: 42 }
    ] as Club[],

    chats: [
        {
            id: 1,
            partnerId: 2, // Jonas
            lastMessage: "Klingt gut! Lass uns morgen in der Bib treffen.",
            timestamp: "14:30",
            unread: 1,
            messages: [
                { id: 1, senderId: 2, text: "Hey! Hast du schon mit der KI-Aufgabe angefangen?", timestamp: "14:25" },
                { id: 2, senderId: 'me' as const, text: "Ja, aber ich hänge noch an Teil 2.", timestamp: "14:28" },
                { id: 3, senderId: 2, text: "Klingt gut! Lass uns morgen in der Bib treffen.", timestamp: "14:30" }
            ]
        },
        {
            id: 2,
            partnerId: 3, // Sarah
            lastMessage: "Danke für das Feedback!",
            timestamp: "Gestern",
            unread: 0,
            messages: [
                { id: 1, senderId: 'me' as const, text: "Cooles Portfolio! Die Farben gefallen mir.", timestamp: "10:00" },
                { id: 2, senderId: 3, text: "Danke für das Feedback!", timestamp: "10:15" }
            ]
        }
    ] as Chat[],
    events: [] as Event[]
};
