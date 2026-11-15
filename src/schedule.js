
'use strict';

$(function () {
    const $page = $('#schedule-page');

    if (!$page.length) {
        return;
    }

    const schedule = [
        {
            day: 'Monday',
            sessions: [
                {
                    time: '09:00 - 10:30',
                    type: 'Group Training',
                    trainer: 'Baglan Kadyrbay',
                    trainerId: 'baglan',
                    sessionId: 'group'
                },
                {
                    time: '18:30 - 20:00',
                    type: 'Personal Training',
                    trainer: 'Kanysh Seidazym',
                    trainerId: 'kanysh',
                    sessionId: 'personal'
                }
            ]
        },
        {
            day: 'Tuesday',
            sessions: [
                {
                    time: '15:00 - 16:30',
                    type: 'Mini-Group',
                    trainer: 'Mikhail Shindin',
                    trainerId: 'mikhail',
                    sessionId: 'minigroup'
                }
            ]
        },
        {
            day: 'Wednesday',
            sessions: [
                {
                    time: '09:00 - 10:30',
                    type: 'Group Training',
                    trainer: 'Baglan Kadyrbay',
                    trainerId: 'baglan',
                    sessionId: 'group'
                },
                {
                    time: '20:00 - 21:30',
                    type: 'Personal Training',
                    trainer: 'Mikhail Shindin',
                    trainerId: 'mikhail',
                    sessionId: 'personal'
                }
            ]
        },
        {
            day: 'Thursday',
            sessions: [
                {
                    time: '15:00 - 16:30',
                    type: 'Mini-Group',
                    trainer: 'Kanysh Seidazym',
                    trainerId: 'kanysh',
                    sessionId: 'minigroup'
                }
            ]
        },
        {
            day: 'Friday',
            sessions: [
                {
                    time: '18:30 - 20:00',
                    type: 'Group Training',
                    trainer: 'Baglan Kadyrbay',
                    trainerId: 'baglan',
                    sessionId: 'group'
                }
            ]
        },
        {
            day: 'Saturday',
            sessions: [
                {
                    time: '09:00 - 10:30',
                    type: 'Personal Training',
                    trainer: 'Mikhail Shindin',
                    trainerId: 'mikhail',
                    sessionId: 'personal'
                }
            ]
        }
    ];

    const $heading = $('<section>', {
        class: 'text-center mb-5'
    });

    $heading.append(
        $('<h1>', {
            class: 'display-5 fw-bold mb-3',
            text: 'Weekly Training Schedule'
        }),
        $('<p>', {
            class: 'lead text-secondary mb-0',
            text: 'Choose your preferred training session and book your place.'
        })
    );

    $page.append($heading);

    const $row = $('<div>', {
        class: 'row g-4'
    });

    schedule.forEach(function (day) {
        const $column = $('<div>', {
            class: 'col-12 col-md-6 col-lg-4'
        });

        const $card = $('<article>', {
            class: 'card bg-black text-white border-secondary h-100 shadow-sm'
        });

        const $body = $('<div>', {
            class: 'card-body p-4'
        });

        $body.append(
            $('<h2>', {
                class: 'h4 fw-bold text-warning mb-4',
                text: day.day
            })
        );

        day.sessions.forEach(function (session, index) {
            const $session = $('<div>', {
                class: index === day.sessions.length - 1
                    ? 'pb-2'
                    : 'border-bottom border-secondary pb-3 mb-3'
            });

            $session.append(
                $('<h3>', {
                    class: 'h6 fw-bold',
                    text: session.type
                }),

                $('<p>', {
                    class: 'text-secondary small mb-1',
                    text: 'Time: ' + session.time
                }),

                $('<p>', {
                    class: 'text-secondary small mb-3',
                    text: 'Trainer: ' + session.trainer
                })
            );

            const params = new URLSearchParams({
                trainer: session.trainerId,
                session: session.sessionId
            });

            const $bookButton = $('<a>', {
                href: 'booking.html?' + params.toString() + '#booking-form',
                class: 'btn btn-warning btn-sm px-3 py-2',
                text: 'Book Now'
            });

            $session.append($bookButton);
            $body.append($session);
        });

        $card.append($body);
        $column.append($card);
        $row.append($column);
    });

    $page.append($row);
});
