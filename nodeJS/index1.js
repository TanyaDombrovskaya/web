const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function internetPrice(A, B, C, D) {
    if (D <= B) {
        return A;
    } else {
        return A + (D - B) * C;
    }
}

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
    try {
        const A = parseFloat(await askQuestion("Введите стоимость интернета (A): "));
        const B = parseFloat(await askQuestion("Введите базовую сумму (B): "));
        const C = parseFloat(await askQuestion("Введите стоимость за единицу превышения (C): "));
        const D = parseFloat(await askQuestion("Введите количество единиц (D): "));

        const totalPrice = internetPrice(A, B, C, D);
        console.log("Итоговая стоимость интернета: " + totalPrice);
    } catch (error) {
        console.error("Ошибка ввода:", error);
    } finally {
        rl.close(); 
    }
}

main();