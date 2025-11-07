var services = {
"стрижка": "60 грн",
"гоління": "80 грн",
"Миття голови": "100 грн",
price: function() {
    let sum = 0;
    for (key in services){
        if (typeof(services[key]) == 'string'){
            let num = parseInt(services[key]);
            sum += num;
        }
    }
    return `Загальна вартість послуг: ${sum}`
},
minPrice: function (){
    min = Infinity
    for (key in services){
        if (typeof(services[key]) == 'string'){
            let num = parseInt(services[key]);
            if(num < min){
                min = num;
            }
        }
    }
    return `Мінімальна ціна послуги: ${min}`
},
maxPrice: function (){
    max = 0
    for (key in services){
        if (typeof(services[key]) == 'string'){
            let num = parseInt(services[key]);
            if(num > max){
                max = num;
            }
        }
    }
    return `Максимальна ціна послуги: ${max}`
},
setProperty: function(name, value){
    services[name] = value;
}
}


console.log(Object.keys(services));
console.log(services.price());
console.log(services.minPrice());
console.log(services.maxPrice());

services['Розбити скло'] = '200 грн';
console.log(Object.keys(services));//дивимось, що властивість додалась в об'єкт та значення суми та максимуму змінились
console.log(services.price());
console.log(services.minPrice());
console.log(services.maxPrice());

services['Почистити вуха'] = '50 грн';//дивимось, що властивість додалась в об'єкт та значення суми та мінімуму змінились
console.log(Object.keys(services));
console.log(services.price());
console.log(services.minPrice());
console.log(services.maxPrice());

services.setProperty('Манікюр', '250 грн');//дивимось, що властивість додалась в об'єкт та значення суми та максимуму змінились
console.log(Object.keys(services));
console.log(services.price());
console.log(services.minPrice());
console.log(services.maxPrice());
