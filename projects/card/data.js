function validate_nums() {
    const numbers_input = document.getElementById('numbers');
    const numbers = numbers_input.value;
    
    const filtered_numbers = numbers.replace(/\D/g, '');
    
    numbers_input.value = filtered_numbers;
}
    
function validate_cvv() {
    const cvv_input = document.getElementById('cvv');
    const cvv = cvv_input.value;
    
    const filtered_cvv = cvv.replace(/\D/g, '');
    
    cvv_input.value = filtered_cvv;
}

function validate_holder() {
    const holder_input = document.getElementById('holder');
    const holder = holder_input.value;
    
    const filtered_holder = holder.replace(/[0-9]/g, '').replace(/[^\x00-\x7F]/g, '');

    holder_input.value = filtered_holder;
}

function add_space() {
    const numbers_input = document.getElementById('numbers');
    let value = numbers_input.value;

    let count = 0;
    let formated_value = '';

    for (let i = 0; i < value.length; i++) {
        if (value[i] !== ' ' && count < 16) {
            count++;
            formated_value += value[i];

            if (count % 4 === 0 && count < 16) {
                formated_value += ' ';
            }
        }
    }

    numbers_input.value = formated_value;
}

function backspace_space(event) {
    if (event.key === 'Backspace') {
        const numbers_input = document.getElementById('numbers');
        const cursorPosition = numbers_input.selectionStart;
        const value = numbers_input.value;

        if (cursorPosition > 0 && value[cursorPosition - 1] === ' ') {
            numbers_input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
        }
    }
}
document.getElementById('numbers').addEventListener('keydown', backspace_space);

function upper_case() {
    const holder_input = document.getElementById('holder');
    holder_input.value = holder_input.value.toUpperCase();
}

function holder_limit() {
    const holder_input = document.getElementById('holder');
    let holder = holder_input.value;

    let count = holder.length;

    let new_holder = '';
    if (count > 25) {
        new_holder = holder.slice(0, 25);
    } else {
        new_holder = holder;
    }
    holder_input.value = new_holder;
}

function validate_data() {
    const data_input = document.getElementById('data');
    const data = data_input.value;

    const filtered_data = data.replace(/\D/g, '');

    data_input.value = filtered_data;
}

function add_slash() {
    const data_input = document.getElementById('data');
    let value = data_input.value;

    let count = 0;
    let formated_value = '';

    for (let i = 0; i < value.length; i++) {
        if (count < 4) {
            count++;
            formated_value += value[i];

            if (count ===2) {
                formated_value += '/';
            }
        }
    }

    data_input.value = formated_value;
}

function backspace_slash(event) {
    if (event.key === 'Backspace') {
        const numbers_input = document.getElementById('data');
        const cursorPosition = numbers_input.selectionStart;
        const value = numbers_input.value;

        if (cursorPosition > 0 && value[cursorPosition - 1] === '/') {
            numbers_input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
        }
    }
}
document.getElementById('data').addEventListener('keydown', backspace_slash);

function limit_cvv() {
    const cvv_input = document.getElementById('cvv');
    let value = cvv_input.value;

    let count = 0;
    let formated_value = '';

    for (let i = 0; i < value.length; i++) {
        if (count < 3) {
            count++;
            formated_value += value[i];
        }
    }

    cvv_input.value = formated_value;
}

function replace_numbers() {
    const numbers_input = document.getElementById('numbers');
    const input = numbers_input.value;

    const numbers_output = document.getElementById('output_nums');
    let output = numbers_output.textContent;

    let output_nums = '';
    for (let i = 0; i < output.length; i++) {
        if (output[i] === ' ') {
            output_nums += ' ';
        } else if (i < input.length) {
            output_nums += input[i];
        } else {
            output_nums += 'X';
        }
    }

    numbers_output.textContent = output_nums;
}

function replace_holder() {
    const holder_input = document.getElementById('holder');
    const input = holder_input.value;

    const holder_output = document.getElementById('output_holder');
    let output = holder_output.textContent;

    let output_holder = '';
    const stroka = 'HOLDER NAME'
    for (let i = 0; i < Math.max(output.length, input.length); i++) {
        if (i < input.length) {
            output_holder += input[i];
        } else {
            if (output.length > stroka.length) {
                output_holder += '';
            } else {
                const index = i % stroka.length;
                output_holder += stroka[index];
            }
        }
    }

    holder_output.textContent = output_holder;
}

function replace_data() {
    const data_input = document.getElementById('data');
    const input = data_input.value;

    const data_output = document.getElementById('output_data');
    let output = data_output.textContent;

    let output_data = '';
    for (let i = 0; i < output.length; i++) {
        if (output[i] === '/') {
            output_data += '/';
        } else if (i < input.length) {
            output_data += input[i];
        } else {
            output_data += 'X';
        }
    }

    data_output.textContent = output_data;
}

function replace_cvv() {
    const cvv_input = document.getElementById('cvv');
    const input = cvv_input.value;

    const cvv_output = document.getElementById('output_cvv');
    let output = cvv_output.textContent;

    let output_cvv = '';
    const stroka = 'CVV';
    for (let i = 0; i < output.length; i++) {
        if (i < input.length) {
            output_cvv += input[i];
        } else {
            if (output.length > stroka.length) {
                output_cvv += '';
            } else {
                const index = i % stroka.length;
                output_cvv += stroka[index];
            }
        }
    }

    cvv_output.textContent = output_cvv;
}

///
///

const box = document.getElementById('card');
const box_cvv = document.getElementById('card_with_cvv')
const cvv = document.getElementById('cvv');
const numbers = document.getElementById('numbers');
const holder = document.getElementById('holder');
const data = document.getElementById('data');

cvv.addEventListener('click', function() {
    box.classList.add('expanded_from');
    box.classList.remove('expanded_to', 'expanded_to_holder', 'expanded_to_data');
});

numbers.addEventListener('click', function() {
    if (box.classList.contains('expanded_from')) {
        box.classList.add('expanded_to');
        box.classList.remove('expanded_to_holder', 'expanded_to_data');
    }
});

holder.addEventListener('click', function() {
    if (box.classList.contains('expanded_from')) {
        box.classList.add('expanded_to');
        box.classList.remove('expanded_to_numbers', 'expanded_to_data');
    }
});

data.addEventListener('click', function() {
    if (box.classList.contains('expanded_from')) {
        box.classList.add('expanded_to');
        box.classList.remove('expanded_to_numbers', 'expanded_to_holder');
    }
});

///
///

cvv.addEventListener('click', function() {
    box_cvv.classList.add('expanded_to_cvv');
    box_cvv.classList.remove('expanded_from_cvv', 'expanded_from_cvv_holder', 'expanded_from_cvv_data');
});

numbers.addEventListener('click', function() {
    if (box_cvv.classList.contains('expanded_to_cvv')) {
        box_cvv.classList.add('expanded_from_cvv');
        box_cvv.classList.remove('expanded_from_cvv_holder', 'expanded_from_cvv_data');
    }
});

holder.addEventListener('click', function() {
    if (box_cvv.classList.contains('expanded_to_cvv')) {
        box_cvv.classList.add('expanded_from_cvv');
        box_cvv.classList.remove('expanded_from_cvv_numbers', 'expanded_from_cvv_data');
    }
});

data.addEventListener('click', function() {
    if (box_cvv.classList.contains('expanded_to_cvv')) {
        box_cvv.classList.add('expanded_from_cvv');
        box_cvv.classList.remove('expanded_from_cvv_numbers', 'expanded_from_cvv_holder');
    }
});