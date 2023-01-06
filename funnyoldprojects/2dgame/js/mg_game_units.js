
function Unit(name,_class,lvl,filename){
this.name = name;
this._class = _class;
this.lvl = lvl;
this.movement = 5;//fixed for now
this.healthpoints = 10;
this.magicpoints = 10;
this.init_img(filename);
// no gear for nowthis.init_gear(gear);

};
Unit.prototype ={
imgLoaded: false,

  init_img: function(filename) {
    var self = this;
    this.img = new Image();
    this.img.onload = function() {
		self.imgLoaded = true;
		//alert(self.name);
    };
    this.img.src = filename;
  },
  	draw: function(ctx){
		ctx.drawImage(this.img,40,80,40,40,100,100,40,40);
	}

};
