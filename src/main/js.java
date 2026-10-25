'use strict';

function createElement(tag, classNames = '', text = '') {
    const element = document.createElement(tag);

    if (classNames) {
        element.className = classNames;
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}

function formatPrice(price) {
    return `${Number(price).toLocaleString('en-US')} KZT`;
}

function showMessage(element, message, type = 'success') {
    if (!element) {
        return;
    }

    element.textContent = message;
    element.classList.remove('hidden', 'alert-success', 'alert-danger');

    if (type === 'error') {
        element.classList.add('alert-danger');
    } else {
        element.classList.add('alert-success');
    }
}

function hideMessage(element) {
    if (!element) {
        return;
    }

    element.textContent = '';
    element.classList.add('hidden');
}

function generateReference(prefix = 'OSBC') {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    return `${prefix}-${randomNumber}`;
}

function setFieldState(field, isValid) {
    field.classList.remove('error', 'success');

    if (isValid) {
        field.classList.add('success');
    } else {
        field.classList.add('error');
    }
}

function clearFieldState(field) {
    field.classList.remove('error', 'success');
}

document.addEventListener('DOMContentLoaded', () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        const navLinks = document.querySelectorAll('.navbar .nav-link');

    navLinks.forEach((link) => {
        const href = link.getAttribute('href');

        if (href === currentPage) {
        link.classList.add('active');
        }
                });

                const yearElements = document.querySelectorAll('footer p');

    yearElements.forEach((paragraph) => {
        if (paragraph.textContent.includes('©')) {
        paragraph.setAttribute(
                'title',
                        'Old School Boxing Club official website'
);
        }
                });
                });