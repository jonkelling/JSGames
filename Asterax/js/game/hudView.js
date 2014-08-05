
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
       this.shieldBarWidth = 60;
       //gets called once to setup everything up.
       this.statusText1 = this.add(this.game.add.text(50, 10, "..." + this.game.rocks.length, {font: "18px Audiowide", fill: "#ffffff"}));
       this.statusText2 = this.add(this.game.add.text(250, 10, "..." + this.game.rocks.length, {font: "18px Audiowide", fill: "#ffffff"}));
       this.statusText3 = this.add(this.game.add.text(450, 10, "..." + this.game.rocks.length, {font: "18px Audiowide", fill: "#ffffff"}));
       
       
       var bmd = game.add.bitmapData(this.game.width, this.game.height);
       
       app.thesprite = this.add(this.game.add.sprite(0, 0, bmd));

       bmd.context.beginPath();
       bmd.context.moveTo(0, 40);
       bmd.context.lineTo(this.game.width, 40);
       bmd.context.strokeStyle = Phaser.Color.createColor(0, 255, 0, 1).rgba;
       bmd.context.lineWidth = 2;
       bmd.context.strokeThickness = 2;
       bmd.context.stroke();
       bmd.context.fillStyle = Phaser.Color.createColor(0, 255, 0, 0.1).rgba;
       bmd.context.fillRect(0, 0, this.game.width, 40);
       bmd.dirty = true;
       
       setupShieldBar.call(this);
   };
   
   module.prototype.update = function()
   {
      if (this.game.rocks)
      {
         this.statusText1.text = "lives: " + 1;
         this.statusText2.text = "health: " + this.game.player.ship.health;
         this.statusText3.text = "shield: " + this.game.player.ship.loadout.shield.name;
         
         //bmd.context.fillStyle = Phaser.Color.createColor(0, 0, 0, 1).rgba;
         //bmd.context.fillRect(460, 10, this.shieldBarWidth, 10);
         
         this.fdsa = this.fdsa || this.shieldBar.width;
         this.fdsa -= 0.1;
         this.shieldBarBmd.clear();
         this.shieldBarBmd.context.fillRect(0, 0, this.fdsa, this.shieldBar.height);
         this.shieldBarBmd.dirty = true;
      }
   };
   
   return module;
   
   
   function setupShieldBar()
   {
      var bmd = this.shieldBarBmd = game.add.bitmapData(100, 20);
      this.shieldBar = this.add(this.game.add.sprite(500, 10, bmd));
      
      bmd.context.fillStyle = Phaser.Color.createColor(255, 0, 0, 1.0).rgba;
      bmd.context.fillRect(0, 0, this.shieldBar.width, this.shieldBar.height);
      bmd.dirty = true;
   }
   
});