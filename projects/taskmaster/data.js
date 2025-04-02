let block_count = 0;
let count_of_yes_block = 0;

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

console.log(tasks);

function load_tasks_from_local_storage() {
    tasks.forEach(task => {
        if (task.state === 'ожидание') {
            create_task_block(task.task);
        }
        if (task.state === 'выполнено') {
            load_yes_element(task.task);
        }
    });
}

function create_task_block(text) {
    const main_item = document.createElement('div');
    main_item.className = 'main_item';

    const new_block = document.createElement('div');
    new_block.className = 'new_block';

    const mark_yes = document.createElement('button');
    mark_yes.className = 'mark_yes';
    mark_yes.addEventListener('click', append_yes_item);

    const mark_no = document.createElement('button');
    mark_no.className = 'mark_no';
    mark_no.addEventListener('click', delete_item);

    block_count++;

    if (block_count === 1) {
        main_item.style.marginTop = '50px';
    }

    height_container();

    new_block.textContent = text;
    mark_yes.textContent = '✓';
    mark_no.textContent = '✕';

    main_item.appendChild(new_block);
    main_item.appendChild(mark_yes);
    main_item.appendChild(mark_no);

    const container = document.getElementById('container');
    container.appendChild(main_item);
}


function delete_task(task) {
    const index = tasks.findIndex(item => item['task'] === task);
    if (index !== -1) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}


function change_state(task, state) {
    tasks.forEach((item) => {
        if (task === item['task']) {
            item['state'] = state;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }    
    });
}

function load_yes_element(text) {
    const item_yes = document.createElement('div');
    item_yes.className = 'item_yes';

    const mark = document.createElement('span');
    mark.className = 'mark';
    mark.textContent = '✔';

    const item_text_yes = document.createElement('span');
    item_text_yes.className = 'item_text_yes';
    item_text_yes.textContent = text;

    const button_delete_item_yes = document.createElement('button');
    button_delete_item_yes.classList = 'button_delete_item_yes';
    button_delete_item_yes.textContent = '✕';
    button_delete_item_yes.addEventListener('click', delete_yes_item);

    item_yes.appendChild(mark);
    item_yes.appendChild(item_text_yes);
    item_yes.appendChild(button_delete_item_yes);

    const katalogElement = document.querySelector('.katalog');
    katalogElement.appendChild(item_yes);

    count_of_yes_block++;

    if (count_of_yes_block === 1) {
        item_yes.style.paddingTop = "70px";
    }
}

function clear_yes_items() {
    const newTasks = tasks.filter(item => item['state'] !== 'выполнено');

    tasks = newTasks;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

if (tasks.length != 0) {
    window.onload = load_tasks_from_local_storage;
}

function height_container() {
    event.preventDefault();

    const container = document.getElementById('container');

    var currentHeight = container.offsetHeight;

    var newHeight = (block_count === 1) ? currentHeight + 90 : currentHeight + 80; 
    
    container.style.height = newHeight + "px";
}

function add_new_block() {
    const state = 'ожидание';

    const text = document.getElementById('task').value;
    
    if (text.trim() !== '') {
        const main_item = document.createElement('div');
        main_item.className = 'main_item';

        const new_block = document.createElement('div');
        new_block.className = 'new_block';

        const mark_yes = document.createElement('button');
        mark_yes.className = 'mark_yes';
        mark_yes.addEventListener('click', append_yes_item);

        const mark_no = document.createElement('button');
        mark_no.className = 'mark_no';
        mark_no.addEventListener('click', delete_item);

        block_count++;

        if (block_count === 1) {
            main_item.style.marginTop = '50px';
        }

        height_container();

        new_block.textContent = text;
        mark_yes.textContent = '✓';
        mark_no.textContent = '✕';
        
        main_item.appendChild(new_block);
        main_item.appendChild(mark_yes);
        main_item.appendChild(mark_no);

        const container = document.getElementById('container');
        container.appendChild(main_item);
        
        document.getElementById('task').value = '';

        tasks.push({ task: text, state: state });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    else {
        event.preventDefault();
        alert('Вы не ввели задание.');
    }
}

function delete_item(event) {
    event.preventDefault();

    const item = event.target.parentNode;
    const task = item.textContent.trim();
    const new_str = task.slice(0, -2);
    item.remove();
    
    const container = document.getElementById('container');
    
    var currentHeight = container.offsetHeight;
    
    var newHeight = (block_count === 1) ? currentHeight - 90 : currentHeight - 80;
    
    container.style.height = newHeight + "px";
    
    block_count--;
    
    if (block_count > 0) {
        const main_items = container.querySelectorAll('.main_item');
        main_items[0].style.marginTop = '50px';
    }

    delete_task(new_str);
}

function clear_all(event) {
    event.preventDefault();

    const container = document.getElementById('container');
    const main_items = container.querySelectorAll('.main_item');

    main_items.forEach(item => {
        item.remove();
    });

    container.style.height = '280px';
    block_count = 0;

    localStorage.clear();
}

function append_yes_item(event) {
    event.preventDefault();

    const item_yes = document.createElement('div');
    item_yes.className = 'item_yes';

    const mark = document.createElement('span');
    mark.className = 'mark';
    mark.textContent = '✔';

    const item_text_yes = document.createElement('span');
    item_text_yes.className = 'item_text_yes';
    item_text_yes.textContent = event.target.parentNode.querySelector('.new_block').textContent;

    const button_delete_item_yes = document.createElement('button');
    button_delete_item_yes.classList = 'button_delete_item_yes';
    button_delete_item_yes.textContent = '✕';
    button_delete_item_yes.addEventListener('click', delete_yes_item);

    item_yes.appendChild(mark);
    item_yes.appendChild(item_text_yes);
    item_yes.appendChild(button_delete_item_yes);

    const katalogElement = document.querySelector('.katalog');
    katalogElement.appendChild(item_yes);

    count_of_yes_block++;

    if (count_of_yes_block === 1) {
        item_yes.style.paddingTop = "70px";
    }

    const del_item = event.target.parentNode;
    del_item.remove();
    
    const container = document.getElementById('container');
    
    var currentHeight = container.offsetHeight;
    
    var newHeight = (block_count === 1) ? currentHeight - 90 : currentHeight - 80;
    
    container.style.height = newHeight + "px";
    
    block_count--;
    
    if (block_count > 0) {
        const main_items = container.querySelectorAll('.main_item');
        main_items[0].style.marginTop = '50px';
    }

    const state = 'выполнено';
    const item = event.target.parentNode;
    const task = item.textContent.trim();
    const new_str = task.slice(0, -2);

    change_state(new_str, state);
}

function delete_yes_item(event) {
    event.preventDefault();

    const item = event.target.parentNode;
    const task = item.textContent.trim();
    const new_str = task.slice(1, -1);
    item.remove();

    count_of_yes_block--;

    const items = document.querySelectorAll('.item_yes');
    
    if (items.length > 0) {
        items[0].style.paddingTop = "70px";
    }

    delete_task(new_str);
}

function clear_all_mark(event) {
    event.preventDefault();
    const items = document.querySelectorAll('.item_yes');

    items.forEach(item => {
        item.remove();
    });

    count_of_yes_block = 0;

    clear_yes_items();
}