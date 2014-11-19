$(document).ready(function(){
    $(function() {
        $('a[href*=#]:not([href=#])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top,
                        scrollLeft: target.offset().left,
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

$('.ui.radio.checkbox')
    .checkbox()
;

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
    start += "          <input type='text' class='prodRHS' placeholder='Enter Productions here' name='pRHS"+prdInputCnt+"'>";
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