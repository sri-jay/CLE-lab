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
	this.nonTerminals = [];

	this.productions = {};
	this.first = {};
	this.follow = {}	;

	this.specifyTerminals = function (ter) {
		this.terminals = ter;
	};

	this.specifyNTerminals = function (nter) {
		this.nonTerminals = nter
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

			var nrProduction = (function (lrPd,nonTerminals) {

				var 
					clrPrdSet = new Object(),
					nNt = lrPd.recSym + "'",
					replaceRhs = [],
					newProdRhs = [];

				console.log(nonTerminals);

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

			})(lrProduction,this.nonTerminals);

			this.productions[nrProduction.replace.lhs] = nrProduction.replace.rhs;
			this.productions[nrProduction.newProd.lhs] = nrProduction.newProd.rhs;
		}

		console.log("Finished removing left recursion");
		console.log(this.productions,this.nonTerminals);
	};

	this.buildFirstAndFollow = function () {
		 this.nullables = (function (productions) {
		 	var nullables = [];
			for(var m in productions) {
				for(var i=0;i<productions[m].length;i++) {
					if(productions[m][i] == "<lambda>") {
						nullables.push(m);
						break;
					}
				}
			}
			console.log("Nullables : "+nullables);
		})(this.productions);

		var first = (function (productions,terminals,nTerminals) {
			var first = [];
			for(var m in productions) {
				for(var i=0;i<productions[m].length;i++){
					var rhs = productions[m][i];
					if(terminals.indexOf(rhs[0]) >= 0)
						first.push(rhs[0]);
					else if(nTerminals.indexOf(rhs[0]) >= 0) {
						var nter = rhs[0];
						for(var i=0;i<productions[nter].length;i++){
							var nt = productions[nter][i][0]
							if(terminals.indexOf(nt) >= 0)
								first.push(nt);
						}
					}
				}
			}
			return first;
		})(this.productions,this.terminals,this.nonTerminals);

		console.log(first);
	};
}

var G = new Grammar();

// G.addProduction(new Production("A",['x','B']));
// G.addProduction(new Production("A",['A','x']));
// G.addProduction(new Production("A",['b']));
// G.addProduction(new Production("C",['C','x']));

G.specifyNTerminals(['A','S']);
G.specifyTerminals(['c','b','d','a']);

G.addProduction(new Production("S",['A','a']));
G.addProduction(new Production("S",['b']));
G.addProduction(new Production("A",['A','c']));
G.addProduction(new Production("A",['<lambda>']));
G.addProduction(new Production("A",['b','d']));
G.addProduction(new Production("A",['A','a','d']));

G.printAllProductions();
G.removeLeftRecursion();
G.buildFirstAndFollow();