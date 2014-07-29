
define(['view'], function(View) {

    var popupPadding = 100;
    var borderColor = 2164260863;

    var module = function(game, parent, content, onClosedCallback, onClosedCallbackContext) {
        View.apply(this, [game, parent]);

        this.content = content;
        this.onClosedCallback = onClosedCallback;
        this.onClosedCallbackContext = onClosedCallbackContext;

        this.createPopupView();
    };

    module.prototype = Object.create(View.prototype);
    module.prototype.constructor = module;

    module.prototype.destroy = function()
    {
        app.nButton.onDown.remove(closePopupView, this);

        this.content.destroy();

//        this.content = null;
        this.onClosedCallback = null;
        this.onClosedCallbackContext = null;

        View.prototype.destroy.call(this);
    };

    module.prototype.createPopupView = function()
    {
//        this.game.paused = true;

        app.escapeButton.onDown.add(closePopupView, this);

        var contentArea = {x:popupPadding, y:popupPadding, width:this.game.width - (2 * popupPadding), height:this.game.height - (2 * popupPadding)};

        drawPopupBackground.call(this);

        this.add(this.content);

        this.content.x = contentArea.x;
        this.content.y = contentArea.y;

        this.content.width = contentArea.width;
        this.content.height = contentArea.height;
    };



    var controller = function() { };

    controller.prototype =
    {
        constructor: controller,

        show: function (game, content, onClosedCallback, onClosedCallbackContext)
        {
            this.close();
            this.currentPopup = new module(game, game.world, content, onClosedCallback, onClosedCallbackContext);
            this.currentPopup.controller = this;
        },

        close: function ()
        {
            if (this.currentPopup)
            {
                if (this.currentPopup.exists)
                {
                    closePopupView.call(this.currentPopup);
                }
            }
            this.currentPopup = null;
        }
    };

    Object.defineProperty(controller.prototype, "active", {
        get: function() {
            return (this.currentPopup && this.currentPopup.exists) ? true : false;
        }
    });

    return new controller();


    function closePopupView() {
        if (this.onClosedCallback)
        {
            this.onClosedCallback.call(this.onClosedCallbackContext);
        }
        this.destroy();
    }

    function getPixels(x, y, width, height)
    {
        var a = [];
        var w = x + width;
        var h = y + height;
        for (var ty = y; ty < h; ty++)
            for (var tx = x; tx < w; tx++)
                a[ty * this.width + tx] = this.pixels[ty * this.width + tx];
        return a;
    }

    function rotatePixels90CCW(sprite, times)
    {
        times = times || 1;
        var padding = 2;
        var x = sprite.x;
        var y = sprite.y;
        var cx = x + (sprite.width/2);
        var cy = y + (sprite.height/2);
        app.debug.writeDebug3(cx + ", " + cy);
        var pxo = getPixels.call(this, x-padding, y-padding, sprite.width+(2*padding), sprite.height+(2*padding));
        this.processPixel(function(px, tx, ty) {
            for (var i = 0; i < times; i++)
            {
                var tx1 = (-(ty - cy)) + cx;
                var ty1 = (tx - cx) + cy;
                tx = tx1;
                ty = ty1;
            }
            return pxo[ty * this.width + tx];
        }, this, x-padding, y-padding, sprite.width+(2*padding), sprite.height+(2*padding));
    }

    function drawPopupBackground()
    {
        var x = popupPadding;
        var y = popupPadding;
        var w = this.game.width - (2 * x);
        var h = this.game.height - (2 * y);

        var lgCornerRad = 50;
        var smCornerRad = 6;

        var rt = { t: -Math.PI / 2, r: 0, b: Math.PI / 2, l: Math.PI };

        var bmp = this.game.add.bitmapData(this.game.width, this.game.height);

        bmp.context.lineWidth = 4;
        bmp.context.strokeStyle = Phaser.Color.unpackPixel(borderColor).rgba;
        bmp.context.arc(x + lgCornerRad, y + lgCornerRad, lgCornerRad, rt.l, rt.t);
        bmp.context.lineTo(x + w - smCornerRad, y);
        bmp.context.arc(x + w - smCornerRad, y + smCornerRad, smCornerRad, rt.t, rt.r);
        bmp.context.lineTo(x + w, y + h - lgCornerRad);
        bmp.context.arc(x + w - lgCornerRad, y + h - lgCornerRad, lgCornerRad, rt.r, rt.b);
        bmp.context.lineTo(x + smCornerRad, y + h);
        bmp.context.arc(x + smCornerRad, y + h - smCornerRad, smCornerRad, rt.b, rt.l);
        bmp.context.lineTo(x, y + lgCornerRad);
        bmp.context.stroke();
        var grad = bmp.context.createLinearGradient(x, y, x, y + h); //Phaser.Color.createColor(0x33, 0x33, 0x33, 0.5).rgba;
        // green V
//        grad.addColorStop(0, Phaser.Color.createColor(0x22, 0x66, 0x22, 0.8).rgba);
//        grad.addColorStop(1, Phaser.Color.createColor(0x22, 0x66, 0x22, 0.5).rgba);
        grad.addColorStop(0, Phaser.Color.createColor(0x00, 0x00, 0x00, 0.8).rgba);
        grad.addColorStop(1, Phaser.Color.createColor(0x00, 0x00, 0x00, 0.7).rgba);
        bmp.context.fillStyle = grad;
        bmp.context.fill();

        this.add(this.game.make.sprite(0, 0, bmp));
    }

});