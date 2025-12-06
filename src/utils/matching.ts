// Helper to convert "WiSe 25/26" or "SoSe 25" to a numeric value for comparison
// SoSe 25 -> 25.0
// WiSe 25/26 -> 25.5
function getSemesterValue(sem?: string | number): number {
    if (!sem) return 0;
    if (typeof sem === 'number') return sem; // Fallback

    const s = sem.trim();
    // Check for WiSe
    if (s.toLowerCase().startsWith('wise')) {
        // Extract first year: "WiSe 25/26" -> 25
        const match = s.match(/(\d{2})/);
        return match ? parseInt(match[0]) + 0.5 : 0;
    }
    // Check for SoSe
    if (s.toLowerCase().startsWith('sose')) {
        // "SoSe 25" -> 25
        const match = s.match(/(\d{2})/);
        return match ? parseInt(match[0]) : 0;
    }
    // Fallback if just "2024" passed as string
    const justYear = parseInt(s);
    if (!isNaN(justYear)) {
        // If 2024, normalize to 24? Or assume full year?
        // Let's assume full year 2024 -> 24
        return justYear > 2000 ? justYear - 2000 : justYear;
    }
    return 0;
}

// Update signature to include shared clubs/modules count
export function calculateScore(
    itemTags: string[],
    userInterests: string[],
    itemYear?: string | number,
    userYear?: string | number,
    commonClubs: number = 0,
    commonModules: number = 0
): number {
    if (!itemTags || !userInterests) return 0;

    // 1. Interest Match (Weight: 40%)
    const matchingTags = itemTags.filter(tag => userInterests.includes(tag));
    const interestScore = (matchingTags.length / Math.max(itemTags.length, 1)) * 40;

    // 2. Semester Match (Weight: 20%) - Optional
    let yearScore = 0;
    if (itemYear && userYear) {
        const v1 = getSemesterValue(itemYear);
        const v2 = getSemesterValue(userYear);

        if (v1 > 0 && v2 > 0) {
            const diff = Math.abs(v1 - v2);
            if (diff === 0) yearScore = 20;       // Same semester
            else if (diff === 0.5) yearScore = 15; // Adjacent
            else if (diff === 1.0) yearScore = 10;
            else if (diff <= 2.0) yearScore = 5;
        }
    }

    // 3. Shared Activities (Weight: 30%)
    // Each common club/module adds points
    const activityScore = Math.min((commonClubs * 15) + (commonModules * 10), 30);

    // 4. Base Boost (Weight: 10%)
    const baseScore = matchingTags.length > 0 ? 10 : 0;

    let total = interestScore + yearScore + activityScore + baseScore;

    if (!itemYear) {
        // Fallback for items without year (like clubs themselves)
        // Just scale interests to 100 if we don't have year info
        // But if we are matching CLUBS, we don't have "common clubs" with a club usually.
        // This function is mostly for Student<->Student matching.
        return Math.min(Math.round((matchingTags.length / Math.max(itemTags.length, 1)) * 100), 100);
    }

    return Math.min(Math.round(total), 100);
}

export function calculateMatch(
    studentInterests: string[],
    userInterests: string[],
    studentYear: string | number,
    userYear: string | number,
    commonClubs: number = 0,
    commonModules: number = 0
): number {
    return calculateScore(studentInterests, userInterests, studentYear, userYear, commonClubs, commonModules);
}
