const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const choices = {
    guide: guideChecked,
    audio: audioChecked,
    catalog: catalogChecked
  };

  const items = services
    .filter((service) => choices[service.id] === true)
    .map((service) => {
      const { title, price } = service;
      return { title: title.trim(), price };
    });

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return {
    count: items.length,
    total,
    items
  };
}

const programButton = document.querySelector('#show-program');
const program = document.querySelector('#program');
const form = document.querySelector('#service-form');
const guide = document.querySelector('#guide');
const audio = document.querySelector('#audio');
const catalog = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const result = document.querySelector('#result');
const reportJson = document.querySelector('#report-json');

let data;
try {
  data = JSON.parse(sourceJson);
} catch (error) {
  dataError.textContent = 'Ошибка данных.';
  dataError.hidden = false;
  programButton.hidden = true;
}

if (data) {
  form.hidden = false;

  programButton.addEventListener('click', () => {
    program.innerHTML = data.event.meeting;
    program.hidden = false;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const report = buildReport(
      data.services,
      guide.checked,
      audio.checked,
      catalog.checked
    );

    if (report.count === 0) {
      choiceError.textContent = 'Выберите хотя бы одну услугу.';
      choiceError.hidden = false;
      result.hidden = true;
      reportJson.hidden = true;
      return;
    }

    choiceError.hidden = true;

    const names = report.items.map((item) => item.title);
    result.innerHTML = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.`
      + names.map((name) => `<br>${name}`).join('');

    const reportString = JSON.stringify(report);
    JSON.parse(reportString); // Проверяем, что строка является корректным JSON.
    reportJson.textContent = reportString;

    result.hidden = false;
    reportJson.hidden = false;
  });
}
