var num = 0;
$('#board').dblclick(function(e) {
	console.log("clicked",e,e.clientX,e.clientY,"  --  ",e.target);
	if(e.target == this){
	//alert("clicked");
	$( this ).append("<div id = 'text_"+num+"' style='left:"+e.clientX+"px;top:"+e.clientY+"px;position:absolute;min-width:50px;min-height:10px;margin: 5px;padding: 5px;border: black;border-width: 1px;border-style: solid'>Double click to type or Click and drag</div>");
	
	$("#text_"+num).editable();
	$("#text_"+num).draggable({containment : $("#board")});
	num = num+1;
}
});
$(document).ready(function(){
$('#board').contextMenu('context-menu-1', {
            'Add Tree': {
                click: function(e) {  // element is the jquery obj clicked on when context menu launched
                	console.log("clicked",e,e.clientX,e.clientY,"  --  ",e.target);
                    $('#board').append("<img src='./img/tree2.jpg'id = 'tree_"+num+"' style='left:"+e.clientX+"px;top:"+e.clientY+"px;position:absolute;width:150px;height:150px;'>");
                    $("#tree_"+num).draggable({containment : $("#board")});
                    num= num +1;
                },
                klass: "menu-item-1" // a custom css class for this menu item (usable for styling)
            },
            'Add Flow Chart': {
                click: function(element){ alert('second clicked'); },
                klass: "second-menu-item"
            },
            'Add Equation' : {
            	click: function(e){
            		$("<span id='Eq_"+num+"' style='left:"+e.clientX+"px;top:"+e.clientY+"px;position:absolute;'></span>").appendTo('#board').mathquill('editable');
                    $("#Eq_"+num).draggable({containment : $("#board")});
                    $("#Eq_"+num).focus();
                    num= num +1;
            	}
            }
        });

});
      function timecode(ms) {
        var hms = {
          h: Math.floor(ms/(60*60*1000)),
          m: Math.floor((ms/60000) % 60),
          s: Math.floor((ms/1000) % 60)
        };
        var tc = []; // Timecode array to be joined with '.'

        if (hms.h > 0) {
          tc.push(hms.h);
        }

        tc.push((hms.m < 10 && hms.h > 0 ? "0" + hms.m : hms.m));
        tc.push((hms.s < 10  ? "0" + hms.s : hms.s));

        return tc.join(':');
      }
    
    
      Recorder.initialize({
        swfSrc: "./JS/recorder.swf"
      });

      function record(){
        Recorder.record({
          start: function(){
            //alert("recording starts now. press stop when youre done. and then play or upload if you want.");
          },
          progress: function(milliseconds){
            document.getElementById("time").innerHTML = timecode(milliseconds);
          }
        });
      }
      
      function play(){
        Recorder.stop();
        Recorder.play({
          progress: function(milliseconds){
            document.getElementById("time").innerHTML = timecode(milliseconds);
          }
        });
      }
      
      function stop(){
        Recorder.stop();
      }