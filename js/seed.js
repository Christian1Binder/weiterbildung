// js/seed.js

const SEED_DATA = {
    modules: [
        {
            title: "Grundausbildung",
            desc: "Grundlegende Schulung für alle Mitarbeiter.",
            order: 1,
            courses: [
                {
                    title: "Einführung in das Unternehmen",
                    desc: "Willkommen im Team! Lernen Sie unsere Werte und Ziele kennen.",
                    order: 1,
                    difficulty: "Einfach",
                    lessons: [
                        {
                            title: "Geschichte & Vision",
                            duration: "15 min",
                            content: `
                                <h3>Willkommen bei uns!</h3>
                                <p>Unsere Geschichte beginnt vor 20 Jahren mit der Idee, Bildung für alle zugänglich zu machen.</p>
                                <h4>Lernziele dieser Lektion:</h4>
                                <ul>
                                    <li>Verständnis unserer Wurzeln</li>
                                    <li>Kennenlernen der Gründer</li>
                                    <li>Die Vision für 2030</li>
                                </ul>
                                <p>Unsere Vision ist es, die Branche durch Innovation und Exzellenz zu revolutionieren.</p>
                                <div style="background:var(--bg); padding:15px; border-left:4px solid var(--accent); margin:20px 0;">
                                    <strong>Praxisaufgabe:</strong><br>
                                    Überlegen Sie sich, wo Sie sich in 5 Jahren sehen.
                                </div>
                            `,
                            order: 1
                        },
                        {
                            title: "Organigramm & Struktur",
                            duration: "10 min",
                            content: `
                                <p>Wer ist wer? Unser Unternehmen ist in 5 Hauptabteilungen gegliedert: Sales, Marketing, IT, HR und Operations.</p>
                                <ul>
                                    <li>CEO: Max Mustermann</li>
                                    <li>CTO: Julia Tech</li>
                                    <li>COO: Peter Operations</li>
                                </ul>
                            `,
                            order: 2
                        },
                        { title: "Unternehmenskultur", duration: "20 min", content: "<p>Wir legen Wert auf Respekt, Offenheit und Teamgeist. Hier zählt das 'Wir' mehr als das 'Ich'.</p>", order: 3 },
                        { title: "Unsere Produkte", duration: "25 min", content: "<p>Ein Überblick über unser Portfolio: Von Softwarelösungen bis hin zu Beratungsdienstleistungen.</p>", order: 4 },
                        { title: "Ansprechpartner & HR", duration: "10 min", content: "<p>Fragen zu Vertrag, Urlaub oder Gehalt? Das HR-Team steht Ihnen jederzeit zur Verfügung.</p>", order: 5 }
                    ]
                },
                {
                    title: "Arbeitssicherheit & Gesundheitsschutz",
                    desc: "Sicheres Arbeiten und Gesundheitsvorsorge am Arbeitsplatz.",
                    order: 2,
                    difficulty: "Mittel",
                    lessons: [
                        { title: "Grundlagen Arbeitsschutz", duration: "30 min", content: "<p>Sicherheit geht vor! Die wichtigsten Regeln und Vorschriften am Arbeitsplatz.</p>", order: 1 },
                        { title: "Verhalten im Brandfall", duration: "15 min", content: "<p>Ruhe bewahren! Nutzen Sie die gekennzeichneten Fluchtwege und finden Sie sich am Sammelplatz ein.</p>", order: 2 },
                        { title: "Erste Hilfe", duration: "45 min", content: "<p>Jeder kann helfen. Kennen Sie die Standorte der Erste-Hilfe-Kästen und Defibrillatoren.</p>", order: 3 },
                        { title: "Ergonomie am Arbeitsplatz", duration: "20 min", content: "<p>Ein gesunder Rücken ist wichtig. Stellen Sie Stuhl und Monitor korrekt ein.</p>", order: 4 },
                        { title: "Psychische Gesundheit", duration: "25 min", content: "<p>Achten Sie auf sich und Ihre Kollegen. Stressmanagement und Pausen sind essenziell.</p>", order: 5 }
                    ]
                },
                {
                    title: "Kommunikation & Teamarbeit",
                    desc: "Effektive Kommunikation und Zusammenarbeit im Team.",
                    order: 3,
                    difficulty: "Fortgeschritten",
                    lessons: [
                        { title: "Kommunikationsmodelle", duration: "30 min", content: "<p>Verstehen Sie, wie Kommunikation funktioniert (Sender-Empfänger, 4-Ohren-Modell).</p>", order: 1 },
                        { title: "Feedback geben & nehmen", duration: "25 min", content: "<p>Feedback ist ein Geschenk. Lernen Sie, konstruktive Kritik zu äußern und anzunehmen.</p>", order: 2 },
                        { title: "Konfliktlösung", duration: "40 min", content: "<p>Konflikte sind normal. Entscheidend ist, wie wir sie lösen – sachlich und lösungsorientiert.</p>", order: 3 },
                        { title: "Meeting-Kultur", duration: "15 min", content: "<p>Keine Agenda, kein Meeting. Wie wir Besprechungen effizient gestalten.</p>", order: 4 },
                        { title: "Virtuelle Zusammenarbeit", duration: "20 min", content: "<p>Best Practices für Homeoffice, Zoom und Teams.</p>", order: 5 }
                    ]
                },
                {
                    title: "IT-Grundlagen & Datenschutz",
                    desc: "Sicherer Umgang mit IT-Systemen und sensiblen Daten.",
                    order: 4,
                    difficulty: "Mittel",
                    lessons: [
                        { title: "IT-Sicherheit Basics", duration: "20 min", content: "<p>Verwenden Sie starke Passwörter und ändern Sie diese regelmäßig. Sperren Sie Ihren Bildschirm beim Verlassen.</p>", order: 1 },
                        { title: "Datenschutz (DSGVO)", duration: "30 min", content: "<p>Personenbezogene Daten sind schützenswert. Kennen Sie die Grundsätze der DSGVO.</p>", order: 2 },
                        { title: "Umgang mit E-Mails", duration: "15 min", content: "<p>Vorsicht bei Anhängen und Links. Phishing-Mails werden immer professioneller.</p>", order: 3 },
                        { title: "Social Engineering", duration: "25 min", content: "<p>Lassen Sie sich nicht manipulieren. Seien Sie skeptisch bei ungewöhnlichen Anfragen.</p>", order: 4 },
                        { title: "Software-Richtlinien", duration: "10 min", content: "<p>Installieren Sie nur freigegebene Software. Schatten-IT gefährdet die Sicherheit.</p>", order: 5 }
                    ]
                },
                {
                    title: "Qualitätsmanagement Basics",
                    desc: "Einführung in unser QM-System und Prozesse.",
                    order: 5,
                    difficulty: "Fortgeschritten",
                    lessons: [
                        { title: "Was ist Qualität?", duration: "15 min", content: "<p>Qualität bedeutet, die Erwartungen unserer Kunden zu erfüllen oder zu übertreffen.</p>", order: 1 },
                        { title: "KVP - Kontinuierliche Verbesserung", duration: "20 min", content: "<p>Stillstand ist Rückschritt. Wir suchen ständig nach Wegen, besser zu werden.</p>", order: 2 },
                        { title: "Prozesslandschaft", duration: "30 min", content: "<p>Unsere Prozesse sind dokumentiert und standardisiert, um gleichbleibende Qualität zu sichern.</p>", order: 3 },
                        { title: "Fehlerkultur", duration: "25 min", content: "<p>Fehler sind Lernchancen. Melden Sie Abweichungen, damit wir die Ursachen beheben können.</p>", order: 4 },
                        { title: "Audit & Zertifizierung", duration: "20 min", content: "<p>Regelmäßige Audits bestätigen die Wirksamkeit unseres QM-Systems.</p>", order: 5 }
                    ]
                }
            ]
        }
    ],
    users: [
        { id: 'admin', role: 'admin', name: 'Admin User' },
        { id: 'editor', role: 'editor', name: 'Editor User' },
        { id: 'user', role: 'user', name: 'Standard User' }
    ]
};

window.initSeedData = function() {
    const db = window.cmsDb;
    const existingData = localStorage.getItem('training_cms_data');

    // Only seed if no data exists or modules array is empty
    if (!existingData || (JSON.parse(existingData).modules && JSON.parse(existingData).modules.length === 0)) {
        console.log("Seeding Database with rich content...");

        // Construct the full data tree in memory
        const modules = SEED_DATA.modules.map(m => ({
            id: 'seed_mod_' + Math.random().toString(36).substr(2, 9),
            title: m.title,
            desc: m.desc,
            order: m.order,
            courses: m.courses.map(c => ({
                id: 'seed_course_' + Math.random().toString(36).substr(2, 9),
                title: c.title,
                desc: c.desc,
                order: c.order,
                difficulty: c.difficulty,
                lessons: c.lessons.map(l => ({
                    id: 'seed_lesson_' + Math.random().toString(36).substr(2, 9),
                    title: l.title,
                    content: l.content,
                    duration: l.duration,
                    order: l.order,
                    quiz: null
                }))
            }))
        }));

        const fullData = {
            modules: modules,
            users: SEED_DATA.users
        };

        db.save(fullData);
        console.log("Seeding Complete. Reloading...");
        location.reload();
    }
};
