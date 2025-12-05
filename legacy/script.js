/**
 * Subs⊂t Logic
 * - Verwaltet Daten (Mock & LocalStorage)
 * - Berechnet Matching-Scores mit Jahrgangs-Priorisierung
 * - Rendert UI
 */

const mockData = {
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

const app = {
    currentUser: {
        name: "",
        email: "",
        major: "",
        year: 2024,
        semester: 1,
        age: null,
        bio: "",
        hobbies: [],
        interests: [],
        myGroups: [],
        myClubs: [],
        chats: []
    },
    onboardingStep: 1,
    selectedInterests: [],

    init: function () {
        this.loadFromStorage();
        this.initOnboarding();
    },

    // --- ONBOARDING ---
    initOnboarding: function () {
        // Check if user already completed onboarding
        const savedUser = localStorage.getItem('subset_user');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (parsed.name && parsed.major) {
                // User exists, skip onboarding
                this.currentUser = { ...this.currentUser, ...parsed };
                document.getElementById('login-screen').classList.add('hidden');
                document.getElementById('app-interface').classList.remove('hidden');
                this.renderAll();
                this.nav('feed'); // Navigate to feed by default
                return;
            }
        }

        // Initialize interest tags
        document.querySelectorAll('.interest-tag').forEach(tag => {
            tag.addEventListener('click', function () {
                const tagValue = this.getAttribute('data-tag');
                app.toggleInterest(tagValue);
            });
        });

        // Initialize hobbies
        this.addHobbyField();
    },

    toggleInterest: function (tag) {
        const index = this.selectedInterests.indexOf(tag);
        if (index > -1) {
            this.selectedInterests.splice(index, 1);
        } else {
            this.selectedInterests.push(tag);
        }
        this.updateInterestTags();
    },

    updateInterestTags: function () {
        document.querySelectorAll('.interest-tag').forEach(tag => {
            const tagValue = tag.getAttribute('data-tag');
            if (this.selectedInterests.includes(tagValue)) {
                tag.classList.add('selected');
            } else {
                tag.classList.remove('selected');
            }
        });
    },

    addCustomInterests: function () {
        const input = document.getElementById('onboarding-custom-interest');
        const value = input.value.trim();
        if (!value) return;

        const interests = value.split(',').map(i => i.trim()).filter(i => i.length > 0);
        interests.forEach(interest => {
            if (!this.selectedInterests.includes(interest)) {
                this.selectedInterests.push(interest);
            }
        });

        input.value = '';
        this.updateInterestTags();
    },

    addHobbyField: function () {
        const container = document.getElementById('hobbies-container');
        const hobbyDiv = document.createElement('div');
        hobbyDiv.className = 'hobby-input-group';
        hobbyDiv.innerHTML = `
            <input type="text" class="hobby-input" placeholder="z.B. Fußball spielen, Gitarre, Lesen...">
            <button type="button" class="btn-remove" onclick="this.parentElement.remove()">×</button>
        `;
        container.appendChild(hobbyDiv);
    },

    onboardingNext: function () {
        // Validate current step
        if (!this.validateStep(this.onboardingStep)) {
            return;
        }

        // Save step data
        this.saveStepData(this.onboardingStep);

        // Move to next step
        if (this.onboardingStep < 5) {
            this.onboardingStep++;
            this.showStep(this.onboardingStep);
        }
    },

    onboardingPrev: function () {
        if (this.onboardingStep > 1) {
            this.onboardingStep--;
            this.showStep(this.onboardingStep);
        }
    },

    validateStep: function (step) {
        switch (step) {
            case 1:
                const name = document.getElementById('onboarding-name').value.trim();
                const email = document.getElementById('onboarding-email').value.trim();
                if (!name) {
                    alert("Bitte gib deinen Namen ein.");
                    return false;
                }
                if (!email || !email.includes('@')) {
                    alert("Bitte gib eine gültige E-Mail-Adresse ein.");
                    return false;
                }
                return true;
            case 2:
                const major = document.getElementById('onboarding-major').value.trim();
                const year = document.getElementById('onboarding-year').value;
                if (!major) {
                    alert("Bitte gib deinen Studiengang ein.");
                    return false;
                }
                if (!year) {
                    alert("Bitte wähle deinen Jahrgang.");
                    return false;
                }
                return true;
            case 3:
                // Age and bio are optional
                return true;
            case 4:
                if (this.selectedInterests.length === 0) {
                    alert("Bitte wähle mindestens ein Interesse aus.");
                    return false;
                }
                return true;
            default:
                return true;
        }
    },

    saveStepData: function (step) {
        switch (step) {
            case 1:
                this.currentUser.name = document.getElementById('onboarding-name').value.trim();
                this.currentUser.email = document.getElementById('onboarding-email').value.trim();
                break;
            case 2:
                this.currentUser.major = document.getElementById('onboarding-major').value.trim();
                this.currentUser.year = parseInt(document.getElementById('onboarding-year').value);
                this.currentUser.semester = parseInt(document.getElementById('onboarding-semester').value);
                break;
            case 3:
                const ageInput = document.getElementById('onboarding-age').value;
                this.currentUser.age = ageInput ? parseInt(ageInput) : null;
                this.currentUser.bio = document.getElementById('onboarding-bio').value.trim();
                break;
            case 4:
                // Get hobbies
                const hobbyInputs = document.querySelectorAll('.hobby-input');
                this.currentUser.hobbies = Array.from(hobbyInputs)
                    .map(input => input.value.trim())
                    .filter(hobby => hobby.length > 0);

                // Interests already saved in selectedInterests
                this.currentUser.interests = [...this.selectedInterests];
                break;
        }
    },

    showStep: function (step) {
        // Hide all steps
        document.querySelectorAll('.onboarding-step').forEach(el => {
            el.classList.remove('active');
        });

        // Show current step
        document.getElementById(`onboarding-step-${step}`).classList.add('active');

        // Update progress bar
        const progress = (step / 5) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';

        // Update step indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index + 1 === step) {
                indicator.classList.add('active');
            }
        });

        // Special handling for step 5
        if (step === 5) {
            this.calculateWelcomeStats();
        }
    },

    calculateWelcomeStats: function () {
        // Calculate matches
        const scoredStudents = mockData.students.map(student => {
            return {
                ...student,
                score: this.calculateMatch(student.interests, student.year)
            };
        }).filter(s => s.score > 0);

        const scoredGroups = mockData.groups.map(group => {
            return {
                ...group,
                score: this.calculateMatch(group.tags || [])
            };
        }).filter(g => g.score > 30);

        const scoredClubs = mockData.clubs.map(club => {
            return {
                ...club,
                score: this.calculateMatch(club.tags)
            };
        }).filter(c => c.score > 40);

        document.getElementById('welcome-matches').innerText = scoredStudents.length;
        document.getElementById('welcome-groups').innerText = scoredGroups.length;
        document.getElementById('welcome-clubs').innerText = scoredClubs.length;
    },

    completeOnboarding: function () {
        // Save all data
        this.saveToStorage();

        // Hide onboarding, show app
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-interface').classList.remove('hidden');

        // Render everything
        this.renderAll();

        // Navigate to feed
        this.nav('feed');
    },

    saveProfile: function () {
        const interestString = document.getElementById('edit-interests').value;
        const yearInput = parseInt(document.getElementById('edit-year').value);
        const bioInput = document.getElementById('edit-bio').value;

        // String zu Array konvertieren, Leerzeichen trimmen
        this.currentUser.interests = interestString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        if (yearInput) this.currentUser.year = yearInput;
        this.currentUser.bio = bioInput;

        this.saveToStorage();
        document.getElementById('edit-profile-form').classList.add('hidden');
        this.renderAll(); // Re-Render everything based on new tags
    },

    loadFromStorage: function () {
        const savedUser = localStorage.getItem('subset_user');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            this.currentUser = { ...this.currentUser, ...parsed };
        }

        // Load Custom Clubs
        const savedClubs = localStorage.getItem('subset_custom_clubs');
        if (savedClubs) {
            const customClubs = JSON.parse(savedClubs);
            mockData.clubs = [...mockData.clubs, ...customClubs];
        }

        // Load Custom Groups
        const savedGroups = localStorage.getItem('subset_custom_groups');
        if (savedGroups) {
            const customGroups = JSON.parse(savedGroups);
            mockData.groups = [...mockData.groups, ...customGroups];
        }
    },

    saveToStorage: function () {
        localStorage.setItem('subset_user', JSON.stringify(this.currentUser));
    },

    // --- CORE ALGORITHM ---
    calculateMatch: function (itemTags, candidateYear = null) {
        if (!itemTags || !this.currentUser.interests) return 0;

        // Normalize to lowercase for comparison
        const userTagsLower = this.currentUser.interests.map(t => t.toLowerCase());
        const itemTagsLower = itemTags.map(t => t.toLowerCase());

        // Find matches
        const matches = itemTagsLower.filter(tag => userTagsLower.includes(tag));

        // Interest Score (0-100)
        let interestScore = 0;
        if (matches.length > 0) {
            const maxTags = Math.max(userTagsLower.length, itemTagsLower.length);
            interestScore = (matches.length / maxTags) * 100;
        }

        // Year Score (0-100) - nur wenn candidateYear vorhanden
        let yearScore = 0;
        if (candidateYear && this.currentUser.year) {
            const yearDiff = Math.abs(this.currentUser.year - candidateYear);
            if (yearDiff === 0) yearScore = 100;
            else if (yearDiff === 1) yearScore = 70;
            else if (yearDiff === 2) yearScore = 40;
        }

        // Final Score: Interest (50%) + Year (30%) + Base (20%)
        let finalScore = (interestScore * 0.5) + (yearScore * 0.3) + (matches.length > 0 ? 20 : 0);

        return Math.min(Math.round(finalScore), 98);
    },

    // --- RENDERING ---
    renderAll: function () {
        this.renderFeed();
        this.renderProfile();
        this.renderStudents();
        this.renderGroups();
        this.renderClubs();
        this.renderModules();
        this.renderChats();
    },

    renderFeed: function () {
        const feedContainer = document.getElementById('posts-feed');
        feedContainer.innerHTML = '';

        // Update user avatar in create post box
        if (this.currentUser.name) {
            document.getElementById('feed-user-avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.currentUser.name)}&background=4f46e5&color=fff`;
        }

        // Update character counter
        const postInput = document.getElementById('new-post-content');
        if (postInput) {
            postInput.addEventListener('input', function () {
                const count = this.value.length;
                document.getElementById('post-char-count').innerText = count;
                if (count > 500) {
                    document.getElementById('post-char-count').style.color = '#ef4444';
                } else {
                    document.getElementById('post-char-count').style.color = 'var(--text-muted)';
                }
            });
        }

        // Render posts
        mockData.posts.forEach(post => {
            const author = mockData.students.find(s => s.id === post.authorId);
            if (!author) return;

            const postCard = document.createElement('div');
            postCard.className = 'post-card';

            const timeAgo = post.timestamp || 'vor kurzem';
            const majorYear = author.year ? `${author.major} • Jahrgang ${author.year}` : author.major;

            postCard.innerHTML = `
                <div class="post-header">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random" class="post-avatar" alt="${author.name}">
                    <div class="post-author-info">
                        <div class="post-author-name">${author.name}</div>
                        <div class="post-author-meta">${majorYear} • ${timeAgo}</div>
                    </div>
                </div>
                <div class="post-content">
                    ${post.content}
                </div>
                ${post.tags && post.tags.length > 0 ? `
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                ${post.hasImage && post.imageUrl ? `
                    <img src="${post.imageUrl}" alt="Post Bild" class="post-image" onerror="this.style.display='none'">
                ` : ''}
                <div class="post-actions">
                    <div class="post-action" onclick="app.toggleLike(${post.id})">
                        <span>❤️</span>
                        <span>${post.likes}</span>
                    </div>
                    <div class="post-action">
                        <span>💬</span>
                        <span>${post.comments}</span>
                    </div>
                    <div class="post-action" onclick="app.sharePost(${post.id})">
                        <span>🔗</span>
                        <span>Teilen</span>
                    </div>
                </div>
            `;
            feedContainer.appendChild(postCard);
        });
    },

    createPost: function () {
        const content = document.getElementById('new-post-content').value.trim();
        if (!content) {
            alert("Bitte gib einen Inhalt für deinen Post ein.");
            return;
        }
        if (content.length > 500) {
            alert("Dein Post ist zu lang (max. 500 Zeichen).");
            return;
        }

        // Extract tags from content (simple: words starting with #)
        const tagMatches = content.match(/#[\w]+/g) || [];
        const tags = tagMatches.map(tag => tag.substring(1));

        const newPost = {
            id: Date.now(),
            authorId: 999, // Current user ID (mock)
            content: content,
            tags: tags,
            likes: 0,
            comments: 0,
            timestamp: "gerade eben",
            hasImage: false
        };

        mockData.posts.unshift(newPost); // Add to beginning
        document.getElementById('new-post-content').value = '';
        document.getElementById('post-char-count').innerText = '0';
        this.renderFeed();
    },

    toggleLike: function (postId) {
        const post = mockData.posts.find(p => p.id === postId);
        if (post) {
            // Simple toggle (in real app would check if user already liked)
            post.likes++;
            this.renderFeed();
        }
    },

    sharePost: function (postId) {
        const post = mockData.posts.find(p => p.id === postId);
        if (post) {
            // In real app: copy link to clipboard
            alert("Post-Link wurde kopiert!");
        }
    },

    renderProfile: function () {
        let nameDisplay = this.currentUser.name;
        if (this.currentUser.year) {
            nameDisplay += ` <span class="year-badge">Jahrgang ${this.currentUser.year}</span>`;
        }
        if (this.currentUser.age) {
            nameDisplay += ` <span style="color: var(--text-muted); font-size: 0.9rem;">• ${this.currentUser.age} Jahre</span>`;
        }
        document.getElementById('profile-name-display').innerHTML = nameDisplay;

        let majorDisplay = this.currentUser.major;
        if (this.currentUser.semester) {
            majorDisplay += ` • ${this.currentUser.semester}. Semester`;
        }
        document.getElementById('profile-major-display').innerText = majorDisplay;

        document.getElementById('profile-img-display').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.currentUser.name)}&background=4f46e5&color=fff`;

        const tagContainer = document.getElementById('profile-tags-display');
        let tagsHTML = '';
        if (this.currentUser.interests && this.currentUser.interests.length > 0) {
            tagsHTML += this.currentUser.interests.map(tag => `<span class="tag">${tag}</span>`).join('');
        }
        if (this.currentUser.hobbies && this.currentUser.hobbies.length > 0) {
            tagsHTML += this.currentUser.hobbies.map(hobby => `<span class="tag" style="background:#fef3c7; color:#92400e;">🎯 ${hobby}</span>`).join('');
        }
        tagContainer.innerHTML = tagsHTML || '<span style="color: var(--text-muted);">Noch keine Interessen hinzugefügt</span>';

        // Update Form Inputs
        document.getElementById('edit-interests').value = (this.currentUser.interests || []).join(', ');
        document.getElementById('edit-year').value = this.currentUser.year || '';
        document.getElementById('edit-bio').value = this.currentUser.bio || '';
    },

    renderStudents: function () {
        const grid = document.getElementById('student-grid');
        grid.innerHTML = "";

        // Filter auslesen
        const yearFilter = document.getElementById('filter-year').value;
        const majorFilter = document.getElementById('filter-major').value;
        const minScoreFilter = parseInt(document.getElementById('filter-min-score').value) || 0;

        // Daten kopieren und Scores berechnen
        let scoredStudents = mockData.students.map(student => {
            return {
                ...student,
                score: this.calculateMatch(student.interests, student.year),
                yearDiff: Math.abs((this.currentUser.year || 2024) - (student.year || 2024))
            };
        });

        // Filter anwenden
        if (yearFilter === 'same') {
            scoredStudents = scoredStudents.filter(s => s.year === this.currentUser.year);
        } else if (yearFilter) {
            scoredStudents = scoredStudents.filter(s => s.year === parseInt(yearFilter));
        }

        if (majorFilter) {
            scoredStudents = scoredStudents.filter(s => s.major === majorFilter);
        }

        scoredStudents = scoredStudents.filter(s => s.score >= minScoreFilter);

        // Sortieren: Zuerst nach Score, dann nach Jahrgangs-Differenz
        scoredStudents.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.yearDiff - b.yearDiff;
        });

        // Stats Update
        document.getElementById('stat-matches').innerText = scoredStudents.filter(s => s.score > 0).length;

        // Major-Filter Optionen aktualisieren
        const majorSelect = document.getElementById('filter-major');
        const majors = [...new Set(mockData.students.map(s => s.major))];
        if (majorSelect.options.length <= 1) {
            majors.forEach(major => {
                const option = document.createElement('option');
                option.value = major;
                option.textContent = major;
                majorSelect.appendChild(option);
            });
        }

        if (scoredStudents.length === 0) {
            grid.innerHTML = "<p style='grid-column: 1/-1; color: #999; text-align: center; padding: 40px;'>Keine Studenten gefunden. Versuche andere Filter.</p>";
            return;
        }

        scoredStudents.forEach(student => {
            const card = document.createElement('div');
            card.className = 'card';

            const yearMatch = student.year === this.currentUser.year;
            const yearBadge = yearMatch
                ? `<span class="year-badge" style="background:#d1fae5; color:#065f46;">Gleicher Jahrgang</span>`
                : `<span class="year-badge">Jahrgang ${student.year}</span>`;

            let matchBadge = student.score > 0
                ? `<div class="match-badge">${student.score}% Match</div>`
                : `<div style="color:#ccc; font-size:0.8rem">Kein direktes Match</div>`;

            card.innerHTML = `
                <div>
                    <div class="card-header">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random" class="avatar">
                        <div>
                            <div class="card-title">${student.name} ${yearBadge}</div>
                            <div class="card-subtitle">${student.major}</div>
                        </div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        ${student.interests.map(tag => `<span class="tag" style="background:#f3f4f6; color:#555;">${tag}</span>`).join('')}
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                    ${matchBadge}
                    <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.8rem;" onclick="app.startChat(${student.id})">Nachricht</button>
                </div>
            `;
            grid.appendChild(card);
        });
    },

    renderGroups: function () {
        const myGrid = document.getElementById('group-grid-my');
        const recGrid = document.getElementById('group-grid-recommended');
        const allGrid = document.getElementById('group-grid-all');
        myGrid.innerHTML = "";
        recGrid.innerHTML = "";
        allGrid.innerHTML = "";

        // Meine Gruppen
        const myGroups = mockData.groups.filter(g => this.currentUser.myGroups.includes(g.id));
        myGroups.forEach(group => {
            myGrid.innerHTML += this.createGroupCardHTML(group, true);
        });
        if (myGroups.length === 0) {
            myGrid.innerHTML = "<p style='grid-column: 1/-1; color: #999;'>Du bist noch in keiner Gruppe.</p>";
        }

        // Alle Gruppen mit Scores
        const scoredGroups = mockData.groups.map(group => {
            return { ...group, score: this.calculateMatch(group.tags || []) };
        }).sort((a, b) => b.score - a.score);

        // Stats Update
        document.getElementById('stat-groups').innerText = myGroups.length;

        scoredGroups.forEach(group => {
            const html = this.createGroupCardHTML(group, this.currentUser.myGroups.includes(group.id));

            if (group.score > 30 && !this.currentUser.myGroups.includes(group.id)) {
                recGrid.innerHTML += html;
            }
            allGrid.innerHTML += html;
        });

        if (recGrid.innerHTML === "") recGrid.innerHTML = "<p style='grid-column: 1/-1; color: #999;'>Ergänze dein Profil, um Gruppen-Empfehlungen zu sehen.</p>";
    },

    createGroupCardHTML: function (group, isMember) {
        const isFull = group.members >= group.maxMembers;
        const canJoin = !isMember && !isFull;

        return `
            <div class="card group-card">
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:start;">
                        <div class="card-title">${group.name}</div>
                        ${group.score > 30 ? `<div class="match-badge">${group.score}% Match</div>` : ''}
                    </div>
                    ${group.course ? `<div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 5px;">📚 ${group.course}</div>` : ''}
                    <p>${group.desc}</p>
                    <div style="margin-bottom:10px;">
                        ${(group.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                    <div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 10px;">
                        👥 ${group.members}/${group.maxMembers} Mitglieder
                    </div>
                </div>
                ${isMember
                ? `<button class="btn btn-secondary" disabled>Beigetreten</button>`
                : isFull
                    ? `<button class="btn btn-secondary" disabled>Voll</button>`
                    : `<button class="btn btn-primary" onclick="app.joinGroup(${group.id})">Beitreten</button>`
            }
            </div>
        `;
    },

    renderClubs: function () {
        const recGrid = document.getElementById('club-grid-recommended');
        const allGrid = document.getElementById('club-grid-all');
        recGrid.innerHTML = "";
        allGrid.innerHTML = "";

        const scoredClubs = mockData.clubs.map(club => {
            return { ...club, score: this.calculateMatch(club.tags) };
        }).sort((a, b) => b.score - a.score);

        // Stats Update
        document.getElementById('stat-clubs').innerText = scoredClubs.filter(c => c.score > 40).length;

        scoredClubs.forEach(club => {
            const isMember = this.currentUser.myClubs.includes(club.id);
            const html = `
                <div class="card">
                    <div>
                        <div style="display:flex; justify-content:space-between;">
                            <div class="card-title">${club.name}</div>
                            ${club.score > 30 ? `<div class="match-badge">${club.score}% Match</div>` : ''}
                        </div>
                        <p>${club.desc}</p>
                        <div style="margin-bottom:10px;">
                            ${club.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                        </div>
                    </div>
                    ${isMember
                    ? `<button class="btn btn-secondary" disabled>Beigetreten</button>`
                    : `<button class="btn btn-primary" onclick="app.joinClub(${club.id})">Beitreten (${club.members} Mitglieder)</button>`
                }
                </div>
            `;

            if (club.score > 0 && !isMember) {
                recGrid.innerHTML += html;
            }
            allGrid.innerHTML += html;
        });

        if (recGrid.innerHTML === "") recGrid.innerHTML = "<p style='grid-column: 1/-1; color: #999;'>Ergänze dein Profil, um Club-Empfehlungen zu sehen.</p>";
    },

    renderModules: function () {
        const grid = document.getElementById('module-grid');
        grid.innerHTML = "";

        const scoredModules = mockData.modules.map(mod => {
            return { ...mod, score: this.calculateMatch(mod.tags) };
        }).sort((a, b) => b.score - a.score);

        scoredModules.forEach(mod => {
            // Zeige nur Module mit relevanz oder alle wenn keine Interessen
            if (this.currentUser.interests.length > 0 && mod.score === 0) return;

            grid.innerHTML += `
                <div class="card module-card">
                    <div class="card-title">${mod.title}</div>
                    <p>${mod.desc}</p>
                    <div style="margin-bottom:15px;">
                        ${mod.tags.map(t => `<span class="tag" style="background:#eef2ff;">${t}</span>`).join('')}
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div class="match-badge" style="background:${mod.score > 50 ? '#d1fae5' : '#f3f4f6'}; color:${mod.score > 50 ? '#065f46' : '#666'}">
                            ${mod.score}% Relevanz
                        </div>
                        <button class="btn btn-secondary">Details</button>
                    </div>
                </div>
            `;
        });

        if (grid.innerHTML === "") grid.innerHTML = "<p>Keine passenden Module basierend auf deinen Interessen gefunden.</p>";
    },

    renderChats: function () {
        const chatList = document.getElementById('chat-list');
        chatList.innerHTML = "";

        if (!this.currentUser.chats || this.currentUser.chats.length === 0) {
            chatList.innerHTML = "<p style='padding: 40px; text-align: center; color: #999;'>Noch keine Nachrichten. Starte einen Chat über 'Nachricht' bei einem Studenten!</p>";
            return;
        }

        this.currentUser.chats.forEach(chat => {
            const student = mockData.students.find(s => s.id === chat.userId);
            if (!student) return;

            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            chatItem.onclick = () => alert(`Chat mit ${student.name} öffnen`);
            chatItem.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random" class="avatar" style="width: 50px; height: 50px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 600;">${student.name}</div>
                        <div class="chat-preview">${chat.lastMessage || 'Neuer Chat'}</div>
                    </div>
                    <div style="color: var(--text-muted); font-size: 0.8rem;">${chat.timestamp || 'Jetzt'}</div>
                </div>
            `;
            chatList.appendChild(chatItem);
        });
    },

    // --- ACTIONS ---
    toggleEditProfile: function () {
        const form = document.getElementById('edit-profile-form');
        form.classList.toggle('hidden');
    },

    joinGroup: function (groupId) {
        const group = mockData.groups.find(g => g.id === groupId);
        if (!group) return;

        if (group.members >= group.maxMembers) {
            alert("Diese Gruppe ist bereits voll!");
            return;
        }

        if (!this.currentUser.myGroups.includes(groupId)) {
            this.currentUser.myGroups.push(groupId);
            group.members++;
            this.saveToStorage();
            this.renderGroups();
            alert(`Du bist der Gruppe "${group.name}" beigetreten!`);
        }
    },

    joinClub: function (clubId) {
        const club = mockData.clubs.find(c => c.id === clubId);
        if (!club) return;

        if (!this.currentUser.myClubs.includes(clubId)) {
            this.currentUser.myClubs.push(clubId);
            club.members++;
            this.saveToStorage();
            this.renderClubs();
            alert(`Du bist dem Club "${club.name}" beigetreten!`);
        }
    },

    startChat: function (userId) {
        const student = mockData.students.find(s => s.id === userId);
        if (!student) return;

        // Prüfe ob Chat bereits existiert
        let chat = this.currentUser.chats.find(c => c.userId === userId);
        if (!chat) {
            chat = {
                userId: userId,
                lastMessage: "Neuer Chat",
                timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
            };
            if (!this.currentUser.chats) this.currentUser.chats = [];
            this.currentUser.chats.push(chat);
            this.saveToStorage();
        }

        // Navigate to chats
        this.nav('chats');
        this.renderChats();
        alert(`Chat mit ${student.name} gestartet!`);
    },

    createGroup: function () {
        const name = document.getElementById('group-new-name').value;
        const desc = document.getElementById('group-new-desc').value;
        const course = document.getElementById('group-new-course').value;
        const maxMembers = parseInt(document.getElementById('group-new-max').value) || 10;
        const isPublic = document.getElementById('group-new-public').checked;

        if (!name || !desc) return alert("Bitte Name und Beschreibung ausfüllen.");

        const newGroup = {
            id: Date.now(),
            name: name,
            desc: desc,
            course: course || null,
            tags: this.currentUser.interests.slice(0, 3), // Erste 3 Interessen als Tags
            maxMembers: maxMembers,
            members: 1,
            createdBy: 999, // Current user ID (mock)
            isPublic: isPublic
        };

        // Add to runtime data
        mockData.groups.push(newGroup);
        this.currentUser.myGroups.push(newGroup.id);

        // Save to localStorage
        const storedGroups = JSON.parse(localStorage.getItem('subset_custom_groups') || "[]");
        storedGroups.push(newGroup);
        localStorage.setItem('subset_custom_groups', JSON.stringify(storedGroups));
        this.saveToStorage();

        // Close Modal & Refresh
        document.getElementById('modal-create-group').classList.add('hidden');
        document.getElementById('group-new-name').value = "";
        document.getElementById('group-new-desc').value = "";
        document.getElementById('group-new-course').value = "";
        document.getElementById('group-new-max').value = "10";

        this.renderGroups();
        alert("Gruppe erfolgreich erstellt!");
    },

    showCreateGroupModal: function () {
        document.getElementById('modal-create-group').classList.remove('hidden');
    },

    createClub: function () {
        const name = document.getElementById('club-new-name').value;
        const desc = document.getElementById('club-new-desc').value;
        const tagsRaw = document.getElementById('club-new-tags').value;

        if (!name || !desc) return alert("Bitte Name und Beschreibung ausfüllen.");

        const newClub = {
            id: Date.now(),
            name: name,
            desc: desc,
            tags: tagsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0),
            members: 1
        };

        // Add to runtime data
        mockData.clubs.push(newClub);
        this.currentUser.myClubs.push(newClub.id);

        // Save to localStorage (simulate backend persistence for new items)
        const storedClubs = JSON.parse(localStorage.getItem('subset_custom_clubs') || "[]");
        storedClubs.push(newClub);
        localStorage.setItem('subset_custom_clubs', JSON.stringify(storedClubs));
        this.saveToStorage();

        // Close Modal & Refresh
        document.getElementById('modal-create-club').classList.add('hidden');
        document.getElementById('club-new-name').value = "";
        document.getElementById('club-new-desc').value = "";
        document.getElementById('club-new-tags').value = "";

        this.renderClubs();
        alert("Club erfolgreich erstellt!");
    },

    showCreateClubModal: function () {
        document.getElementById('modal-create-club').classList.remove('hidden');
    },

    nav: function (pageId) {
        // Hide all sections
        document.querySelectorAll('section').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

        // Show target
        const targetSection = document.getElementById('view-' + pageId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        const targetNav = document.getElementById('nav-' + pageId);
        if (targetNav) {
            targetNav.classList.add('active');
        }
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
