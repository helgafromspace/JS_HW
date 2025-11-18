
//Повинен знаходити: Wonderful, Joyful

// Не повинен знаходити: Happiness, Time, Task, Apple


let re = /\b[^a,A]{6,}/g;

let str = 'Wonderful, Joyful, Happiness, Time, Task, Apple';

console.log(str.match(re));