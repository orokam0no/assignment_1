'use strict';

$(function () {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    function formatKZT(value) {
        return `${Number(value).toLocaleString('en-US')} KZT`;
    }

    function createElement(tag, className = '', text = '') {
        const $element = $(`<${tag}>`);

        if (className) {
            $element.addClass(className);
        }

        if (text) {
            $element.text(text);
        }

        return $element;
    }

    function showMessage(element, message, type = 'success') {
        const $element = $(element);

        if (!$element.length) {
            return;
        }

        $element
            .text(message)
            .removeClass('hidden alert-success alert-danger alert-warning alert-info')
            .addClass(`alert-${type}`)
            .stop(true, true)
            .hide()
            .fadeIn(250);
    }

    function hideMessage(element) {
        const $element = $(element);

        if (!$element.length) {
            return;
        }

        $element
            .stop(true, true)
            .fadeOut(150, function () {
                $(this)
                    .text('')
                    .addClass('hidden')
                    .show();
            });
    }

    function setFieldState(field, valid, message = '') {
        const $field = $(field);

        if (!$field.length) {
            return;
        }

        $field
            .removeClass('is-valid is-invalid')
            .addClass(valid ? 'is-valid' : 'is-invalid');

        let $feedback = $field.siblings('.js-feedback');

        if (!$feedback.length) {
            $feedback = $('<div>', {
                class: 'js-feedback small mt-1'
            });

            $field.after($feedback);
        }

        $feedback
            .removeClass('text-success text-danger')
            .addClass(valid ? 'text-success' : 'text-danger')
            .text(message);
    }

    function clearFieldState(field) {
        const $field = $(field);

        if (!$field.length) {
            return;
        }

        $field.removeClass('is-valid is-invalid');
        $field.siblings('.js-feedback').remove();
    }

    function makeDemoReference(prefix) {
        const number = Math.floor(100000 + Math.random() * 900000);
        return `${prefix}-${number}`;
    }

    $('a[href]').each(function () {
        const href = $(this).attr('href');

        if (href && href.split('#')[0] === currentPage) {
            $(this).attr('aria-current', 'page');
        }
    });

    $('.nav-link').on('mouseenter', function () {
        $(this).stop(true).fadeTo(150, 0.65);
    });

    $('.nav-link').on('mouseleave', function () {
        $(this).stop(true).fadeTo(150, 1);
    });

    $('input[type="checkbox"]').on('change', function () {
        const checked = $(this).prop('checked');

        $(this)
            .closest('label')
            .toggleClass('text-warning', checked);
    });

    $('input[type="checkbox"]:checked').attr('data-checked', 'true');

    window.BoxingClub = {
        formatKZT,
        createElement,
        showMessage,
        hideMessage,
        setFieldState,
        clearFieldState,
        makeDemoReference
    };
});