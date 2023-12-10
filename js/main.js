const typewrite = (elem, interval, callback = undefined) => {
    let text = elem.innerHTML.replace('&amp;', '&');
    elem.innerHTML = '';

    const writer = setInterval(() => {
        if (text.length < 1) {
            clearInterval(writer);

            if (typeof callback == 'function') {
                callback();
            }

            return;
        }

        elem.innerHTML += text[0];
        text = text.slice(1);

        if (text[0] == ' ') {
            elem.innerHTML += ' ';
            text = text.slice(1);
        }
    }, interval);
};

const toggleContainer = (selector) => {
    const others = document.querySelectorAll('.container');
    const targetContainer = typeof selector == 'string' ? document.querySelector('.container' + selector) : selector;

    others.forEach(other => { 
        other.classList.remove('fade-in*', 'hidden');
        other.classList.add('hidden');
    });
    
    targetContainer.classList.remove('hidden');
    targetContainer.classList.add('fade-in');

    document.querySelector('.back').style.visibility = targetContainer.classList.contains('invitation') ? 'hidden' : 'visible';
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
                        return toggleContainer(next);
                    }

                    toggleContainer('.invitation');
                }
            })
        });
};

(async () => {

    (function shared() {
        document.querySelector('.back > img').onclick = () => toggleContainer('.invitation');
    })();

    (function invitationPage() {
        const event = document.querySelector('.event');
        const others = document.querySelectorAll('.message, .date, .venue, .links');
        
        others.forEach(o => o.style.opacity = 0);
        
        // Typewrite effect for event name
        typewrite(event, 3, () => {
            others.forEach(o => {
                o.style.opacity = 1;
                o.classList.add('fade-in');        
            });
        });

        // Toggle container via button links
        document.querySelectorAll('.links > a').forEach(link => {
            link.onclick = () => toggleContainer(link.attributes.href.value.replace('#', ''))
        });
    })();

    onSwipe();

})();