const DB_KEY = 'training_cms_data';
const USER_PROGRESS_KEY = 'training_user_progress';
const USER_FAVORITES_KEY = 'training_user_favorites';
const OLD_MODULE_KEY = 'training_modules';

const db = {
    // --- CORE DATA (Modules, Courses, Lessons) ---
    save(data) {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
    },
    load() {
        let data = localStorage.getItem(DB_KEY);
        if (!data) {
            // Try migration from old format
            const oldModules = localStorage.getItem(OLD_MODULE_KEY);
            if (oldModules) {
                const modules = JSON.parse(oldModules).map(m => ({
                    id: Math.random().toString(36).substr(2, 9),
                    title: m.title,
                    desc: m.desc,
                    courses: []
                }));
                data = { modules };
                this.save(data);
            } else {
                data = { modules: [] };
            }
        } else {
            data = JSON.parse(data);
        }
        return data;
    },
    getModules() {
        return this.load().modules;
    },
    getModule(id) {
        return this.load().modules.find(m => m.id === id);
    },
    addModule(title, desc) {
        const data = this.load();
        const newModule = {
            id: Date.now().toString(),
            title,
            desc,
            courses: []
        };
        data.modules.push(newModule);
        this.save(data);
        return newModule;
    },
    updateModule(id, title, desc) {
        const data = this.load();
        const module = data.modules.find(m => m.id === id);
        if (module) {
            module.title = title;
            module.desc = desc;
            this.save(data);
        }
    },
    deleteModule(id) {
        const data = this.load();
        data.modules = data.modules.filter(m => m.id !== id);
        this.save(data);
    },
    addCourse(moduleId, title, desc) {
        const data = this.load();
        const module = data.modules.find(m => m.id === moduleId);
        if (module) {
            const newCourse = {
                id: Date.now().toString(),
                title,
                desc,
                lessons: []
            };
            module.courses.push(newCourse);
            this.save(data);
            return newCourse;
        }
    },
    updateCourse(moduleId, courseId, title, desc) {
        const data = this.load();
        const module = data.modules.find(m => m.id === moduleId);
        const course = module?.courses.find(c => c.id === courseId);
        if (course) {
            course.title = title;
            course.desc = desc;
            this.save(data);
        }
    },
    getCourse(moduleId, courseId) {
        const module = this.getModule(moduleId);
        return module?.courses.find(c => c.id === courseId);
    },
    deleteCourse(moduleId, courseId) {
        const data = this.load();
        const module = data.modules.find(m => m.id === moduleId);
        if (module) {
            module.courses = module.courses.filter(c => c.id !== courseId);
            this.save(data);
        }
    },
    addLesson(moduleId, courseId, title, content) {
        const data = this.load();
        const module = data.modules.find(m => m.id === moduleId);
        const course = module?.courses.find(c => c.id === courseId);
        if (course) {
            const newLesson = {
                id: Date.now().toString(),
                title,
                content,
                quiz: null
            };
            course.lessons.push(newLesson);
            this.save(data);
            return newLesson;
        }
    },
    updateLesson(moduleId, courseId, lessonId, title, content) {
        const data = this.load();
        const module = data.modules.find(m => m.id === moduleId);
        const course = module?.courses.find(c => c.id === courseId);
        const lesson = course?.lessons.find(l => l.id === lessonId);
        if (lesson) {
            lesson.title = title;
            lesson.content = content;
            this.save(data);
        }
    },
    deleteLesson(moduleId, courseId, lessonId) {
        const data = this.load();
        const module = data.modules.find(m => m.id === moduleId);
        const course = module?.courses.find(c => c.id === courseId);
        if (course) {
            course.lessons = course.lessons.filter(l => l.id !== lessonId);
            this.save(data);
        }
    },

    // --- QUIZ MANAGEMENT ---
    saveQuiz(moduleId, courseId, lessonId, questions) {
        const data = this.load();
        const module = data.modules.find(m => m.id === moduleId);
        const course = module?.courses.find(c => c.id === courseId);
        const lesson = course?.lessons.find(l => l.id === lessonId);
        if (lesson) {
            lesson.quiz = questions;
            this.save(data);
        }
    },
    getQuiz(moduleId, courseId, lessonId) {
        const data = this.load();
        const module = data.modules.find(m => m.id === moduleId);
        const course = module?.courses.find(c => c.id === courseId);
        const lesson = course?.lessons.find(l => l.id === lessonId);
        return lesson?.quiz || null;
    },

    // --- USER PROGRESS ---
    loadProgress() {
        const data = localStorage.getItem(USER_PROGRESS_KEY);
        return data ? JSON.parse(data) : {};
    },
    saveProgress(data) {
        localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(data));
    },
    markLessonComplete(lessonId, score = null) {
        const data = this.loadProgress();
        data[lessonId] = {
            completed: true,
            score: score,
            date: new Date().toISOString()
        };
        this.saveProgress(data);
    },
    getLessonProgress(lessonId) {
        const data = this.loadProgress();
        return data[lessonId];
    },
    isLessonComplete(lessonId) {
        const data = this.loadProgress();
        return !!data[lessonId]?.completed;
    },

    // --- FAVORITES ---
    loadFavorites() {
        const data = localStorage.getItem(USER_FAVORITES_KEY);
        return data ? JSON.parse(data) : [];
    },
    toggleFavorite(id, type, title) {
        let favorites = this.loadFavorites();
        const index = favorites.findIndex(f => f.id === id);
        if (index >= 0) {
            favorites.splice(index, 1);
        } else {
            favorites.push({ id, type, title });
        }
        localStorage.setItem(USER_FAVORITES_KEY, JSON.stringify(favorites));
        return index === -1; // true if added
    },
    isFavorite(id) {
        const favorites = this.loadFavorites();
        return favorites.some(f => f.id === id);
    },

    // --- IMPORT / EXPORT ---
    getExportData() {
        return JSON.stringify(this.load(), null, 2);
    },
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data && Array.isArray(data.modules)) {
                this.save(data);
                return true;
            }
        } catch (e) {
            console.error("Import error", e);
        }
        return false;
    }
};

window.cmsDb = db;
