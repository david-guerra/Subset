# UniConnect - Technische & Konzeptionelle Ausarbeitung

## Inhaltsverzeichnis

1. [Produktvision & Zielsetzung](#1-produktvision--zielsetzung)
2. [Detailliertes Systemdesign](#2-detailliertes-systemdesign)
3. [Datenbankmodell](#3-datenbankmodell)
4. [Rollen- & Berechtigungssystem](#4-rollen--berechtigungssystem)
5. [User Journey / User Flow](#5-user-journey--user-flow)
6. [Konkrete Feature-Empfehlungen](#6-konkrete-feature-empfehlungen)

---

## 1. Produktvision & Zielsetzung

### 1.1 Kernproblem der Studierenden

**Problemstellung:**
- Studierende haben Schwierigkeiten, passende Lerngruppen zu finden
- Fehlende Übersicht über relevante Studentenclubs und Aktivitäten
- Schwierigkeiten bei der Auswahl passender Wahlpflichtmodule
- Isolation im Studium, besonders in großen Universitäten
- Ineffiziente Suche nach Kommilitonen mit ähnlichen Interessen oder Zielen

**Konkrete Pain Points:**
- Zeitaufwändige manuelle Suche nach Kommilitonen
- Fehlende Transparenz über verfügbare Gruppen und Clubs
- Keine personalisierten Empfehlungen basierend auf Profil und Interessen
- Schwierigkeiten bei der Koordination von Lerngruppen

### 1.2 Lösung durch UniConnect

UniConnect ist eine intelligente Social-Matching-Plattform, die Studierende basierend auf:
- **Interessen** (z.B. KI, Design, Sport)
- **Studiengang** und **Jahrgang**
- **Kursen** und **Modulen**
- **Lernpräferenzen** und **Verfügbarkeiten**

automatisch mit passenden Kommilitonen, Lerngruppen und Clubs verbindet.

### 1.3 Alleinstellungsmerkmale (USP)

| USP | Beschreibung |
|-----|-------------|
| **Intelligentes Matching** | KI-basierter Algorithmus, der nicht nur Interessen, sondern auch Jahrgang, Verfügbarkeit und Lernstil berücksichtigt |
| **Multi-Dimensional Matching** | Matching für Studierende, Lerngruppen, Clubs UND Kurse in einer Plattform |
| **Jahrgangs-Priorisierung** | Studierende im gleichen Jahrgang werden bevorzugt gematcht (höhere Wahrscheinlichkeit gemeinsamer Kurse) |
| **Echtzeit-Updates** | Live-Benachrichtigungen über neue Matches, Gruppenaktivitäten und Club-Events |
| **Universitäts-spezifisch** | Anpassbar an verschiedene Universitäten mit deren spezifischen Kursstrukturen |
| **Privacy-First** | Nutzer kontrollieren vollständig, welche Informationen geteilt werden |

---

## 2. Detailliertes Systemdesign

### 2.1 Backend-Architektur

#### 2.1.1 Service-orientierte Architektur (SOA)

```
┌─────────────────────────────────────────────────────────┐
│                    API Gateway                          │
│              (Authentication & Routing)                 │
└──────────────┬──────────────────────────────────────────┘
               │
    ┌──────────┼──────────┬──────────────┬──────────────┐
    │          │          │              │              │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌────────▼────┐ ┌───────▼────┐
│ User  │ │Match  │ │Group  │ │ Chat        │ │ Notification│
│Service│ │Service│ │Service│ │ Service     │ │ Service     │
└───┬───┘ └───┬───┘ └───┬───┘ └────────┬───┘ └───────┬────┘
    │         │          │              │              │
    └─────────┼──────────┼──────────────┼──────────────┘
              │          │              │
         ┌────▼──────────▼──────────────▼────┐
         │      PostgreSQL Database           │
         │  (Primary Data Store)              │
         └────────────────────────────────────┘
              │
         ┌────▼──────────┐
         │ Redis Cache   │
         │ (Sessions,    │
         │  Real-time)   │
         └───────────────┘
```

#### 2.1.2 Service-Beschreibungen

**User Service**
- Verantwortlich für: Authentifizierung, Profilverwaltung, Nutzerdaten
- Endpoints:
  - `POST /api/auth/register` - Registrierung
  - `POST /api/auth/login` - Login
  - `GET /api/users/:id` - Profil abrufen
  - `PUT /api/users/:id` - Profil aktualisieren
  - `GET /api/users/search` - Nutzersuche

**Match Service**
- Verantwortlich für: Matching-Algorithmus, Kompatibilitätsberechnung
- Endpoints:
  - `GET /api/matches/students` - Passende Studierende finden
  - `GET /api/matches/groups` - Passende Lerngruppen
  - `GET /api/matches/clubs` - Empfohlene Clubs
  - `GET /api/matches/modules` - Passende Module
  - `POST /api/matches/calculate` - Match-Score berechnen

**Group Service**
- Verantwortlich für: Lerngruppen-Management, Mitgliedschaften
- Endpoints:
  - `POST /api/groups` - Gruppe erstellen
  - `GET /api/groups/:id` - Gruppen-Details
  - `POST /api/groups/:id/join` - Gruppe beitreten
  - `DELETE /api/groups/:id/leave` - Gruppe verlassen
  - `GET /api/groups/user/:userId` - Gruppen eines Nutzers

**Chat Service**
- Verantwortlich für: Messaging, Gruppenchats
- Endpoints:
  - `GET /api/chats` - Chats abrufen
  - `POST /api/chats` - Chat erstellen
  - `GET /api/chats/:id/messages` - Nachrichten abrufen
  - `POST /api/chats/:id/messages` - Nachricht senden
  - WebSocket: `/ws/chat/:chatId` - Echtzeit-Messaging

**Notification Service**
- Verantwortlich für: Push-Benachrichtigungen, E-Mail-Benachrichtigungen
- Endpoints:
  - `GET /api/notifications` - Benachrichtigungen abrufen
  - `PUT /api/notifications/:id/read` - Als gelesen markieren
  - `POST /api/notifications/send` - Benachrichtigung senden (intern)

#### 2.1.3 Datenflüsse

**Matching-Prozess:**
```
1. User öffnet "Explore" → Frontend sendet GET /api/matches/students
2. Match Service empfängt Request
3. Match Service lädt User-Profil aus User Service
4. Match Service lädt alle relevanten Studierenden aus DB
5. Matching-Algorithmus berechnet Scores für jeden Kandidaten
6. Ergebnisse werden nach Score sortiert und gefiltert (> 0%)
7. Response wird an Frontend gesendet
8. Frontend rendert Ergebnisse mit Match-Badges
```

**Gruppen-Beitritt:**
```
1. User klickt "Beitreten" → Frontend sendet POST /api/groups/:id/join
2. Group Service prüft Berechtigung und Gruppenstatus
3. Group Service erstellt Eintrag in StudyGroupMembers Tabelle
4. Group Service sendet Notification an Gruppenleiter
5. Group Service sendet Notification an neuen Mitglieder
6. Response mit Erfolgsstatus an Frontend
7. Frontend aktualisiert UI (Button wird zu "Beigetreten")
```

### 2.2 Frontend-Struktur

#### 2.2.1 Technologie-Stack

- **Framework:** React.js oder Vue.js (für moderne, reaktive UI)
- **State Management:** Redux/Vuex (für globale App-State)
- **Routing:** React Router / Vue Router
- **UI Library:** Material-UI oder Tailwind CSS
- **Real-time:** Socket.io Client (für Chats und Live-Updates)

#### 2.2.2 Komponenten-Hierarchie

```
App
├── Navigation
│   ├── Logo
│   └── NavLinks (Profile, Explore, Clubs, Modules, Chats)
├── LoginScreen (wenn nicht authentifiziert)
└── MainApp (wenn authentifiziert)
    ├── ProfileView
    │   ├── ProfileHeader
    │   ├── ProfileEditForm
    │   └── DashboardStats
    ├── ExploreView
    │   ├── StudentCard[]
    │   └── FilterBar
    ├── ClubsView
    │   ├── ClubCard[]
    │   └── CreateClubModal
    ├── ModulesView
    │   └── ModuleCard[]
    └── ChatView
        ├── ChatList
        └── ChatWindow
```

#### 2.2.3 Navigation-Struktur

| Route | Komponente | Beschreibung |
|-------|-----------|--------------|
| `/` | LoginScreen | Login/Registrierung |
| `/profile` | ProfileView | Eigenes Profil & Dashboard |
| `/explore` | ExploreView | Passende Studierende finden |
| `/groups` | GroupsView | Eigene Lerngruppen |
| `/clubs` | ClubsView | Studentenclubs durchsuchen |
| `/modules` | ModulesView | Kursempfehlungen |
| `/chats` | ChatsView | Messaging-Übersicht |
| `/chats/:id` | ChatWindow | Einzelner Chat |

### 2.3 Matching-Algorithmus

#### 2.3.1 Algorithmus-Logik

**Grundlegende Formel:**
```
Total Score = (Interest Score × 0.5) + (Year Score × 0.3) + (Course Score × 0.2)
```

**Detaillierte Berechnung:**

1. **Interest Score (0-100 Punkte)**
   ```
   Interest Score = (Anzahl gemeinsamer Interessen / Max(Anzahl User-Interessen, Anzahl Kandidat-Interessen)) × 100
   
   Beispiel:
   User: ["KI", "Coding", "Startups"]
   Kandidat: ["KI", "Coding", "Gaming"]
   Gemeinsam: 2 Interessen
   Max: 3
   Score: (2/3) × 100 = 66.67 Punkte
   ```

2. **Year Score (0-100 Punkte)**
   ```
   Wenn Jahrgang identisch: 100 Punkte
   Wenn Jahrgang ±1: 70 Punkte
   Wenn Jahrgang ±2: 40 Punkte
   Sonst: 0 Punkte
   ```

3. **Course Score (0-100 Punkte)**
   ```
   Course Score = (Anzahl gemeinsamer Kurse / Max(User-Kurse, Kandidat-Kurse)) × 100
   
   Bonus: +20 Punkte wenn mindestens 1 gemeinsamer Kurs
   ```

4. **Final Score**
   ```
   Final Score = (Interest Score × 0.5) + (Year Score × 0.3) + (Course Score × 0.2)
   
   Beispiel:
   Interest: 66.67 × 0.5 = 33.34
   Year: 100 × 0.3 = 30.00
   Course: 50 × 0.2 = 10.00
   Total: 73.34 Punkte
   ```

#### 2.3.2 Priorisierung nach Jahrgang

**Implementierung:**
- Studierende im **gleichen Jahrgang** erhalten höchste Priorität
- Studierende im **±1 Jahrgang** erhalten mittlere Priorität
- Studierende in **±2 Jahrgängen** erhalten niedrigere Priorität
- Studierende außerhalb ±2 Jahrgänge werden nur angezeigt, wenn Match-Score > 80%

**Code-Pseudocode:**
```javascript
function calculateYearScore(userYear, candidateYear) {
    const diff = Math.abs(userYear - candidateYear);
    
    if (diff === 0) return 100;      // Gleicher Jahrgang
    if (diff === 1) return 70;       // ±1 Jahrgang
    if (diff === 2) return 40;       // ±2 Jahrgänge
    return 0;                         // Sonst
}

function shouldShowCandidate(totalScore, yearDiff) {
    if (yearDiff <= 2) return true;  // Immer zeigen wenn ±2 Jahrgänge
    return totalScore > 80;           // Sonst nur bei sehr hohem Score
}
```

#### 2.3.3 Benötigte Daten für Matching

**User-Profil:**
- Interessen (Array von Strings)
- Jahrgang (Integer)
- Studiengang (String)
- Aktuelle Kurse/Module (Array von IDs)
- Verfügbarkeiten (Optional: Zeitfenster)

**Kandidat-Profil:**
- Gleiche Struktur wie User-Profil

**Gruppen-Profil:**
- Tags/Interessen (Array)
- Durchschnittlicher Jahrgang der Mitglieder
- Verfügbare Plätze
- Aktivitätslevel

**Club-Profil:**
- Tags/Kategorien (Array)
- Beschreibung
- Mitgliederanzahl
- Aktivitätsstatus

---

## 3. Datenbankmodell

### 3.1 Entity-Relationship-Diagramm (Übersicht)

```
Users ──┬── Friends (many-to-many)
        ├── StudyGroupMembers (many-to-many)
        ├── ChatParticipants (many-to-many)
        ├── Messages (one-to-many)
        ├── MatchPreferences (one-to-one)
        └── ClubMembers (many-to-many)

StudyGroups ──┬── StudyGroupMembers (one-to-many)
              └── Moderators (one-to-many)

Clubs ──┬── ClubMembers (one-to-many)
        └── Moderators (one-to-many)

Chats ──┬── ChatParticipants (one-to-many)
        └── Messages (one-to-many)
```

### 3.2 Tabellen-Definitionen

#### 3.2.1 Users

**Beschreibung:** Zentrale Tabelle für alle Nutzer der Plattform.

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | UUID | PRIMARY KEY | Eindeutige Nutzer-ID |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | E-Mail-Adresse (Login) |
| `password_hash` | VARCHAR(255) | NOT NULL | Gehashtes Passwort (bcrypt) |
| `first_name` | VARCHAR(100) | NOT NULL | Vorname |
| `last_name` | VARCHAR(100) | NOT NULL | Nachname |
| `display_name` | VARCHAR(100) | | Anzeigename (optional) |
| `university_id` | UUID | FOREIGN KEY → Universities | Zugehörige Universität |
| `major` | VARCHAR(100) | | Studiengang |
| `year` | INTEGER | | Jahrgang (z.B. 2024 für Erstsemester) |
| `semester` | INTEGER | | Aktuelles Semester |
| `bio` | TEXT | | Profilbeschreibung |
| `avatar_url` | VARCHAR(500) | | URL zum Profilbild |
| `is_verified` | BOOLEAN | DEFAULT FALSE | Uni-E-Mail verifiziert |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account aktiv |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Erstellungsdatum |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Letzte Aktualisierung |

**Indizes:**
- `idx_users_email` auf `email`
- `idx_users_university` auf `university_id`
- `idx_users_major_year` auf `major, year` (für Matching)

#### 3.2.2 Friends

**Beschreibung:** Freundschaftsbeziehungen zwischen Nutzern (bidirektional).

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | UUID | PRIMARY KEY | Eindeutige ID |
| `user_id` | UUID | FOREIGN KEY → Users(id), NOT NULL | Erster Nutzer |
| `friend_id` | UUID | FOREIGN KEY → Users(id), NOT NULL | Zweiter Nutzer |
| `status` | ENUM | NOT NULL | Status: 'pending', 'accepted', 'blocked' |
| `initiated_by` | UUID | FOREIGN KEY → Users(id) | Wer die Anfrage gestellt hat |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Erstellungsdatum |
| `accepted_at` | TIMESTAMP | | Akzeptierungsdatum |

**Constraints:**
- `CHECK (user_id != friend_id)` - Nutzer kann nicht mit sich selbst befreundet sein
- `UNIQUE (user_id, friend_id)` - Keine Duplikate

**Indizes:**
- `idx_friends_user` auf `user_id`
- `idx_friends_friend` auf `friend_id`
- `idx_friends_status` auf `status`

#### 3.2.3 StudyGroups

**Beschreibung:** Lerngruppen, die von Nutzern erstellt werden.

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | UUID | PRIMARY KEY | Eindeutige Gruppen-ID |
| `name` | VARCHAR(200) | NOT NULL | Gruppenname |
| `description` | TEXT | | Gruppenbeschreibung |
| `course_id` | UUID | FOREIGN KEY → Courses(id) | Zugehöriger Kurs (optional) |
| `max_members` | INTEGER | DEFAULT 10 | Maximale Mitgliederanzahl |
| `is_public` | BOOLEAN | DEFAULT TRUE | Öffentlich sichtbar |
| `created_by` | UUID | FOREIGN KEY → Users(id), NOT NULL | Ersteller |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Erstellungsdatum |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Letzte Aktualisierung |

**Indizes:**
- `idx_study_groups_course` auf `course_id`
- `idx_study_groups_creator` auf `created_by`

#### 3.2.4 StudyGroupMembers

**Beschreibung:** Mitgliedschaften in Lerngruppen.

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | UUID | PRIMARY KEY | Eindeutige ID |
| `group_id` | UUID | FOREIGN KEY → StudyGroups(id), NOT NULL | Gruppen-ID |
| `user_id` | UUID | FOREIGN KEY → Users(id), NOT NULL | Nutzer-ID |
| `role` | ENUM | DEFAULT 'member' | Rolle: 'member', 'moderator', 'leader' |
| `joined_at` | TIMESTAMP | DEFAULT NOW() | Beitrittsdatum |

**Constraints:**
- `UNIQUE (group_id, user_id)` - Nutzer kann nur einmal Mitglied sein

**Indizes:**
- `idx_group_members_group` auf `group_id`
- `idx_group_members_user` auf `user_id`

#### 3.2.5 Chats

**Beschreibung:** Chat-Konversationen (1:1 oder Gruppenchats).

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | UUID | PRIMARY KEY | Eindeutige Chat-ID |
| `type` | ENUM | NOT NULL | Typ: 'direct', 'group' |
| `name` | VARCHAR(200) | | Gruppenname (nur bei Gruppenchats) |
| `created_by` | UUID | FOREIGN KEY → Users(id) | Ersteller (bei Gruppenchats) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Erstellungsdatum |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Letzte Nachricht |

**Indizes:**
- `idx_chats_type` auf `type`
- `idx_chats_updated` auf `updated_at` (für Sortierung)

#### 3.2.6 ChatParticipants

**Beschreibung:** Teilnehmer eines Chats.

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | UUID | PRIMARY KEY | Eindeutige ID |
| `chat_id` | UUID | FOREIGN KEY → Chats(id), NOT NULL | Chat-ID |
| `user_id` | UUID | FOREIGN KEY → Users(id), NOT NULL | Nutzer-ID |
| `joined_at` | TIMESTAMP | DEFAULT NOW() | Beitrittsdatum |
| `left_at` | TIMESTAMP | | Verlassen-Datum (optional) |
| `last_read_at` | TIMESTAMP | | Letzte gelesene Nachricht |

**Constraints:**
- `UNIQUE (chat_id, user_id)` - Nutzer kann nur einmal Teilnehmer sein

**Indizes:**
- `idx_chat_participants_chat` auf `chat_id`
- `idx_chat_participants_user` auf `user_id`

#### 3.2.7 Messages

**Beschreibung:** Einzelne Nachrichten in Chats.

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | UUID | PRIMARY KEY | Eindeutige Nachrichten-ID |
| `chat_id` | UUID | FOREIGN KEY → Chats(id), NOT NULL | Chat-ID |
| `sender_id` | UUID | FOREIGN KEY → Users(id), NOT NULL | Absender |
| `content` | TEXT | NOT NULL | Nachrichteninhalt |
| `message_type` | ENUM | DEFAULT 'text' | Typ: 'text', 'image', 'file', 'system' |
| `is_edited` | BOOLEAN | DEFAULT FALSE | Nachricht bearbeitet |
| `is_deleted` | BOOLEAN | DEFAULT FALSE | Nachricht gelöscht |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Erstellungsdatum |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Bearbeitungsdatum |

**Indizes:**
- `idx_messages_chat_created` auf `chat_id, created_at` (für Chat-Verlauf)
- `idx_messages_sender` auf `sender_id`

#### 3.2.8 Moderators

**Beschreibung:** Moderatoren für Gruppen und Clubs (polymorphe Tabelle).

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | UUID | PRIMARY KEY | Eindeutige ID |
| `user_id` | UUID | FOREIGN KEY → Users(id), NOT NULL | Moderator-Nutzer |
| `moderatable_type` | VARCHAR(50) | NOT NULL | Typ: 'StudyGroup' oder 'Club' |
| `moderatable_id` | UUID | NOT NULL | ID der Gruppe/des Clubs |
| `permissions` | JSONB | | Spezifische Berechtigungen |
| `assigned_at` | TIMESTAMP | DEFAULT NOW() | Zuweisungsdatum |

**Constraints:**
- `UNIQUE (user_id, moderatable_type, moderatable_id)` - Keine Duplikate

**Indizes:**
- `idx_moderators_user` auf `user_id`
- `idx_moderators_moderatable` auf `moderatable_type, moderatable_id`

#### 3.2.9 Clubs

**Beschreibung:** Studentenclubs und Organisationen.

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | UUID | PRIMARY KEY | Eindeutige Club-ID |
| `name` | VARCHAR(200) | NOT NULL | Clubname |
| `description` | TEXT | | Beschreibung |
| `category` | VARCHAR(100) | | Kategorie (z.B. "Sport", "Tech", "Kunst") |
| `university_id` | UUID | FOREIGN KEY → Universities(id) | Zugehörige Universität |
| `logo_url` | VARCHAR(500) | | Logo-URL |
| `is_official` | BOOLEAN | DEFAULT FALSE | Offizieller Uni-Club |
| `is_active` | BOOLEAN | DEFAULT TRUE | Club aktiv |
| `created_by` | UUID | FOREIGN KEY → Users(id), NOT NULL | Ersteller |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Erstellungsdatum |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Letzte Aktualisierung |

**Indizes:**
- `idx_clubs_university` auf `university_id`
- `idx_clubs_category` auf `category`

#### 3.2.10 ClubMembers

**Beschreibung:** Mitgliedschaften in Clubs.

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | UUID | PRIMARY KEY | Eindeutige ID |
| `club_id` | UUID | FOREIGN KEY → Clubs(id), NOT NULL | Club-ID |
| `user_id` | UUID | FOREIGN KEY → Users(id), NOT NULL | Nutzer-ID |
| `role` | ENUM | DEFAULT 'member' | Rolle: 'member', 'moderator', 'admin' |
| `joined_at` | TIMESTAMP | DEFAULT NOW() | Beitrittsdatum |

**Constraints:**
- `UNIQUE (club_id, user_id)` - Keine Duplikate

**Indizes:**
- `idx_club_members_club` auf `club_id`
- `idx_club_members_user` auf `user_id`

#### 3.2.11 MatchPreferences

**Beschreibung:** Nutzerspezifische Matching-Präferenzen.

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | UUID | PRIMARY KEY | Eindeutige ID |
| `user_id` | UUID | FOREIGN KEY → Users(id), UNIQUE, NOT NULL | Nutzer-ID |
| `interests` | JSONB | | Array von Interessen-Tags |
| `preferred_year_range` | INTEGER[] | | Bevorzugte Jahrgänge (z.B. [2023, 2024, 2025]) |
| `max_distance` | INTEGER | | Maximale Entfernung für lokale Matches (km) |
| `show_only_same_major` | BOOLEAN | DEFAULT FALSE | Nur gleicher Studiengang |
| `min_match_score` | INTEGER | DEFAULT 30 | Mindest-Match-Score (0-100) |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Letzte Aktualisierung |

**Indizes:**
- `idx_match_prefs_user` auf `user_id`
- GIN-Index auf `interests` für schnelle Suche

#### 3.2.12 Zusätzliche Tabellen (Referenz)

**Universities**
- `id`, `name`, `domain`, `location`, `created_at`

**Courses**
- `id`, `name`, `code`, `university_id`, `semester`, `created_at`

**UserInterests** (Alternative zu JSONB)
- `id`, `user_id`, `interest_tag`, `created_at`

**ClubTags** (Alternative zu JSONB)
- `id`, `club_id`, `tag`, `created_at`

### 3.3 Relationen-Übersicht

| Tabelle A | Relation | Tabelle B | Kardinalität |
|-----------|----------|-----------|--------------|
| Users | ↔ | Users (via Friends) | many-to-many |
| Users | → | StudyGroups (via StudyGroupMembers) | many-to-many |
| Users | → | Clubs (via ClubMembers) | many-to-many |
| Users | → | Chats (via ChatParticipants) | many-to-many |
| Users | → | Messages | one-to-many |
| Users | → | MatchPreferences | one-to-one |
| StudyGroups | → | Users (via StudyGroupMembers) | many-to-many |
| StudyGroups | → | Moderators | one-to-many |
| Clubs | → | Users (via ClubMembers) | many-to-many |
| Clubs | → | Moderators | one-to-many |
| Chats | → | Users (via ChatParticipants) | many-to-many |
| Chats | → | Messages | one-to-many |

---

## 4. Rollen- & Berechtigungssystem

### 4.1 Rollen-Hierarchie

```
Super Admin (Uni)
    ↓
Uni Admin
    ↓
Club Admin / Group Leader
    ↓
Moderator
    ↓
Standard User
```

### 4.2 Rollen-Definitionen

#### 4.2.1 Standard User (Nutzer)

**Berechtigungen:**
- ✅ Eigenes Profil anzeigen und bearbeiten
- ✅ Andere Nutzer suchen und anzeigen
- ✅ Freundschaftsanfragen senden/akzeptieren
- ✅ Lerngruppen erstellen
- ✅ Lerngruppen beitreten (wenn öffentlich)
- ✅ Clubs beitreten
- ✅ Chats starten und Nachrichten senden
- ✅ Matching-Ergebnisse anzeigen
- ❌ Andere Nutzer-Profile bearbeiten
- ❌ Gruppen/Clubs löschen (außer eigene)
- ❌ Moderatoren zuweisen

**Einschränkungen:**
- Kann nur eigene Gruppen löschen
- Kann nur eigene Nachrichten bearbeiten/löschen
- Keine Admin-Funktionen

#### 4.2.2 Gruppenleiter / Moderatoren

**Berechtigungen (zusätzlich zu Standard User):**
- ✅ Mitglieder zu Gruppen hinzufügen/entfernen
- ✅ Gruppen-Einstellungen ändern (Name, Beschreibung, max. Mitglieder)
- ✅ Gruppen löschen (nur wenn Leader)
- ✅ Mitglieder zu Moderatoren befördern (nur Leader)
- ✅ Gruppen-Chat moderieren (Nachrichten löschen)
- ✅ Mitglieder aus Gruppe entfernen
- ❌ Andere Gruppen verwalten
- ❌ Uni-weite Einstellungen ändern

**Rollen innerhalb einer Gruppe:**
- **Leader:** Vollständige Kontrolle, kann Gruppe löschen
- **Moderator:** Kann Mitglieder verwalten, aber nicht Gruppe löschen
- **Member:** Standard-Berechtigungen

#### 4.2.3 Club-Administratoren

**Berechtigungen (zusätzlich zu Standard User):**
- ✅ Club-Einstellungen ändern (Name, Beschreibung, Logo)
- ✅ Mitglieder verwalten (hinzufügen/entfernen)
- ✅ Moderatoren zuweisen
- ✅ Club-Events erstellen und verwalten
- ✅ Club-Chat moderieren
- ✅ Club löschen (nur wenn Admin)
- ✅ Offizielle Club-Status beantragen
- ❌ Andere Clubs verwalten
- ❌ Uni-Einstellungen ändern

**Rollen innerhalb eines Clubs:**
- **Admin:** Vollständige Kontrolle
- **Moderator:** Kann Mitglieder verwalten
- **Member:** Standard-Berechtigungen

#### 4.2.4 Uni-Admins (Optional)

**Berechtigungen:**
- ✅ Alle Nutzer verwalten
- ✅ Clubs verifizieren/ablehnen
- ✅ Offizielle Clubs markieren
- ✅ System-Einstellungen ändern
- ✅ Berichte und Statistiken einsehen
- ✅ Nutzer sperren/entsperren
- ✅ Datenexport durchführen
- ❌ Super-Admin-Funktionen

**Verwendung:**
- Wird von Universitäts-IT oder Studentenwerk verwaltet
- Kann bei Bedarf implementiert werden

### 4.3 Berechtigungs-Check-Implementierung

**Pseudocode für Berechtigungsprüfung:**

```javascript
// Beispiel: Kann Nutzer Gruppe bearbeiten?
function canEditGroup(userId, groupId) {
    const membership = getGroupMembership(userId, groupId);
    
    if (!membership) return false;
    
    // Leader kann immer bearbeiten
    if (membership.role === 'leader') return true;
    
    // Moderator kann bearbeiten, aber nicht löschen
    if (membership.role === 'moderator') return true;
    
    return false;
}

// Beispiel: Kann Nutzer Mitglied entfernen?
function canRemoveMember(userId, groupId, targetUserId) {
    const userMembership = getGroupMembership(userId, groupId);
    const targetMembership = getGroupMembership(targetUserId, groupId);
    
    if (!userMembership || !targetMembership) return false;
    
    // Leader kann alle entfernen
    if (userMembership.role === 'leader') return true;
    
    // Moderator kann normale Mitglieder entfernen
    if (userMembership.role === 'moderator' && targetMembership.role === 'member') {
        return true;
    }
    
    return false;
}
```

---

## 5. User Journey / User Flow

### 5.1 Registrierung / Onboarding

```
┌─────────────────────────────────────────────────────────┐
│ Schritt 1: Landing Page                                 │
│ - App öffnen                                             │
│ - "Registrieren" klicken                                 │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 2: Registrierung                                │
│ - E-Mail eingeben (Uni-E-Mail empfohlen)                │
│ - Passwort erstellen                                     │
│ - AGB & Datenschutz akzeptieren                          │
│ - "Registrieren" klicken                                 │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 3: E-Mail-Verifizierung                         │
│ - Verifizierungs-E-Mail erhalten                        │
│ - Link klicken                                           │
│ - Zur App zurückgeleitet                                 │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 4: Profil-Setup                                 │
│ - Vorname & Nachname eingeben                           │
│ - Universität auswählen                                  │
│ - Studiengang eingeben                                   │
│ - Jahrgang auswählen                                     │
│ - Profilbild hochladen (optional)                        │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 5: Interessen-Setup                            │
│ - Interessen-Tags auswählen oder eingeben               │
│   (z.B. "KI", "Design", "Sport")                        │
│ - "Fertig" klicken                                       │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 6: Onboarding-Tour (Optional)                  │
│ - Kurze Einführung in Features                          │
│ - Erste Matches werden angezeigt                        │
│ - "Loslegen" klicken                                     │
└──────────────────┬──────────────────────────────────────┘
                   │
         ┌─────────▼─────────┐
         │ Dashboard öffnet  │
         └───────────────────┘
```

**Dauer:** ~3-5 Minuten

### 5.2 Kompatible Studierende finden

```
┌─────────────────────────────────────────────────────────┐
│ Schritt 1: Explore öffnen                               │
│ - Navigation: "Explore" anklicken                        │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 2: Matching läuft                               │
│ - Backend berechnet Match-Scores                        │
│ - Ergebnisse werden geladen                             │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 3: Ergebnisse anzeigen                          │
│ - Liste von Studierenden-Karten                         │
│ - Sortiert nach Match-Score (höchste zuerst)            │
│ - Match-Badge zeigt Kompatibilität (z.B. "85% Match")  │
│ - Jahrgang wird hervorgehoben wenn identisch           │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 4: Filter anwenden (Optional)                   │
│ - Filter nach Jahrgang                                  │
│ - Filter nach Studiengang                               │
│ - Filter nach Mindest-Match-Score                      │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 5: Profil ansehen                               │
│ - Auf Karte klicken                                     │
│ - Detailansicht öffnet                                  │
│ - Interessen, Kurse, Bio anzeigen                      │
└──────────────────┬──────────────────────────────────────┘
                   │
         ┌─────────▼─────────┐
         │ Aktion wählen:    │
         │ - "Vernetzen"     │
         │ - "Nachricht"     │
         │ - "Zurück"        │
         └───────────────────┘
```

**Dauer:** ~2-3 Minuten für erste Übersicht

### 5.3 Gruppe beitreten

```
┌─────────────────────────────────────────────────────────┐
│ Schritt 1: Gruppe finden                                │
│ - Via Explore oder direkte Suche                        │
│ - Gruppen-Karte anzeigen                               │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 2: Gruppen-Details ansehen                      │
│ - Name, Beschreibung, Mitglieder                        │
│ - Match-Score prüfen                                    │
│ - Verfügbare Plätze prüfen                              │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 3: "Beitreten" klicken                          │
│ - Button auf Gruppen-Karte                              │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 4: Bestätigung                                  │
│ - Modal: "Gruppe beitreten?"                            │
│ - "Bestätigen" klicken                                   │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 5: Erfolg                                       │
│ - Erfolgs-Benachrichtigung                              │
│ - Automatisch zu Gruppen-Chat hinzugefügt               │
│ - Gruppenleiter erhält Notification                      │
│ - Button ändert sich zu "Beigetreten"                   │
└──────────────────┬──────────────────────────────────────┘
                   │
         ┌─────────▼─────────┐
         │ Gruppe erscheint  │
         │ in "Meine Gruppen"│
         └───────────────────┘
```

**Dauer:** ~30 Sekunden

### 5.4 Gruppe erstellen

```
┌─────────────────────────────────────────────────────────┐
│ Schritt 1: Gruppen-View öffnen                          │
│ - Navigation: "Gruppen" anklicken                        │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 2: "Gruppe erstellen" klicken                   │
│ - Button oben rechts                                    │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 3: Formular ausfüllen                           │
│ - Gruppenname eingeben                                  │
│ - Beschreibung schreiben                                │
│ - Kurs auswählen (optional)                             │
│ - Maximale Mitgliederanzahl festlegen                   │
│ - Öffentlich/Privat wählen                              │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 4: "Erstellen" klicken                          │
│ - Validierung läuft                                     │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 5: Erfolg                                       │
│ - Gruppe wird erstellt                                  │
│ - Automatisch als Leader zugewiesen                     │
│ - Gruppen-Chat wird erstellt                            │
│ - Zur Gruppen-Detailansicht weitergeleitet              │
└──────────────────┬──────────────────────────────────────┘
                   │
         ┌─────────▼─────────┐
         │ Gruppe ist aktiv  │
         │ und sichtbar      │
         └───────────────────┘
```

**Dauer:** ~2 Minuten

### 5.5 Chat starten

```
┌─────────────────────────────────────────────────────────┐
│ Schritt 1: Nutzer auswählen                             │
│ - Via Explore oder Profil                               │
│ - Auf Nutzer-Karte klicken                              │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 2: "Nachricht senden" klicken                    │
│ - Button auf Profil-Karte                               │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 3: Chat öffnet                                  │
│ - Neuer Chat wird erstellt (falls nicht vorhanden)      │
│ - Chat-Fenster öffnet sich                              │
│ - Eingabefeld ist fokussiert                            │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 4: Nachricht schreiben                          │
│ - Text eingeben                                         │
│ - "Senden" klicken oder Enter drücken                   │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Schritt 5: Nachricht wird gesendet                      │
│ - Nachricht erscheint im Chat                            │
│ - Empfänger erhält Push-Notification                    │
│ - Chat erscheint in Chat-Liste beider Nutzer           │
└──────────────────┬──────────────────────────────────────┘
                   │
         ┌─────────▼─────────┐
         │ Chat ist aktiv    │
         │ und verfügbar     │
         └───────────────────┘
```

**Dauer:** ~20 Sekunden

### 5.6 Alternative Flows

**Gruppe via Matching finden:**
```
Explore → Filter: "Lerngruppen" → Match-Scores anzeigen → Gruppe beitreten
```

**Club beitreten:**
```
Clubs → Club durchsuchen → Details ansehen → "Beitreten" → Erfolg
```

**Freundschaftsanfrage:**
```
Explore → Nutzer-Profil → "Vernetzen" → Anfrage senden → Warten auf Antwort
```

---

## 6. Konkrete Feature-Empfehlungen

### 6.1 KI-basierte Gruppenempfehlungen

**Beschreibung:**
Erweiterte Matching-Logik mit Machine Learning für präzisere Empfehlungen.

**Technische Umsetzung:**
- **Feature Engineering:** Nutzer-Verhalten analysieren (welche Gruppen wurden beigetreten, wie lange aktiv)
- **Modell:** Collaborative Filtering oder Content-Based Filtering
- **Training:** Historische Daten von erfolgreichen Gruppen-Mitgliedschaften
- **Output:** Personalisierte Gruppen-Empfehlungen mit Konfidenz-Score

**Vorteile:**
- Höhere Erfolgsrate bei Gruppen-Beiträten
- Reduzierte Fluktuation in Gruppen
- Bessere Gruppendynamik

**Implementierungs-Priorität:** ⭐⭐⭐ (Hoch)

### 6.2 Kurs-Auto-Matching

**Beschreibung:**
Automatisches Matching basierend auf eingeschriebenen Kursen.

**Funktionalität:**
- Nutzer wählt Kurse aus seinem Stundenplan aus
- System findet automatisch alle Studierenden im gleichen Kurs
- Vorschlag: "Du bist in 'Einführung in KI' - 15 Kommilitonen gefunden"
- Ein-Klick-Gruppenerstellung für jeden Kurs

**Technische Umsetzung:**
- Integration mit Uni-Systemen (LTI, API) oder manuelle Eingabe
- Tabelle: `UserCourses` mit `user_id`, `course_id`, `semester`
- Matching: `SELECT users WHERE course_id IN (user_courses)`

**Vorteile:**
- Sofortige Verbindung zu Kurs-Kommilitonen
- Erleichtert Lerngruppen-Bildung
- Reduziert manuelle Suche

**Implementierungs-Priorität:** ⭐⭐⭐⭐⭐ (Sehr hoch)

### 6.3 Event-Boards

**Beschreibung:**
Kalender-Feature für Uni-Events, Club-Veranstaltungen und private Treffen.

**Funktionalität:**
- Clubs können Events erstellen (z.B. "Tech Talk am 15.03.")
- Nutzer können Events durchsuchen und teilnehmen
- Persönlicher Kalender mit allen Events
- Push-Benachrichtigungen vor Events
- Integration mit Google Calendar / iCal

**Datenbank-Erweiterung:**
```sql
CREATE TABLE Events (
    id UUID PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    organizer_id UUID REFERENCES Users(id),
    club_id UUID REFERENCES Clubs(id), -- Optional
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    location VARCHAR(200),
    max_participants INTEGER,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE EventParticipants (
    id UUID PRIMARY KEY,
    event_id UUID REFERENCES Events(id),
    user_id UUID REFERENCES Users(id),
    status ENUM('going', 'maybe', 'not_going'),
    UNIQUE(event_id, user_id)
);
```

**Implementierungs-Priorität:** ⭐⭐⭐⭐ (Hoch)

### 6.4 Study-Buddy Matching

**Beschreibung:**
Spezielles Matching für 1:1 Lernpartnerschaften.

**Funktionalität:**
- Nutzer kann "Study Buddy gesucht" aktivieren
- Matching basierend auf:
  - Gleiche Kurse
  - Ähnliche Lernzeiten (Verfügbarkeiten)
  - Komplementäre Stärken (z.B. Mathe-Experte + Design-Experte)
- Vorschlag: "Max passt zu dir - beide in KI-Kurs, ähnliche Zeiten"

**Vorteile:**
- Fokussiertes 1:1-Lernen
- Höhere Verbindlichkeit als große Gruppen
- Bessere individuelle Unterstützung

**Implementierungs-Priorität:** ⭐⭐⭐ (Mittel-Hoch)

### 6.5 Skill-Bartering

**Beschreibung:**
Nutzer können Skills anbieten und suchen (z.B. "Biete: Python-Tutoring, Suche: Design-Hilfe").

**Funktionalität:**
- Profil-Erweiterung: "Skills" und "Gesuchte Skills"
- Matching: Wer bietet was ich suche?
- Skill-Verifizierung durch andere Nutzer (Bewertungen)
- Skill-Board zum Durchsuchen

**Datenbank-Erweiterung:**
```sql
CREATE TABLE UserSkills (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES Users(id),
    skill_name VARCHAR(100) NOT NULL,
    skill_level ENUM('beginner', 'intermediate', 'advanced', 'expert'),
    is_offering BOOLEAN DEFAULT TRUE, -- Bietet oder sucht
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE SkillExchanges (
    id UUID PRIMARY KEY,
    requester_id UUID REFERENCES Users(id),
    provider_id UUID REFERENCES Users(id),
    skill_id UUID REFERENCES UserSkills(id),
    status ENUM('pending', 'accepted', 'completed', 'cancelled'),
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Implementierungs-Priorität:** ⭐⭐ (Mittel)

### 6.6 Gamification

**Beschreibung:**
Spielerische Elemente zur Steigerung der Engagement.

**Features:**
- **Punkte-System:** Für Aktivitäten Punkte sammeln (Gruppe beitreten, Chat starten, etc.)
- **Achievements:** Badges für Meilensteine ("Erste Gruppe gegründet", "10 Matches", etc.)
- **Leaderboards:** Top-Matcher, Aktivste Nutzer, etc.
- **Streaks:** Tägliche Login-Streaks

**Vorteile:**
- Erhöhtes Engagement
- Langfristige Nutzung
- Community-Building

**Implementierungs-Priorität:** ⭐⭐ (Mittel)

### 6.7 Offline-Modus

**Beschreibung:**
App funktioniert auch ohne Internet-Verbindung.

**Funktionalität:**
- Caching von bereits geladenen Daten
- Offline-Messaging (Warteschlange)
- Synchronisation bei Wieder-Verbindung
- Service Worker für Progressive Web App (PWA)

**Technische Umsetzung:**
- IndexedDB für lokale Speicherung
- Background Sync API
- Service Worker für Offline-Funktionalität

**Implementierungs-Priorität:** ⭐⭐⭐ (Hoch)

### 6.8 Erweiterte Suchfunktionen

**Beschreibung:**
Power-User-Suche mit vielen Filtern.

**Filter-Optionen:**
- Jahrgang (Range)
- Studiengang (Multi-Select)
- Interessen (Tags)
- Match-Score (Minimum)
- Aktivitätsstatus (online, letzte Aktivität)
- Freundschaftsstatus (Freunde, Nicht-Freunde, Alle)
- Standort (wenn verfügbar)

**Implementierungs-Priorität:** ⭐⭐⭐ (Hoch)

### 6.9 Gruppen-Aktivitäts-Tracking

**Beschreibung:**
Analytics für Gruppenleiter über Gruppenaktivität.

**Features:**
- Aktivitäts-Dashboard für Gruppenleiter
- Statistiken: Nachrichten pro Tag, aktivste Mitglieder
- Inaktive Mitglieder identifizieren
- Vorschläge zur Gruppenverbesserung

**Implementierungs-Priorität:** ⭐⭐ (Mittel)

### 6.10 Integration mit Uni-Systemen

**Beschreibung:**
Direkte Verbindung zu Uni-Lernplattformen.

**Möglichkeiten:**
- **Moodle/ILIAS Integration:** Automatisches Kurs-Loading
- **Uni-Kalender:** Events automatisch importieren
- **Bibliotheks-System:** Verfügbare Lernplätze anzeigen
- **Prüfungsplan:** Gemeinsame Prüfungen hervorheben

**Technische Herausforderungen:**
- Verschiedene Uni-Systeme
- API-Verfügbarkeit
- Datenschutz-Compliance

**Implementierungs-Priorität:** ⭐⭐⭐⭐ (Hoch, aber komplex)

---

## 7. Technische Implementierungs-Hinweise

### 7.1 Skalierbarkeit

**Backend:**
- Microservices für horizontale Skalierung
- Caching-Strategie (Redis) für häufig abgerufene Daten
- Database Sharding nach Universität
- CDN für statische Assets

**Frontend:**
- Code-Splitting für schnelleres Laden
- Lazy Loading von Komponenten
- Virtual Scrolling für große Listen

### 7.2 Sicherheit

- **Authentication:** JWT-Tokens mit Refresh-Tokens
- **Authorization:** Role-Based Access Control (RBAC)
- **Data Encryption:** HTTPS, verschlüsselte Datenbank-Felder für sensible Daten
- **Input Validation:** Server-seitige Validierung aller Inputs
- **Rate Limiting:** Schutz vor Missbrauch

### 7.3 Performance-Optimierungen

- **Database:** Indizes auf häufig abgefragten Spalten
- **Caching:** Match-Ergebnisse für 5-10 Minuten cachen
- **Pagination:** Limit von 20-50 Ergebnissen pro Seite
- **Image Optimization:** WebP-Format, Lazy Loading

---

## 8. Fazit

UniConnect bietet eine umfassende Lösung für die Vernetzung von Studierenden durch intelligentes Matching, flexible Gruppenverwaltung und intuitive Kommunikation. Die vorgeschlagene Architektur ist skalierbar, sicher und erweiterbar für zukünftige Features.

**Nächste Schritte:**
1. MVP mit Kern-Features entwickeln (Matching, Gruppen, Chats)
2. Beta-Testing an einer Pilot-Universität
3. Feedback sammeln und iterieren
4. Erweiterte Features schrittweise einführen

---

**Dokument erstellt:** 2024  
**Version:** 1.0  
**Autor:** UniConnect Development Team

