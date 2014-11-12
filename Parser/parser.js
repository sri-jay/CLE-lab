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

	this.isTerminal = function (ter) {
		if(this.terminals.indexOf(ter) >= 0)
			return true;
		else
			return false;
	};

	this.isNonTerminal = function (nTer) {
		if(this.nonTerminals.indexOf(nTer) >= 0)
			return true;
		else
			return false;
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
				if(productions[m].indexOf("<lambda>") >= 0)
					nullables.push(m);
			}
			console.log("Nullables : "+nullables);
		})(this.productions);

		/*
			First of language
		 */
		var first = (function (prod,ter,nter){
			console.clear();

			console.log("Building FIRST set.");
			console.log("Productions : "+prod);
			console.log("Terminals : "+ter);
			console.log("Non Terminals : "+nter);

			console.log("Initializing FIRST set.")
			var first = (function (prd) {
				var fst = {};
				for(var m in prd)
					fst[m] = [];
				return fst;
			})(prod);

			for(var m in prod) {
				for(var i=0;i<prod[m].length;i++) {
					var pd = prod[m][i];
					if(ter.indexOf(pd[0]) >= 0)
						first[m].push(pd[0]);
				}
			}
			for(var m in first) {
				console.log("First of "+m+" -> ");
				console.log(first[m]);
			}
		})(this.productions,this.terminals,this.nonTerminals);

		var follow = (function (prod,ter,nter) {
			console.clear();

			console.log("Building FOLLOW set.");
			console.log("Productions : "+prod);
			console.log("Terminals : "+ter);
			console.log("Non Terminals : "+nter);

			console.log("Initializing FOLLOW set.")
			var follow = (function () {
				var flw = {};
				for(var m in prod)
					flw[m] = [];
				return flw;
			})(prod);
		})(this.productions,this.terminals,this.nonTerminals);
	};
}

function run() {
	var G = new Grammar();

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
}

run();
