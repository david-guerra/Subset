import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Student, Post, Group, Club, Module, Chat } from './models.ts';
import { INITIAL_DATA } from '../src/data/mockData.ts'; // Share data!
// Trigger restart for context changes

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/subset')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- API ROUTES ---

// RESET ROUTE (The magic button)
app.post('/api/reset', async (req, res) => {
    try {
        // 1. Clear all collections
        await Promise.all([
            Student.deleteMany({}),
            Post.deleteMany({}),
            Group.deleteMany({}),
            Club.deleteMany({}),
            Module.deleteMany({}),
            Chat.deleteMany({})
        ]);

        // Helpers for randomization
        const getRandomItems = (arr: any[], min: number, max: number) => {
            const shuffled = [...arr].sort(() => 0.5 - Math.random());
            const count = Math.floor(Math.random() * (max - min + 1)) + min;
            return shuffled.slice(0, count);
        };

        const allModuleTitles = INITIAL_DATA.modules.map(m => m.title);
        const clubsWithMeetingTimes = INITIAL_DATA.clubs.map(c => ({
            ...c,
            meetingDay: ['Mo', 'Di', 'Mi', 'Do', 'Fr'][Math.floor(Math.random() * 5)],
            meetingTime: ['18:00', '19:30', '20:00'][Math.floor(Math.random() * 3)]
        }));
        const allClubIds = clubsWithMeetingTimes.map(c => c.id);

        // Prepare Students with Random Courses and Auth Data
        const studentsWithCourses = INITIAL_DATA.students.map(s => {
            const username = s.name.toLowerCase().replace(/\s+/g, '');
            return {
                ...s,
                username,
                email: `${username}@university.edu`,
                password: 'admin',
                courses: getRandomItems(allModuleTitles, 2, 4) // 2-4 random courses
            };
        });

        // Prepare Clubs with Random Members (Distribute mock students into clubs)
        // We initialize a map for club memberships
        const clubMemberships: Record<number, number[]> = {};
        allClubIds.forEach(id => clubMemberships[id] = []);

        studentsWithCourses.forEach(student => {
            // Each student joins 2-4 random clubs (Requirement: at least 2)
            const joinedClubs = getRandomItems(INITIAL_DATA.clubs, 2, 4);
            joinedClubs.forEach(c => {
                if (!clubMemberships[c.id]) clubMemberships[c.id] = [];
                clubMemberships[c.id].push(student.id);
            });
        });

        // Prepare Clubs data
        const clubsWithMembers = INITIAL_DATA.clubs.map(c => ({
            ...c,
            memberIds: clubMemberships[c.id] || [],
            members: (clubMemberships[c.id]?.length || 0) + (c.members || 5) // Add base members to look popular
        }));

        // 2. Reseed

        // GENERATE GROUPS LOGIC
        // 1. Create a group for EVERY module (5 groups)
        let nextGroupId = 301;
        const moduleGroups = INITIAL_DATA.modules.map(mod => ({
            id: nextGroupId++,
            name: `Lerngruppe: ${mod.title}`,
            desc: `Wir lernen gemeinsam für ${mod.title}.`,
            course: mod.title,
            tags: [...mod.tags, "Lernen", "Klausur"],
            maxMembers: Math.floor(Math.random() * 6) + 3, // 3-8 members
            members: 1, // Will update below
            createdBy: getRandomItems(INITIAL_DATA.students, 1, 1)[0].id,
            isPublic: true,
            memberIds: [] as number[]
        }));

        // 2. Create MORE additional non-module groups (Need at least enough to pick 3 distinct easily)
        const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

        const extraTopics = [
            { name: "Laufgruppe am Campus", desc: loremIpsum, tags: ["Sport", "Laufen", "Gesundheit"] },
            { name: "Kino & Film Club", desc: loremIpsum, tags: ["Film", "Kino", "Kultur"] },
            { name: "Brettspiele Abend", desc: loremIpsum, tags: ["Gaming", "Brettspiele", "Social"] },
            { name: "Koch-Treff", desc: loremIpsum, tags: ["Kochen", "Essen", "Kultur"] },
            { name: "Meditations-Kreis", desc: loremIpsum, tags: ["Mindfulness", "Gesundheit", "Entspannung"] },
            { name: "Fotografie Walk", desc: loremIpsum, tags: ["Kunst", "Fotografie", "Hobby"] },
            { name: "Wandergruppe", desc: loremIpsum, tags: ["Sport", "Natur", "Wandern"] },
            { name: "Start-up Pitch Circle", desc: loremIpsum, tags: ["Startups", "Business", "Karriere"] },
            { name: "Yoga im Park", desc: loremIpsum, tags: ["Sport", "Yoga", "Mindfulness"] },
            { name: "Vegan Cooking", desc: loremIpsum, tags: ["Kochen", "Vegan", "Essen"] }
        ];

        const extraGroups = extraTopics.map(topic => ({
            id: nextGroupId++,
            name: topic.name,
            desc: topic.desc,
            course: undefined,
            tags: topic.tags,
            maxMembers: Math.floor(Math.random() * 10) + 5, // 5-15 members
            members: 1,
            createdBy: getRandomItems(INITIAL_DATA.students, 1, 1)[0].id,
            isPublic: true,
            memberIds: [] as number[]
        }));

        // ... (rest of reset logic) ...

        // ... (existing code) ...

        app.post('/api/groups/join', async (req, res) => {
            if (!currentUserId) return res.status(401).json({ error: "Not logged in" });
            const { groupId } = req.body;

            const group = await Group.findOne({ id: groupId });
            if (!group) return res.status(404).json({ error: "Group not found" });

            if (!group.memberIds.includes(currentUserId)) {
                group.memberIds.push(currentUserId);
                group.members += 1;
                await group.save();
            }
            res.json({ success: true, group });
        });

        app.post('/api/groups/leave', async (req, res) => {
            if (!currentUserId) return res.status(401).json({ error: "Not logged in" });
            const { groupId } = req.body;

            const group = await Group.findOne({ id: groupId });
            if (!group) return res.status(404).json({ error: "Group not found" });

            if (group.memberIds.includes(currentUserId)) {
                group.memberIds = group.memberIds.filter(id => id !== currentUserId);
                group.members = Math.max(0, group.members - 1);
                await group.save();
            }
            res.json({ success: true, group });
        });

        const allGeneratedGroups = [...moduleGroups, ...extraGroups];

        // Assign every student to 3-5 groups (Requirement: at least 3)
        const groupMemberships: Record<number, number[]> = {};
        allGeneratedGroups.forEach(g => groupMemberships[g.id] = []);

        studentsWithCourses.forEach(student => {
            const joinedGroups = getRandomItems(allGeneratedGroups, 3, 5);
            joinedGroups.forEach(g => {
                if (!groupMemberships[g.id]) groupMemberships[g.id] = [];
                groupMemberships[g.id].push(student.id);
            });
        });

        // Update groups with members
        const finalGroups = allGeneratedGroups.map(g => ({
            ...g,
            memberIds: [...new Set([...(groupMemberships[g.id] || []), g.createdBy])], // Ensure creator is included
            members: (groupMemberships[g.id]?.length || 0) // count
        }));

        // GENERATE POSTS LOGIC
        const mockPosts: any[] = [...INITIAL_DATA.posts];
        let nextPostId = 1000;

        // GENERATE CHATS LOGIC
        // For the purpose of reset, let's assume a "current user" is the first student (ID 1)
        const mockCurrentUserId = studentsWithCourses[0].id;
        const mockCurrentUser = studentsWithCourses[0];

        // Chat Templates
        const DIRECT_TEMPLATES = [
            { last: "Hey, hast du die Notizen von heute?", msgs: ["Hey, hast du die Notizen von heute?", "Ja, ich schick sie dir gleich!"] },
            { last: "Gehen wir morgen Mittag essen?", msgs: ["Hast du morgen Mittag Zeit?", "Gehen wir morgen Mittag essen?", "Klar, 12 Uhr Mensa?"] },
            { last: "Hast du die Klausurtermine gesehen?", msgs: ["Hast du die Klausurtermine gesehen?", "Ja, voll stressig im Februar."] },
            { last: "Danke dir!", msgs: ["Kannst du mir kurz bei der Aufgabe helfen?", "Jo, was ist das Problem?", "Hat sich erledigt, habs. Danke dir!"] },
            { last: "Bis gleich!", msgs: ["Bin in 5 Minuten da.", "Alles klar, warte vorm Eingang.", "Bis gleich!"] }
        ];

        const GROUP_TEMPLATES = [
            { last: "Wann treffen wir uns nächstes Mal?", msgs: ["Habt ihr den Raum schon gebucht?", "Ich kümmere mich darum.", "Wann treffen wir uns nächstes Mal?"] },
            { last: "Hat jemand das PDF?", msgs: ["Ich finde die Folien nicht mehr.", "Hat jemand das PDF?", "Hier ist der Link."] },
            { last: "Meeting verschoben auf 14 Uhr", msgs: ["Leute, Professor kommt später.", "Meeting verschoben auf 14 Uhr", "Alles klar, danke für die Info."] },
            { last: "Wer präsentiert Teil A?", msgs: ["Wir müssen die Slide aufteilen.", "Wer präsentiert Teil A?", "Ich mach das."] }
        ];

        const CLUB_TEMPLATES = [
            { last: "Event am Freitag steht!", msgs: ["Wer bringt Snacks mit?", "Ich mach Kuchen.", "Event am Freitag steht!"] },
            { last: "Neues Mitglied!", msgs: ["Hallo zusammen!", "Willkommen im Club!", "Neues Mitglied!"] },
            { last: "Abstimmung für das Sommerfest", msgs: ["Bitte alle abstimmen.", "Link ist im Channel.", "Abstimmung für das Sommerfest"] },
            { last: "Raumänderung für heute Abend", msgs: ["Achtung, wir sind heute in Raum 102.", "Raumänderung für heute Abend", "Danke!"] }
        ];

        const initialChats = [];
        let chatIdCounter = 1;

        // 1. Direct Chats
        // Pick 3 random students to have chats with (excluding the mock current user)
        const chatPartners = studentsWithCourses.filter(s => s.id !== mockCurrentUserId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        for (const partner of chatPartners) {
            const template = getRandomItems(DIRECT_TEMPLATES, 1, 1)[0];
            initialChats.push({
                id: chatIdCounter++,
                partnerId: partner.id,
                type: 'direct',
                lastMessage: template.last,
                timestamp: getRandomItems(["10:30", "Gestern", "Vorgestern", "14:15"], 1, 1)[0],
                unread: 0,
                messages: template.msgs.map((text: string, idx: number) => ({
                    id: idx + 1,
                    senderId: idx % 2 === 0 ? partner.id : mockCurrentUserId, // Alternate roughly
                    text: text,
                    timestamp: "Letztes Mal"
                }))
            });
        }

        // 2. Group Chats
        // Pick top 2 groups the mock current user is in
        const myGroups = finalGroups.filter(g => g.memberIds.includes(mockCurrentUserId)).slice(0, 2);

        for (const group of myGroups) {
            console.log(`Creating chat for group: ${group.name}`);
            const template = getRandomItems(GROUP_TEMPLATES, 1, 1)[0];
            initialChats.push({
                id: chatIdCounter++,
                partnerId: 0, // Not applicable for group chats
                type: 'group',
                contextId: group.id,
                lastMessage: template.last,
                timestamp: getRandomItems(["09:15", "11:00", "Gestern"], 1, 1)[0],
                unread: 0,
                messages: template.msgs.map((text: string, idx: number) => ({
                    id: idx + 1,
                    senderId: group.memberIds[idx % group.memberIds.length] || mockCurrentUserId,
                    text: text,
                    timestamp: "Kürzlich"
                }))
            });
        }

        // 3. Club Chats
        // Find clubs the mock current user is in
        const myClubObjs = clubsWithMembers.filter(c => c.memberIds.includes(mockCurrentUserId)).slice(0, 2);

        for (const club of myClubObjs) {
            const template = getRandomItems(CLUB_TEMPLATES, 1, 1)[0];
            initialChats.push({
                id: chatIdCounter++,
                partnerId: 0, // Not applicable for club chats
                type: 'club',
                contextId: club.id,
                lastMessage: template.last,
                timestamp: "Gestern",
                unread: 0,
                messages: template.msgs.map((text: string, idx: number) => ({
                    id: idx + 1,
                    senderId: club.memberIds[idx % club.memberIds.length] || 5,
                    text: text,
                    timestamp: "Gestern"
                }))
            });
        }

        // 1. Generate Posts for Module Groups
        moduleGroups.forEach(g => {
            if (Math.random() > 0.3) { // 70% chance of a post
                const author = getRandomItems(INITIAL_DATA.students, 1, 1)[0];
                mockPosts.push({
                    id: nextPostId++,
                    authorId: author.id,
                    content: `Hat jemand Lust, die Aufgaben für ${g.course} zusammen zu machen?`,
                    tags: ["Lernen", "Aufgaben", g.course!],
                    likes: Math.floor(Math.random() * 10),
                    comments: Math.floor(Math.random() * 5),
                    timestamp: "vor 1 Tag",
                    hasImage: false,
                    context: { type: 'group', name: g.name, id: g.id }
                });
            }
        });

        // 2. Generate Posts for Clubs
        clubsWithMembers.forEach(c => {
            if (Math.random() > 0.4) { // 60% chance
                const authorId = c.memberIds.length > 0 ? c.memberIds[0] : 1; // Pick a member
                const author = INITIAL_DATA.students.find(s => s.id === authorId) || INITIAL_DATA.students[0];

                mockPosts.push({
                    id: nextPostId++,
                    authorId: author.id,
                    content: `Wichtiges Update für alle ${c.name} Mitglieder! Checkt eure Nachrichten for dem nächsten Treffen.`,
                    tags: ["Club", "Update", ...c.tags],
                    likes: Math.floor(Math.random() * 30),
                    comments: Math.floor(Math.random() * 5),
                    timestamp: "vor 5 Stunden",
                    hasImage: false,
                    context: { type: 'club', name: c.name, id: c.id }
                });
            }
        });

        // 3. Generate Posts for Modules (General questions)
        INITIAL_DATA.modules.forEach(m => {
            if (Math.random() > 0.6) { // 40% chance
                const author = getRandomItems(INITIAL_DATA.students, 1, 1)[0];
                mockPosts.push({
                    id: nextPostId++,
                    authorId: author.id,
                    content: `Weiß jemand, wann die Klausur für ${m.title} genau stattfindet? Finde das Datum nicht.`,
                    tags: ["Klausur", "Orga", m.title],
                    likes: Math.floor(Math.random() * 5),
                    comments: Math.floor(Math.random() * 10),
                    timestamp: "vor 2 Tagen",
                    hasImage: false,
                    context: { type: 'module', name: m.title, id: m.id }
                });
            }
        });

        await Promise.all([
            Student.insertMany(studentsWithCourses as any),
            Post.insertMany(mockPosts as any),
            Group.insertMany(finalGroups as any),
            Club.insertMany(clubsWithMembers as any),
            Module.insertMany(INITIAL_DATA.modules as any),
            Chat.insertMany(initialChats as any)
        ]);

        console.log('🔄 Database has been reset with RANDOMIZED mock data');
        res.json({ success: true, message: "Database reset to randomized mock data" });
    } catch (error) {
        console.error('Reset Failed', error);
        res.status(500).json({ error: "Reset failed" });
    }
});

// MOCK AUTH - We'll assume User ID 100 is "Me" (The new user created in App.tsx) or just use the first student? 
// Actually, App.tsx had a hardcoded user "David Guerra". Let's create a "Me" logic.
// For this prototype, we'll store a dedicated "User" document or just mock it.
// Let's create a User model or just use Student.
// To keep it simple: We will create a robust /api/me that finds or creates the "Current User" with ID 999.

// MOCK SESSION STATE
let currentUserId: number | null = null; // Stores the ID of the currently logged-in user

// ROUTES

app.get('/api/me', async (req, res) => {
    if (!currentUserId) {
        return res.status(401).json({ error: "Not logged in" });
    }

    const me = await Student.findOne({ id: currentUserId });
    if (!me) {
        return res.status(404).json({ error: "User not found" });
    }

    // Now find my groups and clubs
    const myGroups = await Group.find({ memberIds: currentUserId });
    const myClubs = await Club.find({ memberIds: currentUserId });

    res.json({
        ...me.toObject(),
        myGroups: myGroups.map(g => g.id),
        myClubs: myClubs.map(c => c.id),
        bio: (me as any).bio
    });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Case-insensitive username lookup
    const user = await Student.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });

    if (user && (user as any).password === password) {
        currentUserId = user.id!; // Log in
        res.json({ success: true, user });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

app.post('/api/logout', (req, res) => {
    currentUserId = null;
    res.json({ success: true });
});

app.post('/api/register', async (req, res) => {
    const { name, major, year, interests, bio } = req.body;

    // Create new ID (max + 1)
    const lastStudent = await Student.findOne().sort({ id: -1 });
    const newId = lastStudent ? lastStudent.id + 1 : 1;

    // Randomize courses for mock version
    const allModules = await Module.find();
    // Shuffle and pick 3
    const shuffled = allModules.sort(() => 0.5 - Math.random());
    const randomCourses = shuffled.slice(0, 3).map(m => m.title);

    // Create the user
    const newUser = await Student.create({
        name,
        major,
        year,
        interests,
        bio,
        courses: randomCourses,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    } as any);

    currentUserId = newId as number; // Auto-login
    res.json(newUser);
});

app.put('/api/me', async (req, res) => {
    if (!currentUserId) {
        return res.status(401).json({ error: "Not logged in" });
    }
    const changes = req.body; // { bio, year, interests ... }
    await Student.updateOne({ id: currentUserId }, changes);
    res.json({ success: true });
});

// GET ROUTES
app.get('/api/posts', async (req, res) => {
    if (!currentUserId) {
        // If not logged in, maybe show only general posts or empty?
        // For now, let's show all general posts to guests (or empty)
        // But the app seems to expect a user.
        return res.json(await Post.find({ 'context.type': 'general' }));
    }

    const me = await Student.findOne({ id: currentUserId });
    const myGroups = await Group.find({ memberIds: currentUserId });
    const myClubs = await Club.find({ memberIds: currentUserId });

    if (!me) return res.json([]);

    const myGroupIds = myGroups.map(g => g.id);
    const myClubIds = myClubs.map(c => c.id);
    const myCourses = me.courses || [];

    const posts = await Post.find({
        $or: [
            { 'context.type': 'general' }, // Always show general
            { 'context.type': 'connection' }, // Show connection posts (could refine to friends only later)
            { 'context.type': 'group', 'context.id': { $in: myGroupIds } },
            { 'context.type': 'club', 'context.id': { $in: myClubIds } },
            { 'context.type': 'module', 'context.name': { $in: myCourses } }
        ]
    } as any).sort({ id: -1 });

    res.json(posts);
});

// ... (Other GETs remain the same, ensure they exist)
app.get('/api/students', async (req, res) => {
    // We need to enrich students with their joined clubs for matching
    const students = await Student.find();
    const enriched = await Promise.all(students.map(async (s) => {
        const clubs = await Club.find({ memberIds: s.id });
        return {
            ...s.toObject(),
            myClubs: clubs.map(c => c.id) // Return IDs of clubs they are in
        };
    }));
    res.json(enriched);
});
app.get('/api/groups', async (req, res) => { res.json(await Group.find()); });
app.get('/api/clubs', async (req, res) => { res.json(await Club.find()); });
app.get('/api/modules', async (req, res) => { res.json(await Module.find()); });
app.get('/api/chats', async (req, res) => { res.json(await Chat.find()); });

app.post('/api/chats', async (req, res) => {
    if (!currentUserId) return res.status(401).json({ error: "Not logged in" });
    const { partnerId } = req.body;

    // Check if chat exists
    let chat = await Chat.findOne({ partnerId });

    if (!chat) {
        // Create new chat
        const lastChat = await Chat.findOne().sort({ id: -1 });
        const newId = lastChat ? lastChat.id + 1 : 1;

        chat = await Chat.create({
            id: newId,
            partnerId,
            lastMessage: "Starten Sie eine Unterhaltung",
            timestamp: "Neu",
            unread: 0,
            messages: []
        } as any);
    }

    res.json(chat);
});


// ACTION ROUTES
app.post('/api/posts', async (req, res) => {
    if (!currentUserId) return res.status(401).json({ error: "Not logged in" });
    const newPost = req.body;
    // Assign ID
    const count = await Post.countDocuments();
    newPost.id = count + 101;
    newPost.timestamp = "Gerade eben"; // Override timestamp for now

    // Ensure authorId is me
    newPost.authorId = currentUserId;

    const created = await Post.create(newPost);
    res.json(created);
});

app.post('/api/groups/join', async (req, res) => {
    if (!currentUserId) return res.status(401).json({ error: "Not logged in" });
    const { groupId } = req.body;

    const group = await Group.findOne({ id: groupId });
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (!group.memberIds.includes(currentUserId)) {
        group.memberIds.push(currentUserId);
        group.members += 1;
        await group.save();
    }
    res.json({ success: true, group });
});

app.post('/api/clubs/join', async (req, res) => {
    if (!currentUserId) return res.status(401).json({ error: "Not logged in" });
    const { clubId } = req.body;

    const club = await Club.findOne({ id: clubId });
    if (!club) return res.status(404).json({ error: "Club not found" });

    // Initialize memberIds if undefined (for legacy data safety)
    if (!club.memberIds) club.memberIds = [];

    if (!club.memberIds.includes(currentUserId)) {
        club.memberIds.push(currentUserId);
        club.members = (club.members || 0) + 1;
        await club.save();
    }
    res.json({ success: true, club });
});

app.post('/api/clubs/leave', async (req, res) => {
    if (!currentUserId) return res.status(401).json({ error: "Not logged in" });
    const { clubId } = req.body;

    const club = await Club.findOne({ id: clubId });
    if (!club) return res.status(404).json({ error: "Club not found" });

    if (club.memberIds && club.memberIds.includes(currentUserId)) {
        club.memberIds = club.memberIds.filter(id => id !== currentUserId);
        club.members = Math.max(0, (club.members || 1) - 1);
        await club.save();
    }
    res.json({ success: true, club });
});

// CREATE ROUTES
app.post('/api/groups', async (req, res) => {
    if (!currentUserId) return res.status(401).json({ error: "Not logged in" });
    const { name, desc, tags, course } = req.body;

    // Generate ID
    const last = await Group.findOne().sort({ id: -1 });
    const newId = last ? last.id + 1 : 301;

    const newGroup = await Group.create({
        id: newId,
        name,
        desc,
        course,
        tags: tags || [],
        members: 1,
        createdBy: currentUserId,
        isPublic: true,
        memberIds: [currentUserId]
    } as any);
    res.json(newGroup);
});

app.post('/api/clubs', async (req, res) => {
    if (!currentUserId) return res.status(401).json({ error: "Not logged in" });
    const { name, desc, tags } = req.body;

    const last = await Club.findOne().sort({ id: -1 });
    const newId = last ? last.id + 1 : 201;

    const newClub = await Club.create({
        id: newId,
        name,
        desc,
        tags: tags || [],
        members: 1,
        memberIds: [currentUserId]
    } as any);
    res.json(newClub);
});



app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
