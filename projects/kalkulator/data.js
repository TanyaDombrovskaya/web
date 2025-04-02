// добавление символов
function appendToResult(num) {
    let input = document.querySelector('.text_result');
    input.value += num;
}

// вычисление результата
function calculate() {
    let input = document.querySelector('.text_result');
    let result = eval(input.value);

    input.value = result;
}

// очистки поля ввода
function clearInput() {
    document.querySelector('.text_result').value = '';
}

// удаление последнего символа
function backspace() {
    let input = document.querySelector('.text_result');
    input.value = input.value.slice(0, -1);
}
