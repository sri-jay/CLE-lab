function Production(lhs,rhs,dat) {
	this.lhs = lhs;
	this.rhs = rhs;

	this.dat = dat;

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

	this.startSymbol = null;
	this.terminals = [];
	this.nonTerminals = [];

	this.productions = {};
	this.first = {};
	this.follow = {}	;

	this.parseTable = {};

	this.specifyTerminals = function (ter) {
		this.terminals = ter;
		this.terminals.push('$');
	};

	this.specifyNTerminals = function (nter) {
		this.nonTerminals = nter
	};

	this.setStartSymbol = function(sym){
		if(this.nonTerminals.indexOf(sym) >= 0)
			this.startSymbol = sym;
		else
			throw new Error();
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

	this.getAllSymbols = function () {
		var symbols = new Object();
		symbols.ter = this.terminals;
		symbols.nter = this.nonTerminals;
		return symbols;
	};

	this.getFirstFollow = function () {
		var sets = new  Object();

		sets.first = this.first;
		sets.follow = this.follow;

		return sets;
	};

	this.getParseTable = function () {
		return this.parseTable;
	};

	this.clearAllProductions = function(){
		this.productions = {};
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
			this.productions[prod.lhs].push(prod.rhs);
		}

		else
			this.productions[prod.lhs].push(prod.rhs);
	};

	this.analyzeGrammar = function(){
		var data = [];

		var
			isLr = false,
			isLf = false;

		console.log("Analysing for left recursion and left factoring : "+this.productions);

		for(var m in this.productions){
			isLr = false;
			isLf = false;

			for(var i=0;i<this.productions[m].length;i++) {
				if(m == this.productions[m][i][0]) {
					//data.lr[m] = this.productions[m];
					isLr = true;
					break;
				}
			}

			for(var i = 0;i<this.productions[m].length;i++){
				var lfTer = this.productions[m][i];
				lfTer = lfTer[0];
				if(this.terminals.indexOf(lfTer) >= 0 || this.nonTerminals.indexOf(lfTer) >= 0){
					for(var j=0;j<this.productions[m].length;j++){
						var prdRhs = this.productions[m][j];
						prdRhs = prdRhs[0];
						if(i != j){
							if(lfTer == prdRhs){
								isLf = true;
								break;
							}
						}
					}
				}
				if(isLf == true)
					break;
			}
			data.push([m,this.productions[m],isLr,isLf]);
		}

		console.log(data);
		return data;
	};

	this.removeLeftRecursion = function () {
		console.log("%cRemoving Left Recursion","background-color:blue;color:green");
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
					replaceRhs.push((function(){
						pd.shift();
						pd.push(nNt);
						return pd;
					})());
				}

				replaceRhs.push("λ");

				if(lrPd.nonRecProd.length == 0)
					newProdRhs.push(nNt);

				else {
					for (var i=0;i<lrPd.nonRecProd.length;i++)
					{
						if(lrPd.nonRecProd[i] == "λ") {
							newProdRhs.push(nNt);
							continue;
						}
						newProdRhs.push([lrPd.nonRecProd[i],nNt]);
					}
				}

				clrPrdSet.replace = new Production(nNt,replaceRhs);
				clrPrdSet.newProd = new Production(lrPd.recSym,newProdRhs);

				return clrPrdSet;

			})(lrProduction,this.nonTerminals);

			this.productions[nrProduction.replace.lhs] = nrProduction.replace.rhs;
			this.productions[nrProduction.newProd.lhs] = nrProduction.newProd.rhs;
		}

		console.log(this.productions,this.nonTerminals);
		console.log("%cRemoved Left Recursion","background-color:blue;color:red");
	};

	this.removeLeftFactoring = function () {
		console.log("%cRemoving Left Factoring","background-color:green;color:yellow");
		var pause = true;
		while(pause){
			pause = false;
			for(var m in this.productions) {

				console.log("Production in analysis : "+m+" -> "+this.productions[m]);
				var data = {};
				var refact = false;

				/*
				 Holds a map of terminals -> productions starting with said terminal,
				 but in the context of the current production.
				 */
				for(var i=0;i<this.terminals.length;i++)
					data[this.terminals[i]] = [];

				for(var i=0;i<this.nonTerminals.length;i++)
					data[this.nonTerminals[i]] = [];

				for(var i=0;i<this.productions[m].length;i++) {
					var str = this.productions[m][i];
					var startToken = str[0];

					refact = true;
					data[startToken].push(str);

				}
				console.log(data);
				if(refact){
					console.log("%c- Analysing for Refactoring:",'color: orange');
					for(var v in data) {
						if(data[v].length < 2) {
							console.log("%c-- Number of productions < 2, skipping.",'color: green');
							continue;
						}
						else {
							pause = true;
							console.log("%c-- Refactoring needed",'color: red');
							console.log("%c-- Adding a new Terminal:",'color: maroon');
							var newNonTer = v.toUpperCase() + ".";
							console.log("%c--- "+newNonTer,'color: blue');
							this.nonTerminals.push(newNonTer);

							var rhs = []
							for(var j=0;j<data[v].length;j++) {
								var str = data[v][j].slice(1);
								if(str.length == 0)
									rhs.push("λ");
								else
									rhs.push(str);
							}
							for(var j=0;j<this.productions[m].length;j++) {
								var str = this.productions[m][j];
								console.log(str);
								if(str[0] == v) {
									this.productions[m].splice(j,1);
									j--;
								}
							}
							this.productions[m].push([v,newNonTer]);
							for(var j=0;j<rhs.length;j++) {
								console.log(rhs[j]);
								var newProd = new Production(newNonTer, rhs[j]);
								this.addProduction(newProd);
							}
						}
					}
				}
			}
		}
		console.log("%cRemoved Left Factoring","background-color:green;color:yellow");
	};

	this.buildFirstAndFollow = function () {
		console.log("%cCalculating FIRST and FOLLOW sets.","background-color:orange");

		 this.nullables = (function (productions) {
		 	console.log("%c- Calculating NULLABLES","color:maroon");
		 	var nullables = [];
			for(var m in productions) {
				if(productions[m].indexOf("λ") >= 0)
					nullables.push(m);
			}
		 	console.log("%c- Calculated NULLABLES","color:maroon");
			 return nullables;
		})(this.productions);

		/*
			Calculating FIRST set of language.
		 */
		this.first = (function (prod,ter,nter){
			console.log("%cCalculating FIRST set of Grammar.","background-color:green;color:white");
			var first = {};

			for(var i=0;i<ter.length;i++){
				first[ter[i]] = [];
				first[ter[i]].push(ter[i]);
			}

			for(var m in prod){
				for(var i=0;i<prod[m].length;i++){
					if(!(m in first))
						first[m] = [];
					first[m].push(prod[m][i][0]);
				}
			}

			while(true){
				var isChanged = false;
				for(var m in first){
					for(var i=0;i<first[m].length;i++){
						if(nter.indexOf(first[m][i]) >= 0){
							isChanged = true;

							var nt = first[m][i];
							first[m].splice(i,1);

							for(var j=0;j<first[nt].length;j++){
								first[m].push(first[nt][j]);
							}
						}
					}
				}

				if(!isChanged)
					break;
			}

			console.log("%cCalculated FIRST set.","color:limegreen;background-color:black");
			return first;
		})(this.productions,this.terminals,this.nonTerminals);

		/*
		Calculating follow of language.
		 */
		this.follow = (function (prod,ter,nter,first){
			var follow = {};
			for(var m in prod)
				follow[m] = [];

			for(var m in prod){
				for(var n in prod){
					for(var i=0;i<prod[n].length;i++){
						for(var j=0;j<prod[n][i].length-1;j++){
							var
								cSym = prod[n][i][j],
								nSym = prod[n][i][j+1];

							if(cSym == m) {
								if (ter.indexOf(nSym) >= 0) {
									follow[m].push(nSym);
								}
								else {
									for(var k=0;k<first[nSym].length;k++)
										follow[m].push(first[nSym][k]);
								}
							}
						}
					}
				}
			}
			return follow;
		})(this.productions, this.terminals, this.nonTerminals, this.first);
	};

	this.buildParseTable = function () {

		this.parseTable = new Object();

		this.parseTable.table = {};
		this.parseTable.tMap = {};
		this.parseTable.ntMap = {};

		var
			tMap = {},
			ntMap = {},
			parseTable = {};

		for(var i=0;i<this.terminals.length;i++)
			tMap[this.terminals[i]] = i;

		for(var i=0;i<this.nonTerminals.length;i++)
			ntMap[this.nonTerminals[i]] = i;

		for(var i=0;i<this.nonTerminals.length;i++){
			parseTable[i] = [];
			for(var j=0;j<this.terminals.length;j++){
				parseTable[i].push([]);
			}
		}

		for(var m in this.productions){
			for(var i=0;i<this.productions[m].length;i++){
				var comp = this.productions[m][i][0];
				var prd = new Production(m,this.productions[m][i],true);
				for(var j=0; j<this.first[comp].length;j++){
					parseTable[ntMap[m]][tMap[this.first[comp][j]]].push(prd);
				}
			}
		}

		// Marking follow of the grammar
		for(var m in this.productions){
			for(var i=0;i<this.productions[m].length;i++){
				var comp = this.productions[m][i][0];
				var prd = new Production(m,this.productions[m][i],false);

				if(this.nullables.indexOf(comp) >= 0){
					for(var j=0; j<this.follow[comp].length;j++){
						parseTable[ntMap[m]][tMap[this.follow[comp][j]]].push(prd);
					}
				}
			}
		}

		this.parseTable.table = parseTable;
		this.parseTable.tMap = tMap;
		this.parseTable.ntMap = ntMap;

		console.log("Built Parse table");
		console.log(parseTable);

	};

	this.parseString = function (input) {
		console.log("%cBeginning parse action.","background-color:red,color:black;");

		var
			stack = [],
			parseActionTable = new Object();

		parseActionTable.status = null;
		parseActionTable.actions = [];

		var
			parseTable = this.parseTable.table,
			tMap = this.parseTable.tMap,
			ntMap = this.parseTable.ntMap;

		input = input.split(" ");

		input.push('$');

		stack.push('$');
		stack.push(this.startSymbol);

		parseActionTable.actions.push({"string":input.toString(),"stack":stack.toString()});
		
		while(input.length > 0 && stack.length > 0){
			var inputTop = input[0];
			var stackTop = stack[stack.length-1];

			if( !(this.terminals.indexOf(inputTop) >= 0) ){
				console.log("Input Top:");
				console.log(inputTop);
				parseActionTable.status = "SYMBOL_ERROR";
				return parseActionTable;
			}

			if(stackTop == inputTop){
				input.shift();
				stack.pop();
			}
			else {
				stack.pop();

				try{
					var dataToPush = parseTable[ntMap[stackTop]][tMap[inputTop]];

					if(dataToPush.length > 1){
						parseActionTable.status = 'PARSE_ERROR';
						return parseActionTable;
					}

					dataToPush = dataToPush[0].getRhs();
					console.log(dataToPush);

					for(var i =dataToPush.length-1;i>=0;i--)
						stack.push(dataToPush[i]);
				}
				catch (err) {
					parseActionTable.status = 'PARSE_ERROR';
					return parseActionTable;
				}
			}
			parseActionTable.actions.push({"string":input.toString(),"stack":stack.toString()});
		}

		if(input.length == 0 && stack.length == 0){
			parseActionTable.status = 'PARSE_SUCCESSFUL';
		}
		else
			parseActionTable.status = 'PARSE_UNSUCCESSFUL';

		console.log("%cEnd Parse Action.","background-color:red,color:black;");

		return parseActionTable;
	};
}

function driver() {
	G = new Grammar();

	G.specifyNTerminals(['S','F','L']);
	G.specifyTerminals(['(',')','a','+', 'lf']);

	//G.addProduction(new Production("S",['A','a']));
	//G.addProduction(new Production("S",['b']));
	//G.addProduction(new Production("A",['A','c']));
	//G.addProduction(new Production("A",['λ']));
	//G.addProduction(new Production("A",['b','d']));
	//G.addProduction(new Production("A",['A','a','d']));
	//G.addProduction(new Production("X", ['a', 'b', 'c']));
	//G.addProduction(new Production("X", ['a', 'd']));
	//G.addProduction(new Production("X", ['a']));
	//G.addProduction(new Production("X",['c','b']));
	//G.addProduction(new Production("Y",['b']));
	//G.addProduction(new Production("Y",['b','c']));
	//G.addProduction(new Production("Z",['Z','d']))

	//G.addProduction(new Production("A",['a','b']));
	//G.addProduction(new Production("A",['b','c']));
	//G.addProduction(new Production("A",['B','b']));
	//G.addProduction(new Production("B",['C','c']));
	//G.addProduction(new Production("B",['x','c']));
	//G.addProduction(new Production("C",['c']));
	//G.addProduction(new Production("C",['d']));

	G.startSymbol = 'S';

	G.addProduction(new Production("S",['L','F']));
	G.addProduction(new Production("S",['L','(','S','+','F',')']));
	G.addProduction(new Production("F",['a']));
	G.addProduction(new Production("L",['lf']));

	G.removeLeftRecursion();
	G.removeLeftFactoring();
	G.buildFirstAndFollow();
	G.buildParseTable();

	parseResults = G.parseString("( a + a )");
}
