'use strict';

$(function () {
    const {
        formatKZT,
        showMessage,
        hideMessage,
        setFieldState,
        clearFieldState,
        makeDemoReference
    } = window.BoxingClub;

    const sessionPrices = {
        group: {
            label: 'Group Training',
            price: 3500,
            maxParticipants: 1
        },
        personal: {
            label: 'Personal Training',
            price: 8000,
            maxParticipants: 1
        },
        minigroup: {
            label: 'Mini-Group',
            price: 5000,
            maxParticipants: 4
        }
    };

    const trainerNames = {
        baglan: 'Baglan Kadyrbay',
        kanysh: 'Kanysh Seidazym',
        mikhail: 'Mikhail Shindin',
        any: 'Any Trainer'
    };

    const $form = $('#booking-form');

    function localDateString(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    function validateName($field) {
        const value = $.trim($field.val());

        const valid =
            /^[A-Za-zÀ-žА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі' -]{2,50}$/.test(value);

        setFieldState(
            $field,
            valid,
            valid
                ? 'Name looks good.'
                : 'Enter a real name using 2–50 letters.'
        );

        return valid;
    }

    function validatePhone($field) {
        const digits = $field.val().replace(/\D/g, '');

        const valid =
            digits.length === 11 &&
            (digits.startsWith('7') || digits.startsWith('8'));

        setFieldState(
            $field,
            valid,
            valid
                ? 'Phone looks good.'
                : 'Enter a Kazakhstan phone number with 11 digits.'
        );

        return valid;
    }

    function validateSelect($field, label) {
        const valid = $field.val() !== '';

        setFieldState(
            $field,
            valid,
            valid
                ? `${label} selected.`
                : `Choose ${label.toLowerCase()}.`
        );

        return valid;
    }

    function validateDate($field) {
        const today = localDateString();

        const valid =
            $field.val() !== '' &&
            $field.val() >= today;

        setFieldState(
            $field,
            valid,
            valid
                ? 'Date is available for a demo request.'
                : 'Choose today or a future date.'
        );

        return valid;
    }

    function validateParticipants($field, $sessionField) {
        const value = Number($field.val());
        const session = sessionPrices[$sessionField.val()];
        const max = session ? session.maxParticipants : 4;

        const valid =
            Number.isInteger(value) &&
            value >= 1 &&
            value <= max;

        setFieldState(
            $field,
            valid,
            valid
                ? 'Participant count accepted.'
                : `Choose between 1 and ${max} participant(s) for this session.`
        );

        return valid;
    }

    function calculateTotal(session, participants) {
        if (!sessionPrices[session]) {
            return 0;
        }

        return sessionPrices[session].price * participants;
    }

    if (!$form.length) {
        return;
    }

    const $nameInput = $('#booking-name');
    const $phoneInput = $('#booking-phone');
    const $trainerSelect = $('#booking-trainer');
    const $sessionSelect = $('#booking-session');
    const $dateInput = $('#booking-date');
    const $timeSelect = $('#booking-time');
    const $errorBox = $('#booking-error');
    const $confirmationBox = $('#booking-confirmation');

    $dateInput.attr('min', localDateString());

    const $participantsRow = $('<div>', {
        class: 'row align-items-center mb-3'
    });

    const $labelCol = $('<div>', {
        class: 'col-12 col-md-4'
    });

    const $inputCol = $('<div>', {
        class: 'col-12 col-md-8'
    });

    const $participantsLabel = $('<label>', {
        class: 'form-label fw-bold mb-md-0',
        for: 'booking-participants',
        text: 'Participants'
    });

    const $participantsInput = $('<input>', {
        type: 'number',
        id: 'booking-participants',
        name: 'participants',
        min: 1,
        max: 4,
        value: 1,
        required: true,
        class: 'form-control bg-dark text-white border-secondary'
    });

    $labelCol.append($participantsLabel);
    $inputCol.append($participantsInput);

    $participantsRow.append(
        $labelCol,
        $inputCol
    );

    $dateInput
        .closest('.row')
        .after($participantsRow);

    const $summary = $('<div>', {
        class: 'border border-secondary rounded-3 p-3 mt-4'
    });

    $form.after($summary);

    function updateSummary() {
        const session = $sessionSelect.val();
        const participants = Number($participantsInput.val()) || 1;
        const price = calculateTotal(session, participants);

        $summary.empty();

        $('<h3>', {
            class: 'h5 text-warning fw-bold',
            text: 'Live Booking Summary'
        }).appendTo($summary);

        $('<p>', {
            class: 'mb-1',
            text: `Trainer: ${trainerNames[$trainerSelect.val()] || 'Not selected'}`
        }).appendTo($summary);

        $('<p>', {
            class: 'mb-1',
            text: `Session: ${sessionPrices[session]?.label || 'Not selected'}`
        }).appendTo($summary);

        $('<p>', {
            class: 'mb-1',
            text: `Date: ${$dateInput.val() || 'Not selected'}`
        }).appendTo($summary);

        $('<p>', {
            class: 'mb-1',
            text: `Time: ${$timeSelect.find('option:selected').text() || 'Not selected'}`
        }).appendTo($summary);

        $('<p>', {
            class: 'mb-1',
            text: `Participants: ${participants}`
        }).appendTo($summary);

        $('<p>', {
            class: 'fw-bold mb-0',
            text: `Estimated total: ${formatKZT(price)}`
        }).appendTo($summary);
    }

    const params = new URLSearchParams(window.location.search);
    const chosenTrainer = params.get('trainer');
    const chosenSession = params.get('session');

    if (
        chosenTrainer &&
        Object.hasOwn(trainerNames, chosenTrainer)
    ) {
        $trainerSelect.val(chosenTrainer);
    }

    if (
        chosenSession &&
        Object.hasOwn(sessionPrices, chosenSession)
    ) {
        $sessionSelect.val(chosenSession);
    }

    $form.on(
        'change',
        '#booking-trainer, #booking-session, #booking-date, #booking-time, #booking-participants',
        function () {
            updateSummary();
        }
    );

    $participantsInput.on('input', function () {
        updateSummary();
        validateParticipants($(this), $sessionSelect);
    });

    $nameInput.on('input', function () {
        validateName($(this));
    });

    $phoneInput.on('input', function () {
        validatePhone($(this));
    });

    $sessionSelect.on('change', function () {
        const session = sessionPrices[$(this).val()];

        $participantsInput.attr(
            'max',
            String(session?.maxParticipants || 4)
        );

        if (
            Number($participantsInput.val()) >
            Number($participantsInput.attr('max'))
        ) {
            $participantsInput.val('1');
        }

        validateParticipants(
            $participantsInput,
            $sessionSelect
        );

        updateSummary();
    });

    $form.on('reset', function () {
        setTimeout(function () {
            $form
                .find('input, select')
                .each(function () {
                    clearFieldState($(this));
                });

            hideMessage($errorBox);
            hideMessage($confirmationBox);

            $participantsInput.val('1');

            updateSummary();
        }, 0);
    });

    $form.on('submit', function (event) {
        event.preventDefault();

        hideMessage($errorBox);
        hideMessage($confirmationBox);

        const checks = [
            [$nameInput, validateName($nameInput)],
            [$phoneInput, validatePhone($phoneInput)],
            [
                $trainerSelect,
                validateSelect($trainerSelect, 'Trainer')
            ],
            [
                $sessionSelect,
                validateSelect($sessionSelect, 'Session type')
            ],
            [$dateInput, validateDate($dateInput)],
            [
                $participantsInput,
                validateParticipants(
                    $participantsInput,
                    $sessionSelect
                )
            ],
            [
                $timeSelect,
                validateSelect($timeSelect, 'Preferred time')
            ]
        ];

        const firstInvalid = checks.find(([, valid]) => !valid);

        if (firstInvalid) {
            showMessage(
                $errorBox,
                'Please correct the highlighted fields before submitting.',
                'danger'
            );

            const $firstInvalid = firstInvalid[0];

            $('html, body').animate(
                {
                    scrollTop: $firstInvalid.offset().top - 120
                },
                400,
                function () {
                    $firstInvalid.trigger('focus');
                }
            );

            return;
        }

        const participants = Number($participantsInput.val());

        const total = calculateTotal(
            $sessionSelect.val(),
            participants
        );

        const reference = makeDemoReference('BOX');

        showMessage(
            $confirmationBox,
            `Demo request ${reference}: ` +
            `${$.trim($nameInput.val())}, ` +
            `${trainerNames[$trainerSelect.val()]}, ` +
            `${sessionPrices[$sessionSelect.val()].label}, ` +
            `${$dateInput.val()}, ` +
            `${$timeSelect.find('option:selected').text()}, ` +
            `${participants} participant(s), ` +
            `estimated total ${formatKZT(total)}. ` +
            `This is a front-end demo only; no booking or payment was sent to a server.`,
            'success'
        );
    });

    updateSummary();
});