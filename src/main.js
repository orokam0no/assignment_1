'use strict';

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

function formatKZT(value) {
    return `${Number(value).toLocaleString('en-US')} KZT`;
}

function createElement(tag, className = '', text = '') {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}

function showMessage(element, message, type = 'success') {
    if (!element) {
        return;
    }

    element.textContent = message;

    element.classList.remove(
        'hidden',
        'alert-success',
        'alert-danger',
        'alert-warning',
        'alert-info'
    );

    element.classList.add(`alert-${type}`);
}

function hideMessage(element) {
    if (!element) {
        return;
    }

    element.textContent = '';
    element.classList.add('hidden');
}

function setFieldState(field, valid, message = '') {
    if (!field) {
        return;
    }

    field.classList.remove('is-valid', 'is-invalid');
    field.classList.add(valid ? 'is-valid' : 'is-invalid');

    let feedback = field.parentElement.querySelector('.js-feedback');

    if (!feedback) {
        feedback = createElement('div', 'js-feedback small mt-1');
        field.insertAdjacentElement('afterend', feedback);
    }

    feedback.classList.remove('text-success', 'text-danger');
    feedback.classList.add(valid ? 'text-success' : 'text-danger');
    feedback.textContent = message;
}

function clearFieldState(field) {
    if (!field) {
        return;
    }

    field.classList.remove('is-valid', 'is-invalid');

    const feedback = field.parentElement.querySelector('.js-feedback');

    if (feedback) {
        feedback.remove();
    }
}

function makeDemoReference(prefix) {
    const number = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${number}`;
}

document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');

    if (href && href.split('#')[0] === currentPage) {
        link.setAttribute('aria-current', 'page');
    }
});

window.BoxingClub = {
    formatKZT,
    createElement,
    showMessage,
    hideMessage,
    setFieldState,
    clearFieldState,
    makeDemoReference
};