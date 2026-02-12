const ui = {
    renderModules(containerId, modules, isAdmin = false) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        if (modules.length === 0) {
            container.innerHTML = '<p>Keine Module vorhanden.</p>';
            return;
        }

        modules.forEach(m => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <span>📘</span>
                <h3>${m.title}</h3>
                <p>${m.desc}</p>
                <div style="margin-top:15px">
                    ${isAdmin ?
                        `<button onclick="manageCourses('${m.id}')">Kurse verwalten</button>
                         <button onclick="deleteModule('${m.id}')" style="background:#ef4444">Löschen</button>` :
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
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <span>🎓</span>
                <h3>${c.title}</h3>
                <p>${c.desc}</p>
                <div style="margin-top:15px">
                    ${isAdmin ?
                        `<button onclick="manageLessons('${moduleId}', '${c.id}')">Lektionen verwalten</button>
                         <button onclick="deleteCourse('${moduleId}', '${c.id}')" style="background:#ef4444">Löschen</button>` :
                        `<button onclick="location.href='lesson.html?moduleId=${moduleId}&courseId=${c.id}'">Kurs starten</button>`
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
            const item = document.createElement('li');
            item.style.padding = '10px';
            item.style.background = 'var(--panel)';
            item.style.marginBottom = '10px';
            item.style.borderRadius = '8px';
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';

            item.innerHTML = `
                <span>${l.title}</span>
                <div>
                    ${isAdmin ?
                        `<button onclick="deleteLesson('${moduleId}', '${courseId}', '${l.id}')" style="background:#ef4444; margin:0">Löschen</button>` :
                        `<button onclick="viewLesson('${moduleId}', '${courseId}', '${l.id}')" style="margin:0">Ansehen</button>`
                    }
                </div>
            `;
            list.appendChild(item);
        });
        container.appendChild(list);
    }
};

window.cmsUi = ui;
