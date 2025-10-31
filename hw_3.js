function pow(x, n){
    let result = 1;
    if (x == 0){
        result = 0;
    }
    else if (n < 0){
        for (let i = 1; i <= Math.abs(n); i++){
          result *= x;
        }  
        result = 1 / result;
    }

    else {
        for (let i = 1; i <= n; i++){
          result *= x;
        }
    }
    return result
}

// console.log(pow(2,-2)) // 0.25
// console.log(pow(3,-3)) // 0.037
// console.log(pow(1,5)) // 1
// console.log(pow(0,1))// 0
// console.log(pow(2,0)) // 1
// console.log(pow(2,1)) // 2
// console.log(pow(2,2)) // 4
// console.log(pow(2,3)) // 8
// console.log(pow(3,3)) // 27
// console.log(pow(5,3)) // 125