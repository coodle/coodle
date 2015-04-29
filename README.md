#### Coodle - the encyclopedia of code.

Coodle is an ongoing work which aims to be a community-driven encyclopedia of code, similar to Wikipedia, using the Pure Lambda Calculus as its foundational programming language. Our main goal is making code sharing and reuse simpler. Currently it has no front-end and only supports use through the terminal.

#### Why it is cool?

`tl;dr`, you can use any code on this encyclopedia in whatever project you are working on, regardless of the language! 

#### Example 1: using a function from Coodle inside a JavaScript project.

Suppose that you are browsing Reddit at work and suddenly your boss comes yelling the company needs a function that sums every even number from `0` til `N`. And it must be in JavaScript, which you know nothing about. You could spend the rest of the day learning JavaScript in order to implement it yourself; you could desperately search for it on Google; or you could realize someone probably already implemented the same function before and just query it on Coodle:

    sum_evens_below n = sum (filter even (enum_til n))

There it is! You then compile it to JavaScript by simply running:

    $ bin/coodle --javascript sum_evens_below >> sum_evens_below.js

which will create the `sum_evens_below.js` file. You then test it by typing:

    $ node
    > require("./runtime/javascript/lambdalib.js");
    > require("./sum_evens_below.js");
    > console.log(sum_evens_below(10));
    20

And, since `0 + 2 + 4 + 6 + 8 = 20` indeed, you proclaim your program correct and go back to Reddit.

#### Example 2: using Coodle directly without a compile target.

Maybe you don't want to compile to anything and just want a list of the even numbers below `10`. In that case, you can append the following line to `coodle.lc`:

    main = filter even (enum_til 10)

And run `main` from the command line:

    $ bin/coodle --result main
    [0 2 4 6 8]

The `--result` flag is very useful for programming your own functions before compiling.

#### Why the Pure Lambda Calculus?

The Lambda Calculus is used since it is a solid, stable and powerful language. Expanding:

1. **It is very simple**, so it is free from [many](https://wiki.theory.org/YourLanguageSucks) [human](http://tech.jonathangardner.net/wiki/Why_Java_Sucks) [design](http://eev.ee/blog/2012/04/09/php-a-fractal-of-bad-design/) [mistakes](https://www.destroyallsoftware.com/talks/wat).

2. **It is the ultimate portable/cross-platform language.** You can run it anywhere. Not because it has a a huge, bloated runtime that covers every use case, but because it is so simple that creating a brand new runtime takes 20 lines of code. We have backends for many common languages.

3. **It is future-proof.** Lambda Calculus has been used informally [since before the 17th century](http://en.wikipedia.org/wiki/History_of_the_function_concept#Functions_before_the_17th_century) and ha been formalized [~70 years ago](https://books.google.com.br/books?id=KCOuGztKVgcC&pg=PP5&lpg=PP5&dq=calculi+of+lambda+conversion+1941&source=bl&ots=rE11DuxxPv&sig=gt6f44SVjjYBLYr_aukXNvO2Aus&hl=pt-BR&sa=X&ei=QUwtVd6FB8vksATIrYCwBw&ved=0CE0Q6AEwBQ#v=onepage&q=calculi%20of%20lambda%20conversion%201941&f=false). It didn't need to change since, and never will - which means we'll never have to [rewrite our entire codebase due to a language update](https://www.python.org/download/releases/3.0/).

4. **It is practical.** Some believe Lambda Calculus is unpractical, mostly for looking mathy and lacking features. And it is, when you have to implement things from scratch. But the fact it is so good at abstraction allows us to add all those missing features as libraries. Good libraries easily make the LC as powerful - if not more - than most languages; which is why it combines so well with Coodle.

5. **It is fast.** "What?" Okay, okay, it is not *very* fast (yet - it has a lot of potential due to a [huge](https://github.com/tommythorn/Reduceron) [amount](https://ghc.haskell.org/trac/ghc/wiki/Supercompilation) of [ongoing research](http://research.microsoft.com/en-us/um/people/simonpj/papers/ndp/haskell-beats-C.pdf)). But, yes, it is fast enough, today: test programs are often only 2~100x slower than Haskell, and sometimes faster than Python - which is sufficient for most practical uses. There is a myth Lambda Calculus is slow because "church number arithmetic" is slow - but simply using floating point arithmetic is enough to recover performance. The idea is to develop most of your app logic on Coodle, and then do the heavy computations (such as rendering) on the host language.

6. **It allows us to write a function encyclopedia, on the first place.** Most of the common languages don't even qualify for writing an encyclopedia of functions anyway, since they allow you to write/read from global state. It would be very hard to write an encyclopedia for function that depend on, and alter, external context. Lambda Calculus functions are pure and self-contained, so it fits very well the goal.

#### Why not language X?

If X has global state and mutability, it couldn't work since Coodle needs functions to be referentially transparent. That is, global state and mutability cause functions work differently based on a "global context", which doesn't exist on Coodle, so it doesn't even make sense. Most languages today have that, so they can't qualify.

#### Why not Haskell?

Haskell is one of the few "pure" languages around, making it a candidate. Unfortunatelly, it is too bloated to make the goal of compiling to anything feasible, and it doesn't comply to the "future-proof" requeriment (as it has updates which are unpredictable). Haskell is currently the fastest compile target, though.

#### Why not any calculi with a type system?

There is no consensus on what the ideal type system would be.

#### TODO

-> A proper front-end (on Lambda Calculus itself). The front-end is supposed to follow the ways of Wikipedia, being a place where everyone can go, query functions, edit definitions, create their own functions etc.

-> Queries (by function name, by comments, etc). Also, a great idea is to allow searching for functions by tests. For example, you could give a few input/output pairs: `[[1 1] [2 4] [3 9] [4 16]]` and Coodle would find the only function that pass that test: `sqr` (that is, the number-squared function).

-> Comments. I'm thinking of a whole per-function commenting system that does more than what a source-code comment could do. (That's why `encyclopedia.lc` is missing comments for now.)

-> A proper tutorial on the Lambda Calculus, as well as the syntax sugars used here. It is very simple, though: it is just the well-known LC syntax with a few sugars such as named function definition borrowed from Haskell and list/number literals (which are converted to church encodings).

-> A proper database.

-> More compilation targets.

-> More functions, of course! While we don't have a proper structure, you can contribute by editing `encyclopedia.lc`. That sucks, yea. But that is also kinda fun, actually.

-> A looot of things, really...
