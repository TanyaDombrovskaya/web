const readline = require('readline');

let n;
let k;
let numbers = [];
let newNumbers = [];
let oldSum;
let newSum;
let result;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main(){
    try {
        n = parseFloat(await askQuestion("Введите количество цифр(n): "));
        k = parseFloat(await askQuestion("Введите количество операций(k): "));

        for (let i = 0; i < n; i++) {
            numbers[i] = parseFloat(await askQuestion(`Введите элемент ${i + 1}: `));
        }

        oldSum = sumOfNums(numbers);

        newSum = replaceMin(numbers, k);


        result = differenceOfSum(oldSum, newSum);

        console.log(result);
    }
    catch(error) {
        console.error("Ошибка ввода:", error);
    }
    finally {
        rl.close();
    }
}

function replaceMin(numbers, k) {
    newNumbers = numbers.slice();

    let maxSum = sumOfNums(newNumbers); 
    let sum = 0;

    for (let i = 0; i < k; i++) {
        newNumbers.forEach(function(number, index) {
            let length = String(number).length; 

            if (length == 1) {
                number = 9;
                sum = sumOfNums(newNumbers);

                if (sum > maxSum) {
                    maxSum = sum;
                }
            } else {
                for (let i = 0; i < length; i++) {
                    let cifsStr = String(number).split('');
                    const cifs = cifsStr.map(Number);
                    cifs[i] = 9; 
                    
                    sum = sumOfNums(newNumbers);

                    if (sum > maxSum) {
                        maxSum = sum;
                    }
                }
            }
        });
    }

    return maxSum;
}

function sumOfNums(numbers) {
    let sum = 0;

    numbers.forEach(function(number) {
        sum += number;
    })

    return sum;
}

function differenceOfSum(oldSum, newSum) {
    return newSum - oldSum;
}

main();

