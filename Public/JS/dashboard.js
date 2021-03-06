var num = 0;
socket = io.connect();

var dragHandle = "<div class='dragHandle' style='width:10px;height:10px;background-color: black;left: 5px;top: -5px;position: relative;float: left;'></div>";
var delHandle = "<div class='delHandle' style='width:10px;height:10px;background-color: red;left: -5px;top: -5px;position: relative;float: right;'></div>";

socket.on("work",function(data){
  console.log(data)
  num = data.length
  for(i = 0;i<data.length;i++){
    $('#board').append("<div  id = '"+data[i].name+"' style='left:"+data[i].position.left+";top:"+data[i].position.top+";position:absolute;'></div>");
    $( "#"+data[i].name ).append(dragHandle+delHandle+"<textarea style='margin: 5px;padding: 5px;border: black;border-width: 1px;border-style: solid'>Click to type</textarea>");
  
  $("#"+data[i].name).draggable({containment : $("#board")
                              ,handler : $('#text_'+num+' .dragHandle')
                              ,stop:function(){
                                console.log("Postion updated")
                                socket.emit("updatePos",$(this).attr('id'),{left : $(this).css("left"),top: $(this).css("top")});
                              }
                            });
  $("#"+data[i].name +" textarea").autosize({append: "\n"});
  $("#"+data[i].name +" textarea").change(function(){
    console.log("Value updated")
    socket.emit('updateVal',$(this).parent().attr('id'),$(this).val())
  });
  $("#"+data[i].name +" .delHandle").click(function(){
    socket.emit("removeObject",$(this).parent().attr('id'));
    $(this).parent().remove();
  })
  $("#"+data[i].name +" textarea").val(data[i].value);
  }

});

$('#board').dblclick(function(e) {
//	console.log("clicked",e,e.clientX,e.clientY,"  --  ",e.target);
	if(e.target == this){
	//alert("clicked");
  $( this ).append("<div  id = 'text_"+num+"' style='left:"+(e.clientX)+"px;top:"+(e.clientY + window.pageYOffset)+"px;position:absolute;'></div>");

  $( "#text_"+num ).append(dragHandle+delHandle+"<textarea style='margin: 5px;padding: 5px;border: black;border-width: 1px;border-style: solid'>Click to type</textarea>");
	
	$("#text_"+num).draggable({containment : $("#board")
                              ,handler : $('#text_'+num+' .dragHandle')
                              ,stop:function(){
                                console.log("Postion updated")
                                socket.emit("updatePos",$(this).attr('id'),{left : $(this).css("left"),top: $(this).css("top")});
                              }
                            });
  $("#text_"+num +" textarea").autosize({append: "\n"});
  $("#text_"+num +" textarea").change(function(){
    console.log("Value updated")
    socket.emit('updateVal',$(this).parent().attr('id'),$(this).val())
  });
  $("#text_"+num +" .delHandle").click(function(){
    socket.emit("removeObject",$(this).parent().attr('id'));
    $(this).parent().remove();
  })
  textboxinfo = {name:"text_"+num
                  , position : {left : $("#text_"+num).css("left"),top: $("#text_"+num).css("top")}
                  , value : $("#text_"+num +" textarea").val()
                   }
  socket.emit("createObject",textboxinfo)
	num = num+1;
}
});
$(document).ready(function(){
$('#board').contextMenu('context-menu-1', {
            'Add Tree': {
                link: '<a href="/tree">Add Tree</a>',
                klass: "menu-item-1" // a custom css class for this menu item (usable for styling)
            },
            'Add Flow Chart': {
                click: function(element){ alert('second clicked'); },
                klass: "second-menu-item"
            },
            'Add Equation' : {
            	click: function(e){
                $('#board').append("<div  id = 'Eq_"+num+"' style='left:"+e.clientX+"px;top:"+e.clientY+"px;position:absolute;'></div>");
            		$('#Eq_'+num).append(dragHandle+delHandle);
                $("<span>\\sumTypeAnEquationHere</span>").appendTo("#Eq_"+num).mathquill('editable');
                $("#Eq_"+num).draggable({containment : $("#board")
                                          ,handler : $('#Eq_'+num+' .dragHandle')});
                $("#Eq_"+num +" .delHandle").click(function(){
                      $(this).parent().remove();
                    })
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

      function save(){
        data = $("#board")[0].innerHTML
        console.log(data);
        socket.emit("Download",data);
      }

      socket.on("Download",function(){
        $.get("/Download");
      });