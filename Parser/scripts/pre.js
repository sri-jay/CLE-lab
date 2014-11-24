$(document).ready(function(){
    /*
        Check the terminals and non terminals
    */

    var grammar = new Grammar();

    /*
        Global how to error flags.
     */
    var prodDebug = true;

    $("#check-symbols").click(function (){
        /*
         Phase 1 Symbol check error flags.
         */
        var
            terError = false,
            nterError = false;

        var
            terInp = document.getElementById("ter-input"),
            nterInp = document.getElementById("nter-input"),

            terStat = document.getElementById("ter-stat"),
            nterStat = document.getElementById("nter-stat"),

            terCnt = document.getElementById("ter-cnt"),
            nterCnt = document.getElementById("nter-cnt"),

            segBack = document.getElementById("symbol-input"),
            button = document.getElementById("check-symbols");

        var
            terminals = terInp.value.split(","),
            nterminals = nterInp.value.split(",");

        terCnt.innerHTML = terminals.length;
        nterCnt.innerHTML = nterminals.length;

        if(terminals.indexOf('\'') >= 0) {
            terInp.parentNode.classList.add("error");
            terStat.classList.remove("grey");
            terStat.classList.remove("green");
            terStat.classList.add("orange");
            terStat.innerHTML = "Failed";

            segBack.classList.remove("pass");
            segBack.classList.add("fail");
            terError = true;
        }
        else
            terError = false;

        if(nterminals.indexOf('\'') >= 0) {
            nterInp.parentNode.classList.add("error");
            nterStat.classList.remove("grey");
            nterStat.classList.remove("green");
            nterStat.classList.add("orange");
            nterStat.innerHTML = "Failed";

            segBack.classList.remove("pass");
            segBack.classList.add("fail");
            nterError = true;
        }
        else
            nterError = false;

        if(!nterError) {
            nterStat.classList.remove("grey");
            nterStat.classList.remove("orange");
            nterStat.classList.add("green");
            nterStat.innerHTML = "Passed";
        }

        if(!terError) {
            terStat.classList.remove("grey");
            terStat.classList.remove("orange");
            terStat.classList.add("green");
            terStat.innerHTML = "Passed";
        }

        if(nterError || terError){
            swal("You have errors!","You put in an invalid character somewhere!","error");
            button.classList.remove("green");
            button.classList.add("orange");

            document.getElementById("p-input").classList.add("loading");
        }


        else {
            terInp.parentNode.classList.remove("error");
            nterInp.parentNode.classList.remove("error");

            button.classList.remove("orange");
            button.classList.add("green");

            segBack.classList.remove("fail");
            segBack.classList.add("pass");

            swal(
                    {
                        type: "success",
                        title: "Looks Good!",
                        text : "Grammar looks good!",
                        showCancelButton: true,
                        confirmButtonColor: "green",
                        confirmButtonText : "Review?",
                        cancelButtonText  : "Not Yet!",
                        closeOnConfirm: false,
                        closeOnCancel: true
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            grammar.specifyNTerminals(nterminals);
                            grammar.specifyTerminals(terminals);
                            swal(
                                {
                                    title: "Added Symbols!",
                                    text: "Terminals : \n" + terminals.toString() + "\nNon Terminals : \n" + nterminals.toString(),
                                    type: "info",
                                    showCancelButton  : true,
                                    confirmButtonText : "Proceed?",
                                    closeOnConfirm    : true,
                                    closeOnCancel     : true
                                },
                                function (isConfirm) {
                                    if(isConfirm){
                                        var data = grammar.getAllSymbols();
                                        reset(grammar.getAllSymbols().nter);
                                        document.getElementById("p-input").classList.remove("loading");
                                        goto("production-input");
                                    }
                                    else {
                                        document.getElementById("p-input").classList.add("loading");
                                    }
                                }
                            );
                        }
                        else {
                            grammar.specifyNTerminals([]);
                            grammar.specifyNTerminals([]);
                        }
                    }
            );
        }
    });

    $("#check-productions").click(function (){

        var
            globalError = false,
            failCount = 0,
            count = 0;

        var
            prodStat = document.getElementById("prod-stat"),
            prodCnt = document.getElementById("prod-cnt");

        var symbols = grammar.getAllSymbols();

        $("#p-input-area").children().each(function(){
            var prodError = false;

            var
                lhsParent = $(this).find(".prodLHS"),
                rhsParent = $(this).find(".prodRHS");

            var
                lhs = lhsParent.val(),
                rhs = rhsParent.val();

            var
                lhsError = false,
                rhsError = false;

            if(typeof rhs != "undefined" && typeof lhs != "undefined"){
                count++;
                rhs = rhs.split(",");

                console.log(symbols);
                console.log(lhs);
                console.log(rhs);

                if(symbols.nter.indexOf(lhs) < 0)
                    lhsError = true;

                for(var v in rhs){
                    if( (symbols.ter.indexOf(rhs[v]) < 0) && (symbols.nter.indexOf(rhs[v]) < 0)) {
                        rhsError = true;
                        break;
                    }
                }

                prodError = lhsError | rhsError;
                if(prodError && prodDebug){
                    swal("Seems like you have an error!","The location of error is highlighted in red!","error");
                    prodDebug = false;
                }
                if(prodError){
                    rhsParent.parent().addClass("error");

                    rhsParent.parent().find(".status-marker").removeClass("blue");
                    rhsParent.parent().find(".status-marker").removeClass("green");
                    rhsParent.parent().find(".status-marker").addClass("red");

                    rhsParent.parent().find(".status-marker").find(".status-mark").html("Rejected");

                    rhsParent.parent().find(".status-marker").find(".status-icon").removeClass("lab");
                    rhsParent.parent().find(".status-marker").find(".status-icon").removeClass("checkmark");
                    rhsParent.parent().find(".status-marker").find(".status-icon").addClass("warning");
                }
                else{
                    rhsParent.parent().removeClass("error");

                    rhsParent.parent().find(".status-marker").removeClass("blue");
                    rhsParent.parent().find(".status-marker").removeClass("red");
                    rhsParent.parent().find(".status-marker").addClass("green");

                    rhsParent.parent().find(".status-marker").find(".status-mark").html("Accepted");
                    rhsParent.parent().find(".status-marker").find(".status-icon").removeClass("lab");
                    rhsParent.parent().find(".status-marker").find(".status-icon").removeClass("warning");
                    rhsParent.parent().find(".status-marker").find(".status-icon").addClass("checkmark");
                }

                globalError = globalError | prodError;
            }
            prodCnt.innerHTML = count;
        });

        if(globalError){
            $("#production-input").removeClass("pass");
            $("#production-input").addClass("fail");

            prodStat.classList.remove("grey");
            prodStat.classList.remove("green");
            prodStat.classList.add("red");

            prodStat.innerHTML = "Failed";
        }
        else {
            $("#production-input").removeClass("fail");
            $("#production-input").addClass("pass");

            prodStat.classList.remove("grey");
            prodStat.classList.remove("red");
            prodStat.classList.add("green");

            prodStat.innerHTML = "Passed";

            swal({
                type: "success",
                title: "Looking Good!",
                text : "Productions look good!",
                showCancelButton: true,
                confirmButtonColor: "green",
                confirmButtonText : "Proceed?",
                cancelButtonText  : "Not Yet!",
                closeOnConfirm: true,
                closeOnCancel: true
            },
                function(isConfirm){
                    if(isConfirm){
                        $('#mdl').modal('toggle');
                        console.clear();
                        $("#prod-rev-data").html("");
                        $("#p-input-area").children().each(function(){
                            var
                                lhsParent = $(this).find(".prodLHS"),
                                rhsParent = $(this).find(".prodRHS");

                            var
                                lhs = lhsParent.val(),
                                rhs = rhsParent.val();

                            if(typeof rhs != "undefined" && typeof lhs != "undefined") {
                                console.log(rhs);
                                console.log(lhs);

                                rhs = rhs.split(",");
                                $("#prod-rev-data").append("<tr><td>"+lhs + "</td><td>" + rhs + "</td></tr>");
                            }
                        });
                    }
                }
            );
        }
        globalError = false;
    });

    $("#reset-productions").click(function () {
        reset(grammar.nonTerminals);
        var back = document.getElementById("production-input");

        back.classList.remove("pass");
        back.classList.remove("fail");
        //back.classList.add("reset");

        var stat = document.getElementById("prod-stat");
        stat.classList.remove("grey");
        stat.classList.remove("green");
        stat.classList.remove("red");

        stat.classList.add("grey");
        stat.innerHTML = "Reset";
    });

    $("#prod-rejected").click(function (){
        grammar.clearAllProductions();
        $("#prod-message").html("");
    });

    $("#prod-verified").click(function (){
        grammar.clearAllProductions();
        $("#p-input-area").children().each(function(){
            var
                lhsParent = $(this).find(".prodLHS"),
                rhsParent = $(this).find(".prodRHS");

            var
                lhs = lhsParent.val(),
                rhs = rhsParent.val();

            if(typeof rhs != "undefined" && typeof lhs != "undefined") {

                grammar.addProduction(new Production(lhs,rhs.split(",")));
            }
        });
        console.log(grammar.printAllProductions());
        $("#prod-message").html("");
        $("#prod-message").append("<div class='ui message inverted'><strong>Grammar rules added successfully, you can still edit them though.</strong></div>");
        setTimeout(function(){
            $("#mdl").modal('hide');
            console.log("%c- User notified on grammar.","color:red");
            createProductionSummary(grammar.analyzeGrammar());
            goto("production-summary");
        },1200);
    });

    $("#handle-errors").click(function () {
        console.log("Removing Left factoring");
        grammar.removeLeftRecursion();
        console.log("Removing left recursion");
        grammar.removeLeftFactoring();
        console.clear();

        setTimeout(updateGrammarSummary(grammar.productions),500);
        swal(
            {
                type : "success",
                title : "Removed production inperfections.",
                text  : "Looks good to go!",
                showCancelButton : true,
                confirmButtonText : "Click to Proceed",
                closeOnConfirm : true
            },
            function(isConfirm){
                if(isConfirm){
                    grammar.buildFirstAndFollow();
                    showFirstAndFollow(grammar.getAllSymbols(),grammar.getFirstFollow());
                    goto("fst-flw-sets");
                }
            }
        );
    });

    $("#sets-action").click(function (){
        $("#string-parsing").removeClass("loading");
        goto("str-parsing");
        grammar.buildParseTable();
    })

    $("#parse").click(function (){
        if(grammar.startSymbol == null){
            getStartSymbol(grammar.getAllSymbols().nter);
            $(this).addClass("red");
            $("#str-parsing").removeClass("fail").addClass("fail");
        }
        else{
            var
                strings = $("#input-strings").val().split(";"),
                parseResults = [];


            for(var i=0;i<strings.length;i++){

                console.log("Sending for Parsing:");
                console.log(strings[i]);

                parseResults.push(grammar.parseString(strings[i]));
            }
            showParseResults(parseResults);
            goto("view-parsing-results");
        }
    });

    $("#fix-start-symbol").click(function (){
        grammar.startSymbol = $("#start-symbol-ch-form input[type='radio']:checked").val();

        $("#parse").removeClass("red").addClass("green");
        $("#str-parsing").removeClass("fail").addClass("pass");

        $("#start-symbol-modal").modal('toggle');
    });
});