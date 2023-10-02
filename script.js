// Идентификатор вашей Google Таблицы.
const spreadsheetId = '1B3EuTXqeou1szvTiYoR6b39cGMZlt5arXg2zxqG1Ruk';

// Ваш ключ доступа к Google Sheets API.
const apiKey = 'AIzaSyCKNkSvsk1cYntkHWw37XFWGI1XtwJ6pek';

// Функция для загрузки данных из Google Таблицы и вывода данных начиная со второй строки.
function loadGoogleSheet() {
    $.ajax(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A2:C?key=${apiKey}`)
    .done(function(data) {
        const values = data.values;
        if (values && values.length > 0) {
            const contentDiv = document.getElementById('content');
            for (const row of values) {
                if (row[0] !== undefined) {
                    const existingYear = contentDiv.querySelector(`.year[data-year="${row[0]}"]`);
                    if (existingYear) {
                        const eventContainer = document.createElement('div');
                        eventContainer.className = 'event';
                        eventContainer.textContent = row[1];

                        // Проверяем значение третьего столбца и определяем, с какой стороны разместить событие.
                        if (row[2] === '1') {
                            eventContainer.classList.add('event-right');
                        } else {
                            eventContainer.classList.add('event-left');
                        }

                        existingYear.appendChild(eventContainer);

                        // Добавляем отступ между событиями
                        eventContainer.style.marginBottom = '10px';
                    } else {
                        const yearContainer = document.createElement('div');
                        yearContainer.className = 'year';
                        yearContainer.dataset.year = row[0];

                        const yearText = document.createElement('div');
                        yearText.className = 'year-text';
                        yearText.textContent = row[0];

                        yearContainer.appendChild(yearText);

                        if (row[1] !== undefined) {
                            const eventContainer = document.createElement('div');
                            eventContainer.className = 'event';
                            eventContainer.textContent = row[1];

                            // Проверяем значение третьего столбца и определяем, с какой стороны разместить событие.
                            if (row[2] === '1') {
                                eventContainer.classList.add('event-right');
                            } else {
                                eventContainer.classList.add('event-left');
                            }

                            yearContainer.appendChild(eventContainer);

                            // Добавляем отступ между событиями
                            eventContainer.style.marginBottom = '10px';
                        }

                        contentDiv.appendChild(yearContainer);
                    }
                }
            }

            // Вызываем функцию для установки высот блоков годов после загрузки данных
            adjustYearHeights();
        } else {
            console.error('Данные не найдены.');
        }
    })
    .fail(function(error) {
        console.error('Произошла ошибка при загрузке данных:', error);
    });
}

function adjustYearHeights() {
    const years = document.querySelectorAll('.year');
    years.forEach(year => {
        const events = year.querySelectorAll('.event');
        let maxEventHeight = 0;
        events.forEach(event => {
            maxEventHeight += event.clientHeight;
        });
        year.style.height = `${maxEventHeight + 40}px`; // Добавляем небольшой отступ сверху и снизу
    });
}

// Загрузка данных при загрузке страницы.
loadGoogleSheet();

// Вызываем функцию для установки высот блоков годов после загрузки данных
adjustYearHeights();
