import io from 'socket.io-client'
import Controller from './Controller';


export default new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function Controller() {
        Phaser.Scene.call(this, { key: 'controller' });
    },

    preload: function() {
		this.load.image('controller/holder', 'assets/controller/holder.png');
        this.load.image('controller/stick', 'assets/controller/stick.png');
        
        this.load.image('controller/block', 'assets/controller/block button.png');
        this.load.image('controller/dash', 'assets/controller/dash button.png');
    },

    create: function() {
		this.cameras.main.setBackgroundColor(window.g.colour)

		var holder = this.add.image(350, 320, "controller/holder")
        holder.setDisplaySize(500, 500)

        this.stick = this.add.sprite(350, 320, "controller/stick")
        this.stick.setDisplaySize(200, 200)

        this.input.on('pointermove', function (pointer) {
            if (pointer.x < 640){
                var deltaX = pointer.x - 350
                var deltaY = pointer.y - 320
                var delta = Math.hypot(deltaX, deltaY)

                var maxDistanceInPixels = 200

                var angle = Phaser.Math.Angle.Between(350, 320, pointer.x, pointer.y);

                if (delta > maxDistanceInPixels) {
                    deltaX = (deltaX===0) ? 0 : Math.cos(angle) * maxDistanceInPixels;
                    deltaY = (deltaY===0)? 0 : Math.sin(angle) * maxDistanceInPixels;
                }
                
                this.stick.x = 350 + deltaX;
                this.stick.y = 320 + deltaY;
                window.g.socket.emit('direction', {'x': deltaX, 'y': deltaY, 'colour': window.g.colour}); 
            }           
    
        }, this);

        this.input.on('pointerup', function(){
            this.stick.x = 350
            this.stick.y = 320
            window.g.socket.emit('direction', {'x': 0, 'y': 0, 'colour': window.g.colour});
        }, this)

        var block = this.add.sprite(1080, 250, 'controller/block')
        block.setInteractive()
        block.setDisplaySize(180, 180)

        var dash = this.add.sprite(930, 450, 'controller/dash')
        dash.setInteractive()
        dash.setDisplaySize(180, 180)
        dash.on('pointerdown', function() {
            window.g.socket.emit('dash', {'colour': window.g.colour});
        }, this)
	}
})