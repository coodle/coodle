-- Haskell runtime for the Lambda Calculus with floats.

module LambdaLib where

import Prelude hiding (div)
import Data.Fixed (mod')
import Debug.Trace

data Term = Fun !(Term -> Term) | Num !Double | Lis [Term]

instance Show Term where
    show (Num x) = "(Num "++(if fromIntegral (floor x) == x then show (floor x) else show x)++")"
    show (Lis x) = "[" ++ foldr (++) "" (map show x) ++ "]"
    show (Fun _) = "(λ...)"

infixl 0 # 
(Fun f) # x    = f x
f_to_church    = Fun (\ (Num n) -> Fun (\f -> Fun (\x -> if n <= 0 then x else (f # (f_to_church # (Num (n - 1)) # f # x)))))
f_compare c    = Fun (\ (Num x) -> Fun (\ (Num y) -> if c x y then Fun (\x -> Fun (\y -> x)) else Fun (\x -> Fun (\y -> y))))
f_equal        = f_compare (==)
f_less_than    = f_compare (<)
f_greater_than = f_compare (>)
f_bin_op op    = Fun (\ (Num x) -> Fun (\ (Num y) -> Num (op x y)))
f_op op        = Fun (\ (Num x) -> Num (op x))
f_add          = f_bin_op (+)
f_sub          = f_bin_op (-)
f_div          = f_bin_op (/)
f_mul          = f_bin_op (*)
f_pow          = f_bin_op (**)
f_log          = f_bin_op (\ a b -> log b / log a)
f_floor        = f_op (fromIntegral . floor)
f_ceil         = f_op (fromIntegral . ceiling)
f_round        = f_op (fromIntegral . round)
f_mod          = f_bin_op mod'

-- Some helpers
fromChurchList l = map (\(Num a)->a) ((\(Lis a)->a) (l # Fun(\a->Fun(\b->Lis (a : ((\(Lis x)->x) b)))) # (Lis [])))
toChurchList     = foldr (\ x xs -> cons # x # xs) nil . map Num
nil              = (Fun(\v0->(Fun(\v1->v1))))
cons             = (Fun(\v0->(Fun(\v1->(Fun(\v2->(Fun(\v3->((v2 # v0) # ((v1 # v2) # v3))))))))))
traceLog x       = trace (show x) x
