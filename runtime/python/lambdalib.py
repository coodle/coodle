# Python runtime for the Lambda Calculus with floats.

import math

f_true         = (lambda a : lambda b : a)
f_false        = (lambda a : lambda b : b)
f_to_church    = (lambda n : lambda f : lambda a : a  if n < 1 else f(((f_to_church(n - 1))(f))(a)))
f_add          = (lambda a : lambda b : a+b)
f_sub          = (lambda a : lambda b : a-b)
f_mul          = (lambda a : lambda b : a*b)
f_div          = (lambda a : lambda b : a/b)
f_mod          = (lambda a : lambda b : a%b)
f_log          = (lambda a : lambda b : math.log(b)/math.log(a))
f_pow          = (lambda a : lambda b : math.pow(a,b))
f_less_than    = (lambda a : lambda b : f_true if a < b else f_false)
f_greater_than = (lambda a : lambda b : f_true if a > b else f_false)
f_equal        = (lambda a : lambda b : f_true if a == b else f_false)
f_foor         = (lambda a : math.floor(a))
f_ceil         = (lambda a : math.ceil(a))
f_round        = (lambda a : round(a))
