function pow(x, n){
    let result = 1
    for (let i = 1; i <= n; i++){
        result *= x
    }
    return result
}

console.log(pow(2,0)) // 1
console.log(pow(2,1)) // 2
console.log(pow(2,2)) // 4
console.log(pow(2,3)) // 8
console.log(pow(3,3)) // 27
console.log(pow(5,3)) // 125