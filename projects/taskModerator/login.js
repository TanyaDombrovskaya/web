document.querySelector('.registration-link').addEventListener('click', function(e) {
    e.preventDefault();

    const loginElements = document.querySelectorAll(
        '.login-text, .login-info, .login-input-block, .registration-link-block, .info-block');

    const loginInfoElements = document.querySelectorAll(
        '.logo-text, .info-text, .what-is-system-text, .info-image');

    loginElements.forEach(el => {
        el.style.transform = 'translateX(800px)';
        el.style.transition = '1s';

        el.addEventListener('transitionend', () => {
            el.style.display = 'none';
        }, { once: true });
    });

    loginInfoElements.forEach(el => {
        el.style.transform = 'translateX(-800px)';
        el.style.transition = '1s';

        el.addEventListener('transitionend', () => {
            el.style.display = 'none';
        }, { once: true });
    });
});