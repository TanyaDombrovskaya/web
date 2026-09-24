<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskModerator - Вход</title>
    <link rel="stylesheet" href="./loginStyles.css">
    <link rel="stylesheet" href="./registerStyles.css">
    <link rel="icon" href="./logo.png">
</head>
<body>
    <div class="all-container">
        <div class="information-block">
            <div class="logo-text">
                <img src="./logo.png" alt="#" class="logo-image">
                <h1 class="name-page">TaskMaster</h1>
            </div>

            <div class="info-text">Управляйте задачами с профессиональной точностью</div>

            <div class="what-is-system-text">Система контроля качества и модерации рабочих процессов для команд мирового уровня.</div>
            <img src="./info-image.png" alt="#" class="info-image">
        </div>

        <div class="login-block">
            <div class="login-text">Вход в систему</div>
            <div class="login-info">Введите свои данные для доступа к панели модерации</div>

            <div class="login-input-block">
                <div class="email-input-block">
                    <div class="email-input-text">ЭЛЕКТРОННАЯ ПОЧТА</div>
                    <input type="text" class="email-input" placeholder="name@company.name">
                </div>

                <div class="password-input-block">
                    <div class="password-text">
                        <div class="password-input-text">ПАРОЛЬ</div>
                        <a href="#" class="reset-password-link">Забыли пароль?</a>
                    </div>

                    <input type="password" class="password-input" placeholder="•••••••">
                </div>

                <div class="remember-block">
                    <input type="checkbox" class="remember-checkbox">
                    <div class="remember-text">Запомнить меня на этом устройстве</div>
                </div>

                <button class="login-button">Войти в аккаунт ⭢</button>

                <div class="else-login-text">
                    <div class="line"></div>
                    <div class="else-text">ИЛИ ВОЙТИ ЧЕРЕЗ SSO</div>
                    <div class="line"></div>
                </div>

                <button class="login-from-korporation">Корпоративный портал (Active Directory)</button>
            </div>

            <div class="registration-link-block">
                <p>Еще нет аккаунта?</p>
                <a href="#" class="registration-link">Зарегистрироваться</a>
            </div>

            <div class="info-block">
                <div class="info-item">
                    © 2024 TaskModerator
                </div>

                <div class="dote">•</div>

                <div class="info-item">
                    Политика конфиденциальности
                </div>

                <div class="dote">•</div>

                <div class="info-item">
                    Условия использования
                </div>
            </div>
        </div>
    </div>

    <script src="./login.js"></script>
</body>
</html>