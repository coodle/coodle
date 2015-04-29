;;; Scheme runtime for the Lambda Calculus with floats.

(define f_true (lambda (a) (lambda (b) b)))
(define f_false (lambda (a) (lambda (b) b)))
(define f_to_church (lambda (n) (lambda (f) (lambda (a) (if (< n 1) a (f (((f_to_church (- n 1)) f) a)))))))
(define f_add (lambda (a) (lambda (b) (+ a b))))
(define f_sub (lambda (a) (lambda (b) (- a b))))
(define f_mul (lambda (a) (lambda (b) (* a b))))
(define f_div (lambda (a) (lambda (b) (/ a b))))
(define f_mod (lambda (a) (lambda (b) (modulo a b))))
(define f_pow (lambda (a) (lambda (b) (expt a b))))
(define f_log (lambda (a) (lambda (b) (/ (log b) (log a)))))
(define f_equal (lambda (a) (lambda (b) (if (= a b) f_true f_false))))
(define f_less_than (lambda (a) (lambda (b) (if (< a b) f_true f_false))))
(define f_greater_than (lambda (a) (lambda (b) (if (> a b) f_true f_false))))
(define f_floor (lambda (a) (floor a)))
(define f_ceil (lambda (a) (ceiling a)))
(define f_round (lambda (a) (round a)))
