var arr = [
    {
        userName:"Test",
        lastName:"Test",
        email:"test.test@gmail.com"
    },
    {
        userName:"Test2",
        lastName:"Test",
        email:"test2@gmail.com"// test for one word email match
    },
    {
        userName:"Dmitro",
        lastName:"Porohov",
        email:"dmitro.porohov@yahoo.com>"
    },
    {
        userName:"Andrii",
        lastName:"",
        email:"andrii@mail.ru" // Нам такі не підходять
    },
];

let arrToString = JSON.stringify(arr);
// console.log(arrToString)
let re = /\w+[@]gmail.com|\w+[.]\w+[@]gmail.com|\w+[@]yahoo.com|\w+[.]\w+[@]yahoo.com/g;
let res = arrToString.match(re);
console.log(res)