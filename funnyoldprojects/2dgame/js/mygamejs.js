const STAND_STILL = 2;
const MOVE_UP = 0;
const MOVE_BOTTOM = 1;
const MOVE_RIGHT = 0;
const MOVE_LEFT = 1;
const SKY_COLOR = "rgb(100, 180, 240)";

function compareposition(a,b){
if(a.x==b.x-1 && a.y==b.y-1) return -1;
if(a.x==a.y && b.x==b.y && a.x < b.x) return -1;
return 1;
}

$(document).ready(function() {
$(window).resize(function() {
  $("#a_submenu").prettypiemenu("hide");
  $("#a_menu").prettypiemenu("hide");
  Game.clearSelectedSquad();
  $("#currentover2").css('left',canvas.offsetLeft + 58);
  $("#selectedSquad").css('left',canvas.offsetLeft );
});

canvas = document.getElementById('game_canvas');

$("#currentover2").css('left',canvas.offsetLeft + 58);
$("#selectedSquad").css('left',canvas.offsetLeft);
//alert(canvas.offsetTop);
$(document).bind("keydown", function(evt) {

 if (evt.which == 27 && Game.gameAction=='move') {
 alert("deselect");
  Game.clearSelectedSquad();
  Game.draw(context);
 }});

$("#game_canvas").bind("mousemove", function(e){

var x = e.pagex;
var y = e.pagey;
var x1 = e.pageX-canvas.offsetLeft;
var y1 = e.pageY-canvas.offsetTop;
var testt = Game.detectSquadMousePosition(x1,y1);
if(testt.valid){
$("#currentover2").show();
$("#currentover2").css('background-image','url('+ Game.players[testt.player].squads[testt.squad].img.src+')');
$("#currentover2").html('Name : ' + Game.players[testt.player].squads[testt.squad].name + '</br> HP : ' + Game.players[testt.player].squads[testt.squad].healthpoints + '</br> MP :' + Game.players[testt.player].squads[testt.squad].magicpoints );
}
else{$("#currentover2").hide();
}
});


$("#game_canvas").bind("mouseup", function(e){
		e.preventDefault();
		e.stopPropagation();
		var x = e.pageX;
		var y = e.pageY;
		var x1 = e.pageX-canvas.offsetLeft;
		var y1 = e.pageY-canvas.offsetTop;
		ymouse=(2*(y-canvas.offsetTop-50)-x+canvas.offsetLeft+380)/2; //50 = top dist 380 = dist left
		xmouse=x+ymouse-380-20-canvas.offsetLeft;
		ymouse=Math.round(ymouse/20);// 20 = terrain height
		xmouse=Math.round(xmouse/20);
		if(Game.currentSelectedSquad!=null && Game.gameAction == 'move')
		{
			e.preventDefault();
			e.stopPropagation();
			Game.detectMoveAction(xmouse,ymouse,context);
			return false;
			
		}
		if(Game.currentSelectedSquad==null && Game.gameAction == null)
		{
			var test = Game.detectsquadSelection(x1,y1,0)	
			if(test.valid){
			$("#selectedSquad").show();
			$("#selectedSquad").css('background-image','url('+ Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].img.src+')');
			$("#selectedSquad").html('Name : ' + Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].name + '</br> HP : ' + Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].healthpoints + '</br> MP :' + Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].magicpoints );
				e.preventDefault();
				e.stopPropagation();
				var temp2 = [];
				//temp2 = [				
				//{ img: "ui-icon-minus", title: "Move" }, 
				//{ img: "ui-icon-plus",  title: "Attack" },
				//{ img: "ui-icon-close", title: "Items" },
				//{ img: "ui-icon-check", title: "Cancel" },
				//{ img: "ui-icon-minus", title: "plaah1" }, 
				//{ img: "ui-icon-plus",  title: "plaah2" }];
				temp2.push({ img: "ui-icon-plus", title: "Move" });
				temp2.push({ img: "ui-icon-minus", title: "Attack" });
				temp2.push({ img: "ui-icon-plus", title: "Items" });
				temp2.push({ img: "ui-icon-close", title: "Cancel" });
				temp2.push({ img: "ui-icon-check", title: "End Turn" });
		
				
			
			
				var temp3 = [];
				temp3 = [
				{ img: "ui-icon-minus", title: "Move" }, 
				{ img: "ui-icon-plus",  title: "Back" },
				{ img: "ui-icon-plus",  title: "Cancel" }];
			
				$("#a_submenu").prettypiemenu({buttons: temp3,
					onSelection: function(item) {
						if(item==1){
							setTimeout(function(){$("#a_menu").prettypiemenu("show", {top: test.ypos+20, left: test.xpos+12+canvas.offsetLeft});},200)	
							return false;
						}
						//cancel
						if(item==2){
							Game.clearSelectedSquad();
							$("#a_submenu").prettypiemenu("hide");
						}
					},
				closeRadius: 15,
				showTitles: true
				});
			
			 	$("#a_menu").prettypiemenu({buttons: temp2,
					onSelection: function(item){
						//move
						if(temp2[item].title=='Move'){
							if(!Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].move){
								Game.draw(context,"move");
							}else{
							Game.clearSelectedSquad();
							alert("alreadymovethisround");}
						}
						//cancel
						if(temp2[item].title=='Cancel'){
							//alert(Game.currentSelectedSquad);
							Game.clearSelectedSquad();
							$("#a_menu").prettypiemenu("hide");
						}
						if(temp2[item].title=='End Turn'){
							$("#a_menu").prettypiemenu("hide");
							Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].setturnOver();
							Game.gameLog("Squad ["+Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].name+"] ended its turn");
							Game.turnOver();
							Game.clearSelectedSquad();
						}
						if(temp2[item].title=='Items'){
							//Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].setturnOver();
							//Game.turnOver();
							Game.clearSelectedSquad();
						}
						//others
						//if(item==1){
						//	setTimeout(function(){$("#a_submenu").prettypiemenu("show", {top: test.ypos+20, left: test.xpos+12+canvas.offsetLeft});},200)	
						//	return false;
						//}
					},
				closeRadius: 15,
				showTitles: true
				});    
			
			$("#a_menu").prettypiemenu("show", {top: test.ypos+20, left: test.xpos+12+canvas.offsetLeft});
			return false;
			}
		}
	});
	
var context = $("#game_canvas")[0].getContext("2d");
//construct map example
//var mapa = [];
//for(i=0;i<20;i++){
//		for(j=0;j<20;j++){
//		mapa[i,j] = 0;
//	}
//}

var mapa = [
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:1},{w:1,t:1},{w:1,t:1},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:1},{w:1,t:1},{w:1,t:1},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}],
			[{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:1,t:2},{w:1,t:2},{w:1,t:2},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0},{w:0,t:0}]
			];

//create map resources, mapa array , tilewidth,tileheight
var mp2 = new Map('images/gameterrainxcf.png',mapa,40,20);

//Units,squads for player iron 
var units = [];
units.push(new Unit('squire5','squire','1','images/individual_units/unit1wavatar.png'));
units.push(new Unit('squire99','squire','1','images/individual_units/unit6wavatar.png'));
var squads = [];
squads.push(new Squad('bsquad1',0,0,0,units));
units = [];
units.push(new Unit('squire4','squire','1','images/individual_units/unit2wavatar.png'));
squads.push(new Squad('bsquad2',1,1,0,units));

squads.sort(compareposition);
var player = new Player('iron',false,'images/running_human_frames.png',squads);


//Units,squads for player iron2
units = [];
units.push(new Unit('squire3','squire','1','images/individual_units/unit3wavatar.png'));
squads = [];
squads.push(new Squad('psquad3',8,8,0,units));
units = [];
units.push(new Unit('squire2','squire','1','images/individual_units/unit4wavatar.png'));
squads.push(new Squad('psquad4',9,8,0,units));
units = [];
units.push(new Unit('squire1','squire','1','images/individual_units/unit5wavatar.png'));
squads.push(new Squad('psquad5',18,18,0,units));
units = [];
units.push(new Unit('squire2','squire','1','images/individual_units/unit6wavatar.png'));
squads.push(new Squad('psquad6',19,19,0,units));
squads.sort(compareposition);
var enemy = new Player('Computer',true,'images/running_human_frames.png',squads);

//Begin
Game.context = context;
Game.addMap(mp2);
Game.addPlayer(player);
Game.addPlayer(enemy);
var __loadingInt = setInterval(function(){if(Game.resourceisLoaded()){Game.draw(context);clearInterval(__loadingInt);Game.gameStart();}},100);

//setTimeout(function(){alert("redraw");Game.draw(context);},3000);
 
});