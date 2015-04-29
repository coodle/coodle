(require "lambdalib")

(define sum_til (lambda (v0) (((((((f_to_church ((f_log 2) ((f_pow 2) (f_ceil ((f_log 2) v0))))) (lambda (v1) (lambda (v2) (lambda (v3) (lambda (v4) (lambda (v5) (((v3 v3) (v1 ((f_mul v2) 2))) (v1 ((f_add ((f_mul v2) 2)) 1))))))))) (lambda (v1) (lambda (v2) (lambda (v3) (lambda (v4) (v3 v1)))))) 0) (lambda (v1) (lambda (v2) (lambda (v3) ((f_add (((v3 v1) (lambda (v4) v4)) 0)) (((v2 v1) (lambda (v4) v4)) 0)))))) (lambda (v1) v1)) 0)))

(display (sum_til (* (* 512 512) 8)))
