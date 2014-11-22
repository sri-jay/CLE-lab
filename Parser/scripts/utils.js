$(document).ready(function(){
    $(function() {
        $('a[href*=#]:not([href=#])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top,
                        scrollLeft: target.offset().left
                    }, 250);
                    return false;
                }
            }
        });
    });

});

prdInputCnt = 0;
nter = null;

function reset(nte){
    prdInputCnt = 0;
    nter = nte;
    var ipArea = document.getElementById("p-input-area");
    ipArea.innerHTML = '<p align="center"><strong>Productions</strong></p><div class="ui message"><p>Enter productions here</p><ul><li>Do not use comma, asterisk, apostrophe, period or double quotes in your terminals/non terminals please</li></ul></div>';
    for(var i=0;i<3;i++)
        writeOneElement();
}

function writeOneElement() {
    var start = "<div class='two fields'>";
    start += "<hr/>";
    start += "  <div class='field'>";
    start += "  <label>LHS</label>";

    start += "<select class='prodLHS' class='ui fluid selection dropdown'>";
    start += "<div class='menu'>";
    for(var v in nter) {
      //  start += "      <div class='ui radio checkbox'>";
        //start += nter[v]+" :<input type='radio' class='prodLHS' value='"+nter[v]+"'name='pLHS"+prdInputCnt+"'>&nbsp;&nbsp;";
        start += '<div  class="item">';
        start += '<option>'+nter[v]+"</option>";
        start += '</div>';
      //  start += "          <label>"+nter[v]+"</label>";
       // start += "      </div>"
    }
    start += "</div>";
    start += "</select>";
    start += "</div>";
    start += "  <div class='field'>";
    start += "      <label>RHS</label>";
    start += "      <div class='ui mini action medium labeled input'>";
    start += "          <input type='text' value='a,b,c' class='prodRHS' placeholder='Enter Productions here' name='pRHS"+prdInputCnt+"'>";
    start += '          <div class="ui icon labeled buttons"><div class="status-marker ui blue tiny right labeled icon button"><div class="status-mark">Pending</div><i class="status-icon lab icon"></i></div><div onclick="removeField(this)" class="ui right labeled icon tiny youtube button">Delete?<i class="remove icon"></i></div></div>';
  //  start += '<div class="status-marker ui blue tiny right labeled icon button"><div class="status-mark">Pending</div><i class="status-icon large square lab icon"></i></div>';
    start += "      </div>";
    start += "  </div>";
    start += "</div>";

    /*
        Increment the production count.
     */
    prdInputCnt++;
    $("#p-input-area").append(start);
}

function removeField(data){
    var dt = $(data).parent().parent().parent().parent().remove();
}

function goto(target) {
    $('html,body').animate({
        scrollTop: $("#"+target).offset().top,
        scrollLeft: $("#"+target).offset().left
    }, 250);
}

function createProductionSummary(results) {
    $("#analysis-results").html("");

    var
        isLr = false,
        isLf = false;

    for(var i=0;i<results.length;i++){
        isLr = isLr | results[i][2];
        isLf = isLf | results[i][3];

        var dat = "<tr>";
        dat += "<td>";
        dat += results[i][0]+"->"+results[i][1];
        dat += "</td>";
        if(results[i][2])
            dat += "<td class='negative'>Left Recursion is Present</td>";
        else
            dat += "<td class='positive'>No Left Recursion</td>";
        if(results[i][3])
            dat += "<td class='negative'>Left factoring present</td>";
        else
            dat += "<td class='positive'>Left Factoring absent</td>";

        dat += "</tr>";
        $("#analysis-results").append(dat);
    }
    if(isLf){
        $("#prod-fact").removeClass("grey");
        $("#prod-fact").addClass("red");
        $("#prod-fact").html("Present")
    }
    else {
        $("#prod-fact").removeClass("grey");
        $("#prod-fact").addClass("green");
        $("#prod-fact").html("Absent")
    }
    if(isLr){
        $("#prod-recur").removeClass("grey");
        $("#prod-recur").addClass("red");
        $("#prod-recur").html("Present")
    }
    else {
        $("#prod-recur").removeClass("grey");
        $("#prod-recur").addClass("green");
        $("#prod-recur").html("Absent")
    }

    if(isLf || isLr){
        $("#production-summary").removeClass("pass");
        $("#production-summary").addClass("fail");
    }
    else{
        $("#production-summary").addClass("pass");
        $("#analysis-action").removeClass("red");
        $("#analysis-action").addClass("green");
        $("#error-a").html("No Errors");
        $("#error-b").html("Proceed?");
    }
}

function updateGrammarSummary(uGrammar) {
    $("#analysis-results").html("");

    for(var m in uGrammar){
        if(typeof uGrammar[m] != "undefined"){
            var str = "<tr>";
            str += "<td>";
            str += m + "</td><td>";
            str += uGrammar[m]+"</td></tr>";

            $("#analysis-results").append(str);
        }
    }
    $("#production-summary").addClass("pass");
    $("#production-summary").removeClass("fail");

    $("#prod-recur").addClass("green");
    $("#prod-fact").addClass("green");

    $("#prod-fact").removeClass("red");
    $("#prod-recur").removeClass("red");

    $("#prod-fact").html("passed");
    $("#prod-recur").html("passed");
}