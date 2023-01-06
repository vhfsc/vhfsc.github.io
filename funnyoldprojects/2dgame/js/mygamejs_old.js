$(document).ready(function() {	
const STAND_STILL = 2;
var curplayer = null;
var world = new GameWorld();
var ctx = $("#game_canvas")[0].getContext("2d");
var playera = new Player(0,0);
//setInterval(function(){ctx.clearRect(0, 0, 600, 400);
//world.drawWorld(ctx);playera.drawPlayer(ctx,this.px,this.py)},10);
$("#move_o").bind("mouseup",function(e){
  playera.drawSelectPlayerMoverange(e);
  curplayer=playera;
  e.stopPropagation();
  $("#menu_player").css("display","none");}
);
$("#attack_o").bind("mouseup",function(e){alert("teste2");});
$("#cancel_o").bind("mouseup",function(e){alert("teste3");});

$("#game_canvas").bind("mouseup", function(e){
var x = e.pageX-7;
   var y = e.pageY-7;
//alert(curplayer);
if(curplayer==null)
{

 if (x > playera.px && x < playera.px + 40 && y > playera.py  && y < playera.py + 40)
   {
//alert(playera.py);
e.stopPropagation();
$("#menu_player").css("position","absolute");
$("#menu_player").css("top",playera.py);
$("#menu_player").css("left",playera.px+40);
$("#menu_player").css("display","block");
}
}
else
{//ctx.clearRect(0, 0, 600, 400);
//world.drawWorld(ctx);
if ((x < playera.px || x > playera.px + 40) || (y < playera.py  || y > playera.py + 40))
   {

	playera.movePlayer(e,world);curplayer=null;$("#output-span").css("display","none");}
}
});
 
//    var x = evt.pageX-7
 //  var y = evt.pageY-7
 // p = $("#game_canvas")
 //var position = p.position();
    

  //   if (x-7 > player.x && x-7 < player.x + 40 && y-7 > player.y  && y-7 < player.y + 40)
   //  {
   // alert("ola");
   // this.drawWorld(ctx);
   //    }
 //});


});

function GameWorld(){
var ctx = $("#game_canvas")[0].getContext("2d");
this.drawWorld(ctx);

}

GameWorld.prototype ={
drawWorld: function(ctx){
  for(i=0; i<15 ;i++){
    for(j=0;j<20;j++){
      if ((i+j) % 2 === 0) {
        ctx.fillStyle = '#444444';
        }
       else {
          ctx.fillStyle = '#BBBBBB';
        } 
      ctx.fillRect(j*40,i*40,40,40);
    }
  }
}




};

function Player(px,py){
this.movementDirection = 2;
this.animationFrame = 0;
this.px = px;
this.py = py;
this.dist = 15;
this.img = new Image();
this.img.src="running_human_frames.png";
ctx = $("#game_canvas")[0].getContext("2d");



this.drawPlayer(ctx,px,py);

}

Player.prototype ={
drawPlayer: function(ctx,x,y){
  //ctx.fillStyle = 'Blue';
  //ctx.beginPath();
  //ctx.arc(x+20,y+20,20,0,Math.PI*2,false);
  //ctx.fill();
  var spriteOffsetY = 64*this.movementDirection;
  var spriteOffsetX = 64*this.animationFrame;
  ctx.drawImage(this.img, spriteOffsetX, spriteOffsetY, 64, 64,
                      this.px, this.py, 64, 64);

},
playerMenuItems: function(){
return "<ul style='background:white;' ><li>Move</li><li>Attack</li><li>Cancel</li></ul>";
},
movePlayer:function(evt,world){
var x = evt.pageX-7;
var y = evt.pageY-7;
//alert("rato : " + x +"-"+ y);
//alert("player : " + this.px +"-"+ this.py);
//ctx.clearRect(this.px,this.py,40,40);
//alert((Math.abs((x)-(this.px)) + Math.abs((y)-(this.py))))
x = x-(x%40);
y = y-(y%40);
//if(x%40<=20)
 //   { x = x-(x%40);}
//else
//    { x = x-(x%40)+40;}
//if(y%40<=20)
 //   { y = y-(y%40);}
//else
 //   { y = y-(y%40)+40;}

//	alert("novo rato : " + x + "-" + y);
var self = this;
if((Math.abs((x+20)-(this.px+20)) + Math.abs((y+20)-(this.py+20))) <= this.dist*40 ){
   test = setInterval(function() {self.updatePlayer(x,y,world);
},1000/30);
   //this.drawPlayer(ctx,x,y);
  // this.px = x;
   //this.py = y;
}
else
{
this.drawPlayer(ctx,this.px,this.py);
this.drawSelectPlayerMoverange(e);
}   
},
updatePlayer: function(x,y,world){


if (x!=this.px)
	{
		if(x-this.px>0)
	{this.px=this.px+10;}
	else
	{this.px=this.px-10;}
	this.movementDirection = 1;
	this.animationFrame = (this.animationFrame + 1) % 5;
	ctx.clearRect(0, 0, 600, 400);
	world.drawWorld(ctx); this.drawPlayer(ctx,this.px,this.py);}
	else
	{if (y!=this.py)
		{if(y-this.py>0)
		{this.py=this.py+10;}
		else
		{this.py=this.py-10;}
		this.movementDirection = 0;
		this.animationFrame = (this.animationFrame + 1) % 5;
		ctx.clearRect(0, 0, 600, 400);
		world.drawWorld(ctx);
		this.drawPlayer(ctx,this.px,this.py);}			
		else
		{this.movementDirection = 2;
		this.animationFrame = 0;
		ctx.clearRect(0, 0, 600, 400);
		world.drawWorld(ctx);
		this.drawPlayer(ctx,this.px,this.py);
		clearInterval(test);}
			
	}
},
drawSelectPlayerMoverange:function(evt){
 
 //alert("Player pos : left => " +  this.px + "top =>" + this.py);



    for(i=0; i<15 ;i++){
      for(j=0;j<20;j++){
          ctx.fillStyle = 'rgba(200, 0, 0, 0.4)';
          if((Math.abs((j*40+20)-(this.px+20)) + Math.abs((i*40+20)-(this.py+20))) <= this.dist*40 ){
         if((j*40)!=this.px || (i*40)!=this.py)
            ctx.fillRect(j*40,i*40,40,40);}
         
 }
  }
  
}



};


