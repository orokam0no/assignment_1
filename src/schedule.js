
'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const scheduleData = [
        { id: 1, day: 'Monday', time: '09:00', type: 'Group Boxing', trainer: 'Alex', capacity: 12, booked: 7 },
        { id: 2, day: 'Monday', time: '18:00', type: 'Personal Training', trainer: 'Daniel', capacity: 1, booked: 0 },
        { id: 3, day: 'Tuesday', time: '10:00', type: 'Group Boxing', trainer: 'Michael', capacity: 12, booked: 12 },
        { id: 4, day: 'Tuesday', time: '19:00', type: 'Technique Training', trainer: 'Alex', capacity: 10, booked: 4 },
        { id: 5, day: 'Wednesday', time: '09:00', type: 'Group Boxing', trainer: 'Daniel', capacity: 12, booked: 6 },
        { id: 6, day: 'Wednesday', time: '18:00', type: 'Sparring', trainer: 'Michael', capacity: 8, booked: 5 },
        { id: 7, day: 'Thursday', time: '10:00', type: 'Technique Training', trainer: 'Alex', capacity: 10, booked: 3 },
        { id: 8, day: 'Thursday', time: '19:00', type: 'Group Boxing', trainer: 'Daniel', capacity: 12, booked: 9 },
        { id: 9, day: 'Friday', time: '09:00', type: 'Personal Training', trainer: 'Michael', capacity: 1, booked: 1 },
        { id: 10, day: 'Friday', time: '18:00', type: 'Group Boxing', trainer: 'Alex', capacity: 12, booked: 8 },
        { id: 11, day: 'Saturday', time: '11:00', type: 'Sparring', trainer: 'Daniel', capacity: 8, booked: 2 },
        { id: 12, day: 'Sunday', time: '12:00', type: 'Group Boxing', trainer: 'Michael', capacity: 12, booked: 5 }
    ];

    const days = [
        'All', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];

    const anchor = document.querySelector('main') ||
        document.querySelector('footer');

    if (!anchor) return;

    const section = document.createElement('section');
    section.id = 'training-schedule';
    section.className = 'container py-5';

    section.innerHTML = `
        <div class="text-center mb-4">
            <h2 class="fw-bold">Weekly Training Schedule</h2>
            <p class="text-secondary">
                Find the perfect boxing session for you.
            </p>
        </div>
        <div id="schedule-filters"
             class="d-flex flex-wrap justify-content-center gap-2 mb-4">
        </div>
        <div id="schedule-summary"
             class="text-center mb-4">
        </div>
        <div id="schedule-list" class="row g-4"></div>
    `;

    anchor.insertAdjacentElement('afterend', section);

    const filters = section.querySelector('#schedule-filters');
    const list = section.querySelector('#schedule-list');
    const summary = section.querySelector('#schedule-summary');

    let selectedDay = 'All';

    function getAvailablePlaces(session) {
        return Math.max(0, session.capacity - session.booked);
    }

    function isAvailable(session) {
        return getAvailablePlaces(session) > 0;
    }

    function filterSessions(day) {
        if (day === 'All') {
            return scheduleData;
        }

        return scheduleData.filter(function (session) {
            return session.day === day;
        });
    }

    function countAvailableSessions(sessions) {
        return sessions.filter(isAvailable).length;
    }

    function createCard(session) {
        const column = document.createElement('div');
        column.className = 'col-md-6 col-lg-4';

        const availablePlaces = getAvailablePlaces(session);
        const available = isAvailable(session);

        column.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold"></h5>
                    <p class="mb-2 session-day"></p>
                    <p class="mb-2 session-time"></p>
                    <p class="mb-2 session-trainer"></p>
                    <p class="mb-3 session-places"></p>
                    <div class="mt-auto">
                        <span class="badge mb-3"></span>
                        <button type="button"
                                class="btn w-100 schedule-book">
                        </button>
                    </div>
                </div>
            </div>
        `;

        column.querySelector('.card-title').textContent = session.type;
        column.querySelector('.session-day').textContent = 'Day: ' + session.day;
        column.querySelector('.session-time').textContent = 'Time: ' + session.time;
        column.querySelector('.session-trainer').textContent = 'Trainer: ' + session.trainer;
        column.querySelector('.session-places').textContent =
            'Available places: ' + availablePlaces;

        const badge = column.querySelector('.badge');
        badge.textContent = available ? 'Available' : 'Full';
        badge.className = available
            ? 'badge bg-success mb-3'
            : 'badge bg-danger mb-3';

        const button = column.querySelector('.schedule-book');
        button.textContent = available ? 'Book Now' : 'Fully Booked';
        button.className = available
            ? 'btn btn-warning w-100 schedule-book'
            : 'btn btn-secondary w-100 schedule-book';
        button.disabled = !available;
        button.dataset.sessionId = session.id;

        return column;
    }

    function renderSchedule() {
        const sessions = filterSessions(selectedDay);

        list.replaceChildren();

        for (const session of sessions) {
            list.appendChild(createCard(session));
        }

        const availableCount = countAvailableSessions(sessions);

        summary.textContent =
            'Total sessions: ' + sessions.length +
            ' | Available sessions: ' + availableCount;

        if (sessions.length === 0) {
            const message = document.createElement('p');
            message.className = 'text-center text-secondary';
            message.textContent = 'No training sessions found.';
            list.appendChild(message);
        }
    }

    function renderFilters() {
        filters.replaceChildren();

        for (const day of days) {
            const button = document.createElement('button');

            button.type = 'button';
            button.textContent = day;
            button.dataset.day = day;
            button.className = day === selectedDay
                ? 'btn btn-warning'
                : 'btn btn-outline-secondary';

            filters.appendChild(button);
        }
    }

    filters.addEventListener('click', function (event) {
        const button = event.target.closest('button[data-day]');

        if (!button || !filters.contains(button)) return;

        selectedDay = button.dataset.day;

        renderFilters();
        renderSchedule();
    });

    list.addEventListener('click', function (event) {
        const button = event.target.closest('.schedule-book');

        if (!button || !list.contains(button)) return;

        const sessionId = Number(button.dataset.sessionId);

        const session = scheduleData.find(function (item) {
            return item.id === sessionId;
        });

        if (!session || !isAvailable(session)) return;

        const params = new URLSearchParams({
            session: session.type,
            trainer: session.trainer,
            day: session.day,
            time: session.time
        });

        window.location.href = 'booking.html?' + params.toString();
    });

    renderFilters();
    renderSchedule();
});
