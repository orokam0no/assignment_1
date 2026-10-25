'use strict';

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

const main =
    document.querySelector(
        '#trainers-list'
    );

const originalRow =
    main?.querySelector('.row.g-4');

function baseTrainerId(id) {
    if (
        id.startsWith('baglan')
    ) {
        return 'baglan';
    }

    if (
        id.startsWith('kanysh')
    ) {
        return 'kanysh';
    }

    return 'mikhail';
}

function card(trainer) {
    const col =
        createElement(
            'div',
            'col-12 col-md-6 col-lg-4'
        );

    const article =
        createElement(
            'article',
            'card bg-black text-white border-secondary h-100 shadow-sm'
        );

    const img =
        document.createElement('img');

    img.src =
        trainer.image;

    img.alt =
        `Boxing trainer ${trainer.name}`;

    img.className =
        'card-img-top trainer-img';

    const body =
        createElement(
            'div',
            'card-body d-flex flex-column text-center'
        );

    const button =
        createElement(
            'a',

            `btn ${
                trainer.available
                    ? 'btn-warning'
                    : 'btn-outline-secondary'
            } w-100 mt-auto`,

            trainer.available
                ? 'Book This Trainer'
                : 'Unavailable'
        );

    if (trainer.available) {
        button.href =
            `booking.html?trainer=${baseTrainerId(trainer.id)}#booking-form`;
    } else {
        button.href = '#';

        button.setAttribute(
            'aria-disabled',
            'true'
        );

        button.addEventListener(
            'click',
            (event) => {
                event.preventDefault();
            }
        );
    }

    body.append(
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

        button
    );

    article.append(
        img,
        body
    );

    col.append(article);

    return col;
}

if (main && originalRow) {
    originalRow.remove();

    const controls =
        createElement(
            'section',
            'border border-secondary rounded-3 p-3 mb-4'
        );

    const row =
        createElement(
            'div',
            'row g-3'
        );

    const search =
        createElement(
            'input',
            'form-control bg-dark text-white border-secondary'
        );

    search.type = 'search';

    search.placeholder =
        'Search trainer or specialty';

    const specialty =
        createElement(
            'select',
            'form-select bg-dark text-white border-secondary'
        );

    [
        'All specialties',
        'Fundamentals',
        'Technique',
        'Ring Skills',
        'Conditioning',
        'Defense',
        'Combinations'
    ].forEach(
        (label, index) => {
            const option =
                createElement(
                    'option',
                    '',
                    label
                );

            option.value =
                index === 0
                    ? 'all'
                    : label;

            specialty.append(
                option
            );
        }
    );

    const sort =
        createElement(
            'select',
            'form-select bg-dark text-white border-secondary'
        );

    [
        [
            'default',
            'Default order'
        ],

        [
            'rating',
            'Highest rating'
        ],

        [
            'experience',
            'Most experience'
        ]
    ].forEach(
        ([value, label]) => {
            const option =
                createElement(
                    'option',
                    '',
                    label
                );

            option.value =
                value;

            sort.append(
                option
            );
        }
    );

    [
        search,
        specialty,
        sort
    ].forEach(
        (control) => {
            const col =
                createElement(
                    'div',
                    'col-12 col-md-4'
                );

            col.append(control);
            row.append(col);
        }
    );

    const count =
        createElement(
            'p',
            'small text-secondary mt-3 mb-2'
        );

    const reset =
        createElement(
            'button',
            'btn btn-outline-warning',
            'Reset filters'
        );

    reset.type = 'button';

    controls.append(
        row,
        count,
        reset
    );

    const list =
        createElement(
            'div',
            'row g-4 justify-content-center'
        );

    main.prepend(controls);

    controls.insertAdjacentElement(
        'afterend',
        list
    );

    function render() {
        const query =
            search.value
                .trim()
                .toLowerCase();

        let result =
            trainers.filter(
                (trainer) => {
                    const matchesText =
                        trainer.name
                            .toLowerCase()
                            .includes(query) ||

                        trainer.specialty
                            .toLowerCase()
                            .includes(query);

                    const matchesSpecialty =
                        specialty.value ===
                        'all' ||

                        trainer.specialty ===
                        specialty.value;

                    return (
                        matchesText &&
                        matchesSpecialty
                    );
                }
            );

        if (
            sort.value === 'rating'
        ) {
            result =
                [...result].sort(
                    (a, b) =>
                        b.rating -
                        a.rating
                );
        }

        if (
            sort.value ===
            'experience'
        ) {
            result =
                [...result].sort(
                    (a, b) =>
                        b.experience -
                        a.experience
                );
        }

        list.replaceChildren();

        result.forEach(
            (trainer) => {
                list.append(
                    card(trainer)
                );
            }
        );

        count.textContent =
            `${result.length} of ${trainers.length} trainer profiles`;

        if (
            result.length === 0
        ) {
            list.append(
                createElement(
                    'p',
                    'text-center text-secondary',
                    'No trainers match your search.'
                )
            );
        }
    }

    search.addEventListener(
        'input',
        render
    );

    specialty.addEventListener(
        'change',
        render
    );

    sort.addEventListener(
        'change',
        render
    );

    reset.addEventListener(
        'click',
        () => {
            search.value = '';

            specialty.value =
                'all';

            sort.value =
                'default';

            render();

            search.focus();
        }
    );

    render();
}