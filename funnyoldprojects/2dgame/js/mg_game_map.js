//filename = img with map terrain
//map = array with terrain pos
function Map(filename,map,tilew,tileh){
//function Map(filename,map,widt,height,tilew,tileh){
//default settings canvas = 800*600 tiles=40*20

this.width = 800;
this.height = 600;
this.tilew = tilew;
this.tileh = tileh;
this.map = map;
this.init(filename);
};
Map.prototype = {
		resLoaded: false,
		init: function(filename){
		var self = this;
		this._resources = new Image();
		this._resources.onload = function() {
			self.resLoaded = true;
		};
		this._resources.src = filename;
		},
		drawMap: function(ctx,action){
				for(i=0; i<20;i++){
					for(j=0;j<20;j++){
						var xpos = (i-j)*this.tileh + 380;
						var ypos = (i+j)*this.tileh/2+ 50;
						switch(action){
							case 'move' :
								((Math.abs(i-Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].x)+Math.abs(j-Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].y) <= Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].mrange) ? ((Game.validPath(i,j).valid && Game.validPath(i,j).result.length<= Game.players[Game.currentPlayer].squads[Game.currentSelectedSquad].mrange) ? ctx.drawImage(this._resources, 0*this.tilew,1*this.tileh, this.tilew, this.tileh,xpos, ypos, this.tilew, this.tileh) : ctx.drawImage(this._resources, this.map[i][j].t*this.tilew,0, this.tilew, this.tileh,xpos, ypos, this.tilew, this.tileh)) : ctx.drawImage(this._resources, this.map[i][j].t*this.tilew,0, this.tilew, this.tileh,xpos, ypos, this.tilew, this.tileh)); 
								break;
							case 'attack' :
								break;
							default : 
								ctx.drawImage(this._resources, this.map[i][j].t*this.tilew,0, this.tilew, this.tileh,xpos, ypos, this.tilew, this.tileh);
						}
					}
				}
			},
		changeW: function(x,y){
			if(this.map[x][y].w==0){
			this.map[x][y].w=1;
			}
			
		},
		changeW1: function(x,y){
			if(this.map[x][y].w==1){
			this.map[x][y].w=0;
			}
			
		},
		drawMapifLoaded: function(ctx){
		}
		
};
