function Squad(name,x,y,o_leader,o_units){
this.name = name;
this.leader = (o_leader!=null)?o_leader:null;
this.units = (o_units!=null)?o_units:[];
this.x = x;
this.y = y;
this.xdrawpos = (this.x-this.y)*20 + 380 + 8;
this.ydrawpos = (this.x+this.y)*20/2 + 50 - 22;
//this.xdrawpos = (this.x-this.y)*20 + 380 + 4;
//this.ydrawpos = (this.x+this.y)*20/2 + 50 - 34;
this.mrange = 5;
this.movementDirection = 2;
this.animationFrame = 0;
this.init();
this.turnOver = false;
this.actions = false;
this.move = false;
this.atarget = null;
this.alive = true;
this.healthpoints = 0;
this.magicpoints = 0;
this.initsquad();

};
Squad.prototype ={
imgLoaded: false,
	init: function(){
	var self = this;
    this.img = new Image();
    this.units[this.leader].img.onload = function() {
		self.imgLoaded = true;
    };
    this.img.src = this.units[this.leader].img.src;
	},
	initsquad: function(){
		for(var i = 0; i < this.units.length ; i++)
		{
		this.healthpoints = this.healthpoints + this.units[i].healthpoints;
		this.magicpoints = this.magicpoints + this.units[i].magicpoints;
		}
	},
 	draw: function(ctx){
		var spriteOffsetY = 32*this.movementDirection;
		var spriteOffsetX = 24*this.animationFrame;
		ctx.drawImage(this.img,spriteOffsetX, spriteOffsetY,24,32,this.xdrawpos,this.ydrawpos,24,32);
		Game.map.changeW(Math.round(this.x),Math.round(this.y));
		
		//		alert(Game.gameStarted);
	//	if(Game.gameStarted){
	//	alert(Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].name);
//		alert(Game.gameAction);}
		//if(Game.gameStarted && Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad]==this && Game.gameAction == "moving"){alert("ola");}
	},
	
	addUnit: function(obj){
		this.units.push(obj);
	},
	
	setLeader: function(obj){
		this.leader = obj;
	},
	
	getLeader: function(){
		return this.leader;
	},
	
	getUnits: function(){
		return this.units;
	},
	
	//moveSquadOLD: function(x,y){
	//	Game.map.changeW1(this.x,this.y);
	//	this.x = x;
	//	this.y = y;
	//	this.xdrawpos = (this.x-this.y)*20 + 380 + 8;
	//	this.ydrawpos = (this.x+this.y)*20/2 + 50 - 22;
	//	this.move = true;
	//},
	moveSquad: function(obj){
		Game.map.changeW1(Math.round(this.x),Math.round(this.y));
		if (obj[Game.moveArrayi].x!=this.x)
			{ 
				if(obj[Game.moveArrayi].x-this.x > 0 )
					{this.x=this.x+0.125;this.movementDirection = 2;}
					else
					{this.x=this.x-0.125;this.movementDirection = 0;}
					this.animationFrame = (this.animationFrame + 1) % 3;
			}
			else
				{
				if(obj[Game.moveArrayi].y!=this.y)
					{
					if(obj[Game.moveArrayi].y-this.y > 0)
						{this.y=this.y+0.125;this.movementDirection = 3;}
						else
						{this.y=this.y-0.125;this.movementDirection = 1;}
						this.animationFrame = (this.animationFrame + 1) % 3;
					}
					else
					{	
						if(Game.moveArrayi+1 < obj.length)
							{
								Game.moveArrayi++;
							}else
							{
								animMoveInt = null;
								this.move = true;
							}
					}
				}


		this.xdrawpos = (this.x-this.y)*20 + 380 + 8;
		this.ydrawpos = (this.x+this.y)*20/2 + 50 - 22;
	},
	showSqdMoveR: function(ctx){
	},
	
	showSqdAtkR: function(ctx){
	},
	clearTurn: function(){
	this.turnOver = false;
	this.move = false;
	this.actions = false;
	},
	setturnOver: function(){
	this.turnOver = true;
	}	
};
