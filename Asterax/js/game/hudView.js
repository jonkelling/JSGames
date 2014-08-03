
define(['Phaser'], function() {
   
   var module = function()
   {
       this.events = new Phaser.Events(this);
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
       this.statusText = this.add(this.game.add.text(50, 20, "..." + this.game.rocks.length, {font: "25px arial", fill: "#ffffff"}));
       
       var bmd = game.add.bitmapData(this.game.width, this.game.height);
       
       this.add(this.game.add.sprite(0, 0, bmd));
       
       bmd.context.moveTo(100, 100);
       bmd.context.lineTo(300, 300);
       bmd.context.strokeStyle = Phaser.Color.createColor(0, 255, 0, 1).rgba;
       bmd.context.lineWidth = 2;
       bmd.context.strokeThickness = 2;
       bmd.context.stroke();
       bmd.dirty = true;
   };
   
   module.prototype.update = function()
   {
      if (this.game.rocks)
      {
         this.statusText.text = "lives: " + 1 + "   rocks left: " + this.game.rocks.countLiving() + "   health: " + this.game.player.ship.health + "   Shield: " + this.game.player.ship.loadout.shield.name;
      }
   };
   
   return module;
});