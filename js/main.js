const typewrite = (elem, interval, callback = undefined) => {
    let text = elem.html().replace('&amp;', '&');
    elem.html('');

    const writer = setInterval(() => {
        if (text.length < 1) {
            clearInterval(writer);

            if (typeof callback == 'function') {
                callback();
            }

            return;
        }

        elem.html(elem.html() + text[0]);
        text = text.slice(1);
        
        if (text[0] == ' ') {
            elem.html(elem.html() + ' ');
            text = text.slice(1);
        }
    }, interval);
};

const toggleContainer = (selector) => {
    const others = $('.container');
    const targetContainer = typeof selector == 'string' ? $('.container' + selector) : selector;

    others.removeClass('fade-in').removeClass('hidden').addClass('hidden');


    targetContainer.removeClass('hidden').addClass('fade-in');
    $('.back').css('visibility', targetContainer.hasClass('invitation') ? 'hidden' : 'visible');
};

const invitationPage = () => {
    const others = $('.message, .date, .venue, .links');
    
    others.css('opacity', 0);
    
    // Typewrite effect for event name
    typewrite($('.event'), 3, () => {
        others.css('opacity', 1).addClass('fade-in');
    });

    // Toggle container via button links
    $('.links > a').click(function () {
        toggleContainer($(this).attr('href').replace('#', ''));
    });
};

const onSwipe = () => {
    document.querySelectorAll('.container')
        .forEach((element) => {
            let startX;

            element.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);

            element.addEventListener('touchend', (e) => {
                
                const endX = e.changedTouches[0].clientX;
                const directionX = endX > startX ? 'left' : 'right';
                const deltaX = directionX == 'left' ? endX - startX : startX - endX;
    
                const minSwipeDistance = 150;

                if (deltaX > minSwipeDistance) {
                    const next = directionX == 'right' ? element.nextElementSibling : element.previousElementSibling;

                    if (next) {
                        return toggleContainer($(next));
                    }

                    toggleContainer('.invitation');
                }
            })
        });
};

const rsvp = {
    url: 'https://api.jsonbin.io/v3/b/65756f080574da7622d2df02',
    headers: {
        'X-Access-Key': '$2a$10$2CHk7JiW31mfaR9H9l.5uuQPPy3IcEmCdxoUQ5qnMvwHhvvC9rfKS',
        'Content-Type': 'application/json',
    },
    hasOngoingWrite: false,
    get: async () => {
        return await $.ajax({
            url: rsvp.url,
            method: 'GET',
            dataType: 'json',
            headers: rsvp.headers,
        });
    }
};

const onRespond = () => {
    const buttons = $('.form button');

    const name = $('#name');
    const guests = $('#guests');

    $('#name, #guests').keyup(() => {
        buttons.addClass('disabled').attr('disabled', 'disabled');

        if (name.val() && guests.val()) {
            buttons.removeClass('disabled').removeAttr('disabled');
        }
    });

    buttons.click(async function () {
        buttons.addClass('disabled').attr('disabled', 'disabled');
        
        if (rsvp.hasOngoingWrite) return;

        const current = await rsvp.get();
        const data = current.record;

        data.responses.push({
            name: name.val(),
            guests: guests.val(),
            response: $(this).val(),
            timestamp: +new Date,
        });

        rsvp.hasOngoingWrite = true;

        $.ajax({
            url: rsvp.url,
            method: 'PUT',
            dataType: 'json',
            headers: rsvp.headers,
            data: JSON.stringify(data),
            success: () => {
                $('.input').remove();
                $('.thanks').removeClass('thanks');
                rsvp.hasOngoingWrite = false;
            },
            error: (e) => {
                buttons.removeClass('disabled').removeAttr('disabled');
                console.error(e);
                rsvp.hasOngoingWrite = false;
            },
        });
    });
};

(async () => {
    invitationPage();
    onSwipe();
    onRespond();

    $('.back > img').click(() => toggleContainer('.invitation'));
})();