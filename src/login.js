'use strict';

const {
    createElement,
    showMessage,
    hideMessage,
    setFieldState,
    makeDemoReference
} = window.BoxingClub;

const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRules = [
    {
        label: 'At least 8 characters',

        test: (value) =>
            value.length >= 8
    },

    {
        label: 'One uppercase letter',

        test: (value) =>
            /[A-Z]/.test(value)
    },

    {
        label: 'One lowercase letter',

        test: (value) =>
            /[a-z]/.test(value)
    },

    {
        label: 'One digit',

        test: (value) =>
            /\d/.test(value)
    },

    {
        label: 'One special character',

        test: (value) =>
            /[^A-Za-z0-9]/.test(value)
    }
];

function validPassword(value) {
    return passwordRules.every(
        (rule) =>
            rule.test(value)
    );
}

function addPasswordToggle(input) {
    const button =
        createElement(
            'button',
            'btn btn-outline-light btn-sm mt-2',
            'Show password'
        );

    button.type = 'button';

    button.setAttribute(
        'aria-controls',
        input.id
    );

    button.addEventListener(
        'click',
        () => {
            const hidden =
                input.type === 'password';

            input.type =
                hidden
                    ? 'text'
                    : 'password';

            button.textContent =
                hidden
                    ? 'Hide password'
                    : 'Show password';
        }
    );

    input.insertAdjacentElement(
        'afterend',
        button
    );
}

const loginForm =
    document.querySelector(
        '#login-form'
    );

const registerForm =
    document.querySelector(
        '#register-form'
    );

if (loginForm) {
    loginForm.noValidate = true;

    const email =
        document.querySelector(
            '#login-email'
        );

    const password =
        document.querySelector(
            '#login-password'
        );

    const error =
        document.querySelector(
            '#login-error'
        );

    const success =
        document.querySelector(
            '#login-success'
        );

    addPasswordToggle(
        password
    );

    loginForm.addEventListener(
        'submit',
        (event) => {
            event.preventDefault();

            hideMessage(error);
            hideMessage(success);

            const emailValid =
                emailPattern.test(
                    email.value.trim()
                );

            const passwordValid =
                password.value.length >= 8;

            setFieldState(
                email,
                emailValid,

                emailValid
                    ? 'Email format accepted.'
                    : 'Enter a valid email address.'
            );

            setFieldState(
                password,
                passwordValid,

                passwordValid
                    ? 'Password length accepted.'
                    : 'Password must contain at least 8 characters.'
            );

            if (
                !emailValid ||
                !passwordValid
            ) {
                showMessage(
                    error,
                    'Correct the highlighted login fields.',
                    'danger'
                );

                (
                    emailValid
                        ? password
                        : email
                ).focus();

                return;
            }

            showMessage(
                success,
                'Front-end demo only: the form is valid, but no authentication request was sent and no password was stored.',
                'success'
            );
        }
    );
}

if (registerForm) {
    registerForm.noValidate = true;

    const name =
        document.querySelector(
            '#register-name'
        );

    const email =
        document.querySelector(
            '#register-email'
        );

    const password =
        document.querySelector(
            '#register-password'
        );

    const confirm =
        document.querySelector(
            '#register-confirm-password'
        );

    const error =
        document.querySelector(
            '#register-error'
        );

    const success =
        document.querySelector(
            '#register-success'
        );

    addPasswordToggle(
        password
    );

    addPasswordToggle(
        confirm
    );

    const checklist =
        createElement(
            'ul',
            'small text-secondary mt-2'
        );

    const ruleItems =
        passwordRules.map(
            (rule) => {
                const item =
                    createElement(
                        'li',
                        '',
                        `○ ${rule.label}`
                    );

                checklist.append(
                    item
                );

                return item;
            }
        );

    password.parentElement.append(
        checklist
    );

    function updateChecklist() {
        passwordRules.forEach(
            (rule, index) => {
                const passed =
                    rule.test(
                        password.value
                    );

                ruleItems[index]
                    .textContent =
                    `${passed ? '✓' : '○'} ${rule.label}`;

                ruleItems[index]
                    .classList.toggle(
                    'text-warning',
                    passed
                );

                ruleItems[index]
                    .classList.toggle(
                    'text-secondary',
                    !passed
                );
            }
        );
    }

    password.addEventListener(
        'input',
        updateChecklist
    );

    registerForm.addEventListener(
        'submit',
        (event) => {
            event.preventDefault();

            hideMessage(error);
            hideMessage(success);

            const nameValid =
                name.value
                    .trim()
                    .length >= 2 &&

                name.value
                    .trim()
                    .length <= 60;

            const emailValid =
                emailPattern.test(
                    email.value.trim()
                );

            const passwordValid =
                validPassword(
                    password.value
                );

            const confirmValid =
                confirm.value !== '' &&
                confirm.value ===
                password.value;

            setFieldState(
                name,
                nameValid,

                nameValid
                    ? 'Name accepted.'
                    : 'Enter 2–60 characters.'
            );

            setFieldState(
                email,
                emailValid,

                emailValid
                    ? 'Email format accepted.'
                    : 'Enter a valid email address.'
            );

            setFieldState(
                password,
                passwordValid,

                passwordValid
                    ? 'Password meets every rule.'
                    : 'Password does not meet every rule.'
            );

            setFieldState(
                confirm,
                confirmValid,

                confirmValid
                    ? 'Passwords match.'
                    : 'Passwords must match exactly.'
            );

            const checks = [
                [name, nameValid],
                [email, emailValid],
                [password, passwordValid],
                [confirm, confirmValid]
            ];

            const firstInvalid =
                checks.find(
                    ([, valid]) =>
                        !valid
                );

            if (firstInvalid) {
                showMessage(
                    error,
                    'Correct the highlighted registration fields.',
                    'danger'
                );

                firstInvalid[0].focus();

                return;
            }

            const reference =
                makeDemoReference(
                    'MEM'
                );

            showMessage(
                success,

                `Demo profile ${reference} validated for ${name.value.trim()}. ` +
                'No real account was created, no data was sent to a server, and the password was not stored.',

                'success'
            );
        }
    );

    updateChecklist();
}