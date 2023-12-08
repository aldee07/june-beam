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
    const targetContainer = document.querySelector('.container' + selector);

    others.forEach(other => { 
        other.classList.remove('fade-in*', 'hidden');
        other.classList.add('hidden');
    });
    
    targetContainer.classList.remove('hidden');
    targetContainer.classList.add('fade-in');
};

(async () => {

    (function shared() {
        // Back to main screen (invitation page)
        document.querySelectorAll('.back > img').forEach(back => {
            back.onclick = () => toggleContainer('.invitation');
        });
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

})();