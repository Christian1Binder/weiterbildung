const ui = {
    renderNavigation() {
        // Create Navbar
        const nav = document.createElement('nav');
        nav.className = 'navbar';

        const user = window.cmsDb.getCurrentUser();
        const isAdmin = window.cmsDb.hasRole('admin');
        const isEditor = window.cmsDb.hasRole('editor'); // Editors might see admin link too? Or distinct?
        // Let's say Admin link is for Editor+
        const showAdmin = isAdmin || isEditor;

        nav.innerHTML = `
            <a href="index.html" class="nav-brand">
                🚀 Training <span class="role-badge">${user.role}</span>
            </a>
            <div class="nav-links">
                <a href="index.html" class="nav-link">🏠 Start</a>
                ${showAdmin ? `<a href="admin.html" class="nav-link">🔧 Admin</a>` : ''}
                <select id="roleSwitcher" onchange="window.switchRole(this.value)" style="padding:5px; margin:0; width:auto; font-size:0.8rem; background:var(--bg); color:var(--text); border-color:var(--border)">
                    <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                    <option value="editor" ${user.role === 'editor' ? 'selected' : ''}>Editor</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
                <button class="theme-toggle small" onclick="toggleTheme()" style="margin:0">🌓</button>
            </div>
        `;

        // Inject at top of body
        document.body.prepend(nav);
    },

    getIcon(title) {
        if (title.includes('Arbeitssicherheit')) return '⛑️';
        if (title.includes('IT')) return '💻';
        if (title.includes('Kommunikation')) return '💬';
        if (title.includes('Qualität')) return '✅';
        if (title.includes('Einführung')) return '👋';
        return '📘';
    },

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
            container.innerHTML = '<p style="text-align:center; color:var(--muted)">Keine Module vorhanden.</p>';
            return;
        }

        modules.forEach(m => {
            const progress = this.calculateModuleProgress(m);
            const icon = this.getIcon(m.title);
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-icon">${icon}</div>
                <h3>${m.title}</h3>
                <p>${m.desc}</p>

                ${!isAdmin ? `
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div class="flex-between" style="margin-top:5px">
                        <small style="color:var(--muted)">Fortschritt</small>
                        <small style="color:var(--text)">${progress}%</small>
                    </div>
                ` : ''}

                <div style="margin-top:auto; padding-top:20px">
                    ${isAdmin ?
                        `<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
                            <button onclick="editModule('${m.id}')" class="secondary small">✏️ Edit</button>
                            <button onclick="manageCourses('${m.id}')" class="primary small">Kurse</button>
                         </div>
                         <button onclick="deleteModule('${m.id}')" class="danger small full-width" style="margin-top:10px">Löschen</button>` :
                        `<button onclick="location.href='course.html?moduleId=${m.id}'" class="full-width">Modul öffnen</button>`
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
            container.innerHTML = '<p style="text-align:center; color:var(--muted)">Keine Kurse vorhanden.</p>';
            return;
        }

        courses.forEach(c => {
            const progress = this.calculateCourseProgress(c);
            const isFav = window.cmsDb.isFavorite(c.id);
            const difficulty = c.difficulty || 'Mittel';

            // Difficulty Color Code
            let diffColor = 'var(--muted)';
            if(difficulty === 'Einfach') diffColor = 'var(--success)';
            if(difficulty === 'Mittel') diffColor = 'var(--warning)';
            if(difficulty === 'Fortgeschritten') diffColor = 'var(--danger)';

            const card = document.createElement('div');
            card.className = 'card';

            let favButton = '';
            if (!isAdmin) {
                favButton = `<button class="favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite('${c.id}', 'course', '${c.title}', this)" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:${isFav?'var(--danger)':'var(--muted)'}; padding:0; margin:0">
                                ${isFav ? '❤️' : '🤍'}
                             </button>`;
            }

            card.innerHTML = `
                <div class="flex-between" style="align-items:flex-start">
                    <div class="card-icon">🎓</div>
                    ${favButton}
                </div>
                <h3>${c.title}</h3>
                <p>${c.desc}</p>
                <div style="margin-top:10px; margin-bottom:10px">
                    <span style="font-size:0.8rem; padding:2px 6px; border-radius:4px; border:1px solid ${diffColor}; color:${diffColor}">${difficulty}</span>
                </div>

                ${!isAdmin ? `
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div class="flex-between" style="margin-top:5px">
                        <small style="color:var(--muted)">${progress}% Abgeschlossen</small>
                    </div>
                ` : ''}

                <div style="margin-top:auto; padding-top:20px">
                    ${isAdmin ?
                        `<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
                            <button onclick="editCourse('${moduleId}', '${c.id}')" class="secondary small">✏️ Edit</button>
                            <button onclick="manageLessons('${moduleId}', '${c.id}')" class="primary small">Lektionen</button>
                         </div>
                         <button onclick="deleteCourse('${moduleId}', '${c.id}')" class="danger small full-width" style="margin-top:10px">Löschen</button>` :
                        `<button onclick="location.href='lesson.html?moduleId=${moduleId}&courseId=${c.id}'" class="full-width">Kurs starten</button>
                         ${progress === 100 ? `<button onclick="generateCertificate('${c.title}')" class="success small full-width" style="margin-top:10px">🏆 Zertifikat</button>` : ''}`
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
            container.innerHTML = '<p style="text-align:center; color:var(--muted)">Keine Lektionen vorhanden.</p>';
            return;
        }

        const list = document.createElement('div');
        list.style.display = 'flex';
        list.style.flexDirection = 'column';
        list.style.gap = '10px';

        lessons.forEach(l => {
            const isComplete = window.cmsDb.isLessonComplete(l.id);
            const duration = l.duration || '15 min';

            const item = document.createElement('div');
            item.className = 'card';
            item.style.padding = '15px';
            item.style.marginBottom = '0';
            item.style.flexDirection = 'row';
            item.style.alignItems = 'center';
            item.style.justifyContent = 'space-between';
            item.style.borderLeft = isComplete ? '4px solid var(--success)' : '4px solid transparent';

            item.innerHTML = `
                <div style="display:flex; align-items:center; gap:15px">
                    <span style="font-size:1.5rem">${isComplete ? '✅' : '📄'}</span>
                    <div>
                        <h4 style="margin:0">${l.title}</h4>
                        <small style="color:var(--muted)">⏱️ ${duration}</small>
                        ${l.quiz ? '<small style="color:var(--accent); margin-left:10px">📝 Quiz verfügbar</small>' : ''}
                    </div>
                </div>
                <div style="display:flex; gap:10px">
                    ${isAdmin ?
                        `<button onclick="manageQuiz('${moduleId}', '${courseId}', '${l.id}')" class="secondary small">📝 Quiz</button>
                         <button onclick="editLesson('${moduleId}', '${courseId}', '${l.id}')" class="secondary small">✏️</button>
                         <button onclick="deleteLesson('${moduleId}', '${courseId}', '${l.id}')" class="danger small">🗑️</button>` :
                        `<button onclick="location.href='lesson_view.html?moduleId=${moduleId}&courseId=${courseId}&lessonId=${l.id}'" class="small">
                            ${isComplete ? 'Wiederholen' : 'Starten'}
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
    btnElement.style.color = isFav ? 'var(--danger)' : 'var(--muted)';
    btnElement.classList.toggle('active');
    if(event) event.stopPropagation();
};
