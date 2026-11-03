'use strict';

$(function () {
    const {
        createElement
    } = window.BoxingClub;

    const equipment = [
        {
            id: 'heavy-bags',
            name: 'Heavy Leather Bags',
            category: 'Bags',
            available: true,
            level: 'All levels',
            image: 'images/gym6.jpg',
            description: 'Heavy bags for power combinations, body shots and endurance.'
        },
        {
            id: 'speed-bags',
            name: 'Speed Bags',
            category: 'Bags',
            available: true,
            level: 'Intermediate',
            image: 'images/gym5.jpg',
            description: 'Speed bags for rhythm, timing and hand-eye coordination.'
        },
        {
            id: 'teardrop-bags',
            name: 'Teardrop Bags',
            category: 'Bags',
            available: true,
            level: 'All levels',
            image: 'images/gym5.jpg',
            description: 'Specialty bags for uppercuts, hooks and head-movement drills.'
        },
        {
            id: 'boxing-ring',
            name: 'Regulation Boxing Ring',
            category: 'Ring',
            available: true,
            level: 'Advanced',
            image: 'images/gym4.jpg',
            description: 'Full-size ring for movement drills, partner work and supervised sparring.'
        },
        {
            id: 'free-weights',
            name: 'Free Weights',
            category: 'Conditioning',
            available: true,
            level: 'All levels',
            image: 'images/gym3.jpg',
            description: 'Strength equipment for controlled boxing-specific conditioning.'
        },
        {
            id: 'medicine-balls',
            name: 'Medicine Balls & Ropes',
            category: 'Conditioning',
            available: false,
            level: 'All levels',
            image: 'images/gym3.jpg',
            description: 'Conditioning tools for stamina, coordination and explosive strength.'
        }
    ];

    const $main = $('#equipment-list');
    const $originalRow = $main.find('.row.g-4:first');

    function equipmentCard(item) {
        const $col = createElement(
            'div',
            'col-12 col-md-6 col-lg-4'
        );

        const $article = createElement(
            'article',
            'card bg-black text-white border-secondary h-100 shadow-sm'
        );

        const $body = createElement(
            'div',
            'card-body d-flex flex-column'
        );

        const $img = $('<img>', {
            src: item.image,
            alt: item.name,
            class: 'img-fluid rounded equipment-img my-3'
        });

        const $status = createElement(
            'span',
            `badge ${item.available ? 'text-bg-warning' : 'text-bg-secondary'} mb-2`,
            item.available ? 'Available' : 'Temporarily unavailable'
        );

        $body.append(
            createElement(
                'h2',
                'h4 fw-bold text-center',
                item.name
            ),
            $img,
            $status,
            createElement(
                'p',
                'small text-secondary text-center',
                `${item.category} • ${item.level}`
            ),
            createElement(
                'p',
                'text-secondary text-center mt-auto',
                item.description
            )
        );

        $article.append($body);
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

    const $controlsRow = createElement(
        'div',
        'row g-3'
    );

    const $search = $('<input>', {
        type: 'search',
        class: 'form-control bg-dark text-white border-secondary',
        placeholder: 'Search equipment',
        'aria-label': 'Search equipment'
    });

    const $category = $('<select>', {
        class: 'form-select bg-dark text-white border-secondary'
    });

    [
        ['all', 'All categories'],
        ['Bags', 'Bags'],
        ['Ring', 'Ring'],
        ['Conditioning', 'Conditioning']
    ].forEach(([value, label]) => {
        $('<option>', {
            value,
            text: label
        }).appendTo($category);
    });

    const $availability = $('<select>', {
        class: 'form-select bg-dark text-white border-secondary'
    });

    [
        ['all', 'All availability'],
        ['available', 'Available'],
        ['unavailable', 'Unavailable']
    ].forEach(([value, label]) => {
        $('<option>', {
            value,
            text: label
        }).appendTo($availability);
    });

    const $sort = $('<select>', {
        class: 'form-select bg-dark text-white border-secondary'
    });

    [
        ['default', 'Default order'],
        ['az', 'Name A–Z'],
        ['za', 'Name Z–A']
    ].forEach(([value, label]) => {
        $('<option>', {
            value,
            text: label
        }).appendTo($sort);
    });

    [
        $search,
        $category,
        $availability,
        $sort
    ].forEach(($control) => {
        const $col = createElement(
            'div',
            'col-12 col-md-6'
        );

        $col.append($control);
        $controlsRow.append($col);
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
        $controlsRow,
        $count,
        $reset
    );

    const $list = createElement(
        'div',
        'row g-4 justify-content-center'
    );

    $main.prepend($controls);
    $controls.after($list);

    function applyFilters() {
        const query = $.trim($search.val()).toLowerCase();
        const categoryValue = $category.val();
        const availabilityValue = $availability.val();

        let result = equipment.filter((item) => {
            const matchesSearch =
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query);

            const matchesCategory =
                categoryValue === 'all' ||
                item.category === categoryValue;

            const matchesAvailability =
                availabilityValue === 'all' ||
                (availabilityValue === 'available' && item.available) ||
                (availabilityValue === 'unavailable' && !item.available);

            return (
                matchesSearch &&
                matchesCategory &&
                matchesAvailability
            );
        });

        if ($sort.val() === 'az') {
            result = [...result].sort((a, b) =>
                a.name.localeCompare(b.name)
            );
        }

        if ($sort.val() === 'za') {
            result = [...result].sort((a, b) =>
                b.name.localeCompare(a.name)
            );
        }

        $list.stop(true, true).fadeOut(100, function () {
            $list.empty();

            $.each(result, function (_, item) {
                $list.append(equipmentCard(item));
            });

            if (result.length === 0) {
                $list.append(
                    createElement(
                        'p',
                        'text-center text-secondary',
                        'No equipment matches these filters.'
                    )
                );
            }

            $list.fadeIn(200);
        });

        $count.text(`${result.length} of ${equipment.length} equipment items`);
    }

    $search.on('input', applyFilters);
    $category.on('change', applyFilters);
    $availability.on('change', applyFilters);
    $sort.on('change', applyFilters);

    $reset.on('click', function () {
        $search.val('');
        $category.val('all');
        $availability.val('all');
        $sort.val('default');

        applyFilters();
        $search.trigger('focus');
    });

    applyFilters();
});