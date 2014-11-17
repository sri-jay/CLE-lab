$(document).ready(function(){
    /*
        Check the terminals and non terminals
    * */

    var grammar = new Grammar();

    var terError = false;
    var nterError = false;

    $("#check-symbols").click(function(){
        var
            terInp = document.getElementById("ter-input"),
            nterInp = document.getElementById("nter-input"),
            terStat = document.getElementById("ter-stat"),
            nterStat = document.getElementById("nter-stat"),

            segBack = document.getElementById("symbol-input"),
            button = document.getElementById("check-symbols");

        var
            terminals = terInp.value.split(","),
            nterminals = nterInp.value.split(",");

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
                            grammar.specifyTerminals(terminals)
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
                                        goto("production-input");
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

    var data = grammar.getAllSymbols();

    var lhsOpt = data.nter;
});