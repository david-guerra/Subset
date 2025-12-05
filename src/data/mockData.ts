export interface Student {
    id: number;
    name: string;
    major: string;
    year: number;
    interests: string[];
}

export interface Post {
    id: number;
    authorId: number;
    content: string;
    tags: string[];
    likes: number;
    comments: number;
    timestamp: string;
    hasImage: boolean;
    imageUrl?: string;
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
}

export const INITIAL_DATA = {
    students: [
        { id: 1, name: "Lisa Müller", major: "BWL", year: 2024, interests: ["Marketing", "Startups", "Social Media", "Reisen"] },
        { id: 2, name: "Jonas Schmidt", major: "Informatik", year: 2024, interests: ["Coding", "KI", "Gaming", "Pizza"] },
        { id: 3, name: "Sarah Klein", major: "Design", year: 2023, interests: ["UI/UX", "Kunst", "Fotografie", "Marketing"] },
        { id: 4, name: "Ahmed Yilmaz", major: "Maschinenbau", year: 2024, interests: ["Autos", "Technik", "Fussball", "Coding"] },
        { id: 5, name: "Emma Weber", major: "Psychologie", year: 2023, interests: ["Menschen", "Lesen", "Yoga", "Reisen"] },
        { id: 6, name: "Tom Schneider", major: "Informatik", year: 2024, interests: ["Coding", "KI", "Startups", "Gaming"] },
        { id: 7, name: "Maria Garcia", major: "BWL", year: 2022, interests: ["Marketing", "Startups", "Management"] }
    ],
    posts: [
        {
            id: 1,
            authorId: 2,
            content: "Hat jemand Erfahrung mit TensorFlow? Brauche Hilfe bei meinem KI-Projekt für die Uni. Würde mich über Tipps oder eine Lerngruppe freuen! 🚀",
            tags: ["KI", "Coding", "TensorFlow"],
            likes: 12,
            comments: 3,
            timestamp: "vor 2 Stunden",
            hasImage: false
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
            imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop"
        },
        {
            id: 3,
            authorId: 1,
            content: "Suche noch Mitgründer für mein Startup im Bereich Social Media Marketing. Wer hat Lust? 💼",
            tags: ["Startups", "Marketing", "Social Media"],
            likes: 18,
            comments: 5,
            timestamp: "vor 8 Stunden",
            hasImage: false
        },
        {
            id: 4,
            authorId: 4,
            content: "Uni-Fußball Training heute Abend um 18 Uhr! Alle sind willkommen, auch Anfänger. Kommt vorbei! ⚽",
            tags: ["Sport", "Fussball"],
            likes: 31,
            comments: 12,
            timestamp: "vor 1 Tag",
            hasImage: false
        },
        {
            id: 5,
            authorId: 5,
            content: "Buchempfehlung: 'Thinking, Fast and Slow' von Daniel Kahneman. Absolut faszinierend für alle, die sich für Psychologie interessieren! 📚",
            tags: ["Lesen", "Psychologie"],
            likes: 15,
            comments: 7,
            timestamp: "vor 1 Tag",
            hasImage: false
        },
        {
            id: 6,
            authorId: 6,
            content: "Wer ist dabei für eine Coding-Session heute Abend? Wir machen ein kleines Hackathon-Projekt. Discord-Link in den Kommentaren! 💻",
            tags: ["Coding", "Gaming", "Hackathon"],
            likes: 22,
            comments: 9,
            timestamp: "vor 2 Tagen",
            hasImage: false
        }
    ],
    groups: [
        { id: 301, name: "KI-Kurs Lerngruppe", desc: "Wir lernen zusammen für die KI-Klausur.", course: "Einführung in KI", tags: ["KI", "Coding", "Lernen"], maxMembers: 8, members: 3, createdBy: 2, isPublic: true },
        { id: 302, name: "Marketing Projekt", desc: "Gruppe für das Marketing-Projekt.", course: "Digitales Marketing", tags: ["Marketing", "Projekt"], maxMembers: 5, members: 2, createdBy: 1, isPublic: true },
        { id: 303, name: "Design Portfolio Review", desc: "Wir geben uns Feedback zu unseren Portfolios.", tags: ["Design", "UI/UX", "Kunst"], maxMembers: 6, members: 4, createdBy: 3, isPublic: true }
    ],
    modules: [
        { id: 101, title: "Einführung in KI", desc: "Grundlagen neuronaler Netze.", tags: ["KI", "Coding", "Technik", "Informatik"] },
        { id: 102, title: "Digitales Marketing", desc: "SEO, SEA und Social Media Strategien.", tags: ["Marketing", "Social Media", "BWL"] },
        { id: 103, title: "User Experience Design", desc: "Wie man nutzerzentrierte Produkte baut.", tags: ["UI/UX", "Design", "Psychologie"] },
        { id: 104, title: "Entrepreneurship 101", desc: "Vom MVP zum Unicorn.", tags: ["Startups", "BWL", "Management"] },
        { id: 105, title: "Robotics Lab", desc: "Bau deinen eigenen Roboter.", tags: ["Technik", "Maschinenbau", "Coding"] }
    ],
    clubs: [
        { id: 201, name: "Tech Innovators", desc: "Wir bauen coole Software Projekte.", tags: ["Coding", "Technik", "KI", "Startups"], members: 12 },
        { id: 202, name: "Debattierclub", desc: "Lerne zu argumentieren.", tags: ["Politik", "Rhetorik", "Menschen"], members: 25 },
        { id: 203, name: "Uni Sport Fussball", desc: "Jeden Dienstag Kicken.", tags: ["Sport", "Fussball"], members: 40 },
        { id: 204, name: "Art Collective", desc: "Zusammen malen und Ausstellungen besuchen.", tags: ["Kunst", "Design", "Fotografie"], members: 8 }
    ]
};
