// This file offers a runtime for the Lambda Calculus, including functions such
// as parsing, normalizing, printing and compiling a term to several targets.
// It is written in JavaScript since it can run on anywhere, including browsers.
// It isn't supposed to do any heavy work, so I guess that's ok for now.
// It needs comments and many refactorings, though.
var LambdaCalculus = (function(){
    var i32size = Math.pow(2,32);
    function Runtime(params){
        this.subsMemo = {};
        this.left_    = [];
        this.right_   = [];
        this.normal_  = {};
        this.hash     = {};
        this.defs     = {};
        this.vars     = {};
        this.diff     = {defs: {}, vars: {}}
        for (var i=0; i<this.buckets; ++i) 
            this.hash[i] = [];
        this.f_true   = this.lam(this.lam(1));
        this.f_false  = this.lam(this.lam(0));
        this.Lam      = this.prim(1000);
        this.stats    = {
            beta_reductions       : 0,
            reductions            : 0,
            unmemoized_reductions : 0,
            subs_calls            : 0,
            unmemoized_subs_calls : 0,
            max_var               : 0
        };
    };
    Runtime.prototype.app = function(x,y){
        var hash = x + "_" + y;
        var pos           = this.left_.length;
        var ptr           = 0x80000000|pos
        this.left_[pos]   = x;
        this.right_[pos]  = y;
        return this.hash[hash] = ptr;
    };
    Runtime.prototype.isApp = function(node){
        return !this.isLam(node) && !this.isNum(node) && (node >>> 20) === 0x800;
    };
    Runtime.prototype.left = function(node){ 
        return this.left_[(node & 0x000FFFFF)];
    };
    Runtime.prototype.right = function(node){ 
        return this.right_[(node & 0x000FFFFF)];
    };
    Runtime.prototype.isPrim = function(node){
        return (node >>> 20) === 0x400;
    };
    Runtime.prototype.prim = function(node){
        return node | 0x40000000;
    };
    Runtime.prototype.getPrim = function(n){
        return n & 0x000FFFFF;
    };
    Runtime.prototype.isLam = function(node){
        return (node >>> 20) === 0x800 ? this.left(node) === this.Lam : !this.isNum(node) && (node & 0x3FF00000);
    };
    Runtime.prototype.lam = function(node){
        return this.isNum(node) ? this.app(this.Lam,node) : node + 0x00100000;
    };
    Runtime.prototype.body = function(node){
        return (node >>> 20) === 0x800 ? this.right(node) : node - 0x00100000;
    };
    Runtime.prototype.isVar = function(node){
        return !this.isNum(node) && !(node >>> 20);
    };
    Runtime.prototype.num = function(x){
        return x > 0 ? (x + 1) * i32size : (x - 1) * i32size;
    };
    Runtime.prototype.isNum = function(node){
        return Math.abs(node) >= i32size;
    };
    Runtime.prototype.getNum = function(x){
        return x > 0 ? (x / i32size - 1) : (x / i32size + 1);
    };
    Runtime.prototype.id = function(node){
        return node & 0x7FFFFFFF;
    };
    Runtime.prototype.prims = (function(){
        var primNames = [
            "","float.to_church",
            "float.add","float.sub","float.mul","float.div","float.mod","float.pow","float.log",
            "float.greater_than","float.less_than","float.equal",
            "float.floor","float.ceil","float.round"];
        var prims = {};
        for (var i=0; i<primNames.length; ++i){
            prims[primNames[i]] = i;
            prims[i] = primNames[i];
        };
        return prims;
    })();
    var prims = Runtime.prototype.prims;
    var binOps = {};
    Runtime.prototype.binOps = binOps;
    binOps[prims["float.add"]] = function(a,b){ 
        return this.num(this.getNum(a) + this.getNum(b)) 
    };
    binOps[prims["float.sub"]] = function(a,b){ 
        return this.num(this.getNum(a) - this.getNum(b)) 
    };
    binOps[prims["float.mul"]] = function(a,b){ 
        return this.num(this.getNum(a) * this.getNum(b)) 
    };
    binOps[prims["float.div"]] = function(a,b){ 
        return this.num(this.getNum(a) / this.getNum(b)) 
    };
    binOps[prims["float.mod"]] = function(a,b){ 
        return this.num(this.getNum(a) % this.getNum(b)) 
    };
    binOps[prims["float.pow"]] = function(a,b){ 
        return this.num(Math.pow(this.getNum(a),this.getNum(b))) 
    };
    binOps[prims["float.log"]] = function(a,b){ 
        return this.num(Math.log(this.getNum(b))/Math.log(this.getNum(a))) 
    };
    binOps[prims["float.greater_than"]] = function(a,b){ 
        return (this.getNum(a) > this.getNum(b) ? this.f_true : this.f_false) 
    };
    binOps[prims["float.less_than"]] = function(a,b){ 
        return (this.getNum(a) < this.getNum(b) ? this.f_true : this.f_false) 
    };
    binOps[prims["float.equal"]] = function(a,b){ 
        return (this.getNum(a) === this.getNum(b) ? this.f_true : this.f_false) 
    };
    var ops = {};
    Runtime.prototype.ops = ops;
    ops[prims["float.to_church"]] = function (n){
        for (var result=0, i=0, l=this.getNum(n); i<l; ++i)
            result = this.app(1,result);
        return this.lam(this.lam(result));
    };
    ops[prims["float.floor"]] = function (r){
        return this.num(Math.floor(this.getNum(r)));
    };
    ops[prims["float.ceil"]] = function (r){
        return this.num(Math.ceil(this.getNum(r)));
    };
    ops[prims["float.round"]] = function (r){
        return this.num(Math.round(this.getNum(r)));
    };
    Runtime.prototype.normal = function(x){
        ++this.stats.reductions;
        var self = this;
        if (this.isApp(x)){
            var l  = this.normal(this.left(x));
            var r  = this.normal(this.right(x));
            var ll = this.left(l);
            var lr = this.right(l);
        };
        if (this.isLam(x))
            var body = this.normal(this.body(x));
        return this.normal_[x] || (++this.stats.unmemoized_reductions, this.normal_[x] = ((
            this.isVar(x) ? (this.stats.max_var < x ? (this.stats.max_var=x) : x)
            : this.isPrim(x) ? x
            : this.isNum(x) ? x
            : this.isLam(x) && this.isApp(body) && this.right(body) === 0 && this.bindUses(x) === 1 ?
                this.subs(0,-1,-1,this.left(body)) // eta-reduce
            : this.isLam(x) ? this.lam(body)
            : this.isLam(l) ? this.apply(l,r) // beta-reduce
            : this.isPrim(l) && this.isNum(r) && this.ops[this.getPrim(l)] ?
                this.ops[this.getPrim(l)].call(this,r)
            : this.isPrim(ll) && this.isNum(lr) && this.isNum(r) && this.binOps[this.getPrim(ll)] ? 
                ((this.binOps[this.getPrim(ll)]).call(this,lr,r))
            : this.app(l,r))));
    };
    Runtime.prototype.bindUses = function (t){
        var self = this;
        return (function R(d,x){
            return self.isApp(x) ? R(d,self.left(x))+R(d,self.right(x))
                 : self.isLam(x) ? R(d+1,self.body(x))
                 : self.isVar(x) ? (x===d ? 1 : 0)
                 : 0;
        })(-1,t);
    };
    Runtime.prototype.subs = function (t,d,w,x){
        ++this.stats.subs_calls;
        var hash = ""+t+"_"+d+"_"+w+"_"+x;
        if (this.subsMemo[hash]) return this.subsMemo[hash];
        ++this.stats.unmemoized_subs_calls;
        return this.subsMemo[hash] = 
              this.isApp(x) ? this.app(this.subs(t,d,w,this.left(x)),this.subs(t,d,w,this.right(x)))
            : this.isLam(x) ? this.lam(this.subs(t,d+1,w,this.body(x)))
            : this.isVar(x) ? (t && x===d ? this.subs(0,-1,d,t) : x>d ? x+w : x)
            : x;
    };
    Runtime.prototype.apply = function(f,x){
        ++this.stats.beta_reductions;
        return this.normal(this.subs(x,0,-1,this.body(f)));
    };
    Runtime.prototype.define = function(name,ptr){
        if (typeof ptr === "string") ptr = this.read(ptr);
        this.defs[name] = this.diff.defs[name] = ptr;
        if (!this.defs[ptr]) this.defs[ptr] = name;
        return ptr;
    };
    Runtime.prototype.tag = function(tag,ptr){
        this.vars[this.id(ptr)] = this.diff.vars[this.id(ptr)] = tag;
        return ptr;
    };
    Runtime.prototype.toString = function(x){ 
        return this.isPrim(x) ? this.prims[this.getPrim(x)] :
            this.isNum(x) ? this.getNum(x) :
            this.isApp(x) ? "("+this.toString(this.left(x))+" "+this.toString(this.right(x))+")" :
            this.isLam(x) ? "(λ "+this.toString(this.body(x))+")" 
            : "v"+x;
    };
    Runtime.prototype.compilers = {
        lambdacalculus: {
            def  : function (name,a){ return a; },
            app  : function (a,b){ return "("+a+" "+b+")"; },
            lam  : function (var_,body){ return "(λ "+var_+" . "+body+")"; }
        },
        scheme : {
            def  : function (name,a){ return "(define " + name + " " + a + ")"; },
            app  : function (a,b){ return "("+a+" "+b+")"; },
            lam  : function (var_,body){ return "(lambda ("+var_+") "+body+")"; },
            prim : function(prim){ return prim.replace("float.","f_"); }
        },
        javascript : {
            def  : function (name,a){ return name + " = " + a; },
            app  : function (a,b){ return "("+a+"("+b+"))"; },
            lam  : function (var_,body){ return "(function ("+var_+") { return "+body+" })"; },
            prim : function(prim){ return prim.replace("float.","f_"); }
        },
        python : {
            def  : function (name,a){ return name + " = " + a; },
            app  : function (a,b){ return "("+a+"("+b+"))"; },
            lam  : function (var_,body){ return "(lambda "+var_+" : "+body+")"; },
            prim : function(prim){ return prim.replace("float.","f_"); }
        },
        haskell : {
            def  : function (name,a){ return name + " = " + a; },
            app  : function (a,b){ return "("+a+" # "+b+")"; },
            lam  : function (var_,body){ return "(Fun(\\"+var_+"->"+body+"))"; },
            prim : function(prim){ return prim.replace("float.","f_"); },
            num  : function(num){ return "(Num "+num+")"; }
        }
    };
    Runtime.prototype.compileWith = function(fns,symbol){ 
        fns.prim = fns.prim || function(a){return a};
        fns.num  = fns.num  || function(a){return a};
        var self = this;
        return (function(x){
            return (function R(x,d){
                return (
                    self.isPrim(x) ? fns.prim(self.prims[self.getPrim(x)]) :
                    self.isNum(x)  ? fns.num(self.getNum(x)) :
                    self.isApp(x)  ? fns.app(R(self.left(x),d),R(self.right(x),d)) :
                    self.isLam(x)  ? fns.lam("v"+d,R(self.body(x),d+1)) : 
                    "v"+(d-x-1));
                })(x,0);
        })(symbol);
    };
    Runtime.prototype.compileTo = function(target,symbol,name){
        var compiler = this.compilers[target.toLowerCase()];
        var compiled = this.compileWith(compiler, symbol);
        return name ? compiler.def(name,compiled) : compiled;
    };
    Runtime.prototype.read = function(value){
        return this.jsonToValue(this.unflatten(this.unlets(this.unarrows(this.stringToJson(value))))); 
    };
    Runtime.prototype.show = function(value){
        return this.jsonToString(this.arrows(this.lets(this.flatten(this.valueToJson(value)))));
    }; 
    Runtime.prototype.valueToJson = function(tree){
        var abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var self = this;
        return (function R(x,scope,root){
            //(fn (a b) (a (a (a b))))
            function churchNumber(x){
                return x === 0 ? 0 : self.isApp(x) && self.left(x) === 1 ? 1 + churchNumber(self.right(x)) : NaN;
            };
            //(fn (a b) (a 1 (a 2 (a 3 b))))
            function churchList(x){
                if (x === 0)
                    return [];
                if (self.isApp(x) && self.isApp(self.left(x)) && self.left(self.left(x)) === 1){
                    var tail = churchList(self.right(x));
                    return tail !== null 
                        ? [self.right(self.left(x))].concat(tail) 
                        : null;
                };
                return null;
            };
            //(fn (a) (((a 1) 2) 3))
            function churchTuple(x){
                if (self.isApp(self.left(x))){
                    var left = churchTuple(self.left(x));
                    return left !== null ? left.concat([self.right(x)]) : null;
                };
                if (self.left(x) === 0)
                    return [self.right(x)];
                return null;
            };
            var ptr = self.id(x);
            var church;
            if (self.isNum(x))
                return String(self.getNum(x));
            if (self.isPrim(x))
                return self.prims[self.getPrim(x)];
            if (self.isLam(x) && self.isLam(self.body(x)) && !isNaN(church = churchNumber(self.body(self.body(x)))))
                return "c"+String(church);
            if (self.isLam(x) && self.isLam(self.body(x)) && ((church = churchList(self.body(self.body(x)))) !== null))
                return ["list"].concat(church.map(function(x){ 
                    return R(x,[abc[scope.length],abc[scope.length+1]].concat(scope),0); 
                }));
            if (self.isLam(x) && (church = churchTuple(self.body(x))))
                return ["tuple"].concat(church.map(function(x){
                    return R(x,[abc[scope.length]].concat(scope),0);
                }));
            if (!root && self.defs[ptr])
                return self.defs[ptr];
            if (self.isApp(x))
                return [R(self.left(x),scope,0),R(self.right(x),scope,0)];
            if (self.isLam(x)){
                var bind = self.vars[ptr]||abc[scope.length];
                return [["fn",[bind]],R(self.body(x),[bind].concat(scope),0)];
            };
            return scope[x] || "var_"+x+"";
        })(tree,[],1); 
    };
    Runtime.prototype.jsonToValue = function (tree){
        var self = this;
        return (function R(a,scope,depth){
            function churchNumber(x){
                return self.lam(self.lam((function R(x){
                    return x === 0 ? 0 : self.app(1,R(x-1));
                })(x)));
            };
            function churchList(x){
                return self.lam(self.lam((function R_(x,t){
                    return x === "List" || x.length === 1 ? t : R_(x[0],self.app(self.app(1,R(x[1],scope,depth+2)),t));
                })(x,0)));
            };
            function churchTuple(x){
                return self.lam((function R_(x){
                    return x === "Tuple" || x.length === 1 ? 0 : self.app(R_(x[0]),R(x[1],scope,depth+1));
                })(x));
            };
            if (a[1] === "Nil")
                return churchList(a[0]);
            if (a[1] === "TupleNil")
                return churchTuple(a[0]);
            if (typeof a === "string"){
                return (
                    self.defs[a] && scope[a]===undefined ? self.defs[a] :
                    typeof scope[a] !== "undefined" ? depth-scope[a] :
                    a[0] === "c" && !isNaN(Number(a.slice(1))) ? churchNumber(Number(a.slice(1))) :
                    !isNaN(Number(a)) ? self.num(Number(a)) :
                    self.prims[a] ? self.prim(self.prims[a]) :
                    (function(){throw "Undefined symbol: "+a})());
            };
            if (a[0]&&a[0][0] === "fn") {
                depth = depth+1;
                scope = JSON.parse(JSON.stringify(scope));
                scope[a[0][1][0]] = depth;
                return self.tag(a[0][1][0],self.lam(R(a[1], scope, depth)));
            };
            return self.app(R(a[0],scope,depth),R(a[1],scope,depth));
        })(tree,{},-1); 
    };
    Runtime.prototype.flatten = foldJson(function R(a){
        return Array.isArray(a[0]) && !(a[0][0]==="fn" && a[0].length===3) ? a[0].concat(a.slice(1)) : a;
    },function(x){return x});
    Runtime.prototype.unflatten = foldJson(function R(a){
        return typeof a === "object" && a.length > 2 ? R([[a[0],a[1]]].concat(a.slice(2))) : a;
    },function(x){return x});
    Runtime.prototype.arrows = foldJson(function R(a){
        return a[0] === "fn" ? a[1].concat(["->"]).concat(a[2]) : a;
    },function(x){return x});
    Runtime.prototype.unarrows = foldJson(function R(a){
        return a.indexOf("->") !== -1 
            ? ["fn",a.slice(0,a.indexOf("->"))].concat(a.slice(a.indexOf("->")+1))
            : a;
    },function(x){return x});
    Runtime.prototype.lets = foldJson(function R(a){
        return a[0][0] === "fn" ? ["let",[a[0][1][0],a[1]],R(a[0][2].concat(a.slice(2)))]
            : a[0] === "fn" && a[2][0] === "fn" ? ["fn",a[1].concat(a[2][1]),a[2][2]]
            : a[0] === "let" && a[2][0] === "let" ? ["let",a[1]].concat(a[2].slice(1))
            : a;
    },function(x){return x});
    Runtime.prototype.unlets = foldJson(function R(a){
        return a[0] === "let" && a.length <= 3 ? [["fn",[a[1][0]],a[2]],a[1][1]]
            : a[0] === "fn" && a[1].length > 1 ? ["fn",[a[1][0]],R(["fn",a[1].slice(1),a[2]])]
            : a[0] === "let" && a.length > 3 ? R(["let",a[1],R(["let"].concat(a.slice(2)))])
            : a; 
    },function(x){return x});
    Runtime.prototype.jsonToString = function(json){
        return foldJson(function(a){ return function(d){
            function repeat(str,n){ return n===0 ? "" : str + repeat(str,n-1); };
            for (var i=0,l=a.length; i<l; ++i) a[i] = a[i](d+1);
            if (a[0] === "string") return '"'+a.slice(1).join(" ")+'"';
            if (a[0] === "list") return '['+a.slice(1).join(" ")+']';
            if (a[0] === "tuple") return '{'+a.slice(1).join(" ")+'}';
            var inline     = JSON.stringify(a).length < 60;
            var sep        = inline ? " " : "\n" + repeat("    ",d);
            var doubleHead = a.length > 1 && (a[0] === "fn" || a[0] === "if" || a[0] === "case");
            return "("+(doubleHead ? a[0]+" "+a.slice(1).join(sep) : a.join(sep))+")";
        }},function(a){return function(d){return a}})(json)(1);
    };
    Runtime.prototype.stringToJson = function(x){
        var i = 0, l = x.length;
        return (function parse(){
            for (var c; !c || c === " "; c = x[i++]){};
            if (/[\(\[\{]/.test(c)){
                for (var result = (c[0]==="["?["List"]:c[0]==="{"?["Tuple"]:[]); i<l && x[i]!=="]" && x[i]!==")" && x[i]!=="}";)
                    result.push(parse());
                if (result[0] === "List")
                    result.push("Nil");
                if (result[0] === "Tuple")
                    result.push("TupleNil");
                return ++i, result;
            };
            for (var str = ""; i<l && !/[ ,\t\n\)\]\}]/.test(c); c = x[i++])
                str += c;
            if (c === ")" || c === "]" || c === "}") --i;
            return str;
        })(); 
    };
    Runtime.prototype.readSource = function(text){
        var self = this;
        return text.split("\n").map(function(line){
            if (line.indexOf("=") === -1) return;
            if (line.slice(0,3) === "---") return;
            line = line.replace(/\s{2,}/g, ' ');
            if (line[line.length-1] === " ") line = line.slice(0,-1);
            var name = line.split(" = ")[0].split(" ")[0];
            var vars = line.split(" = ")[0].split(" ").slice(1).join(" ");
            var body = line.split(" = ")[1];
            if (body.indexOf(" ")!==-1 && body[0]!=="(" && body[0]!=="[" && body[0]!=="{") body = "("+body+")";
            if (body.indexOf(" ")===-1 && vars.length===0) body = "((fn (a) a) "+body+")";
            var code = vars.length > 0 ? "(fn ("+vars+") "+body+")" : body;
            self.define(name,code);
        });
    };
    function foldJson(node,leaf){
        return function(tree){
            return (function R(a){
                return typeof a !== "object" ? leaf(a) : node(a.map(R));
            })(tree,[]);
        };
    };
    return {Runtime:Runtime};
})();
if (typeof module !== "undefined") module.exports = LambdaCalculus;
