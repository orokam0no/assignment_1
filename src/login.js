'use strict';

$(function () {
    const {
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
            test: (value) => value.length >= 8
        },
        {
            label: 'One uppercase letter',
            test: (value) => /[A-Z]/.test(value)
        },
        {
            label: 'One lowercase letter',
            test: (value) => /[a-z]/.test(value)
        },
        {
            label: 'One digit',
            test: (value) => /\d/.test(value)
        },
        {
            label: 'One special character',
            test: (value) => /[^A-Za-z0-9]/.test(value)
        }
    ];

    function validPassword(value) {
        return passwordRules.every(
            (rule) => rule.test(value)
        );
    }

    function addPasswordToggle($input) {
        const $button = $('<button>', {
            type: 'button',
            class: 'btn btn-outline-light btn-sm mt-2',
            text: 'Show password',
            'aria-controls': $input.attr('id')
        });

        $input.after($button);

        $button.on('click', function () {
            const hidden =
                $input.attr('type') === 'password';

            $input.attr(
                'type',
                hidden ? 'text' : 'password'
            );

            $(this).text(
                hidden
                    ? 'Hide password'
                    : 'Show password'
            );
        });
    }

    const $loginForm = $('#login-form');
    const $registerForm = $('#register-form');

    if ($loginForm.length) {
        const $email = $('#login-email');
        const $password = $('#login-password');
        const $error = $('#login-error');
        const $success = $('#login-success');

        addPasswordToggle($password);

        $email.on('input', function () {
            const valid =
                emailPattern.test($.trim($(this).val()));

            setFieldState(
                $(this),
                valid,
                valid
                    ? 'Email format accepted.'
                    : 'Enter a valid email address.'
            );
        });

        $password.on('input', function () {
            const valid =
                $(this).val().length >= 8;

            setFieldState(
                $(this),
                valid,
                valid
                    ? 'Password length accepted.'
                    : 'Password must contain at least 8 characters.'
            );
        });

        $loginForm.on('submit', function (event) {
            event.preventDefault();

            hideMessage($error);
            hideMessage($success);

            const emailValid =
                emailPattern.test(
                    $.trim($email.val())
                );

            const passwordValid =
                $password.val().length >= 8;

            setFieldState(
                $email,
                emailValid,
                emailValid
                    ? 'Email format accepted.'
                    : 'Enter a valid email address.'
            );

            setFieldState(
                $password,
                passwordValid,
                passwordValid
                    ? 'Password length accepted.'
                    : 'Password must contain at least 8 characters.'
            );

            if (!emailValid || !passwordValid) {
                showMessage(
                    $error,
                    'Correct the highlighted login fields.',
                    'danger'
                );

                (
                    emailValid
                        ? $password
                        : $email
                ).trigger('focus');

                return;
            }

            showMessage(
                $success,
                'Front-end demo only: the form is valid, but no authentication request was sent and no password was stored.',
                'success'
            );
        });
    }

    if ($registerForm.length) {
        const $name = $('#register-name');
        const $email = $('#register-email');
        const $password = $('#register-password');
        const $confirm = $('#register-confirm-password');
        const $error = $('#register-error');
        const $success = $('#register-success');

        addPasswordToggle($password);
        addPasswordToggle($confirm);

        const $checklist = $('<ul>', {
            class: 'small text-secondary mt-2'
        });

        const ruleItems = passwordRules.map((rule) => {
            const $item = $('<li>', {
                text: `○ ${rule.label}`
            });

            $checklist.append($item);

            return $item;
        });

        $password.parent().append($checklist);

        function updateChecklist() {
            passwordRules.forEach((rule, index) => {
                const passed =
                    rule.test($password.val());

                ruleItems[index]
                    .text(
                        `${passed ? '✓' : '○'} ${rule.label}`
                    )
                    .toggleClass(
                        'text-warning',
                        passed
                    )
                    .toggleClass(
                        'text-secondary',
                        !passed
                    );
            });
        }

        $password.on('input', function () {
            updateChecklist();
        });

        $registerForm.on('submit', function (event) {
            event.preventDefault();

            hideMessage($error);
            hideMessage($success);

            const cleanName =
                $.trim($name.val());

            const nameValid =
                cleanName.length >= 2 &&
                cleanName.length <= 60;

            const emailValid =
                emailPattern.test(
                    $.trim($email.val())
                );

            const passwordValid =
                validPassword(
                    $password.val()
                );

            const confirmValid =
                $confirm.val() !== '' &&
                $confirm.val() ===
                $password.val();

            setFieldState(
                $name,
                nameValid,
                nameValid
                    ? 'Name accepted.'
                    : 'Enter 2–60 characters.'
            );

            setFieldState(
                $email,
                emailValid,
                emailValid
                    ? 'Email format accepted.'
                    : 'Enter a valid email address.'
            );

            setFieldState(
                $password,
                passwordValid,
                passwordValid
                    ? 'Password meets every rule.'
                    : 'Password does not meet every rule.'
            );

            setFieldState(
                $confirm,
                confirmValid,
                confirmValid
                    ? 'Passwords match.'
                    : 'Passwords must match exactly.'
            );

            const checks = [
                [$name, nameValid],
                [$email, emailValid],
                [$password, passwordValid],
                [$confirm, confirmValid]
            ];

            const firstInvalid =
                checks.find(([, valid]) => !valid);

            if (firstInvalid) {
                showMessage(
                    $error,
                    'Correct the highlighted registration fields.',
                    'danger'
                );

                firstInvalid[0].trigger('focus');

                return;
            }

            const reference =
                makeDemoReference('MEM');

            showMessage(
                $success,
                `Demo profile ${reference} validated for ${cleanName}. ` +
                'No real account was created, no data was sent to a server, and the password was not stored.',
                'success'
            );
        });

        updateChecklist();
    }
});