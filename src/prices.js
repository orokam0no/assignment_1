'use strict';

$(function () {
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
        return Math.round(plan.price / plan.sessions);
    }

    const $main = $('main');

    if (!$main.length) {
        return;
    }

    $('[data-session]').on('click', function () {
        const session = $(this).attr('data-session');

        $(this).attr(
            'href',
            `booking.html?session=${encodeURIComponent(session)}#booking-form`
        );
    });

    const $section = createElement(
        'section',
        'mt-5 border border-warning rounded-3 p-4'
    );

    const $title = createElement(
        'h2',
        'h3 text-warning fw-bold text-center mb-4',
        'Training Plan Calculator'
    );

    const $row = createElement(
        'div',
        'row g-3'
    );

    const $planSelect = $('<select>', {
        class: 'form-select bg-dark text-white border-secondary'
    });

    const $placeholder = $('<option>', {
        value: '',
        text: 'Choose a plan'
    });

    $planSelect.append($placeholder);

    const $quantity = $('<input>', {
        type: 'number',
        min: 1,
        max: 12,
        value: 1,
        class: 'form-control bg-dark text-white border-secondary',
        'aria-label': 'Number of plan periods'
    });

    const $sort = $('<select>', {
        class: 'form-select bg-dark text-white border-secondary'
    });

    [
        ['all', 'All categories'],
        ['Group', 'Group'],
        ['Personal', 'Personal'],
        ['Mini-Group', 'Mini-Group']
    ].forEach(([value, label]) => {
        $('<option>', {
            value,
            text: label
        }).appendTo($sort);
    });

    [
        $planSelect,
        $quantity,
        $sort
    ].forEach(($control) => {
        const $col = createElement(
            'div',
            'col-12 col-md-4'
        );

        $col.append($control);
        $row.append($col);
    });

    const $result = createElement(
        'div',
        'alert alert-info mt-3 mb-0'
    );

    const $book = $('<a>', {
        class: 'btn btn-warning mt-3',
        href: 'booking.html#booking-form',
        text: 'Continue to Booking'
    });

    function calculate() {
        const plan = plans.find(
            (item) => item.id === $planSelect.val()
        );

        const count = Number($quantity.val());

        if (
            !plan ||
            !Number.isInteger(count) ||
            count < 1 ||
            count > 12
        ) {
            $result.text(
                'Choose a plan and a quantity from 1 to 12.'
            );

            $book.attr(
                'href',
                'booking.html#booking-form'
            );

            return;
        }

        const total = plan.price * count;

        $result.text(
            `${plan.category} — ${plan.name}: ` +
            `${count} × ${formatKZT(plan.price)} = ${formatKZT(total)}. ` +
            `Approx. ${formatKZT(pricePerSession(plan))} per session in one plan period.`
        );

        $book.attr(
            'href',
            `booking.html?session=${encodeURIComponent(plan.session)}#booking-form`
        );
    }

    function populatePlans() {
        const selected = $planSelect.val();

        $planSelect.empty().append($placeholder);

        const filtered = plans.filter(
            (plan) =>
                $sort.val() === 'all' ||
                plan.category === $sort.val()
        );

        $.each(filtered, function (_, plan) {
            $('<option>', {
                value: plan.id,
                text:
                    `${plan.category} — ${plan.name} ` +
                    `(${formatKZT(plan.price)})`
            }).appendTo($planSelect);
        });

        if (
            filtered.some(
                (plan) => plan.id === selected
            )
        ) {
            $planSelect.val(selected);
        }

        calculate();
    }

    $planSelect.on('change', calculate);
    $quantity.on('input', calculate);
    $sort.on('change', populatePlans);

    $section.append(
        $title,
        $row,
        $result,
        $book
    );

    $main.append($section);

    $section.hide().slideDown(400);

    populatePlans();
});