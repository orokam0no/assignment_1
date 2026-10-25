'use strict';

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
        description:
            'Heavy bags for power combinations, body shots and endurance.'
    },

    {
        id: 'speed-bags',
        name: 'Speed Bags',
        category: 'Bags',
        available: true,
        level: 'Intermediate',
        image: 'images/gym5.jpg',
        description:
            'Speed bags for rhythm, timing and hand-eye coordination.'
    },

    {
        id: 'teardrop-bags',
        name: 'Teardrop Bags',
        category: 'Bags',
        available: true,
        level: 'All levels',
        image: 'images/gym5.jpg',
        description:
            'Specialty bags for uppercuts, hooks and head-movement drills.'
    },

    {
        id: 'boxing-ring',
        name: 'Regulation Boxing Ring',
        category: 'Ring',
        available: true,
        level: 'Advanced',
        image: 'images/gym4.jpg',
        description:
            'Full-size ring for movement drills, partner work and supervised sparring.'
    },

    {
        id: 'free-weights',
        name: 'Free Weights',
        category: 'Conditioning',
        available: true,
        level: 'All levels',
        image: 'images/gym3.jpg',
        description:
            'Strength equipment for controlled boxing-specific conditioning.'
    },

    {
        id: 'medicine-balls',
        name: 'Medicine Balls & Ropes',
        category: 'Conditioning',
        available: false,
        level: 'All levels',
        image: 'images/gym3.jpg',
        description:
            'Conditioning tools for stamina, coordination and explosive strength.'
    }
];

const main =
    document.querySelector('#equipment-list');

const originalRow =
    main?.querySelector('.row.g-4');

function equipmentCard(item) {
    const col = createElement(
        'div',
        'col-12 col-md-6 col-lg-4'
    );

    const article = createElement(
        'article',
        'card bg-black text-white border-secondary h-100 shadow-sm'
    );

    const body = createElement(
        'div',
        'card-body d-flex flex-column'
    );

    const img =
        document.createElement('img');

    img.src = item.image;
    img.alt = item.name;

    img.className =
        'img-fluid rounded equipment-img my-3';

    const status = createElement(
        'span',

        `badge ${
            item.available
                ? 'text-bg-warning'
                : 'text-bg-secondary'
        } mb-2`,

        item.available
            ? 'Available'
            : 'Temporarily unavailable'
    );

    body.append(
        createElement(
            'h2',
            'h4 fw-bold text-center',
            item.name
        ),

        img,

        status,

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

    article.append(body);
    col.append(article);

    return col;
}

if (main && originalRow) {
    originalRow.remove();

    const controls = createElement(
        'section',
        'border border-secondary rounded-3 p-3 mb-4'
    );

    const controlsRow = createElement(
        'div',
        'row g-3'
    );

    const search = createElement(
        'input',
        'form-control bg-dark text-white border-secondary'
    );

    search.type = 'search';
    search.placeholder = 'Search equipment';

    search.setAttribute(
        'aria-label',
        'Search equipment'
    );

    const category = createElement(
        'select',
        'form-select bg-dark text-white border-secondary'
    );

    [
        'all',
        'Bags',
        'Ring',
        'Conditioning'
    ].forEach((value) => {
        const option = createElement(
            'option',
            '',
            value === 'all'
                ? 'All categories'
                : value
        );

        option.value = value;
        category.append(option);
    });

    const availability = createElement(
        'select',
        'form-select bg-dark text-white border-secondary'
    );

    [
        ['all', 'All availability'],
        ['available', 'Available'],
        ['unavailable', 'Unavailable']
    ].forEach(([value, label]) => {
        const option = createElement(
            'option',
            '',
            label
        );

        option.value = value;
        availability.append(option);
    });

    const sort = createElement(
        'select',
        'form-select bg-dark text-white border-secondary'
    );

    [
        ['default', 'Default order'],
        ['az', 'Name A–Z'],
        ['za', 'Name Z–A']
    ].forEach(([value, label]) => {
        const option = createElement(
            'option',
            '',
            label
        );

        option.value = value;
        sort.append(option);
    });

    [
        search,
        category,
        availability,
        sort
    ].forEach((control) => {
        const col = createElement(
            'div',
            'col-12 col-md-6'
        );

        col.append(control);
        controlsRow.append(col);
    });

    const count = createElement(
        'p',
        'small text-secondary mt-3 mb-2'
    );

    const reset = createElement(
        'button',
        'btn btn-outline-warning',
        'Reset filters'
    );

    reset.type = 'button';

    controls.append(
        controlsRow,
        count,
        reset
    );

    const list = createElement(
        'div',
        'row g-4 justify-content-center'
    );

    main.prepend(controls);

    controls.insertAdjacentElement(
        'afterend',
        list
    );

    function applyFilters() {
        const query =
            search.value
                .trim()
                .toLowerCase();

        const categoryValue =
            category.value;

        const availabilityValue =
            availability.value;

        let result = equipment.filter(
            (item) => {
                const matchesSearch =
                    item.name
                        .toLowerCase()
                        .includes(query) ||
                    item.description
                        .toLowerCase()
                        .includes(query);

                const matchesCategory =
                    categoryValue === 'all' ||
                    item.category === categoryValue;

                const matchesAvailability =
                    availabilityValue === 'all' ||

                    (
                        availabilityValue ===
                        'available' &&
                        item.available
                    ) ||

                    (
                        availabilityValue ===
                        'unavailable' &&
                        !item.available
                    );

                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesAvailability
                );
            }
        );

        if (sort.value === 'az') {
            result = [...result].sort(
                (a, b) =>
                    a.name.localeCompare(b.name)
            );
        } else if (sort.value === 'za') {
            result = [...result].sort(
                (a, b) =>
                    b.name.localeCompare(a.name)
            );
        }

        list.replaceChildren();

        result.forEach((item) => {
            list.append(
                equipmentCard(item)
            );
        });

        count.textContent =
            `${result.length} of ${equipment.length} equipment items`;

        if (result.length === 0) {
            list.append(
                createElement(
                    'p',
                    'text-center text-secondary',
                    'No equipment matches these filters.'
                )
            );
        }
    }

    search.addEventListener(
        'input',
        applyFilters
    );

    category.addEventListener(
        'change',
        applyFilters
    );

    availability.addEventListener(
        'change',
        applyFilters
    );

    sort.addEventListener(
        'change',
        applyFilters
    );

    reset.addEventListener(
        'click',
        () => {
            search.value = '';
            category.value = 'all';
            availability.value = 'all';
            sort.value = 'default';

            applyFilters();
            search.focus();
        }
    );

    applyFilters();
}