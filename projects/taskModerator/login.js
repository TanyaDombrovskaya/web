const innerRegisterBlockHtml = `
        <div class="register-block">
            <div class="register-text">Создать аккаунт</div>
            <div class="register-info">Начните работу с лучшим инструментом для модерации задач</div>

            <div class="name-input-block">
                <div class="name-text">ПОЛНОЕ ИМЯ</div>
                <input type="text" class="name-input" placeholder="Иван Иванов">
            </div>

            <div class="register-email-input-block">
                <div class="register-email-text">ЭЛЕКТРОННАЯ ПОЧТА</div>
                <input type="text" class="register-email-input" placeholder="name@company.name">
            </div>

            <div class="register-password-input-block">
                <div class="register-password-text">ПАРОЛЬ</div>
                <input type="password" class="register-password-input" placeholder="•••••••">
                <div class="password-rool">Минимум 8 символов, включая символы и спецсимволы</div>
            </div>

            <div class="register-double-password">
                <div class="register-double-password-text">ПОВТОРИТЕ ПАРОЛЬ</div>
                <input type="password" class="register-double-password-input" placeholder="•••••••">
            </div>

            <div class="register-remember-block">
                <input type="checkbox" class="register-remember-checkbox">
                <div class="register-remember-text">Я согласен с <a>Условиями пользования</a> и <a>Политикой конфиденциальности</a></div>
            </div>

            <button class="register-button">Зарегистрироваться ⭢</button>

            <div class="else-register-text">
                <div class="reg-line"></div>
                <div class="else-reg-text">ИЛИ С ПОМОЩЬЮ</div>
                <div class="reg-line"></div>
            </div>

            <div class="auth-button">
                <div class="google-button">
                    <img src="" alt="" class="google-image">
                    <p>Google</p>
                </div>

                <div class="git-button">
                    <img src="" alt="" class="git-image">
                    <p>GitHub</p>
                </div>
            </div>

            <div class="login-link">
                <div class="login-link-text">Уже есть аккаунт?</div>
                <div class="login-link-back">Войти ⭢</div>
            </div>

            <div class="register-line"></div>

            <div class="register-security-info">
                <div class="verifed-block">
                    <div class="verified-text">ПРОВЕРЕНО</div>
                    <div class="verified-info">Инструмент выбора для 200+ команд</div>
                </div>

                <div class="security-block">
                    <div class="security-text">БЕЗОПАСНО</div>
                    <div class="securty-info">Шифрование данных по стандарту AES-256</div>
                </div>
            </div>
        </div>
`;

document.querySelector('.registration-link').addEventListener('click', function(e) {
    e.preventDefault();

    const loginElements = document.querySelectorAll(
        '.login-text, .login-info, .login-input-block, .registration-link-block, .info-block');

    const loginInfoElements = document.querySelectorAll(
        '.logo-text, .info-text, .what-is-system-text, .info-image');
    
    const loginBlock = document.querySelector('.login-block');
    loginBlock.insertAdjacentHTML('beforeend', innerRegisterBlockHtml);

    const registerBlock = document.querySelector('.register-block');

    loginElements.forEach(el => {
        el.addEventListener('transitionend', () => {
            el.style.display = 'none';
        }, { once: true });

        el.style.transform = 'translateX(800px)';
        el.style.transition = '1s';
    });

    loginInfoElements.forEach(el => {
        el.addEventListener('transitionend', () => {
            el.style.display = 'none';
        }, { once: true });

        el.style.transform = 'translateX(-800px)';
        el.style.transition = '1s';
    });

    setTimeout(() => {
        registerBlock.style.display = 'block';
        registerBlock.style.transition = '1s';
    
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                registerBlock.style.transform = 'translateX(0)';
            });
        });
    }, 1000);
});