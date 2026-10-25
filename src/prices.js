'use strict';

const {
    formatKZT,
    createElement
} = window.BoxingClub;

const plans = [
    {
        id: 'group-single',
        category: 'Group',
        name: 'Single Training',
        price: 3500,
        sessions: 1,
        session: 'group'
    },

    {
        id: 'group-standard',
        category: 'Group',
        name: 'Standard Pass',
        price: 25000,
        sessions: 8,
        session: 'group'
    },

    {
        id: 'group-unlimited',
        category: 'Group',
        name: 'Unlimited',
        price: 30000,
        sessions: 30,
        session: 'group'
    },

    {
        id: 'personal-single',
        category: 'Personal',
        name: 'Single Training',
        price: 8000,
        sessions: 1,
        session: 'personal'
    },

    {
        id: 'personal-8',
        category: 'Personal',
        name: '8 Sessions',
        price: 60000,
        sessions: 8,
        session: 'personal'
    },

    {
        id: 'personal-10',
        category: 'Personal',
        name: '10 Sessions',
        price: 70000,
        sessions: 10,
        session: 'personal'
    },

    {
        id: 'mini-split',
        category: 'Mini-Group',
        name: 'Split',
        price: 60000,
        sessions: 12,
        session: 'minigroup'
    },

    {
        id: 'mini-pass',
        category: 'Mini-Group',
        name: 'Mini-Group',
        price: 50000,
        sessions: 10,
        session: 'minigroup'
    }
];

function pricePerSession(plan) {
    return Math.round(
        plan.price /
        plan.sessions
    );
}

const main =
    document.querySelector('main');

if (main) {
    document
        .querySelectorAll(
            '[data-session]'
        )
        .forEach((link) => {
            link.addEventListener(
                'click',
                () => {
                    const session =
                        link.dataset.session;

                    link.href =
                        `booking.html?session=${encodeURIComponent(session)}#booking-form`;
                }
            );
        });

    const section =
        createElement(
            'section',
            'mt-5 border border-warning rounded-3 p-4'
        );

    const title =
        createElement(
            'h2',
            'h3 text-warning fw-bold text-center mb-4',
            'Training Plan Calculator'
        );

    const row =
        createElement(
            'div',
            'row g-3'
        );

    const planSelect =
        createElement(
            'select',
            'form-select bg-dark text-white border-secondary'
        );

    const placeholder =
        createElement(
            'option',
            '',
            'Choose a plan'
        );

    placeholder.value = '';

    planSelect.append(
        placeholder
    );

    plans.forEach((plan) => {
        const option =
            createElement(
                'option',
                '',
                `${plan.category} — ${plan.name} (${formatKZT(plan.price)})`
            );

        option.value = plan.id;

        planSelect.append(option);
    });

    const quantity =
        createElement(
            'input',
            'form-control bg-dark text-white border-secondary'
        );

    quantity.type = 'number';
    quantity.min = '1';
    quantity.max = '12';
    quantity.value = '1';

    quantity.setAttribute(
        'aria-label',
        'Number of plan periods'
    );

    const sort =
        createElement(
            'select',
            'form-select bg-dark text-white border-secondary'
        );

    [
        ['all', 'All categories'],
        ['Group', 'Group'],
        ['Personal', 'Personal'],
        ['Mini-Group', 'Mini-Group']
    ].forEach(([value, label]) => {
        const option =
            createElement(
                'option',
                '',
                label
            );

        option.value = value;

        sort.append(option);
    });

    [
        planSelect,
        quantity,
        sort
    ].forEach((control) => {
        const col =
            createElement(
                'div',
                'col-12 col-md-4'
            );

        col.append(control);
        row.append(col);
    });

    const result =
        createElement(
            'div',
            'alert alert-info mt-3 mb-0'
        );

    const book =
        createElement(
            'a',
            'btn btn-warning mt-3',
            'Continue to Booking'
        );

    book.href =
        'booking.html#booking-form';

    function calculate() {
        const plan =
            plans.find(
                (item) =>
                    item.id ===
                    planSelect.value
            );

        const count =
            Number(quantity.value);

        if (
            !plan ||
            !Number.isInteger(count) ||
            count < 1 ||
            count > 12
        ) {
            result.textContent =
                'Choose a plan and a quantity from 1 to 12.';

            book.href =
                'booking.html#booking-form';

            return;
        }

        const total =
            plan.price * count;

        result.textContent =
            `${plan.category} — ${plan.name}: ` +
            `${count} × ${formatKZT(plan.price)} = ${formatKZT(total)}. ` +
            `Approx. ${formatKZT(pricePerSession(plan))} per session in one plan period.`;

        book.href =
            `booking.html?session=${encodeURIComponent(plan.session)}#booking-form`;
    }

    function populatePlans() {
        const selected =
            planSelect.value;

        planSelect.replaceChildren(
            placeholder
        );

        const filtered =
            plans.filter(
                (plan) =>
                    sort.value === 'all' ||
                    plan.category ===
                    sort.value
            );

        filtered.forEach((plan) => {
            const option =
                createElement(
                    'option',
                    '',
                    `${plan.category} — ${plan.name} (${formatKZT(plan.price)})`
                );

            option.value =
                plan.id;

            planSelect.append(
                option
            );
        });

        if (
            filtered.some(
                (plan) =>
                    plan.id === selected
            )
        ) {
            planSelect.value =
                selected;
        }

        calculate();
    }

    planSelect.addEventListener(
        'change',
        calculate
    );

    quantity.addEventListener(
        'input',
        calculate
    );

    sort.addEventListener(
        'change',
        populatePlans
    );

    section.append(
        title,
        row,
        result,
        book
    );

    main.append(section);

    calculate();
}