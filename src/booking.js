
'use strict';

$(function () {
    const {
        formatKZT,
        showMessage,
        hideMessage,
        setFieldState,
        clearFieldState
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
            maxParticipants: 1
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

    function normalizePhone(value) {
        let digits = String(value).replace(/\D/g, '');

        if (digits.length === 11 && digits.startsWith('8')) {
            digits = '7' + digits.slice(1);
        }

        return digits;
    }

    function formatKazakhstanPhone(value) {
        const digits = normalizePhone(value);

        if (!/^77\d{9}$/.test(digits)) {
            return value;
        }

        return (
            '+7 ' +
            digits.slice(1, 4) + ' ' +
            digits.slice(4, 7) + ' ' +
            digits.slice(7, 9) + ' ' +
            digits.slice(9, 11)
        );
    }

    function validatePhone($field) {
        const digits = normalizePhone($field.val());
        const valid = /^77\d{9}$/.test(digits);

        setFieldState(
            $field,
            valid,
            valid
                ? 'Valid Kazakhstan mobile number.'
                : 'Enter a Kazakhstan mobile number, for example +7 775 123 45 67.'
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

    function validateParticipants($field) {
        $field.val('1');

        setFieldState(
            $field,
            true,
            'One participant selected.'
        );

        return true;
    }

    function calculateTotal(session) {
        if (!sessionPrices[session]) {
            return 0;
        }

        return sessionPrices[session].price;
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

    $phoneInput.attr({
        placeholder: '+7 775 123 45 67',
        type: 'tel',
        autocomplete: 'tel',
        inputmode: 'tel'
    });

    $dateInput.attr('min', localDateString());

    // Participants field: always exactly 1
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
        max: 1,
        step: 1,
        value: 1,
        readonly: true,
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
        const price = calculateTotal(session);

        $participantsInput.val('1');

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
            text: `Time: ${$timeSelect.val()
                ? $timeSelect.find('option:selected').text()
                : 'Not selected'}`
        }).appendTo($summary);

        $('<p>', {
            class: 'mb-1',
            text: 'Participants: 1'
        }).appendTo($summary);

        $('<p>', {
            class: 'fw-bold mb-0',
            text: `Estimated total: ${formatKZT(price)}`
        }).appendTo($summary);
    }

    // Prefill trainer and session from schedule page
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
        '#booking-trainer, #booking-session, #booking-date, #booking-time',
        function () {
            updateSummary();
        }
    );

    $participantsInput.on('input change', function () {
        $(this).val('1');
        updateSummary();
    });

    $nameInput.on('input', function () {
        validateName($(this));
    });

    $phoneInput.on('input', function () {
        validatePhone($(this));
    });

    $phoneInput.on('blur', function () {
        if (validatePhone($(this))) {
            $(this).val(
                formatKazakhstanPhone($(this).val())
            );
        }
    });

    $sessionSelect.on('change', function () {
        $participantsInput.val('1');
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

        $participantsInput.val('1');

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
                validateParticipants($participantsInput)
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

        $phoneInput.val(
            formatKazakhstanPhone($phoneInput.val())
        );

        updateSummary();

        const reference = 'BOX-' +
            Date.now().toString().slice(-8);

        showMessage(
            $confirmationBox,
            'Booking Successful! Your booking reference: ' +
            reference +
            '. This is a demo request; no real booking was saved.',
            'success'
        );
    });

    updateSummary();
});
