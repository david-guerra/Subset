import type { Student } from '../data/mockData';

export function calculateScore(itemTags: string[], currentUser: { interests?: string[], year?: number }, itemYear?: number): number {
    const userTags = currentUser.interests || [];
    if (userTags.length === 0) return 0;

    // Normalize tags
    const userTagsLower = userTags.map(t => t.toLowerCase());
    const itemTagsLower = itemTags.map(t => t.toLowerCase());

    // Find matches
    const matches = itemTagsLower.filter(tag => userTagsLower.includes(tag));

    // Interest Score (0-100)
    let interestScore = 0;
    if (matches.length > 0) {
        const maxTags = Math.max(userTagsLower.length, itemTagsLower.length);
        interestScore = (matches.length / maxTags) * 100;
    }

    // Year Score (0-100)
    let yearScore = 0;
    if (currentUser.year && itemYear) {
        const yearDiff = Math.abs(currentUser.year - itemYear);
        if (yearDiff === 0) yearScore = 100;
        else if (yearDiff === 1) yearScore = 70;
        else if (yearDiff === 2) yearScore = 40;
    }

    // Weighting
    // If Year is involved (Students), use original weighting: 50% Interest, 30% Year, 20% Base
    if (itemYear) {
        let finalScore = (interestScore * 0.5) + (yearScore * 0.3) + (matches.length > 0 ? 20 : 0);
        return Math.min(Math.round(finalScore), 98);
    }

    // If no Year (Groups/Clubs), use simplified weighting (replicate original logic implies purely interest based?)
    // Original logic: calculateMatch(tags) -> returns same formula but yearScore is 0. 
    // (interestScore * 0.5) + (0) + (20) roughly. 
    // Let's stick to the same formula but yearScore is 0.

    let finalScore = (interestScore * 0.5) + (matches.length > 0 ? 20 : 0);
    // Scale it up a bit for groups since they lack the 30% year bonus? 
    // The original code used the SAME formula. So a max match for a group (without year) would be 50 + 20 = 70%.
    // In the original script.js: calculateMatch(group.tags || []) -> candidateYear is null/undefined.

    return Math.min(Math.round(finalScore), 98);
}

export function calculateMatch(student: Student, currentUser: { interests?: string[], year?: number }): number {
    return calculateScore(student.interests, currentUser, student.year);
}
