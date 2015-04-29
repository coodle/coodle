// JavaScript runtime for the Lambda Calculus with floats.

f_true = function(a){return function(b){return a}}
f_false = function(a){return function(b){return b}}
f_to_church = (function (n) { return (function (f) { return (function (a) { for (var i=0; i<n; ++i) a = f(a); return a; }) }) })
f_from_church = (function (n) {return ((n(function (a) {return (a + 1)}))(0))})
f_add = (function (a) {return (function (b) {return (a + b)})})
f_mul = (function (a) {return (function (b) {return (a * b)})})
f_div = (function (a) {return (function (b) {return (a / b)})})
f_floor = (function (a) {return Math.floor(a)})
f_ceil = (function (a) {return Math.ceil(a)})
f_equal = (function (a) {return (function (b) {return a === b ? f_true : f_false})})
f_less_than = (function (a) {return (function (b) {return a < b ? f_true : f_false})})
f_greater_than = (function (a) {return (function (b) {return a > b ? f_true : f_false})})
f_mod = (function (a) {return (function (b) {return (a % b)})})
f_log = (function (a) {return (function (b) {return Math.log(b) / Math.log(a)})})
f_pow = (function (a) {return (function (b) {return Math.pow(a,b)})})
