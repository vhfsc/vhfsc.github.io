function Player(name,ai,avatar,o_squads){
this.name = name;
this.aicontrol = ai;
this.squads = (o_squads!=null)?o_squads:[];
this.init(avatar);


};
Player.prototype ={
 imgLoaded: false,
 	init: function(filename) {
		var self = this;
		this.avatar = new Image();
		this.avatar.onload = function() {
			self.imgLoaded = true;
		};
		this.avatar.src = filename;
	},
	addSquad: function(obj){
	this.squads.push(obj);
	},
	draw: function(ctx){
		for(var i = 0; i < this.squads.length; i++){
			this.squads[i].draw(ctx);
		}
	}
};
