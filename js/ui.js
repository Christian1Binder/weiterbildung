const ui = {
    calculateModuleProgress(module) {
        let totalLessons = 0;
        let completedLessons = 0;
        if (!module.courses) return 0;
        module.courses.forEach(c => {
            if (!c.lessons) return;
            c.lessons.forEach(l => {
                totalLessons++;
                if (window.cmsDb.isLessonComplete(l.id)) completedLessons++;
            });
        });
        return totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
    },

    calculateCourseProgress(course) {
        if (!course.lessons) return 0;
        let totalLessons = course.lessons.length;
        let completedLessons = 0;
        course.lessons.forEach(l => {
            if (window.cmsDb.isLessonComplete(l.id)) completedLessons++;
        });
        return totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
    },

    renderModules(containerId, modules, isAdmin = false) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        if (modules.length === 0) {
            container.innerHTML = '<p>Keine Module vorhanden.</p>';
            return;
        }

        modules.forEach(m => {
            const progress = this.calculateModuleProgress(m);
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <span>📘</span>
                <h3>${m.title}</h3>
                <p>${m.desc}</p>
                ${!isAdmin ? `
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <small style="color:var(--muted)">${progress}% Abgeschlossen</small>
                ` : ''}
                <div style="margin-top:15px">
                    ${isAdmin ?
                        `<button onclick="manageCourses('${m.id}')">Kurse verwalten</button>
                         <button onclick="editModule('${m.id}')" class="secondary">Bearbeiten</button>
                         <button onclick="deleteModule('${m.id}')" class="danger">Löschen</button>` :
                        `<button onclick="location.href='course.html?moduleId=${m.id}'">Öffnen</button>`
                    }
                </div>
            `;
            container.appendChild(card);
        });
    },

    renderCourses(containerId, moduleId, courses, isAdmin = false) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        if (courses.length === 0) {
            container.innerHTML = '<p>Keine Kurse in diesem Modul vorhanden.</p>';
            return;
        }

        courses.forEach(c => {
            const progress = this.calculateCourseProgress(c);
            const isFav = window.cmsDb.isFavorite(c.id);
            const card = document.createElement('div');
            card.className = 'card';

            let favButton = '';
            if (!isAdmin) {
                favButton = `<button class="favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite('${c.id}', 'course', '${c.title}', this)">
                                ${isFav ? '❤️' : '🤍'}
                             </button>`;
            }

            card.innerHTML = `
                <div class="flex-between">
                    <span>🎓</span>
                    ${favButton}
                </div>
                <h3>${c.title}</h3>
                <p>${c.desc}</p>
                ${!isAdmin ? `
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <small style="color:var(--muted)">${progress}% Abgeschlossen</small>
                ` : ''}
                <div style="margin-top:15px">
                    ${isAdmin ?
                        `<button onclick="manageLessons('${moduleId}', '${c.id}')">Lektionen verwalten</button>
                         <button onclick="editCourse('${moduleId}', '${c.id}')" class="secondary">Bearbeiten</button>
                         <button onclick="deleteCourse('${moduleId}', '${c.id}')" class="danger">Löschen</button>` :
                        `<button onclick="location.href='lesson.html?moduleId=${moduleId}&courseId=${c.id}'">Kurs starten</button>
                         ${progress === 100 ? `<button onclick="generateCertificate('${c.title}')" class="success" style="margin-left:5px">Zertifikat 🏆</button>` : ''}`
                    }
                </div>
            `;
            container.appendChild(card);
        });
    },

    renderLessons(containerId, moduleId, courseId, lessons, isAdmin = false) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        if (lessons.length === 0) {
            container.innerHTML = '<p>Keine Lektionen in diesem Kurs vorhanden.</p>';
            return;
        }

        const list = document.createElement('ul');
        list.style.listStyle = 'none';
        list.style.padding = '0';

        lessons.forEach(l => {
            const isComplete = window.cmsDb.isLessonComplete(l.id);
            const item = document.createElement('li');
            item.style.padding = '10px';
            item.style.background = 'var(--panel)';
            item.style.marginBottom = '10px';
            item.style.borderRadius = '8px';
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.borderLeft = isComplete ? '4px solid var(--success)' : '4px solid transparent';

            item.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px">
                    ${isComplete ? '<span style="color:var(--success)">✅</span>' : '<span>📄</span>'}
                    <span>${l.title}</span>
                </div>
                <div>
                    ${isAdmin ?
                        `<button onclick="manageQuiz('${moduleId}', '${courseId}', '${l.id}')" class="secondary" style="margin:0 5px">Quiz</button>
                         <button onclick="editLesson('${moduleId}', '${courseId}', '${l.id}')" class="secondary" style="margin:0 5px">Bearbeiten</button>
                         <button onclick="deleteLesson('${moduleId}', '${courseId}', '${l.id}')" class="danger" style="margin:0">Löschen</button>` :
                        `<button onclick="location.href='lesson_view.html?moduleId=${moduleId}&courseId=${courseId}&lessonId=${l.id}'" style="margin:0">
                            ${isComplete ? 'Nochmal lesen' : 'Starten'}
                         </button>`
                    }
                </div>
            `;
            list.appendChild(item);
        });
        container.appendChild(list);
    }
};

window.cmsUi = ui;

// Add global toggle function for favorites
window.toggleFavorite = function(id, type, title, btnElement) {
    window.cmsDb.toggleFavorite(id, type, title);
    const isFav = window.cmsDb.isFavorite(id);
    btnElement.innerHTML = isFav ? '❤️' : '🤍';
    btnElement.classList.toggle('active');
};
