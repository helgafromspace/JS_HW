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
    return `sum ${sum}`
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
    return `min ${min}`
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
    return `max ${max}`
},
}


console.log(Object.keys(services))
console.log(services.price())
console.log(services.minPrice())
console.log(services.maxPrice())

services['Розбити скло'] = '200 грн';
console.log(Object.keys(services))
console.log(services.price())
console.log(services.minPrice())
console.log(services.maxPrice())

services['Почистити вуха'] = '50 грн';
console.log(Object.keys(services))
console.log(services.price())
console.log(services.minPrice())
console.log(services.maxPrice())