# Appwrite Next.js Authentication & Dashboard

Dieses Projekt ist ein Next.js Starter-Template mit Appwrite-Integration für Authentifizierung und Datenbankzugriff.

## Features

✅ **Email/Password Authentifizierung** - Vollständiges Login/Register-System  
✅ **Protected Routes** - Dashboard nur für eingeloggte Nutzer  
✅ **Database Integration** - Anzeige von 2 Collections aus Appwrite  
✅ **Template-Seite** - Zugriff ohne Login möglich  
✅ **Responsive Design** - Optimiert für Desktop & Mobile  

## Setup

### 1. Installation

```bash
npm install
```

### 2. Appwrite Konfiguration

Öffne die `.env`-Datei und ersetze die Platzhalter mit deinen echten Appwrite IDs:

```env
NEXT_PUBLIC_APPWRITE_PROJECT_ID = "69074bf4001a447ddde9"
NEXT_PUBLIC_APPWRITE_PROJECT_NAME = "DemoProject"
NEXT_PUBLIC_APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1"

# Diese IDs musst du aus deiner Appwrite Console holen:
NEXT_PUBLIC_APPWRITE_DATABASE_ID = "deine-database-id"
NEXT_PUBLIC_APPWRITE_COLLECTION_1_ID = "deine-erste-collection-id"
NEXT_PUBLIC_APPWRITE_COLLECTION_2_ID = "deine-zweite-collection-id"
```

#### Wo finde ich die IDs?

1. Gehe zu [Appwrite Console](https://cloud.appwrite.io)
2. Wähle dein Projekt aus
3. **Database ID**: Navigiere zu "Databases" → Klicke auf deine Datenbank → Kopiere die ID aus der URL oder dem Header
4. **Collection IDs**: Innerhalb der Datenbank → Klicke auf eine Collection → Kopiere die ID

### 3. Appwrite Berechtigungen setzen

Damit die App funktioniert, musst du in der Appwrite Console die richtigen Berechtigungen setzen:

#### Auth Settings
1. Gehe zu **Authentication** → **Settings**
2. Aktiviere **Email/Password** unter "Auth Methods"

#### Database Permissions
1. Gehe zu **Databases** → Deine Datenbank → Deine Collection
2. Unter **Settings** → **Permissions**:
   - Füge **Read** Permission hinzu: `Users` (damit eingeloggte User lesen können)
   - Optional: `Any` für öffentlichen Zugriff

### 4. Ersten User erstellen

Du kannst einen User auf zwei Arten erstellen:

**Option A: Über die App**
1. Starte die App: `npm run dev`
2. Gehe zu `/login`
3. Klicke auf "Don't have an account? Register"
4. Fülle Email, Passwort und Name aus

**Option B: Über Appwrite Console**
1. Gehe zu **Authentication** → **Users**
2. Klicke auf "Create User"
3. Fülle die Felder aus

## Projekt starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## Routen

- **`/`** - Template-Seite (öffentlich zugänglich, mit Navigation)
- **`/login`** - Login/Register-Seite
- **`/dashboard`** - Dashboard mit Datenbank-Anzeige (nur für eingeloggte User)

## Projektstruktur

```
src/
├── app/
│   ├── layout.js           # Root Layout mit AuthProvider
│   ├── page.js             # Template-Seite (öffentlich)
│   ├── login/
│   │   └── page.js         # Login/Register-Seite
│   └── dashboard/
│       └── page.js         # Dashboard (protected)
├── contexts/
│   └── AuthContext.js      # Authentication Context & Hooks
└── lib/
    └── appwrite.js         # Appwrite Client Setup
```

## Verwendung

### Authentication

```javascript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, login, logout, register } = useAuth();
  
  // Check if user is logged in
  if (user) {
    console.log("Logged in as:", user.name);
  }
}
```

### Database Access

```javascript
import { databases } from "@/lib/appwrite";

const data = await databases.listDocuments({
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  collectionId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_1_ID,
});
```

## Troubleshooting

### "Database/Collection IDs not configured"
→ Überprüfe, ob du die `.env`-Datei mit den echten IDs aktualisiert hast

### "Unauthorized" beim Datenzugriff
→ Stelle sicher, dass die Collection-Permissions in Appwrite korrekt gesetzt sind (siehe oben)

### "Invalid credentials" beim Login
→ Überprüfe Email/Passwort oder erstelle einen neuen Account über Register

## Weiterführende Links

- [Appwrite Dokumentation](https://appwrite.io/docs)
- [Next.js Dokumentation](https://nextjs.org/docs)
- [Appwrite Console](https://cloud.appwrite.io)
