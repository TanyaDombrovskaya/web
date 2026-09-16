const panelItems = document.querySelectorAll('.panel-item');

const statusDirectory = {
    enable: 'active',
    disable: 'disable'
};

panelItems.forEach(item => {
    item.status = statusDirectory.disable;
});

panelItems[0].status = statusDirectory.enable;
panelItems[0].classList.replace('panel-item', 'panel-item-click');

let currentLoaderId = null;
let currentLoaderNumber = '';
let currentDowntimeId = null;
let searchTimeout = null;

function resetStatus(items) {
    items.forEach(item => {
        item.status = statusDirectory.disable;
        if (item.classList.contains('panel-item-click')) {
            item.classList.replace('panel-item-click', 'panel-item');
        }
    });
}

function addStatus(item) {
    item.status = statusDirectory.enable;
    if (item.classList.contains('panel-item')) {
        item.classList.replace('panel-item', 'panel-item-click');
    }
}

async function loadLoadersData() {
    const tbody = document.getElementById('loaders-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Загрузка...</td></tr>';
    
    try {
        const response = await fetch('getLoaders.php');
        if (!response.ok) throw new Error('Ошибка HTTP: ' + response.status);
        const html = await response.text();
        tbody.innerHTML = html;
        
        if (currentLoaderNumber) {
            selectLoaderByNumber(currentLoaderNumber);
        } else {
            selectFirstLoader();
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        tbody.innerHTML = '<tr><td colspan="8" style="color: red; text-align: center;">Ошибка загрузки данных</td></tr>';
    }
}

function selectLoaderByNumber(loaderNumber) {
    const rows = document.querySelectorAll('#loaders-table-body tr');
    let found = false;
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
            const rowNumber = cells[2]?.textContent?.trim() || '';
            if (rowNumber === loaderNumber) {
                row.classList.add('selected');
                found = true;
                
                const loaderId = cells[0]?.textContent?.trim() || '';
                currentLoaderId = loaderId;
                currentLoaderNumber = rowNumber;
                
                const loaderNumberSpan = document.querySelector('.loader-number');
                if (loaderNumberSpan) {
                    loaderNumberSpan.textContent = rowNumber;
                }
                
                if (loaderId) {
                    loadDowntimes(loaderId);
                }
            } else {
                row.classList.remove('selected');
            }
        }
    });
    
    if (!found) {
        selectFirstLoader();
    }
}

function selectFirstLoader() {
    const firstRow = document.querySelector('#loaders-table-body tr');
    if (!firstRow) {
        currentLoaderId = null;
        currentLoaderNumber = '';
        const loaderNumberSpan = document.querySelector('.loader-number');
        if (loaderNumberSpan) {
            loaderNumberSpan.textContent = '';
        }
        const tbody = document.getElementById('downtimes-table-body');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Выберите погрузчик</td></tr>';
        }
        return;
    }
    
    const cells = firstRow.querySelectorAll('td');
    if (cells.length < 3) return;
    
    const loaderNumber = cells[2]?.textContent?.trim() || '';
    if (!loaderNumber || loaderNumber === 'Нет данных' || loaderNumber === 'Загрузка...') {
        return;
    }
    
    const loaderId = cells[0]?.textContent?.trim() || '';
    
    const table = firstRow.closest('.table-wrapper table');
    if (table) {
        table.querySelectorAll('tr').forEach(r => r.classList.remove('selected'));
    }
    
    firstRow.classList.add('selected');
    
    currentLoaderId = loaderId;
    currentLoaderNumber = loaderNumber;
    
    const loaderNumberSpan = document.querySelector('.loader-number');
    if (loaderNumberSpan) {
        loaderNumberSpan.textContent = loaderNumber;
    }
    
    if (loaderId) {
        loadDowntimes(loaderId);
    }
}

async function loadDowntimes(loaderId) {
    const tbody = document.getElementById('downtimes-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Загрузка простоев...</td></tr>';
    
    try {
        const response = await fetch(`getDowntimes.php?loaderId=${loaderId}`);
        if (!response.ok) throw new Error('Ошибка HTTP: ' + response.status);
        const html = await response.text();
        tbody.innerHTML = html;
    } catch (error) {
        console.error('Ошибка:', error);
        tbody.innerHTML = '<tr><td colspan="6" style="color: red; text-align: center;">Ошибка загрузки простоев</td></tr>';
    }
}

function addRowToTable() {
    const tbody = document.getElementById('loaders-table-body');
    if (!tbody) return;
    
    const oldRow = document.getElementById('add-row');
    if (oldRow) oldRow.remove();
    
    const newRow = document.createElement('tr');
    newRow.id = 'add-row';
    newRow.style.backgroundColor = '#f9f9f9';
    
    newRow.innerHTML = `
        <td>—</td>
        <td><input type="text" placeholder="Марка"></td>
        <td><input type="text" placeholder="Номер"></td>
        <td><input type="text" placeholder="Вес"></td>
        <td>
            <select>
                <option value="true">✔</option>
                <option value="false">✖</option>
            </select>
        </td>
        <td>—</td>
        <td><input type="text" placeholder="Пользователь"></td>
        <td>
            <div class="td-btn-container">
                <button class="edit-btn save-new-btn">✔</button>
                <button class="delete-btn cancel-new-btn">✖</button>
            </div>
        </td>
    `;
    
    tbody.appendChild(newRow);
    
    newRow.querySelector('.save-new-btn').addEventListener('click', function() {
        saveNewRow(newRow);
    });
    
    newRow.querySelector('.cancel-new-btn').addEventListener('click', function() {
        newRow.remove();
    });
}

async function saveNewRow(row) {
    const inputs = row.querySelectorAll('input');
    const select = row.querySelector('select');
    
    const brand = inputs[0]?.value?.trim() || '';
    const number = inputs[1]?.value?.trim() || '';
    const weight = inputs[2]?.value?.trim() || null;
    const selectValue = select.value;
    const user = inputs[3]?.value?.trim() || '';
    
    if (!brand || !number) {
        alert('Марка и Номер обязательны');
        return;
    }
    
    const formData = new FormData();
    formData.append('brand', brand);
    formData.append('number', number);
    formData.append('weight', weight);
    formData.append('active', selectValue);
    formData.append('user', user);
    
    try {
        const response = await fetch('addLoader.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        
        if (result.success) {
            row.remove();
            const currentNumber = currentLoaderNumber;
            await loadLoadersData();
            if (currentNumber) {
                selectLoaderByNumber(currentNumber);
            }
        } else {
            alert('Ошибка: ' + result.message);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при сохранении');
    }
}

function filterTable() {
    const input = document.querySelector('.search-container input[type="text"]');
    const searchValue = input?.value?.toLowerCase()?.trim() || '';
    const rows = document.querySelectorAll('#loaders-table-body tr');
    let hasVisibleRows = false;
    
    rows.forEach(row => {
        if (row.id === 'add-row') {
            row.style.display = 'none';
            return;
        }
        
        if (row.closest('thead')) return;
        
        const cells = row.querySelectorAll('td');
        let found = false;
        
        if (!searchValue) {
            found = true;
        } else {
            cells.forEach(cell => {
                const text = cell.textContent?.toLowerCase()?.trim() || '';
                if (text.includes(searchValue)) {
                    found = true;
                }
            });
        }
        
        if (found) {
            row.style.display = '';
            hasVisibleRows = true;
        } else {
            row.style.display = 'none';
        }
    });
    
    const tbody = document.getElementById('loaders-table-body');
    const noDataRow = tbody.querySelector('.no-data-row');
    
    if (!hasVisibleRows && !noDataRow) {
        const tr = document.createElement('tr');
        tr.className = 'no-data-row';
        tr.innerHTML = '<td colspan="8" style="text-align: center; padding: 20px;">Ничего не найдено</td>';
        tbody.appendChild(tr);
    } else if (hasVisibleRows && noDataRow) {
        noDataRow.remove();
    }
}

function resetFilter() {
    const input = document.querySelector('.search-container input[type="text"]');
    if (input) {
        input.value = '';
    }
    
    const rows = document.querySelectorAll('#loaders-table-body tr');
    rows.forEach(row => {
        row.style.display = '';
    });
    
    const tbody = document.getElementById('loaders-table-body');
    const noDataRow = tbody.querySelector('.no-data-row');
    if (noDataRow) {
        noDataRow.remove();
    }
}

function showSectionContent(sectionType) {
    const directoryContainer = document.getElementById('directory-container');
    
    directoryContainer.innerHTML = '';
    
    switch(sectionType) {
        case 'users':
            directoryContainer.innerHTML = ``;
            break;
            
        case 'notifications':
            directoryContainer.innerHTML = ``;
            break;
            
        case 'settings':
            directoryContainer.innerHTML = ``;
            break;
            
        case 'loaders':
            directoryContainer.innerHTML = `
                <div class="header-directory-container">
                    <h1>Справочник погрузчиков</h1>
                    <div class="search-container">
                        <p>Номер погрузчика</p>
                        <input type="text" id="searchInput">
                        <div class="search-button" id="searchBtn">Искать</div>
                        <div class="reset-filter-container" id="resetFilterBtn">Сбросить фильтр</div>
                    </div>
                    <div class="add-button" id="addBtn">Добавить</div>
                </div>
                
                <div class="tables-container">
                    <div class="table-wrapper">
                        <div class="table-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Код записи</th>
                                        <th>Марка</th>
                                        <th>Номер</th>
                                        <th>Грузоподъем-ность</th>
                                        <th>Активен</th>
                                        <th>Время и дата изменения</th>
                                        <th>Пользователь</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody id="loaders-table-body">
                                    <tr><td colspan="8" style="text-align: center;">Загрузка...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
            
                    <div class="table-wrapper">
                        <div class="table-header">
                            <div class="downtime-container">
                                <span class="table-title">Простои по погрузчику</span>
                                <span class="loader-number"></span>
                                <div class="add-simple-button" id="addDowntimeBtn">Добавить</div>
                            </div>
                        </div>
                        <div class="table-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Код записи</th>
                                        <th>Начало</th>
                                        <th>Окончание</th>
                                        <th>Время простоя</th>
                                        <th>Причина</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody id="downtimes-table-body">
                                    <tr><td colspan="6" style="text-align: center;">Выберите погрузчик</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('addBtn').addEventListener('click', addRowToTable);
            
            document.getElementById('searchBtn').addEventListener('click', filterTable);
            
            document.getElementById('resetFilterBtn').addEventListener('click', function() {
                resetFilter();
                if (currentLoaderNumber) {
                    selectLoaderByNumber(currentLoaderNumber);
                } else {
                    selectFirstLoader();
                }
            });
            
            document.getElementById('searchInput').addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    filterTable();
                }
            });
            
            const addDowntimeBtn = document.getElementById('addDowntimeBtn');
            if (addDowntimeBtn) {
                addDowntimeBtn.addEventListener('click', openDowntimeModal);
            }
            
            loadLoadersData();
            break;

        case 'backup':
            directoryContainer.innerHTML = ``;
            break;
            
        case 'directory':
            directoryContainer.innerHTML = ``;
            break;
            
        default:
            directoryContainer.innerHTML = '<h1>Раздел не найден</h1>';
    }
}

panelItems.forEach(item => {
    item.addEventListener('click', function() {
        if (item.status === statusDirectory.enable) {
            return; 
        }
        
        resetStatus(panelItems);
        addStatus(item);
        
        const sectionType = item.getAttribute('sectionData');
        showSectionContent(sectionType);
    });
});

document.addEventListener('click', function(event) {
    const row = event.target.closest('tr');
    if (!row) return;
    
    const tbody = row.closest('#loaders-table-body');
    if (!tbody) return;
    
    if (row.closest('thead')) return;
    if (row.id === 'add-row') return;
    
    const cells = row.querySelectorAll('td');
    if (cells.length < 3) return;
    
    const loaderNumber = cells[2]?.textContent?.trim() || '';
    const loaderId = cells[0]?.textContent?.trim() || '';
    
    if (!loaderId || loaderId === '—' || !loaderNumber) return;
    
    tbody.querySelectorAll('tr').forEach(r => r.classList.remove('selected'));
    
    row.classList.add('selected');
    
    currentLoaderId = loaderId;
    currentLoaderNumber = loaderNumber;
    
    const loaderNumberSpan = document.querySelector('.loader-number');
    if (loaderNumberSpan) {
        loaderNumberSpan.textContent = loaderNumber;
    }
    
    if (loaderId) {
        loadDowntimes(loaderId);
    }
});

document.addEventListener('click', function(event) {
    const target = event.target;
    
    if (target.classList.contains('delete-btn')) {
        const row = target.closest('tr');
        if (!row || row.id === 'add-row') return;
        
        if (row.classList.contains('editing')) {
            cancelEditMode(row);
            return;
        }
        
        const id = target.getAttribute('data-id');
        if (id && confirm('Удалить запись?')) {
            deleteLoader(id);
        }
        return;
    }
    
    if (target.classList.contains('edit-btn')) {
        const row = target.closest('tr');
        if (!row || row.id === 'add-row') return;
        
        const isEditing = row.classList.contains('editing');
        
        if (isEditing) {
            saveEditedRow(row);
        } else {
            enableEditMode(row);
        }
    }
});

function enableEditMode(row) {
    const cells = row.querySelectorAll('td');
    if (cells.length < 7) return;
    
    const originalData = {
        brand: cells[1]?.textContent?.trim() || '',
        number: cells[2]?.textContent?.trim() || '',
        weight: cells[3]?.textContent?.trim() || '',
        active: cells[4]?.textContent?.trim() === '✔',
        user: cells[6]?.textContent?.trim() || ''
    };
    
    row.dataset.originalBrand = originalData.brand;
    row.dataset.originalNumber = originalData.number;
    row.dataset.originalWeight = originalData.weight;
    row.dataset.originalActive = originalData.active ? 'true' : 'false';
    row.dataset.originalUser = originalData.user;
    
    cells[1].innerHTML = `<input type="text" value="${originalData.brand}">`;
    cells[2].innerHTML = `<input type="text" value="${originalData.number}">`;
    cells[3].innerHTML = `<input type="text" value="${originalData.weight}">`;
    cells[4].innerHTML = `
        <select>
            <option value="true" ${originalData.active ? 'selected' : ''}>✔</option>
            <option value="false" ${!originalData.active ? 'selected' : ''}>✖</option>
        </select>
    `;
    cells[5].innerHTML = '—';
    cells[6].innerHTML = `<input type="text" value="${originalData.user}">`;
    
    cells[7].querySelector('.edit-btn').textContent = '✔';
    cells[7].querySelector('.edit-btn').title = 'Сохранить';
    
    row.classList.add('editing');
}

function cancelEditMode(row) {
    const cells = row.querySelectorAll('td');
    if (cells.length < 7) return;
    
    const brand = row.dataset.originalBrand || '';
    const number = row.dataset.originalNumber || '';
    const weight = row.dataset.originalWeight || '';
    const active = row.dataset.originalActive === 'true';
    const user = row.dataset.originalUser || '';
    
    cells[1].textContent = brand;
    cells[2].textContent = number;
    cells[3].textContent = weight;
    cells[4].textContent = active ? '✔' : '✖';
    cells[5].textContent = '—';
    cells[6].textContent = user;
    
    cells[7].querySelector('.edit-btn').textContent = '✎';
    cells[7].querySelector('.edit-btn').title = 'Редактировать';
    
    row.classList.remove('editing');
    
    delete row.dataset.originalBrand;
    delete row.dataset.originalNumber;
    delete row.dataset.originalWeight;
    delete row.dataset.originalActive;
    delete row.dataset.originalUser;
}

async function saveEditedRow(row) {
    const cells = row.querySelectorAll('td');
    if (cells.length < 7) return;
    
    const loaderId = cells[0]?.textContent?.trim() || '';
    
    const inputs = row.querySelectorAll('input');
    const select = row.querySelector('select');
    
    const brand = inputs[0]?.value?.trim() || '';
    const number = inputs[1]?.value?.trim() || '';
    const weight = inputs[2]?.value?.trim() || null;
    const active = select?.value === 'true';
    const user = inputs[3]?.value?.trim() || '';
    
    if (!brand || !number) {
        alert('Марка и Номер обязательны');
        return;
    }
    
    const formData = new FormData();
    formData.append('loaderId', loaderId);
    formData.append('brand', brand);
    formData.append('number', number);
    formData.append('weight', weight);
    formData.append('active', active ? 'true' : 'false');
    formData.append('user', user);
    
    try {
        const response = await fetch('updateLoader.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        
        if (result.success) {
            const currentNumber = currentLoaderNumber;
            await loadLoadersData();
            if (currentNumber) {
                selectLoaderByNumber(currentNumber);
            }
        } else {
            alert('Ошибка: ' + result.message);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при сохранении');
    }
}

async function deleteLoader(id) {
    try {
        const response = await fetch(`deleteLoader.php?id=${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        
        if (result.success) {
            if (currentLoaderId === id) {
                currentLoaderId = null;
                currentLoaderNumber = '';
                const loaderNumberSpan = document.querySelector('.loader-number');
                if (loaderNumberSpan) {
                    loaderNumberSpan.textContent = '';
                }
                const tbody = document.getElementById('downtimes-table-body');
                if (tbody) {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Выберите погрузчик</td></tr>';
                }
            }
            await loadLoadersData();
        } else {
            alert('Ошибка: ' + result.message);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при удалении');
    }
}

function setCurrentDateTime() {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById('dtStart').value = dateTimeString;
    
    const endTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const endYear = endTime.getFullYear();
    const endMonth = String(endTime.getMonth() + 1).padStart(2, '0');
    const endDay = String(endTime.getDate()).padStart(2, '0');
    const endHours = String(endTime.getHours()).padStart(2, '0');
    const endMinutes = String(endTime.getMinutes()).padStart(2, '0');
    
    const endDateTimeString = `${endYear}-${endMonth}-${endDay}T${endHours}:${endMinutes}`;
    document.getElementById('dtEnd').value = endDateTimeString;
}

function resetModalToAddMode() {
    document.querySelector('#downtimeModal .modal-header h2').textContent = 'Проблемы с погрузчиком? опишите';
    document.querySelector('#downtimeModal .save-btn').textContent = 'Сохранить';
    document.querySelector('#downtimeModal .save-btn').onclick = saveDowntime;
    currentDowntimeId = null;
}

function openDowntimeModal() {
    const loaderNumberSpan = document.querySelector('.loader-number');
    const loaderNumber = loaderNumberSpan?.textContent?.trim() || '';
    
    if (!loaderNumber) {
        alert('Сначала выберите погрузчик в таблице');
        return;
    }
    
    currentLoaderNumber = loaderNumber;
    
    fetch(`getLoaderIdByNumber.php?number=${encodeURIComponent(loaderNumber)}`)
        .then(response => response.json())
        .then(result => {
            if (result.success && result.loaderId) {
                currentLoaderId = result.loaderId;
                
                resetModalToAddMode();
                document.getElementById('dtCause').value = '';
                setCurrentDateTime();
                document.getElementById('downtimeModal').style.display = 'flex';
            } else {
                alert('Ошибка: погрузчик с номером ' + loaderNumber + ' не найден');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка при поиске погрузчика');
        });
}

function closeDowntimeModal() {
    document.getElementById('downtimeModal').style.display = 'none';
    document.querySelectorAll('.modal-error').forEach(el => el.classList.remove('show'));
    resetModalToAddMode();
}

async function saveDowntime() {
    const dtStart = document.getElementById('dtStart').value;
    const dtEnd = document.getElementById('dtEnd').value;
    const cause = document.getElementById('dtCause').value.trim();
    
    if (!dtStart) {
        alert('Пожалуйста, укажите время начала простоя');
        return;
    }
    
    if (!dtEnd) {
        alert('Пожалуйста, укажите время окончания простоя');
        return;
    }
    
    if (new Date(dtEnd) <= new Date(dtStart)) {
        alert('Время окончания должно быть позже времени начала');
        return;
    }
    
    if (!cause) {
        alert('Пожалуйста, опишите причину простоя');
        return;
    }
    
    if (!currentLoaderId) {
        alert('Ошибка: не выбран погрузчик');
        return;
    }
    
    const formData = new FormData();
    formData.append('loaderId', currentLoaderId);
    formData.append('dtStart', dtStart);
    formData.append('dtEnd', dtEnd);
    formData.append('cause', cause);
    
    try {
        const response = await fetch('addDowntime.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeDowntimeModal();
            if (currentLoaderId) {
                loadDowntimes(currentLoaderId);
            }
        } else {
            alert('Ошибка: ' + result.message);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при сохранении простоя');
    }
}

function openEditDowntimeModal(downtimeId) {
    const rows = document.querySelectorAll('#downtimes-table-body tr');
    let targetRow = null;
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
            const rowId = cells[0]?.textContent?.trim() || '';
            if (rowId === downtimeId) {
                targetRow = row;
            }
        }
    });
    
    if (!targetRow) {
        alert('Ошибка: запись не найдена');
        return;
    }
    
    const cells = targetRow.querySelectorAll('td');
    if (cells.length < 5) {
        alert('Ошибка: не удалось получить данные');
        return;
    }
    
    const dtStartText = cells[1]?.textContent?.trim() || '';
    const dtEndText = cells[2]?.textContent?.trim() || '';
    const causeText = cells[4]?.textContent?.trim() || '';
    
    let dtStart = '';
    let dtEnd = '';
    
    if (dtStartText && dtStartText !== '—') {
        const parts = dtStartText.split(' ');
        if (parts.length === 2) {
            const dateParts = parts[0].split('.');
            const timeParts = parts[1].split(':');
            if (dateParts.length === 3 && timeParts.length === 2) {
                dtStart = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timeParts[0]}:${timeParts[1]}`;
            }
        }
    }
    
    if (dtEndText && dtEndText !== '—' && dtEndText !== 'Действует') {
        const parts = dtEndText.split(' ');
        if (parts.length === 2) {
            const dateParts = parts[0].split('.');
            const timeParts = parts[1].split(':');
            if (dateParts.length === 3 && timeParts.length === 2) {
                dtEnd = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timeParts[0]}:${timeParts[1]}`;
            }
        }
    }
    
    currentDowntimeId = downtimeId;
    
    document.getElementById('dtStart').value = dtStart;
    document.getElementById('dtEnd').value = dtEnd;
    document.getElementById('dtCause').value = causeText;
    
    document.querySelector('#downtimeModal .save-btn').onclick = updateDowntime;
    
    document.getElementById('downtimeModal').style.display = 'flex';
}

async function updateDowntime() {
    const dtStart = document.getElementById('dtStart').value;
    const dtEnd = document.getElementById('dtEnd').value;
    const cause = document.getElementById('dtCause').value.trim();
    
    if (!dtStart) {
        alert('Пожалуйста, укажите время начала простоя');
        return;
    }
    
    if (!dtEnd) {
        alert('Пожалуйста, укажите время окончания простоя');
        return;
    }
    
    if (new Date(dtEnd) <= new Date(dtStart)) {
        alert('Время окончания должно быть позже времени начала');
        return;
    }
    
    if (!cause) {
        alert('Пожалуйста, опишите причину простоя');
        return;
    }
    
    if (!currentDowntimeId) {
        alert('Ошибка: не найден ID простоя');
        return;
    }
    
    const formData = new FormData();
    formData.append('downTimeId', currentDowntimeId);
    formData.append('dtStart', dtStart);
    formData.append('dtEnd', dtEnd);
    formData.append('cause', cause);
    
    try {
        const response = await fetch('updateDowntime.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeDowntimeModal();
            if (currentLoaderId) {
                loadDowntimes(currentLoaderId);
            }
        } else {
            alert('Ошибка: ' + result.message);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при обновлении простоя');
    }
}

async function deleteDowntime(downTimeId) {
    if (!confirm('Удалить информацию о простое? Вы уверены?')) {
        return;
    }
    
    try {
        const response = await fetch(`deleteDowntime.php?id=${downTimeId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            if (currentLoaderId) {
                loadDowntimes(currentLoaderId);
            }
        } else {
            alert('Ошибка: ' + result.message);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при удалении простоя');
    }
}

document.addEventListener('click', function(event) {
    const target = event.target;
    
    if (target.classList.contains('edit-downtime-btn')) {
        const downTimeId = target.getAttribute('data-id');
        if (downTimeId) {
            openEditDowntimeModal(downTimeId);
        }
        return;
    }
    
    if (target.classList.contains('delete-downtime-btn')) {
        const downTimeId = target.getAttribute('data-id');
        if (downTimeId) {
            deleteDowntime(downTimeId);
        }
        return;
    }
});

document.addEventListener('click', function(event) {
    const modal = document.getElementById('downtimeModal');
    if (event.target === modal) {
        closeDowntimeModal();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeDowntimeModal();
    }
});