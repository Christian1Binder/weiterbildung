document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    // Initialisiere Dashboard
    if (document.getElementById('moduleList') && !document.querySelector('h1').innerText.includes('Admin')) {
        const modules = window.cmsDb.getModules();
        window.cmsUi.renderModules('moduleList', modules, false);
    }

    // Initialisiere Adminbereich
    if (document.querySelector('h1')?.innerText.includes('Adminbereich')) {
        const modules = window.cmsDb.getModules();
        window.cmsUi.renderModules('moduleList', modules, true);
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

    // Initialisiere Lektions-Ansicht
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
   ADMIN FUNKTIONEN
   ============================= */
window.addModule = function() {
    const title = document.getElementById('moduleTitle').value.trim();
    const desc = document.getElementById('moduleDesc').value.trim();
    if (!title || !desc) return;

    window.cmsDb.addModule(title, desc);
    const modules = window.cmsDb.getModules();
    window.cmsUi.renderModules('moduleList', modules, true);

    document.getElementById('moduleTitle').value = '';
    document.getElementById('moduleDesc').value = '';
};

window.deleteModule = function(id) {
    if (confirm('Modul wirklich löschen?')) {
        window.cmsDb.deleteModule(id);
        const modules = window.cmsDb.getModules();
        window.cmsUi.renderModules('moduleList', modules, true);
    }
};

let currentModuleId = null;
let currentCourseId = null;

window.manageCourses = function(moduleId) {
    currentModuleId = moduleId;
    const module = window.cmsDb.getModule(moduleId);
    document.getElementById('selectedModuleTitle').innerText = `Kurse in: ${module.title}`;
    document.getElementById('courseManagement').style.display = 'block';
    window.cmsUi.renderCourses('courseList', moduleId, module.courses, true);
};

window.closeCourseMgmt = function() {
    document.getElementById('courseManagement').style.display = 'none';
};

window.addCourse = function() {
    const title = document.getElementById('courseTitle').value.trim();
    const desc = document.getElementById('courseDesc').value.trim();
    if (!title || !desc || !currentModuleId) return;

    window.cmsDb.addCourse(currentModuleId, title, desc);
    const module = window.cmsDb.getModule(currentModuleId);
    window.cmsUi.renderCourses('courseList', currentModuleId, module.courses, true);

    document.getElementById('courseTitle').value = '';
    document.getElementById('courseDesc').value = '';
};

window.deleteCourse = function(moduleId, courseId) {
    if (confirm('Kurs wirklich löschen?')) {
        window.cmsDb.deleteCourse(moduleId, courseId);
        const module = window.cmsDb.getModule(moduleId);
        window.cmsUi.renderCourses('courseList', moduleId, module.courses, true);
    }
};

window.manageLessons = function(moduleId, courseId) {
    currentModuleId = moduleId;
    currentCourseId = courseId;
    const course = window.cmsDb.getCourse(moduleId, courseId);
    document.getElementById('selectedCourseTitle').innerText = `Lektionen in: ${course.title}`;
    document.getElementById('lessonManagement').style.display = 'block';
    window.cmsUi.renderLessons('lessonList', moduleId, courseId, course.lessons, true);
};

window.closeLessonMgmt = function() {
    document.getElementById('lessonManagement').style.display = 'none';
};

window.addLesson = function() {
    const title = document.getElementById('lessonTitle').value.trim();
    const content = document.getElementById('lessonContent').value.trim();
    if (!title || !content || !currentModuleId || !currentCourseId) return;

    window.cmsDb.addLesson(currentModuleId, currentCourseId, title, content);
    const course = window.cmsDb.getCourse(currentModuleId, currentCourseId);
    window.cmsUi.renderLessons('lessonList', currentModuleId, currentCourseId, course.lessons, true);

    document.getElementById('lessonTitle').value = '';
    document.getElementById('lessonContent').value = '';
};

window.deleteLesson = function(moduleId, courseId, lessonId) {
    if (confirm('Lektion wirklich löschen?')) {
        window.cmsDb.deleteLesson(moduleId, courseId, lessonId);
        const course = window.cmsDb.getCourse(moduleId, courseId);
        window.cmsUi.renderLessons('lessonList', moduleId, courseId, course.lessons, true);
    }
};

window.viewLesson = function(moduleId, courseId, lessonId) {
    const course = window.cmsDb.getCourse(moduleId, courseId);
    const lesson = course?.lessons.find(l => l.id === lessonId);
    if (lesson) {
        alert(`Lektion: ${lesson.title}\n\nInhalt: ${lesson.content}`);
    }
};
