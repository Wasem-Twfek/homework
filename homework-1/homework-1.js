const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

function ticketPrice(category) {
  switch (category) {
    case 1:
      return 300;
    case 2:
      return 500;
    case 3:
      return 900;
    default:
      return 0;
  }
}

function maxTickets(budget, price) {
  let count = 0;

  // Buy tickets one by one; no division or rounding is used.
  while (price > 0 && budget >= price) {
    budget -= price;
    count++;
  }

  return count;
}

function printTicketResult(category, budget) {
  const price = ticketPrice(category);

  if (price === 0) {
    console.log('неизвестная категория');
    return;
  }

  const count = maxTickets(budget, price);
  console.log(
    `Категория ${category}, билет ${price} руб., бюджет ${budget} руб.: можно купить ${count} шт.`
  );
}

function deliveryPrice(distance, total) {
  if (total >= 3000) {
    return 0;
  }

  if (distance <= 3) {
    return 0;
  }

  if (distance <= 10) {
    return 200;
  }

  return 200 + (distance - 10) * 25;
}

function printDelivery(distance, total) {
  const price = deliveryPrice(distance, total);
  console.log(
    `Расстояние ${distance} км, заказ ${total} руб.: доставка ${price} руб.`
  );
}

function printSteps(height) {
  let built = 0;

  for (let step = 1; step <= height; step++) {
    if (step === 4) {
      continue;
    }

    console.log(`Ступень ${step}`);
    built++;

    if (step === 10) {
      console.log('Дальше лестница не построена');
      break;
    }
  }

  console.log(`Всего построено: ${built}`);
}

async function main() {
  const rl = readline.createInterface({ input, output });
  const lines = rl[Symbol.asyncIterator]();

  async function ask(prompt) {
    output.write(prompt);
    const result = await lines.next();
    return result.done ? '' : result.value;
  }

  try {
    console.log('Выберите задачу:\n1 — билетная касса\n2 — доставка заказа\n3 — лестница');
    const choice = Number(await ask('Ваш выбор: '));

    switch (choice) {
      case 1: {
        const category = Number(await ask('Категория билета: '));
        const budget = Number(await ask('Бюджет: '));
        printTicketResult(category, budget);
        break;
      }
      case 2: {
        const distance = Number(await ask('Расстояние: '));
        const total = Number(await ask('Сумма заказа: '));
        printDelivery(distance, total);
        break;
      }
      case 3: {
        const height = Number(await ask('Высота лестницы: '));
        printSteps(height);
        break;
      }
      default:
        console.log('такой задачи нет');
    }
  } finally {
    rl.close();
  }
}

main();
