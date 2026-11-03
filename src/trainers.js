'use strict';

$(function () {
    const {
        createElement
    } = window.BoxingClub;

    const trainers = [
        {
            id: 'baglan',
            name: 'Baglan Kadyrbay',
            specialty: 'Fundamentals',
            experience: 8,
            available: true,
            rating: 5,
            image: 'images/gym9.png'
        },
        {
            id: 'kanysh',
            name: 'Kanysh Seidazym',
            specialty: 'Technique',
            experience: 6,
            available: true,
            rating: 5,
            image: 'images/gym8.png'
        },
        {
            id: 'mikhail',
            name: 'Mikhail Shindin',
            specialty: 'Ring Skills',
            experience: 7,
            available: true,
            rating: 4,
            image: 'images/gym7.png'
        },
        {
            id: 'baglan-conditioning',
            name: 'Baglan — Conditioning',
            specialty: 'Conditioning',
            experience: 8,
            available: false,
            rating: 5,
            image: 'images/gym9.png'
        },
        {
            id: 'kanysh-defense',
            name: 'Kanysh — Defense Focus',
            specialty: 'Defense',
            experience: 6,
            available: true,
            rating: 5,
            image: 'images/gym8.png'
        },
        {
            id: 'mikhail-combinations',
            name: 'Mikhail — Combinations',
            specialty: 'Combinations',
            experience: 7,
            available: true,
            rating: 4,
            image: 'images/gym7.png'
        }
    ];

    const $main = $('#trainers-list');
    const $originalRow = $main.find('.row.g-4:first');

    function baseTrainerId(id) {
        if (id.startsWith('baglan')) {
            return 'baglan';
        }

        if (id.startsWith('kanysh')) {
            return 'kanysh';
        }

        return 'mikhail';
    }

    function trainerCard(trainer) {
        const $col = createElement(
            'div',
            'col-12 col-md-6 col-lg-4'
        );

        const $article = createElement(
            'article',
            'card bg-black text-white border-secondary h-100 shadow-sm'
        );

        const $img = $('<img>', {
            src: trainer.image,
            alt: `Boxing trainer ${trainer.name}`,
            class: 'card-img-top trainer-img'
        });

        const $body = createElement(
            'div',
            'card-body d-flex flex-column text-center'
        );

        const $button = $('<a>', {
            class:
                `btn ${
                    trainer.available
                        ? 'btn-warning'
                        : 'btn-outline-secondary'
                } w-100 mt-auto`,
            text:
                trainer.available
                    ? 'Book This Trainer'
                    : 'Unavailable'
        });

        if (trainer.available) {
            $button.attr(
                'href',
                `booking.html?trainer=${baseTrainerId(trainer.id)}#booking-form`
            );
        } else {
            $button
                .attr('href', '#')
                .attr('aria-disabled', 'true')
                .addClass('trainer-unavailable');
        }

        $body.append(
            createElement(
                'h2',
                'h4 text-warning fw-bold',
                trainer.name
            ),
            createElement(
                'p',
                'text-secondary',
                `${trainer.specialty} • ${trainer.experience} years • Rating ${trainer.rating}/5`
            ),
            createElement(
                'p',
                'small mb-3',
                trainer.available
                    ? 'Available for demo booking'
                    : 'Temporarily unavailable'
            ),
            $button
        );

        $article.append(
            $img,
            $body
        );

        $col.append($article);

        return $col;
    }

    if (!$main.length || !$originalRow.length) {
        return;
    }

    $originalRow.remove();

    const $controls = createElement(
        'section',
        'border border-secondary rounded-3 p-3 mb-4'
    );

    const $row = createElement(
        'div',
        'row g-3'
    );

    const $search = $('<input>', {
        type: 'search',
        class: 'form-control bg-dark text-white border-secondary',
        placeholder: 'Search trainer or specialty'
    });

    const $specialty = $('<select>', {
        class: 'form-select bg-dark text-white border-secondary'
    });

    [
        ['all', 'All specialties'],
        ['Fundamentals', 'Fundamentals'],
        ['Technique', 'Technique'],
        ['Ring Skills', 'Ring Skills'],
        ['Conditioning', 'Conditioning'],
        ['Defense', 'Defense'],
        ['Combinations', 'Combinations']
    ].forEach(([value, label]) => {
        $('<option>', {
            value,
            text: label
        }).appendTo($specialty);
    });

    const $sort = $('<select>', {
        class: 'form-select bg-dark text-white border-secondary'
    });

    [
        ['default', 'Default order'],
        ['rating', 'Highest rating'],
        ['experience', 'Most experience']
    ].forEach(([value, label]) => {
        $('<option>', {
            value,
            text: label
        }).appendTo($sort);
    });

    [
        $search,
        $specialty,
        $sort
    ].forEach(($control) => {
        const $col = createElement(
            'div',
            'col-12 col-md-4'
        );

        $col.append($control);
        $row.append($col);
    });

    const $count = createElement(
        'p',
        'small text-secondary mt-3 mb-2'
    );

    const $reset = $('<button>', {
        type: 'button',
        class: 'btn btn-outline-warning',
        text: 'Reset filters'
    });

    $controls.append(
        $row,
        $count,
        $reset
    );

    const $list = createElement(
        'div',
        'row g-4 justify-content-center'
    );

    $main.prepend($controls);
    $controls.after($list);

    function render() {
        const query = $.trim($search.val()).toLowerCase();

        let result = trainers.filter((trainer) => {
            const matchesText =
                trainer.name.toLowerCase().includes(query) ||
                trainer.specialty.toLowerCase().includes(query);

            const matchesSpecialty =
                $specialty.val() === 'all' ||
                trainer.specialty === $specialty.val();

            return matchesText && matchesSpecialty;
        });

        if ($sort.val() === 'rating') {
            result = [...result].sort(
                (a, b) => b.rating - a.rating
            );
        }

        if ($sort.val() === 'experience') {
            result = [...result].sort(
                (a, b) => b.experience - a.experience
            );
        }

        $list.empty();

        $.each(result, function (_, trainer) {
            $list.append(
                trainerCard(trainer)
            );
        });

        $count.text(
            `${result.length} of ${trainers.length} trainer profiles`
        );

        if (result.length === 0) {
            $list.append(
                createElement(
                    'p',
                    'text-center text-secondary',
                    'No trainers match your search.'
                )
            );
        }

        $list
            .hide()
            .fadeIn(200);
    }

    $search.on('input', render);
    $specialty.on('change', render);
    $sort.on('change', render);

    $reset.on('click', function () {
        $search.val('');
        $specialty.val('all');
        $sort.val('default');

        render();

        $search.trigger('focus');
    });

    $main.on('click', '.trainer-unavailable', function (event) {
        event.preventDefault();

        $(this)
            .closest('.card')
            .stop(true, true)
            .fadeTo(120, 0.5)
            .fadeTo(120, 1);
    });

    render();
});