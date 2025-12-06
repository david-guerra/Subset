import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
    id: Number,
    name: String,
    major: String,
    year: String, // e.g. "WiSe 25/26" or "SoSe 25"
    interests: [String],
    bio: String, // Added bio for onboarding
    courses: [String], // Added courses for profile
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    password: { type: String, default: 'admin' }
});

const PostSchema = new mongoose.Schema({
    id: Number,
    authorId: Number,
    content: String,
    tags: [String],
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    timestamp: String,
    hasImage: Boolean,
    imageUrl: String,
    context: {
        type: { type: String, enum: ['club', 'group', 'module', 'connection', 'general'] },
        name: String,
        id: Number
    }
});

const GroupSchema = new mongoose.Schema({
    id: Number,
    name: String,
    desc: String,
    course: String,
    tags: [String],
    maxMembers: Number,
    members: { type: Number, default: 1 },
    createdBy: Number,
    isPublic: Boolean,
    memberIds: [Number] // New: track actual members
});

const ClubSchema = new mongoose.Schema({
    id: Number,
    name: String,
    desc: String,
    tags: [String],
    members: Number,
    memberIds: [Number], // New: track actual members
    meetingDay: String,
    meetingTime: String
});

const ModuleSchema = new mongoose.Schema({
    id: Number,
    title: String,
    desc: String,
    tags: [String]
});

// For simplicity, we store Chats in a somewhat relational way to match mockData
const MessageSchema = new mongoose.Schema({
    id: Number,
    senderId: mongoose.Schema.Types.Mixed, // number or 'me'
    text: String,
    timestamp: String
});

const ChatSchema = new mongoose.Schema({
    id: Number,
    partnerId: Number,
    type: { type: String, enum: ['direct', 'group', 'club'], default: 'direct' },
    contextId: Number,
    lastMessage: String,
    timestamp: String,
    unread: Number,
    messages: [MessageSchema]
});

export const Student = mongoose.model('Student', StudentSchema);
export const Post = mongoose.model('Post', PostSchema);
export const Group = mongoose.model('Group', GroupSchema);
export const Club = mongoose.model('Club', ClubSchema);
export const Module = mongoose.model('Module', ModuleSchema);
export const Chat = mongoose.model('Chat', ChatSchema);
