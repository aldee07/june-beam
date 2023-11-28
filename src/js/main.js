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

(async () => {

    const event = document.querySelector('.event');
    const others = document.querySelectorAll('.message, .date, .venue, .links');

    others.forEach(o => o.style.opacity = 0);

    typewrite(event, 400, () => {
        others.forEach(o => {
            o.style.opacity = 1;
            o.classList.add('fade-in');        
        });
    });


})();