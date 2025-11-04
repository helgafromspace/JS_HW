function checkProbabilityTheory(count){
    let countEven = 0; // парні
    let countOdd = 0; // непарні
    for (let i = 0; i < count; i++){
        let num = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
        // console.log(num);
        (num % 2 == 0) ? countEven++ : countOdd++;
        // console.log(countEven)
        // console.log(countOdd)
    }
    let evenToOddPercent = (countOdd != 0) ? (countEven  / countOdd) * 100 : 'Непарних чисел не сгенеровано';// якщо буде 0 непарних то в результаті отримаємо Infinity
   return `Кількість згенерованих чисел: ${count}; Кількість парних: ${countEven}; Кількість непарних:${countOdd}; Відсоток парних до непарних:${evenToOddPercent} %` 
}

console.log(checkProbabilityTheory(4))