const DB_KEY = 'training_cms_data';
const OLD_MODULE_KEY = 'training_modules';

const db = {
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
                content
            };
            course.lessons.push(newLesson);
            this.save(data);
            return newLesson;
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
    }
};

window.cmsDb = db;
