
define(['view'], function(View) {

    var module = function () {
        View.apply(this, arguments);
    };

    module.prototype = Object.create(View.prototype);
    module.prototype.constructor = module;

    return module;
});