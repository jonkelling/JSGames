
define(['Phaser'], function() {
   
   var module = function()
   {
       this.events.onAddedToGroup.addOnce(this.setupView, this);
       Phaser.Group.apply(this, arguments);
   };
   
   module.prototype = Object.create(Phaser.Group.prototype);
   module.prototype.constructor = module;
   
   /*** THINGS AVAILABLE TO YOU: *****\
    * this.game.player
    * this.game.player.ship
    * this.game.player.ship.health
    * this.game.player.ship.loadout (see loadout.js, the getShip function, for what loadout will look like)
    * this.game.rocks
    * 
    * 
    **********************************/
   
   module.prototype.setupView = function()
   {
       //gets called once to setup everything up.
       this.statusText1 = this.add(this.game.add.text(50, 18, "..." + this.game.rocks.length, {font: "20px Audiowide", fill: "#ffffff"}));
       this.statusText2 = this.add(this.game.add.text(250, 18, "..." + this.game.rocks.length, {font: "20px Audiowide", fill: "#ffffff"}));
       this.statusText3 = this.add(this.game.add.text(450, 18, "..." + this.game.rocks.length, {font: "20px Audiowide", fill: "#ffffff"}));
       
       
       var bmd = game.add.bitmapData(this.game.width, this.game.height);
       
       this.add(this.game.add.sprite(0, 0, bmd));

       bmd.context.beginPath();
       bmd.context.moveTo(10, 50);
       bmd.context.lineTo(950, 50);
       bmd.context.strokeStyle = Phaser.Color.createColor(0, 255, 0, 1).rgba;
       bmd.context.lineWidth = 2;
       bmd.context.strokeThickness = 2;
       bmd.context.stroke();
       bmd.context.fillStyle = Phaser.Color.createColor(0, 255, 0, 0.3).rgba;
       bmd.context.drawRect(10, 2, 950, 38);
       bmd.context.fill();
       bmd.dirty = true;
   };
   
   module.prototype.update = function()
   {
      if (this.game.rocks)
      {
         this.statusText1.text = "lives: " + 1;
         this.statusText2.text = "health: " + this.game.player.ship.health;
         this.statusText3.text = "shield: " + this.game.player.ship.loadout.shield.name;
      }
   };
   
   return module;
});