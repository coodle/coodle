require("./lcrt.js");

sum_til = (function (v0) { return (((((((f_to_church(((f_log(2))(((f_pow(2))((f_ceil(((f_log(2))(v0))))))))))((function (v1) { return (function (v2) { return (function (v3) { return (function (v4) { return (function (v5) { return (((v3(v3))((v1(((f_mul(v2))(2))))))((v1(((f_add(((f_mul(v2))(2))))(1)))))) }) }) }) }) })))((function (v1) { return (function (v2) { return (function (v3) { return (function (v4) { return (v3(v1)) }) }) }) })))(0))((function (v1) { return (function (v2) { return (function (v3) { return ((f_add((((v3(v1))((function (v4) { return v4 })))(0))))((((v2(v1))((function (v4) { return v4 })))(0)))) }) }) })))((function (v1) { return v1 })))(0)) })

n = 512*512*8;
console.log(sum_til(n));
