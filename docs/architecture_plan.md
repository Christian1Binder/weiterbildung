# Zielarchitektur: Webbasiertes Ausbildungs-CMS

## 1. Empfohlene Projektstruktur
Um die Skalierbarkeit zu gewährleisten, wird das Projekt modularisiert.

```
/
├── index.html          # Dashboard (Landing Page)
├── admin.html          # Admin-Bereich
├── course.html         # Kurs-Ansicht (dynamisch)
├── lesson.html         # Lektions-Ansicht (dynamisch)
├── style.css           # Zentrales Design
├── docs/
│   └── architecture_plan.md
├── js/
│   ├── app.js          # Hauptlogik & Routing
│   ├── db.js           # Daten-Persistenz (localStorage / API)
│   ├── ui.js           # UI-Komponenten & Rendering
│   └── auth.js         # Benutzerverwaltung (Mock/API)
└── assets/             # Bilder & Icons
```

## 2. Datenmodelle

### Module
```json
{
  "id": "uuid",
  "title": "String",
  "description": "String",
  "order": 1
}
```

### Courses (Kurse)
```json
{
  "id": "uuid",
  "moduleId": "uuid",
  "title": "String",
  "description": "String",
  "order": 1
}
```

### Lessons (Lektionen)
```json
{
  "id": "uuid",
  "courseId": "uuid",
  "title": "String",
  "content": "String (HTML/Markdown)",
  "order": 1
}
```

### Users
```json
{
  "id": "uuid",
  "email": "String",
  "role": "admin | editor | user"
}
```

## 3. Backend-Strategie
Die Architektur bleibt kompatibel mit statischem Hosting, nutzt aber externe APIs für Persistenz.

1.  **Phase 1 (IST):** `localStorage` (Browser-basiert).
2.  **Phase 2 (Übergang):** Abstraktionsschicht in `js/db.js` einführen.
3.  **Phase 3 (Ziel):** Integration von **Supabase** oder **Firebase**.
    - Supabase bietet PostgreSQL, Auth und Realtime-Features über eine einfache JS-Bibliothek.
    - Perfekt für GitHub Pages / statisches Hosting.

## 4. Implementierungsschritte (Roadmap)
1.  **Refactoring:** Bereinigung von `script.js` und Einführung der `js/` Modulstruktur.
2.  **Datenmodell-Erweiterung:** Implementierung der hierarchischen Struktur (Modul -> Kurs -> Lektion).
3.  **Dynamisierung:** Umstellung der HTML-Seiten auf dynamisches Rendering basierend auf URL-Parametern.
4.  **Admin-Upgrade:** Ausbau des Admin-Bereichs zur Verwaltung der tieferen Hierarchie-Ebenen.
5.  **Persistenz-Swap:** Ersetzen von `localStorage` durch eine Cloud-Datenbank (z.B. Supabase).
