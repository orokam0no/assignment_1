'use strict';

const {
    formatKZT,
    createElement,
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

const form =
    document.querySelector('#booking-form');

function localDateString(date = new Date()) {
    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, '0');

    const day =
        String(date.getDate())
            .padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function validateName(field) {
    const value =
        field.value.trim();

    const valid =
        /^[A-Za-zÀ-žА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі' -]{2,50}$/
            .test(value);

    setFieldState(
        field,
        valid,

        valid
            ? 'Name looks good.'
            : 'Enter a real name using 2–50 letters.'
    );

    return valid;
}

function validatePhone(field) {
    const digits =
        field.value.replace(/\D/g, '');

    const valid =
        digits.length === 11 &&
        (
            digits.startsWith('7') ||
            digits.startsWith('8')
        );

    setFieldState(
        field,
        valid,

        valid
            ? 'Phone looks good.'
            : 'Enter a Kazakhstan phone number with 11 digits.'
    );

    return valid;
}

function validateSelect(
    field,
    label
) {
    const valid =
        field.value !== '';

    setFieldState(
        field,
        valid,

        valid
            ? `${label} selected.`
            : `Choose ${label.toLowerCase()}.`
    );

    return valid;
}

function validateDate(field) {
    const today =
        localDateString();

    const valid =
        field.value !== '' &&
        field.value >= today;

    setFieldState(
        field,
        valid,

        valid
            ? 'Date is available for a demo request.'
            : 'Choose today or a future date.'
    );

    return valid;
}

function validateParticipants(
    field,
    sessionField
) {
    const value =
        Number(field.value);

    const session =
        sessionPrices[sessionField.value];

    const max =
        session
            ? session.maxParticipants
            : 4;

    const valid =
        Number.isInteger(value) &&
        value >= 1 &&
        value <= max;

    setFieldState(
        field,
        valid,

        valid
            ? 'Participant count accepted.'
            : `Choose between 1 and ${max} participant(s) for this session.`
    );

    return valid;
}

function calculateTotal(
    session,
    participants
) {
    if (!sessionPrices[session]) {
        return 0;
    }

    return (
        sessionPrices[session].price *
        participants
    );
}

if (form) {
    form.noValidate = true;

    const nameInput =
        document.querySelector(
            '#booking-name'
        );

    const phoneInput =
        document.querySelector(
            '#booking-phone'
        );

    const trainerSelect =
        document.querySelector(
            '#booking-trainer'
        );

    const sessionSelect =
        document.querySelector(
            '#booking-session'
        );

    const dateInput =
        document.querySelector(
            '#booking-date'
        );

    const timeSelect =
        document.querySelector(
            '#booking-time'
        );

    const errorBox =
        document.querySelector(
            '#booking-error'
        );

    const confirmationBox =
        document.querySelector(
            '#booking-confirmation'
        );

    dateInput.min =
        localDateString();

    const participantsRow =
        createElement(
            'div',
            'row align-items-center mb-3'
        );

    const labelCol =
        createElement(
            'div',
            'col-12 col-md-4'
        );

    const inputCol =
        createElement(
            'div',
            'col-12 col-md-8'
        );

    const participantsLabel =
        createElement(
            'label',
            'form-label fw-bold mb-md-0',
            'Participants'
        );

    participantsLabel.htmlFor =
        'booking-participants';

    const participantsInput =
        createElement(
            'input',
            'form-control bg-dark text-white border-secondary'
        );

    participantsInput.type =
        'number';

    participantsInput.id =
        'booking-participants';

    participantsInput.name =
        'participants';

    participantsInput.min = '1';
    participantsInput.max = '4';
    participantsInput.value = '1';
    participantsInput.required = true;

    labelCol.append(
        participantsLabel
    );

    inputCol.append(
        participantsInput
    );

    participantsRow.append(
        labelCol,
        inputCol
    );

    const dateRow =
        dateInput.closest('.row');

    dateRow.insertAdjacentElement(
        'afterend',
        participantsRow
    );

    const summary =
        createElement(
            'div',
            'border border-secondary rounded-3 p-3 mt-4'
        );

    form.insertAdjacentElement(
        'afterend',
        summary
    );

    function updateSummary() {
        const session =
            sessionSelect.value;

        const participants =
            Number(
                participantsInput.value
            ) || 1;

        const price =
            calculateTotal(
                session,
                participants
            );

        summary.replaceChildren(
            createElement(
                'h3',
                'h5 text-warning fw-bold',
                'Live Booking Summary'
            ),

            createElement(
                'p',
                'mb-1',
                `Trainer: ${
                    trainerNames[
                        trainerSelect.value
                        ] || 'Not selected'
                }`
            ),

            createElement(
                'p',
                'mb-1',
                `Session: ${
                    sessionPrices[session]
                        ?.label ||
                    'Not selected'
                }`
            ),

            createElement(
                'p',
                'mb-1',
                `Date: ${
                    dateInput.value ||
                    'Not selected'
                }`
            ),

            createElement(
                'p',
                'mb-1',
                `Time: ${
                    timeSelect.options[
                        timeSelect.selectedIndex
                        ]?.text ||
                    'Not selected'
                }`
            ),

            createElement(
                'p',
                'mb-1',
                `Participants: ${participants}`
            ),

            createElement(
                'p',
                'fw-bold mb-0',
                `Estimated total: ${formatKZT(price)}`
            )
        );
    }

    const params =
        new URLSearchParams(
            window.location.search
        );

    const chosenTrainer =
        params.get('trainer');

    const chosenSession =
        params.get('session');

    if (
        chosenTrainer &&
        Object.hasOwn(
            trainerNames,
            chosenTrainer
        )
    ) {
        trainerSelect.value =
            chosenTrainer;
    }

    if (
        chosenSession &&
        Object.hasOwn(
            sessionPrices,
            chosenSession
        )
    ) {
        sessionSelect.value =
            chosenSession;
    }

    [
        trainerSelect,
        sessionSelect,
        dateInput,
        timeSelect,
        participantsInput
    ].forEach((field) => {
        field.addEventListener(
            'change',
            updateSummary
        );
    });

    participantsInput.addEventListener(
        'input',
        updateSummary
    );

    nameInput.addEventListener(
        'input',
        () => {
            validateName(nameInput);
        }
    );

    phoneInput.addEventListener(
        'input',
        () => {
            validatePhone(phoneInput);
        }
    );

    sessionSelect.addEventListener(
        'change',
        () => {
            const session =
                sessionPrices[
                    sessionSelect.value
                    ];

            participantsInput.max =
                String(
                    session
                        ?.maxParticipants || 4
                );

            if (
                Number(
                    participantsInput.value
                ) >
                Number(
                    participantsInput.max
                )
            ) {
                participantsInput.value =
                    '1';
            }

            validateParticipants(
                participantsInput,
                sessionSelect
            );

            updateSummary();
        }
    );

    form.addEventListener(
        'reset',
        () => {
            window.setTimeout(
                () => {
                    form
                        .querySelectorAll(
                            'input, select'
                        )
                        .forEach(
                            clearFieldState
                        );

                    hideMessage(errorBox);
                    hideMessage(
                        confirmationBox
                    );

                    participantsInput.value =
                        '1';

                    updateSummary();
                },
                0
            );
        }
    );

    form.addEventListener(
        'submit',
        (event) => {
            event.preventDefault();

            hideMessage(errorBox);

            hideMessage(
                confirmationBox
            );

            const checks = [
                [
                    nameInput,
                    validateName(
                        nameInput
                    )
                ],

                [
                    phoneInput,
                    validatePhone(
                        phoneInput
                    )
                ],

                [
                    trainerSelect,
                    validateSelect(
                        trainerSelect,
                        'Trainer'
                    )
                ],

                [
                    sessionSelect,
                    validateSelect(
                        sessionSelect,
                        'Session type'
                    )
                ],

                [
                    dateInput,
                    validateDate(
                        dateInput
                    )
                ],

                [
                    participantsInput,
                    validateParticipants(
                        participantsInput,
                        sessionSelect
                    )
                ],

                [
                    timeSelect,
                    validateSelect(
                        timeSelect,
                        'Preferred time'
                    )
                ]
            ];

            const firstInvalid =
                checks.find(
                    ([, valid]) =>
                        !valid
                );

            if (firstInvalid) {
                showMessage(
                    errorBox,
                    'Please correct the highlighted fields before submitting.',
                    'danger'
                );

                firstInvalid[0].focus();

                return;
            }

            const participants =
                Number(
                    participantsInput.value
                );

            const total =
                calculateTotal(
                    sessionSelect.value,
                    participants
                );

            const reference =
                makeDemoReference('BOX');

            showMessage(
                confirmationBox,

                `Demo request ${reference}: ` +
                `${nameInput.value.trim()}, ` +
                `${trainerNames[trainerSelect.value]}, ` +
                `${sessionPrices[sessionSelect.value].label}, ` +
                `${dateInput.value}, ` +
                `${timeSelect.options[timeSelect.selectedIndex].text}, ` +
                `${participants} participant(s), ` +
                `estimated total ${formatKZT(total)}. ` +
                `This is a front-end demo only; no booking or payment was sent to a server.`,

                'success'
            );
        }
    );

    updateSummary();
}