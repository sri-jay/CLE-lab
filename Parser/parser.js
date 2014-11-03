function Production(lhs,rhs) {
	this.lhs = lhs;
	this.rhs = rhs;

	this.getLhs = function () {
		return this.lhs;
	};

	this.getRhs = function () {
		return this.rhs;
	};

	this.print = function () {
		console.log(this.lhs+" -> "+this.rhs.join("|"));
	};
}

function Grammar() {

	this.terminals = [];
	this.nonTerminsls = [];

	this.productions = {};
	this.first = {};
	this.follow = {}	;

	this.specfyTerminals = function (ter) {
		this.terminals = ter;
	};

	this.specifyNTerminals = function (nter) {
		this.nonTerminsls = nter
	};

	this.printAllProductions = function () {
			for(var m in this.productions)
			{
				console.log(m+" -> "+this.productions[m].join("|"));
			}
	};

	this.addProduction = function (prod) {
		if(typeof this.productions[prod.lhs] == 'undefined') 
		{
			this.productions[prod.lhs] = [];
			this.productions[prod.lhs].push(prod.rhs.join(''));
		}

		else
			this.productions[prod.lhs].push(prod.rhs.join(''));		
	};

	this.removeLeftRecursion = function () {

		for(var nt in this.productions) {

			var lrProduction = (function (nt, prd) {

				// Holds the output of left recursion test.
				var lrP = new Object();				

				lrP.status = false;

				for(var i=0;i<prd.length;i++) {
					if(prd[i][0] == nt) {
						lrP.status = true;
						console.log("Left recursion found : "+nt+" -> "+prd);
						break;
					}
				}

				if(lrP.status) {

					lrP.recSym = nt;
					lrP.recProd = [];
					lrP.nonRecProd = [];

					for(var i=0;i<prd.length;i++) {
						if(prd[i][0] == nt)
							lrP.recProd.push(prd[i]);
						else
							lrP.nonRecProd.push(prd[i]);
					}
				}

				return lrP;

			})(nt, this.productions[nt]);

			if(!lrProduction.status)
				continue;

			delete this.productions[lrProduction.recSym];

			var nrProduction = (function (lrPd) {

				var 
					clrPrdSet = new Object(),
					nNt = lrPd.recSym + "'",
					replaceRhs = [],
					newProdRhs = [];

				this.nonTerminsls.push(nNt);

				for (var i =0;i<lrPd.recProd.length;i++) {
					var pd = lrPd.recProd[i];
					replaceRhs.push(pd.substr(1)+nNt);
				}

				replaceRhs.push("<lambda>");

				if(lrPd.nonRecProd.length == 0)
					newProdRhs.push(nNt);

				else {
					for (var i=0;i<lrPd.nonRecProd.length;i++)
					{
						if(lrPd.nonRecProd[i] == "<lambda>") {
							newProdRhs.push(nNt);
							continue;
						}
						newProdRhs.push(lrPd.nonRecProd[i]+nNt);
					}
				}


				clrPrdSet.replace = new Production(nNt,replaceRhs);
				clrPrdSet.newProd = new Production(lrPd.recSym,newProdRhs);

				return clrPrdSet;

			})(lrProduction);

			this.productions[nrProduction.replace.lhs] = nrProduction.replace.rhs;
			this.productions[nrProduction.newProd.lhs] = nrProduction.newProd.rhs;
		}

		console.log("Finished removing left recursion");
		console.log(this.productions);
	};

	var removeLeftFactoring = function () {
		
	};

	var buildFirstSet = function () {
		var first = (function (productions) {

			var first = {};

			for (var m in productions) {
				first[m] = [];
				for (var i=0;i<productions[m].length;i++) {
					if(this.terminals.indexOf(productions[m][0]) >= 0)
						first[m].push(productions[m][0]);
				}
			}

		})(this.productions);
	};

	var buildFollowSet = function () {};
}

var G = new Grammar();

// G.addProduction(new Production("A",['x','B']));
// G.addProduction(new Production("A",['A','x']));
// G.addProduction(new Production("A",['b']));
// G.addProduction(new Production("C",['C','x']));

G.specfyTerminals(['A','S']);
G.specifyNTerminals(['c','b','d','a']);

G.addProduction(new Production("S",['A','a']));
G.addProduction(new Production("S",['b']));
G.addProduction(new Production("A",['A','c']));
G.addProduction(new Production("A",['<lambda>']));
G.addProduction(new Production("A",['b','d']));
G.addProduction(new Production("A",['A','a','d']));

G.printAllProductions();
G.removeLeftRecursion();