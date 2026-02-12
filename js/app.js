document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    // Theme Check
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Initialisiere Dashboard (User)
    if (document.getElementById('moduleList') && !document.querySelector('h1').innerText.includes('Admin')) {
        const modules = window.cmsDb.getModules();
        window.cmsUi.renderModules('moduleList', modules, false);
        updateRecentActivity();
    }

    // Initialisiere Adminbereich
    if (document.querySelector('h1')?.innerText.includes('Adminbereich')) {
        const modules = window.cmsDb.getModules();
        window.cmsUi.renderModules('moduleList', modules, true);
        updateAdminStats();
    }

    // Initialisiere Kurs-Ansicht
    if (path.includes('course.html')) {
        const moduleId = params.get('moduleId');
        const module = window.cmsDb.getModule(moduleId);
        if (module) {
            document.getElementById('moduleTitle').innerText = module.title;
            window.cmsUi.renderCourses('courseList', moduleId, module.courses, false);
        }
    }

    // Initialisiere Lektions-Liste
    if (path.includes('lesson.html')) {
        const moduleId = params.get('moduleId');
        const courseId = params.get('courseId');
        const course = window.cmsDb.getCourse(moduleId, courseId);
        if (course) {
            document.getElementById('courseTitle').innerText = course.title;
            window.cmsUi.renderLessons('lessonList', moduleId, courseId, course.lessons, false);
        }
    }
});

/* =============================
   HELPER / SHARED
   ============================= */
window.toggleTheme = function() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
};

/* =============================
   ADMIN FUNKTIONEN
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
    if (newTitle && newDesc) {
        window.cmsDb.updateModule(id, newTitle, newDesc);
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
    // Scroll to section
    document.getElementById('courseManagement').scrollIntoView({behavior: 'smooth'});
    refreshCourses(moduleId);
};

window.addCourse = function() {
    const title = document.getElementById('courseTitle').value.trim();
    const desc = document.getElementById('courseDesc').value.trim();
    if (!title || !desc || !currentModuleId) return;

    window.cmsDb.addCourse(currentModuleId, title, desc);
    refreshCourses(currentModuleId);
    clearInputs('courseTitle', 'courseDesc');
    updateAdminStats();
};

window.editCourse = function(moduleId, courseId) {
    const course = window.cmsDb.getCourse(moduleId, courseId);
    if (!course) return;
    const newTitle = prompt("Neuer Titel:", course.title);
    const newDesc = prompt("Neue Beschreibung:", course.desc);
    if (newTitle && newDesc) {
        window.cmsDb.updateCourse(moduleId, courseId, newTitle, newDesc);
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
    if (!title || !content || !currentModuleId || !currentCourseId) return;

    window.cmsDb.addLesson(currentModuleId, currentCourseId, title, content);
    refreshLessons(currentModuleId, currentCourseId);
    clearInputs('lessonTitle', 'lessonContent');
    updateAdminStats();
};

window.editLesson = function(moduleId, courseId, lessonId) {
    const course = window.cmsDb.getCourse(moduleId, courseId);
    const lesson = course?.lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    // For simplicity, we just fill the input fields and delete the old one on save,
    // OR we could make a proper edit mode.
    // Given the constraints, let's use prompt for title, and maybe load content into textarea?
    // Better: Populate the add form and change button to "Update".
    // Even simpler for "simple admin": prompts for now, or just filling the inputs.

    // Let's try filling inputs for better UX
    document.getElementById('lessonTitle').value = lesson.title;
    document.getElementById('lessonContent').value = lesson.content;

    // Change Add button to Update button temporary?
    // Or just delete and re-add logic? No, we lose ID.
    // Let's implement a direct update via Prompt for now to be consistent,
    // but for Content (HTML) prompt is bad.

    // NEW APPROACH: We put the data into the inputs, and change the onclick of the button.
    const addBtn = document.querySelector('#lessonManagement button[onclick="addLesson()"]');
    addBtn.innerText = "💾 Speichern";
    addBtn.onclick = function() {
        const newTitle = document.getElementById('lessonTitle').value.trim();
        const newContent = document.getElementById('lessonContent').value.trim();
        if(newTitle && newContent) {
            window.cmsDb.updateLesson(moduleId, courseId, lessonId, newTitle, newContent);
            refreshLessons(moduleId, courseId);
            clearInputs('lessonTitle', 'lessonContent');
            // Reset button
            addBtn.innerText = "Lektion hinzufügen";
            addBtn.onclick = window.addLesson;
        }
    };
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
            <div class="card" style="text-align:center"><h3>${modules.length}</h3><p>Module</p></div>
            <div class="card" style="text-align:center"><h3>${courseCount}</h3><p>Kurse</p></div>
            <div class="card" style="text-align:center"><h3>${lessonCount}</h3><p>Lektionen</p></div>
        `;
    }
};

// --- UTILS ---
function clearInputs(...ids) {
    ids.forEach(id => document.getElementById(id).value = '');
}

// --- USER FEATURES ---
window.updateRecentActivity = function() {
    // Placeholder: In a real app we'd track last visited.
    // For now, let's just leave this empty or show something simple if we had the data.
};

window.generateCertificate = function(courseTitle) {
    const name = prompt("Bitte deinen Namen für das Zertifikat eingeben:");
    if (!name) return;

    const win = window.open('', '', 'width=800,height=600');
    win.document.write(`
        <html>
        <head>
            <title>Zertifikat</title>
            <style>
                body { font-family: sans-serif; text-align: center; padding: 50px; background: #f8fafc; }
                .cert { border: 10px solid #3b82f6; padding: 50px; background: white; }
                h1 { color: #1e293b; font-size: 48px; }
                p { font-size: 24px; color: #64748b; }
                .name { font-size: 32px; font-weight: bold; color: #0f172a; margin: 20px 0; border-bottom: 2px solid #3b82f6; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="cert">
                <h1>Zertifikat</h1>
                <p>Hiermit wird bestätigt, dass</p>
                <div class="name">${name}</div>
                <p>den Kurs <strong>${courseTitle}</strong> erfolgreich abgeschlossen hat.</p>
                <p>🎉 Herzlichen Glückwunsch!</p>
                <small>${new Date().toLocaleDateString()}</small>
            </div>
            <script>window.print();</script>
        </body>
        </html>
    `);
    win.document.close();
};

/* =============================
   QUIZ MANAGER
   ============================= */
let quizModuleId, quizCourseId, quizLessonId;
let currentQuestions = [];

window.manageQuiz = function(moduleId, courseId, lessonId) {
    quizModuleId = moduleId;
    quizCourseId = courseId;
    quizLessonId = lessonId;

    const quiz = window.cmsDb.getQuiz(moduleId, courseId, lessonId);
    currentQuestions = quiz || []; // Load existing or empty

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
                <button onclick="deleteQuestion(${idx})" class="danger" style="padding:5px 10px; font-size:12px">Löschen</button>
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

    // Save immediately
    window.cmsDb.saveQuiz(quizModuleId, quizCourseId, quizLessonId, currentQuestions);

    // Clear inputs
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
