import LambdaLib

sum_til = (Fun(\v0->(((((((f_to_church # ((f_log # (Num 2)) # ((f_pow # (Num 2)) # (f_ceil # ((f_log # (Num 2)) # v0))))) # (Fun(\v1->(Fun(\v2->(Fun(\v3->(Fun(\v4->(Fun(\v5->(((v3 # v3) # (v1 # ((f_mul # v2) # (Num 2)))) # (v1 # ((f_add # ((f_mul # v2) # (Num 2))) # (Num 1))))))))))))))) # (Fun(\v1->(Fun(\v2->(Fun(\v3->(Fun(\v4->(v3 # v1)))))))))) # (Num 0)) # (Fun(\v1->(Fun(\v2->(Fun(\v3->((f_add # (((v3 # v1) # (Fun(\v4->v4))) # (Num 0))) # (((v2 # v1) # (Fun(\v4->v4))) # (Num 0)))))))))) # (Fun(\v1->v1))) # (Num 0))))

main = print $ (sum_til # (Num (512*512*8)))
