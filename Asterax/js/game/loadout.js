
define(function() {
	
	var module = function()
	{
	};
	
	module.prototype.getShip = function(id) {
		var shipData = getData.call(this, "ships", 'id', id);
		
		var shipDataWrapper = {
			id: shipData.id,
			name: shipData.name,
			weapon1: this.getWeapon(shipData.weapon1),
			weaponModIds: shipData.weaponMods,
			weaponMods: [],
			shield: this.getShield(shipData.shield),
			engine: this.getEngine(shipData.engine)
		};

		for (var i = 0; i < shipData.weaponMods.length; i++) {
			shipDataWrapper.weaponMods.push(this.getWeaponMod(shipData.weaponMods[i]));
		}

		return shipDataWrapper;
	};
	
	module.prototype.getShield = function(id) {
		return getData.call(this, "shields", 'id', id);
	};
	
	module.prototype.getEngine = function(id) {
		return getData.call(this, "engines", 'id', id);
	};
	
	module.prototype.getWeapon = function(id) {
		return getData.call(this, "weapons", 'id', id);
	};
	
	module.prototype.getWeaponByModuleName = function(moduleName) {
		return getData.call(this, "weapons", 'moduleName', moduleName)
	}
	
	module.prototype.getWeaponMod = function(id) {
		return getData.call(this, "weaponMods", 'id', id);
	};
	
	return new module();
	
	function getData(key, matchKey, matchValue)
	{
		if (!this.data)
			this.data = game.cache.getJSON("config");
		var entry = this.data[key];
		for (var i = 0; i < entry.length; i++)
			if (entry[i][matchKey] == matchValue)
				return entry[i];
		return null;
	}
});