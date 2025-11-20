# Troubleshooting: Connection Refused

Wenn du "Connection refused" oder CORS-Fehler beim Zugriff auf die App bekommst, liegt das meist an fehlenden **Platform-Einstellungen** in Appwrite.

## Lösung: Platform Hostname hinzufügen

### 1. Öffne die Appwrite Console
Gehe zu: https://cloud.appwrite.io

### 2. Wähle dein Projekt
Klicke auf dein Projekt **"DemoProject"** (ID: `69074bf4001a447ddde9`)

### 3. Gehe zu Settings → Platforms
- Im linken Menü: **Settings** → **Platforms**
- Klicke auf **"Add Platform"**

### 4. Wähle "Web App"
- Platform Type: **Web App**

### 5. Füge folgende Informationen ein:
- **Name:** `Local Development` (oder ein anderer Name)
- **Hostname:** `localhost`
- Optional kannst du auch hinzufügen:
  - `localhost:3000`
  - `localhost:3001`
  - `127.0.0.1`

### 6. Speichern
Klicke auf **"Next"** oder **"Create"**

### 7. Für Production (später):
Wenn du die App deployst, füge auch die Production-Domain hinzu:
- z.B. `your-app.vercel.app`
- z.B. `your-domain.com`

## Alternative Lösung: Wildcard (nur für Development!)

Falls du oft den Port wechselst, kannst du auch hinzufügen:
- `localhost:*` (erlaubt alle Ports auf localhost)

⚠️ **Achtung:** Wildcard sollte nur in der Development-Phase genutzt werden!

## Nach dem Hinzufügen:

1. **Starte den Dev-Server neu** (falls er noch läuft):
   ```bash
   # Stoppe den Server (Ctrl+C im Terminal)
   # Starte ihn erneut:
   npm run dev
   ```

2. **Refresh den Browser** (Strg+F5 für Hard-Refresh)

3. **Teste die App** unter http://localhost:3001

## Weitere häufige Probleme:

### "Invalid credentials" oder "Unauthorized"
→ Überprüfe, ob die Collection-Permissions gesetzt sind:
- Gehe zu **Databases → Data → [Collection] → Settings → Permissions**
- Füge hinzu: **"Users"** mit **Read** und optional **Create/Update/Delete**

### "User (role: guests) missing scope (account)"
→ Du musst eingeloggt sein, um auf das Dashboard zuzugreifen
- Gehe zu `/login` und erstelle einen Account

### Browser-Console zeigt "ERR_CONNECTION_REFUSED"
→ Dev-Server läuft nicht
- Starte `npm run dev` im Terminal

## Testen:

Nach dem Hinzufügen der Platform kannst du testen:

1. Öffne http://localhost:3001
2. Du solltest die Template-Seite sehen
3. Klicke auf "Login"
4. Erstelle einen Account
5. Du wirst zum Dashboard weitergeleitet
6. Dort sollten die Collections "Table" und "Games" angezeigt werden
