'use strict';

$(function () {
    const {
        createElement,
        showMessage,
        hideMessage
    } = window.BoxingClub;

    const reviews = [
        {
            name: 'Ayan',
            text: 'Great technical sessions and a serious training atmosphere.',
            rating: 5,
            category: 'Training',
            date: '2026-10-05'
        },
        {
            name: 'Dana',
            text: 'The coaches explain combinations clearly and pay attention to technique.',
            rating: 5,
            category: 'Coaches',
            date: '2026-10-10'
        },
        {
            name: 'Timur',
            text: 'Good equipment and enough space for conditioning work.',
            rating: 4,
            category: 'Equipment',
            date: '2026-10-14'
        }
    ];

    const featuredTips = [
        'Bring hand wraps and arrive 10–15 minutes before training.',
        'Beginners can choose Any Trainer when they are unsure who to book.',
        'Group training is a practical way to start and learn the fundamentals.',
        'Personal training is best when you want individual technical feedback.'
    ];

    function stars(rating) {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    }

    function renderReview(review, $container) {
        const $col = createElement(
            'div',
            'col-12 col-md-6 col-lg-4'
        );

        const $card = createElement(
            'article',
            'card bg-black text-white border-secondary h-100'
        );

        const $body = createElement(
            'div',
            'card-body'
        );

        $body.append(
            createElement(
                'h3',
                'h5 text-warning fw-bold',
                review.name
            ),
            createElement(
                'p',
                'mb-2',
                stars(review.rating)
            ),
            createElement(
                'p',
                'text-secondary',
                review.text
            ),
            createElement(
                'p',
                'small text-secondary mb-0',
                `${review.category} • ${review.date}`
            )
        );

        $card.append($body);
        $col.append($card);
        $container.append($col);
    }

    function renderReviews(list, $container) {
        $container.empty();

        if (list.length === 0) {
            $container.append(
                createElement(
                    'p',
                    'text-secondary text-center',
                    'No reviews yet.'
                )
            );

            return;
        }

        $.each(list, function (_, review) {
            renderReview(review, $container);
        });
    }

    const $main = $('main');

    if (!$main.length) {
        return;
    }

    const $featured = createElement(
        'section',
        'container py-4'
    );

    const $featuredBox = createElement(
        'div',
        'border border-warning rounded-3 p-4 text-center'
    );

    const randomTip =
        featuredTips[Math.floor(Math.random() * featuredTips.length)];

    $featuredBox.append(
        createElement(
            'h2',
            'h4 text-warning fw-bold',
            'Training Tip of the Visit'
        ),
        createElement(
            'p',
            'mb-0',
            randomTip
        )
    );

    $featured.append($featuredBox);
    $main.append($featured);

    const $section = createElement(
        'section',
        'container py-5'
    ).attr('id', 'reviews');

    const $heading = createElement(
        'div',
        'text-center mb-4'
    );

    $heading.append(
        createElement(
            'span',
            'text-warning fw-bold',
            'MEMBER FEEDBACK'
        ),
        createElement(
            'h2',
            'display-6 fw-bold mt-2',
            'Training Reviews'
        )
    );

    const $row = createElement(
        'div',
        'row g-4 mb-4'
    ).attr('id', 'reviews-list');

    renderReviews(reviews, $row);

    const $formBox = createElement(
        'div',
        'border border-secondary rounded-3 p-4'
    );

    const $formTitle = createElement(
        'h3',
        'h4 text-warning fw-bold mb-3',
        'Add a Demo Review'
    );

    const $form = $('<form>', {
        id: 'review-form'
    });

    const $name = $('<input>', {
        type: 'text',
        class: 'form-control bg-dark text-white border-secondary mb-3',
        placeholder: 'Your name',
        'aria-label': 'Your name',
        required: true
    });

    const $category = $('<select>', {
        class: 'form-select bg-dark text-white border-secondary mb-3',
        'aria-label': 'Review category',
        required: true
    });

    [
        ['Choose category', ''],
        ['Training', 'Training'],
        ['Coaches', 'Coaches'],
        ['Equipment', 'Equipment']
    ].forEach(([label, value]) => {
        $('<option>', {
            value,
            text: label
        }).appendTo($category);
    });

    const $rating = $('<select>', {
        class: 'form-select bg-dark text-white border-secondary mb-3',
        'aria-label': 'Rating',
        required: true
    });

    [
        ['Choose rating', ''],
        ['5', '5'],
        ['4', '4'],
        ['3', '3'],
        ['2', '2'],
        ['1', '1']
    ].forEach(([label, value]) => {
        $('<option>', {
            value,
            text: label
        }).appendTo($rating);
    });

    const $textarea = $('<textarea>', {
        class: 'form-control bg-dark text-white border-secondary',
        rows: 3,
        maxlength: 180,
        placeholder: 'Write 10–180 characters about your experience.',
        'aria-label': 'Review text',
        required: true
    });

    const $counter = createElement(
        'p',
        'small text-secondary mt-1',
        '0 / 180 characters'
    );

    const $submit = $('<button>', {
        type: 'submit',
        class: 'btn btn-warning',
        text: 'Add Review'
    });

    const $reset = $('<button>', {
        type: 'reset',
        class: 'btn btn-outline-light ms-2',
        text: 'Reset'
    });

    const $message = $('<div>', {
        class: 'alert mt-3 hidden',
        role: 'status'
    });

    $form.append(
        $name,
        $category,
        $rating,
        $textarea,
        $counter,
        $submit,
        $reset,
        $message
    );

    $formBox.append(
        $formTitle,
        $form
    );

    $section.append(
        $heading,
        $row,
        $formBox
    );

    $main.append($section);

    $section.hide().slideDown(400);

    $textarea.on('input', function () {
        $counter.text(`${$(this).val().length} / 180 characters`);
    });

    $form.on('reset', function () {
        setTimeout(function () {
            $counter.text('0 / 180 characters');
            hideMessage($message);
        }, 0);
    });

    $form.on('submit', function (event) {
        event.preventDefault();

        hideMessage($message);

        const cleanName = $.trim($name.val());
        const cleanText = $.trim($textarea.val());
        const numericRating = Number($rating.val());

        if (cleanName.length < 2 || cleanName.length > 40) {
            showMessage(
                $message,
                'Enter a name between 2 and 40 characters.',
                'danger'
            );

            $name.trigger('focus');
            return;
        }

        if (!$category.val()) {
            showMessage(
                $message,
                'Choose a review category.',
                'danger'
            );

            $category.trigger('focus');
            return;
        }

        if (numericRating < 1 || numericRating > 5) {
            showMessage(
                $message,
                'Choose a rating from 1 to 5.',
                'danger'
            );

            $rating.trigger('focus');
            return;
        }

        if (cleanText.length < 10 || cleanText.length > 180) {
            showMessage(
                $message,
                'Review text must contain 10–180 characters.',
                'danger'
            );

            $textarea.trigger('focus');
            return;
        }

        reviews.unshift({
            name: cleanName,
            text: cleanText,
            rating: numericRating,
            category: $category.val(),
            date: new Date().toISOString().slice(0, 10)
        });

        renderReviews(reviews, $row);

        this.reset();

        $counter.text('0 / 180 characters');

        showMessage(
            $message,
            'Review added to this front-end demo. It is not sent to a server.',
            'success'
        );

        $row
            .find('.card:first')
            .hide()
            .fadeIn(400);
    });
});

