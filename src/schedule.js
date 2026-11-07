'use strict';

document.addEventListener('DOMContentLoaded', function () {

    // Training schedule data
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
        'All',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];

    // Find footer and main content
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');

    if (!footer && !main) {
        return;
    }

    // Create schedule section
    const section = document.createElement('section');

    section.id = 'training-schedule';
    section.className = 'bg-black text-white py-5';

    section.innerHTML = `
        <div class="container py-4">

            <div class="text-center mb-5">
                <h2 class="fw-bold text-white mb-3">
                    Weekly Training Schedule
                </h2>

                <p class="text-white-50">
                    Choose your training day and find the perfect boxing session.
                </p>
            </div>

            <div
                id="schedule-filters"
                class="d-flex flex-wrap justify-content-center gap-2 mb-4">
            </div>

            <div
                id="schedule-summary"
                class="text-center text-white mb-4 fw-semibold">
            </div>

            <div
                id="schedule-list"
                class="row g-4">
            </div>

        </div>
    `;

    // Place schedule before footer
    if (footer) {
        footer.insertAdjacentElement('beforebegin', section);
    } else {
        main.insertAdjacentElement('afterend', section);
    }

    const filters = section.querySelector('#schedule-filters');
    const list = section.querySelector('#schedule-list');
    const summary = section.querySelector('#schedule-summary');

    let selectedDay = 'All';

    // Calculate available places
    function getAvailablePlaces(session) {
        return Math.max(0, session.capacity - session.booked);
    }

    // Check availability
    function isAvailable(session) {
        return getAvailablePlaces(session) > 0;
    }

    // Filter sessions by day
    function filterSessions(day) {

        if (day === 'All') {
            return scheduleData;
        }

        return scheduleData.filter(function (session) {
            return session.day === day;
        });
    }

    // Count available sessions
    function countAvailableSessions(sessions) {
        return sessions.filter(isAvailable).length;
    }

    // Create a training card
    function createCard(session) {

        const column = document.createElement('div');
        column.className = 'col-md-6 col-lg-4';

        const availablePlaces = getAvailablePlaces(session);
        const available = isAvailable(session);

        column.innerHTML = `
            <div class="card h-100 bg-dark text-white border-secondary">

                <div class="card-body d-flex flex-column p-4">

                    <h5 class="card-title fw-bold text-white mb-4"></h5>

                    <p class="mb-2 session-day text-white-50"></p>

                    <p class="mb-2 session-time text-white-50"></p>

                    <p class="mb-2 session-trainer text-white-50"></p>

                    <p class="mb-4 session-places text-warning"></p>

                    <div class="mt-auto">

                        <span class="badge mb-3"></span>

                        <button
                            type="button"
                            class="btn w-100 schedule-book">
                        </button>

                    </div>

                </div>

            </div>
        `;

        column.querySelector('.card-title').textContent =
            session.type;

        column.querySelector('.session-day').textContent =
            'Day: ' + session.day;

        column.querySelector('.session-time').textContent =
            'Time: ' + session.time;

        column.querySelector('.session-trainer').textContent =
            'Trainer: ' + session.trainer;

        column.querySelector('.session-places').textContent =
            'Available places: ' + availablePlaces;

        // Availability badge
        const badge = column.querySelector('.badge');

        badge.textContent = available
            ? 'Available'
            : 'Full';

        badge.className = available
            ? 'badge bg-warning text-dark mb-3'
            : 'badge bg-secondary text-white mb-3';

        // Booking button
        const button = column.querySelector('.schedule-book');

        button.textContent = available
            ? 'Book Now'
            : 'Fully Booked';

        button.className = available
            ? 'btn btn-warning w-100 schedule-book'
            : 'btn btn-secondary w-100 schedule-book';

        button.disabled = !available;
        button.dataset.sessionId = session.id;

        return column;
    }

    // Render training schedule
    function renderSchedule() {

        const sessions = filterSessions(selectedDay);

        list.replaceChildren();

        for (const session of sessions) {
            list.appendChild(createCard(session));
        }

        const availableCount =
            countAvailableSessions(sessions);

        summary.textContent =
            'Total sessions: ' + sessions.length +
            ' | Available sessions: ' + availableCount;

        if (sessions.length === 0) {

            const message = document.createElement('p');

            message.className =
                'text-center text-white-50 py-4';

            message.textContent =
                'No training sessions found.';

            list.appendChild(message);
        }
    }

    // Render day filters
    function renderFilters() {

        filters.replaceChildren();

        for (const day of days) {

            const button = document.createElement('button');

            button.type = 'button';
            button.textContent = day;
            button.dataset.day = day;

            button.className = day === selectedDay
                ? 'btn btn-warning px-3'
                : 'btn btn-outline-secondary px-3';

            filters.appendChild(button);
        }
    }

    // Delegated event: filter by day
    filters.addEventListener('click', function (event) {

        const button = event.target.closest('button[data-day]');

        if (!button || !filters.contains(button)) {
            return;
        }

        selectedDay = button.dataset.day;

        renderFilters();
        renderSchedule();
    });

    // Delegated event: booking
    list.addEventListener('click', function (event) {

        const button = event.target.closest('.schedule-book');

        if (!button || !list.contains(button)) {
            return;
        }

        const sessionId = Number(button.dataset.sessionId);

        const session = scheduleData.find(function (item) {
            return item.id === sessionId;
        });

        if (!session || !isAvailable(session)) {
            return;
        }

        // Pass selected session to booking page
        const params = new URLSearchParams({
            session: session.type,
            trainer: session.trainer,
            day: session.day,
            time: session.time
        });

        window.location.href =
            'booking.html?' + params.toString();
    });

    // Initialize schedule
    renderFilters();
    renderSchedule();

});
