document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Seed Data (if empty)
    if (window.initSeedData) {
        window.initSeedData();
    }

    // 2. Render Navigation
    if (window.cmsUi && window.cmsUi.renderNavigation) {
        window.cmsUi.renderNavigation();
    }

    // 3. Theme Check
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const user = window.cmsDb.getCurrentUser();

    // 4. Role Protection (Simple Client-Side)
    if (path.includes('admin.html') && !window.cmsDb.hasRole('editor')) { // Editor+ can see admin
        alert('Zugriff verweigert. Bitte als Admin oder Editor anmelden.');
        window.location.href = 'index.html';
        return;
    }

    // 5. Page Initialization

    // Dashboard (User View)
    if (document.getElementById('moduleList') && !path.includes('admin.html')) {
        const modules = window.cmsDb.getModules();
        window.cmsUi.renderModules('moduleList', modules, false);
    }

    // Admin Dashboard
    if (path.includes('admin.html')) {
        const modules = window.cmsDb.getModules();
        window.cmsUi.renderModules('moduleList', modules, true);
        if (window.updateAdminStats) window.updateAdminStats();
    }

    // Course View
    if (path.includes('course.html')) {
        const moduleId = params.get('moduleId');
        const module = window.cmsDb.getModule(moduleId);
        if (module) {
            const heroTitle = document.querySelector('.page-header h1');
            const heroDesc = document.querySelector('.page-header .lead');
            if(heroTitle) heroTitle.innerText = module.title;
            if(heroDesc) heroDesc.innerText = module.desc;

            window.cmsUi.renderCourses('courseList', moduleId, module.courses, false);
        }
    }

    // Lesson List View
    if (path.includes('lesson.html')) {
        const moduleId = params.get('moduleId');
        const courseId = params.get('courseId');
        const course = window.cmsDb.getCourse(moduleId, courseId);
        if (course) {
            const heroTitle = document.querySelector('.page-header h1');
            const heroDesc = document.querySelector('.page-header .lead');
            if(heroTitle) heroTitle.innerText = course.title;
            if(heroDesc) heroDesc.innerText = course.desc;

            window.cmsUi.renderLessons('lessonList', moduleId, courseId, course.lessons, false);
        }
    }
});

/* =============================
   GLOBAL ACTIONS
   ============================= */
window.toggleTheme = function() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
};

window.switchRole = function(role) {
    const users = window.cmsDb.getUsers();
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
        window.cmsDb.setCurrentUser(targetUser.id);
        location.reload();
    } else {
        alert('Kein User mit dieser Rolle gefunden.');
    }
};

/* =============================
   ADMIN FUNCTIONS
   ============================= */

// --- MODULES ---
window.addModule = function() {
    const title = document.getElementById('moduleTitle').value.trim();
    const desc = document.getElementById('moduleDesc').value.trim();
    if (!title || !desc) return;

    window.cmsDb.addModule(title, desc);
    refreshModules();
    clearInputs('moduleTitle', 'moduleDesc');
    updateAdminStats();
};

window.editModule = function(id) {
    const module = window.cmsDb.getModule(id);
    if (!module) return;
    const newTitle = prompt("Neuer Titel:", module.title);
    const newDesc = prompt("Neue Beschreibung:", module.desc);
    const newOrder = prompt("Neue Reihenfolge (Zahl):", module.order || 0);

    if (newTitle && newDesc) {
        window.cmsDb.updateModule(id, newTitle, newDesc, newOrder);
        refreshModules();
    }
};

window.deleteModule = function(id) {
    if (confirm('Modul wirklich löschen?')) {
        window.cmsDb.deleteModule(id);
        refreshModules();
        updateAdminStats();
    }
};

function refreshModules() {
    const modules = window.cmsDb.getModules();
    window.cmsUi.renderModules('moduleList', modules, true);
}

// --- COURSES ---
let currentModuleId = null;
let currentCourseId = null;

window.manageCourses = function(moduleId) {
    currentModuleId = moduleId;
    const module = window.cmsDb.getModule(moduleId);
    document.getElementById('selectedModuleTitle').innerText = `Kurse in: ${module.title}`;
    document.getElementById('courseManagement').style.display = 'block';
    document.getElementById('courseManagement').scrollIntoView({behavior: 'smooth'});
    refreshCourses(moduleId);
};

window.addCourse = function() {
    const title = document.getElementById('courseTitle').value.trim();
    const desc = document.getElementById('courseDesc').value.trim();
    const difficulty = document.getElementById('courseDifficulty').value;

    if (!title || !desc || !currentModuleId) return;

    window.cmsDb.addCourse(currentModuleId, title, desc, difficulty);
    refreshCourses(currentModuleId);
    clearInputs('courseTitle', 'courseDesc');
    updateAdminStats();
};

window.editCourse = function(moduleId, courseId) {
    const course = window.cmsDb.getCourse(moduleId, courseId);
    if (!course) return;
    const newTitle = prompt("Neuer Titel:", course.title);
    const newDesc = prompt("Neue Beschreibung:", course.desc);
    const newOrder = prompt("Neue Reihenfolge (Zahl):", course.order || 0);
    // Difficulty is harder to prompt, maybe add to prompt or separate action.
    // Keeping it simple with prompt for now, defaulting to existing.

    if (newTitle && newDesc) {
        window.cmsDb.updateCourse(moduleId, courseId, newTitle, newDesc, newOrder, course.difficulty);
        refreshCourses(moduleId);
    }
};

window.deleteCourse = function(moduleId, courseId) {
    if (confirm('Kurs wirklich löschen?')) {
        window.cmsDb.deleteCourse(moduleId, courseId);
        refreshCourses(moduleId);
        updateAdminStats();
    }
};

window.closeCourseMgmt = function() {
    document.getElementById('courseManagement').style.display = 'none';
};

function refreshCourses(moduleId) {
    const module = window.cmsDb.getModule(moduleId);
    window.cmsUi.renderCourses('courseList', moduleId, module.courses, true);
}

// --- LESSONS ---
window.manageLessons = function(moduleId, courseId) {
    currentModuleId = moduleId;
    currentCourseId = courseId;
    const course = window.cmsDb.getCourse(moduleId, courseId);
    document.getElementById('selectedCourseTitle').innerText = `Lektionen in: ${course.title}`;
    document.getElementById('lessonManagement').style.display = 'block';
    document.getElementById('lessonManagement').scrollIntoView({behavior: 'smooth'});
    refreshLessons(moduleId, courseId);
};

window.addLesson = function() {
    const title = document.getElementById('lessonTitle').value.trim();
    const content = document.getElementById('lessonContent').value.trim();
    const duration = document.getElementById('lessonDuration').value.trim() || '15 min';

    if (!title || !content || !currentModuleId || !currentCourseId) return;

    window.cmsDb.addLesson(currentModuleId, currentCourseId, title, content, duration);
    refreshLessons(currentModuleId, currentCourseId);
    clearInputs('lessonTitle', 'lessonContent', 'lessonDuration');
    updateAdminStats();
};

window.editLesson = function(moduleId, courseId, lessonId) {
    const course = window.cmsDb.getCourse(moduleId, courseId);
    const lesson = course?.lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    // Populate form for editing
    document.getElementById('lessonTitle').value = lesson.title;
    document.getElementById('lessonContent').value = lesson.content;
    document.getElementById('lessonDuration').value = lesson.duration || '15 min';

    const addBtn = document.querySelector('#lessonManagement button[onclick="addLesson()"]');
    if(addBtn) {
        const originalText = addBtn.innerText;
        addBtn.innerText = "💾 Update Speichern";
        addBtn.onclick = function() {
            const updatedTitle = document.getElementById('lessonTitle').value.trim();
            const updatedContent = document.getElementById('lessonContent').value.trim();
            const updatedDuration = document.getElementById('lessonDuration').value.trim();

            if(updatedTitle && updatedContent) {
                window.cmsDb.updateLesson(moduleId, courseId, lessonId, updatedTitle, updatedContent, lesson.order, updatedDuration);
                refreshLessons(moduleId, courseId);
                clearInputs('lessonTitle', 'lessonContent', 'lessonDuration');
                addBtn.innerText = originalText;
                addBtn.onclick = window.addLesson;
            }
        };
    }
};

window.deleteLesson = function(moduleId, courseId, lessonId) {
    if (confirm('Lektion wirklich löschen?')) {
        window.cmsDb.deleteLesson(moduleId, courseId, lessonId);
        refreshLessons(moduleId, courseId);
        updateAdminStats();
    }
};

window.closeLessonMgmt = function() {
    document.getElementById('lessonManagement').style.display = 'none';
};

function refreshLessons(moduleId, courseId) {
    const course = window.cmsDb.getCourse(moduleId, courseId);
    window.cmsUi.renderLessons('lessonList', moduleId, courseId, course.lessons, true);
}

// --- EXPORT / IMPORT ---
window.exportData = function() {
    const data = window.cmsDb.getExportData();
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cms_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

window.triggerImport = function() {
    document.getElementById('importFile').click();
};

window.importData = function(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const success = window.cmsDb.importData(e.target.result);
        if (success) {
            alert('Daten erfolgreich importiert!');
            location.reload();
        } else {
            alert('Fehler beim Importieren.');
        }
    };
    reader.readAsText(file);
};

// --- STATS ---
window.updateAdminStats = function() {
    const modules = window.cmsDb.getModules();
    let courseCount = 0;
    let lessonCount = 0;
    modules.forEach(m => {
        m.courses.forEach(c => {
            courseCount++;
            lessonCount += c.lessons.length;
        });
    });

    const statsContainer = document.getElementById('adminStats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="card text-center"><h3>${modules.length}</h3><p>Module</p></div>
            <div class="card text-center"><h3>${courseCount}</h3><p>Kurse</p></div>
            <div class="card text-center"><h3>${lessonCount}</h3><p>Lektionen</p></div>
        `;
    }
};

// --- UTILS ---
function clearInputs(...ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value = '';
    });
}

// --- QUIZ MANAGER ---
let quizModuleId, quizCourseId, quizLessonId;
let currentQuestions = [];

window.manageQuiz = function(moduleId, courseId, lessonId) {
    quizModuleId = moduleId;
    quizCourseId = courseId;
    quizLessonId = lessonId;

    const quiz = window.cmsDb.getQuiz(moduleId, courseId, lessonId);
    currentQuestions = quiz || [];

    document.getElementById('quizManagement').style.display = 'block';
    document.getElementById('quizManagement').scrollIntoView({behavior: 'smooth'});

    renderQuizEditor();
};

window.closeQuizMgmt = function() {
    document.getElementById('quizManagement').style.display = 'none';
};

function renderQuizEditor() {
    const container = document.getElementById('quizQuestionsList');
    container.innerHTML = '';

    if (currentQuestions.length === 0) {
        container.innerHTML = '<p>Noch keine Fragen vorhanden.</p>';
    } else {
        currentQuestions.forEach((q, idx) => {
            const div = document.createElement('div');
            div.className = 'card';
            div.style.background = 'rgba(255,255,255,0.05)';
            div.innerHTML = `
                <h4>Frage ${idx + 1}</h4>
                <p><strong>F:</strong> ${q.question}</p>
                <p><strong>A:</strong> ${q.options.join(', ')}</p>
                <p><strong>Korrekt:</strong> ${q.options[q.correct]}</p>
                <button onclick="deleteQuestion(${idx})" class="danger small" style="margin-top:10px">Löschen</button>
            `;
            container.appendChild(div);
        });
    }
}

window.addQuestion = function() {
    const qText = document.getElementById('qText').value.trim();
    const qOpt1 = document.getElementById('qOpt1').value.trim();
    const qOpt2 = document.getElementById('qOpt2').value.trim();
    const qOpt3 = document.getElementById('qOpt3').value.trim();
    const qCorrect = document.getElementById('qCorrect').value;

    if(!qText || !qOpt1 || !qOpt2) {
        alert("Bitte Frage und mindestens 2 Antworten eingeben.");
        return;
    }

    const options = [qOpt1, qOpt2];
    if(qOpt3) options.push(qOpt3);

    const correctIdx = parseInt(qCorrect);
    if(correctIdx >= options.length) {
         alert("Bitte wähle die korrekte Antwort aus den verfügbaren Optionen.");
         return;
    }

    currentQuestions.push({
        question: qText,
        options: options,
        correct: correctIdx
    });

    window.cmsDb.saveQuiz(quizModuleId, quizCourseId, quizLessonId, currentQuestions);

    document.getElementById('qText').value = '';
    document.getElementById('qOpt1').value = '';
    document.getElementById('qOpt2').value = '';
    document.getElementById('qOpt3').value = '';
    document.getElementById('qCorrect').value = '0';

    renderQuizEditor();
};

window.deleteQuestion = function(idx) {
    currentQuestions.splice(idx, 1);
    window.cmsDb.saveQuiz(quizModuleId, quizCourseId, quizLessonId, currentQuestions);
    renderQuizEditor();
};

// --- CERTIFICATE ---
window.generateCertificate = function(courseTitle) {
    const user = window.cmsDb.getCurrentUser();
    const name = user.name !== 'Gast' ? user.name : prompt("Bitte deinen Namen für das Zertifikat eingeben:");
    if (!name) return;

    const win = window.open('', '', 'width=800,height=600');
    win.document.write(`
        <html>
        <head>
            <title>Zertifikat</title>
            <style>
                body { font-family: sans-serif; text-align: center; padding: 50px; background: #f8fafc; }
                .cert { border: 10px solid #3b82f6; padding: 50px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                h1 { color: #1e293b; font-size: 48px; margin-bottom: 10px; }
                h2 { color: #3b82f6; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
                p { font-size: 20px; color: #64748b; line-height: 1.6; }
                .name { font-size: 42px; font-weight: bold; color: #0f172a; margin: 30px 0; border-bottom: 4px solid #3b82f6; display: inline-block; padding-bottom: 10px; }
                .footer { margin-top: 50px; font-size: 14px; color: #94a3b8; }
            </style>
        </head>
        <body>
            <div class="cert">
                <h2>Offizielle Bestätigung</h2>
                <h1>Zertifikat</h1>
                <p>Hiermit wird bestätigt, dass</p>
                <div class="name">${name}</div>
                <p>den Kurs <strong>${courseTitle}</strong> erfolgreich abgeschlossen hat.</p>
                <p>🎉 Herzlichen Glückwunsch!</p>
                <div class="footer">Ausgestellt am ${new Date().toLocaleDateString()} • Weiterbildungsplattform</div>
            </div>
            <script>window.print();</script>
        </body>
        </html>
    `);
    win.document.close();
};
