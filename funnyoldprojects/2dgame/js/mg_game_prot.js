var Game = {
context : null,
//array of players
players : [],
// map object
map : null,
moveArrayi : 0,
// current player
currentPlayer : null,
// current select squad
currentSelectedSquad : null,
gameAction : null,
gameStarted : false,
addPlayer: function(obj){ 
	this.players.push(obj);
},
addMap: function(obj){
this.map = obj;
},
resourceisLoaded: function(){
	for(var i = 0; i < this.players.length; i++){
		if(!this.players[i].imgLoaded){return false;}
		for(var j = 0; j < this.players[i].squads.length;j++){
			if(!this.players[i].squads[j].imgLoaded){
			return false;}
		}
	}
	return true;
},
draw: function(ctx,action){
	ctx.clearRect(0, 0,800, 600);
	this.map.drawMap(ctx,action);
	this.gameAction =  action;
	for(var i = 0; i < this.players.length; i++){
		this.players[i].draw(ctx);
	}
},
detectSquadMousePosition: function(x,y){
	for(var i = 0; i < this.players.length; i++){
		for(var j = (this.players[i].squads.length)-1 ; j >= 0 ; j--){
			if(x > this.players[i].squads[j].xdrawpos && x < this.players[i].squads[j].xdrawpos + 24 && y > this.players[i].squads[j].ydrawpos && y < this.players[i].squads[j].ydrawpos + 32 ){
				return {valid : true, player : i, squad : j };
			}
		}
	}
	return {valid : false};
},
detectsquadSelection: function(x,y){
	for(var i = 0; i < this.players.length; i++){
		for(var j = (this.players[i].squads.length)-1 ; j >= 0 ; j--){
			if(x > this.players[i].squads[j].xdrawpos && x < this.players[i].squads[j].xdrawpos + 24 && y > this.players[i].squads[j].ydrawpos && y < this.players[i].squads[j].ydrawpos + 32  && i==this.currentPlayer && !this.players[i].squads[j].turnOver){
				this.currentSelectedSquad = j;
				this.gameLog("Squad selected : [" + this.players[this.currentPlayer].squads[j].name + "]");
				return {valid : true, xpos : this.players[i].squads[j].xdrawpos, ypos : this.players[i].squads[j].ydrawpos };
			}
		}
	}
	return {valid : false};
},
detectMoveAction: function(x,y,ctx){
	if(Math.abs(x-this.players[this.currentPlayer].squads[this.currentSelectedSquad].x)+Math.abs(y-this.players[this.currentPlayer].squads[this.currentSelectedSquad].y) <= Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].mrange && x >=0 && x<=19 && y>=0 && y<=19 )
	{ 
		var resultadoCaminho = this.validPath(x,y);
		if(resultadoCaminho.valid && resultadoCaminho.result.length<=this.players[this.currentPlayer].squads[this.currentSelectedSquad].mrange){
				this.gameLog("Squad ["+ this.players[this.currentPlayer].squads[this.currentSelectedSquad].name +"]  moving from  [" + this.players[this.currentPlayer].squads[this.currentSelectedSquad].x +"," + this.players[this.currentPlayer].squads[this.currentSelectedSquad].y +"] to [" + x +"," + y + "]");
				var self = this;
				this.moveArrayi = 0;
				var animMoveInt = setInterval(
				function(){
				if(!self.players[self.currentPlayer].squads[self.currentSelectedSquad].move){
					self.players[self.currentPlayer].squads[self.currentSelectedSquad].moveSquad(resultadoCaminho.result);
					self.draw(ctx,'moving');
				}else{
					clearInterval(animMoveInt);
					self.clearSelectedSquad();
					self.gameAction = null;
				}				
				},1000/30);
				
		}
	}
},
clearSelectedSquad: function(){
this.currentSelectedSquad = null;
$("#selectedSquad").hide();
},
turnOver : function(){
var count = 0;
	for(var i = 0; i < this.players[this.currentPlayer].squads.length;i++){
		if(this.players[this.currentPlayer].squads[i].turnOver){
			count++;
		}
	}
	if(this.players[this.currentPlayer].squads.length == count){
		this.changeTurn();
	}
},
changeTurn : function(){
	for(var i = 0; i < this.players[this.currentPlayer].squads.length;i++){
	 this.players[this.currentPlayer].squads[i].clearTurn();
	}
	this.currentPlayer = (this.currentPlayer+1 >= this.players.length)? 0 : this.currentPlayer+1;
	this.gameLog("Player turn changed. Current player : " + this.players[this.currentPlayer].name);
	if(this.players[this.currentPlayer].aicontrol)
	{
	this.currentSelectedSquad=null;
		var self = this;
		setTimeout(function(){self.AIstart()},100);
		
	}
},
gameStart : function(){
this.gameStarted = true;
this.currentPlayer = 0;
this.currentSelectedSquad = null;
this.gameLog("Game Started. Current Player : "+ this.players[this.currentPlayer].name);
},
validPath : function(destx,desty){

	if(destx >= 0 && destx <20 && desty >=0 && desty < 20)
	{
	var graph = new Graph(this.map.map);
	var start = graph.nodes[Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].x][Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].y];
	var end = graph.nodes[destx][desty];
	var result = astar.search(graph.nodes, start, end);
	if(result.length>0)
		{return {valid : true,result : result};
		}
	}
return {valid : false, result : result};
},
AIstart : function(){
var self = this;
if(this.currentSelectedSquad==null){this.currentSelectedSquad=this.AISelectNextAliveSquad(0);}
	

	if(this.currentSelectedSquad < this.players[this.currentPlayer].squads.length)
	{
	this.gameLog("Squad selected : " + this.players[this.currentPlayer].squads[this.currentSelectedSquad].name);
	$("#selectedSquad").show();
	$("#selectedSquad").css('background-image','url('+ this.players[this.currentPlayer].squads[this.currentSelectedSquad].img.src+')');
	$("#selectedSquad").html('Name : ' + this.players[this.currentPlayer].squads[this.currentSelectedSquad].name + '</br> HP : ' + this.players[this.currentPlayer].squads[this.currentSelectedSquad].healthpoints + '</br> MP :' + this.players[this.currentPlayer].squads[this.currentSelectedSquad].magicpoints );
	if((this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget==null) || (!this.players[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.player].squads[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.squad].alive)){
		this.AIsearchTarget();
		
		if(this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget==null)
		{	
			this.gameLog("Squad : [" + this.players[this.currentPlayer].squads[this.currentSelectedSquad].name + "] didnt find target ending turn");
			this.players[this.currentPlayer].squads[this.currentSelectedSquad].setturnOver();
			this.currentSelectedSquad = this.AISelectNextAliveSquad(this.currentSelectedSquad+1);
			this.AIstart();
			return;
		}
		this.gameLog("Squad : [" + this.players[this.currentPlayer].squads[this.currentSelectedSquad].name + "] selected its target [" + this.players[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.player].squads[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.squad].name  +"]");
	}
	if((Math.abs(this.players[this.currentPlayer].squads[this.currentSelectedSquad].x - this.players[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.player].squads[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.squad].x) + Math.abs(this.players[this.currentPlayer].squads[this.currentSelectedSquad].y-this.players[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.player].squads[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.squad].y))==1 && !this.players[this.currentPlayer].squads[this.currentSelectedSquad].actions)
	{this.gameLog("Squad [" + this.players[this.currentPlayer].squads[this.currentSelectedSquad].name + "] is attacking squad [" + this.players[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.player].squads[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.squad].name + "]"); 
	
		this.players[this.currentPlayer].squads[this.currentSelectedSquad].actions=true;
		if(this.players[this.currentPlayer].squads[this.currentSelectedSquad].move)
			{this.players[this.currentPlayer].squads[this.currentSelectedSquad].setturnOver();
			this.gameLog("Squad : [" + this.players[this.currentPlayer].squads[this.currentSelectedSquad].name + "] ended its turn");
			this.currentSelectedSquad = this.AISelectNextAliveSquad(this.currentSelectedSquad+1);
			}
		this.AIstart();
		return;
		}
	if((Math.abs(this.players[this.currentPlayer].squads[this.currentSelectedSquad].x - this.players[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.player].squads[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.squad].x) + Math.abs(this.players[this.currentPlayer].squads[this.currentSelectedSquad].y-this.players[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.player].squads[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.squad].y))>1 && this.players[this.currentPlayer].squads[this.currentSelectedSquad].move)
		{
			this.players[this.currentPlayer].squads[this.currentSelectedSquad].setturnOver();
			this.gameLog("Squad : [" + this.players[this.currentPlayer].squads[this.currentSelectedSquad].name + "] ended its turn");
			this.currentSelectedSquad = this.AISelectNextAliveSquad(this.currentSelectedSquad+1);
			
			this.AIstart();
			return;
		}

	
	if((Math.abs(this.players[this.currentPlayer].squads[this.currentSelectedSquad].x - this.players[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.player].squads[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.squad].x) + Math.abs(this.players[this.currentPlayer].squads[this.currentSelectedSquad].y-this.players[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.player].squads[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.squad].y))==1 && this.players[this.currentPlayer].squads[this.currentSelectedSquad].actions)
		{
			this.players[this.currentPlayer].squads[this.currentSelectedSquad].setturnOver();
						this.gameLog("Squad : [" + this.players[this.currentPlayer].squads[this.currentSelectedSquad].name + "] ended its turn");

			this.currentSelectedSquad = this.AISelectNextAliveSquad(this.currentSelectedSquad+1);
			this.AIstart();
			return;
		}
	
	if(this.players[this.currentPlayer].squads[this.currentSelectedSquad].move && this.players[this.currentPlayer].squads[this.currentSelectedSquad].actions && !this.players[this.currentPlayer].squads[this.currentSelectedSquad].turnOver)
	{
		this.players[this.currentPlayer].squads[this.currentSelectedSquad].setturnOver();
		this.gameLog("Squad : [" + this.players[this.currentPlayer].squads[this.currentSelectedSquad].name + "] ended its turn");
		this.currentSelectedSquad = this.AISelectNextAliveSquad(this.currentSelectedSquad+1);
		
		this.AIstart();
		return;
	}
	if(!this.players[this.currentPlayer].squads[this.currentSelectedSquad].move){
	this.gameAction="move";
	
	var resultadoCaminho;

	resultadoCaminho = this.AIbestPath(this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.player,this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.squad);
		
		if((resultadoCaminho==null || !resultadoCaminho.valid) && this.players[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.player].squads[this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget.squad].alive)
				{
					this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget=null;
					this.gameAction = null;
					this.AIstart();
					return;
					
				}
				
				this.moveArrayi = 0;
				var squadd = self.currentSelectedSquad;
				
				resultadoCaminho.result.splice(this.players[this.currentPlayer].squads[this.currentSelectedSquad].mrange,resultadoCaminho.result.length-this.players[this.currentPlayer].squads[this.currentSelectedSquad].mrange);
				this.gameLog("Squad [" + this.players[this.currentPlayer].squads[this.currentSelectedSquad].name + "] moving from  [" + this.players[this.currentPlayer].squads[this.currentSelectedSquad].x +"," + this.players[this.currentPlayer].squads[this.currentSelectedSquad].y +"] to ["+ resultadoCaminho.result[resultadoCaminho.result.length-1].x +","+ resultadoCaminho.result[resultadoCaminho.result.length-1].y+ "]");
				var animMoveInt = setInterval(
				function(){
				if(!self.players[self.currentPlayer].squads[squadd].move){
					self.players[self.currentPlayer].squads[squadd].moveSquad(resultadoCaminho.result);
					self.draw(self.context,'moving');
				}else{
					clearInterval(animMoveInt);
					self.gameAction=null;
					if(self.players[self.currentPlayer].squads[squadd].actions)
					{self.players[self.currentPlayer].squads[squadd].setturnOver();
					self.gameLog("Squad : [" + self.players[self.currentPlayer].squads[squadd].name + "] ended its turn");
					self.currentSelectedSquad = self.AISelectNextAliveSquad(squadd+1);
					}
					
					self.AIstart();
				}				
				},1000/30);
	
	}
	}
	else{
	this.clearSelectedSquad();
	this.turnOver();
	}
},
AISelectNextAliveSquad : function(squad){
var retval=this.players[this.currentPlayer].squads.length;
	for(var i=squad; i < this.players[this.currentPlayer].squads.length;i++){
			if(this.players[this.currentPlayer].squads[i].alive && !this.players[this.currentPlayer].squads[i].turnOver){retval = i;break;}
		}
	return retval;
},
//distance only for now
AIsearchTarget : function(){
type='defensive';
var pathfinal=null;
switch(type){
//doesnt move only attacks within range
case 'defensive' :

	for(var i=0; i < this.players.length; i++){
		if(i!=this.currentPlayer){
		
				for(var j=0; j < this.players[i].squads.length; j++){
			
					var temp = this.AIbestPath(i,j);
					if(temp!=null && temp.valid){
					if(temp.valid && temp.result.length <= this.players[this.currentPlayer].squads[this.currentSelectedSquad].mrange && pathfinal==null){
						this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget = {player : i,squad : j};
						pathfinal = temp;
					}
					else{
						if(temp.valid && temp.result.length <= this.players[this.currentPlayer].squads[this.currentSelectedSquad].mrange && temp.result.length < pathfinal.result.length){
							this.players[this.currentPlayer].squads[this.currentSelectedSquad].atarget = {player : i,squad : j};
							pathfinal = temp;
					}
					}
					}
				}
			}	
		}
		
 break;
//choose target and chase
//case 'offensive' : break;

}

},
AIbestPath : function(p,s){
	var pathfinal = null;
	var epath = [];

		epath[0] = this.validPath(this.players[p].squads[s].x+1,this.players[p].squads[s].y);

		epath[1] = this.validPath(this.players[p].squads[s].x-1,this.players[p].squads[s].y);

		epath[2] = this.validPath(this.players[p].squads[s].x,this.players[p].squads[s].y+1);

		epath[3] = this.validPath(this.players[p].squads[s].x,this.players[p].squads[s].y-1);

			
		for(var h=0;h < 4;h++){
			if(epath[h]!=null && epath[h].valid && pathfinal==null){
					pathfinal = epath[h];
				}
				else{
					if(epath[h]!=null && epath[h].valid && epath[h].result.length < pathfinal.result.length){
						pathfinal = epath[h];
					}					
				}
	}

	return pathfinal;
},
gameLog : function(text){
//$("#logsystem").append(text  +" </br>");
var temp4 = $("#logsystem").html();
$("#logsystem").html(text+" </br>" + temp4);
//$("#logsystem").html(temp4+" </br>" + text);
}

};
