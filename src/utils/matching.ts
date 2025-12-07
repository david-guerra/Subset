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
    const baseScore = matchingTags.length > 0 ? 10 : 5; // Minimal base score for everyone

    // 5. Potential/Random Boost (to make it feel more "alive" and avoid 0%)
    // Deterministic random based on lengths to keep it consistent but "fuzzy"
    const fuzzyBoost = (itemTags.length + userInterests.length) % 15;

    let total = interestScore + yearScore + activityScore + baseScore + fuzzyBoost;

    // Cap at 100
    return Math.min(Math.round(total), 100);
}

// Overload for simple tag matching (Clubs/Groups)
export function calculateMatchScore(itemTags: string[], userInterests: string[]): number {
    if (!itemTags || !userInterests) return 10; // Base baseline

    const matchingTags = itemTags.filter(tag => userInterests.includes(tag));
    // More generous scoring: even 1 match gives a good chunk
    const rawScore = (matchingTags.length / Math.max(itemTags.length, 1)) * 100;

    // Boost low scores
    return Math.min(Math.round(Math.max(rawScore, 10) + (Math.random() * 15)), 100);
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
