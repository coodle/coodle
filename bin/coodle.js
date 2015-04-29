var lc = require("./../lambda.js");
var rt = new lc.Runtime();

var args = [].slice.call(process.argv,2);

if (args.length === 0){
    console.log("You are doing it wrong!");
    console.log("");
    help();
};

var opts = {};

while (args[0] && args[0][0] === "-"){
    var opt = args.shift();
    opts[opt.slice(/[^-]/.exec(opt).index).toLowerCase().replace("to-","")] = true;
};

if (opts.help) help();

rt.readSource(require("fs").readFileSync("./lib.lc","utf8"));

args.map(compile);

function help(){
    console.log("Usage   : coodle [opts] function1 function2 ...");
    console.log("Example : coodle --pretty --result --to-javascript --stats main");
    console.log("");
    console.log("Opts can be:");
    console.log("--pretty        : prints pretty details about the compilation.");
    console.log("--bruijn        : prints the ompilation result as bruijn indices.");
    console.log("--result        : prints the original term prettified.");
    console.log("--reduce        : prints the original term prettified.");
    console.log("--stats         : prints some stats of the compilation.");
    console.log("--scheme        : prints compilation to Scheme.");
    console.log("--to-javascript : prints compilation to JavaScript.");
    console.log("--to-python     : prints compilation to Python.");
    console.log("--to-haskell    : prints compilation to Haskell.");
    console.log("--output-only   : only prints the compilation result (for piping, etc).");
    console.log("--no-names      : don't include variable names on the compilation result.");
    console.log("--all           : prints everything.");
    process.exit();
};

function compile(symbol){
    if (opts.pretty){
        console.log("## Coodle: loading "+symbol+". ##");
        console.log("");
    };

    if (opts.bruijn || opts.all){
        if (opts.pretty) console.log("## Original term (bruijn-indexed). ##");
        console.log(rt.toString(rt.defs[symbol]));
        if (opts.pretty) console.log();
        if (opts.pretty) console.log("## Result (bruijn-indexed). ##");
        console.log(rt.toString(rt.normal(rt.defs[symbol])));
        if (opts.pretty) console.log();
    };

    if (opts.result || opts.reduce || opts.all){
        //TODO: buggy
        //console.log("## Original term (unnormalized, pretty):");
        //console.log(rt.show(rt.defs[symbol]));
        //console.log();
        if (opts.pretty) console.log("## Result (pretty). ##");
        console.log(rt.show(rt.normal(rt.defs[symbol])).replace(/\n/g,"").replace(/ +(?= )/g,''));
        if (opts.pretty) console.log();
    };

    ["Scheme","JavaScript","Python","Haskell"].map(function(language){
        if (opts[language.toLowerCase()] || opts.all){
            if (opts.pretty) console.log("## Compiled to " + language + ". ##");
            console.log(rt.compileTo(language,rt.normal(rt.defs[symbol]),opts["no-names"] ? undefined : symbol));
            if (opts.pretty) console.log();
        };
    });

    if (opts.stats || opts.all){
        if (opts.pretty) console.log("## Stats. ##");
        console.log("-> Node count      :",rt.left_.length);
        console.log("-> Beta-reductions :",rt.stats.beta_reductions);
        console.log("-> Reductions      :",rt.stats.reductions,"("+(rt.stats.reductions-rt.stats.unmemoized_reductions)+" memoized)");
        console.log("-> Calls to subs   :",rt.stats.subs_calls,"("+(rt.stats.subs_calls-rt.stats.unmemoized_subs_calls)+" memoized)");
        console.log("-> Max var         :",rt.stats.max_var);
    };
};
