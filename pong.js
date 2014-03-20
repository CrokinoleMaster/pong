function Pong(){
    var canvas = new Canvas();
    var $menu = $('#menu');
    this.start = function(){
        $(canvas).on('lost', function(){
            canvas.init();
            $('canvas').css('background-color', '#F9CCC6');
            $menu.find('h1').text('GAME OVER');
            $menu.fadeIn('fast');
        });
        $menu.on('click', '#start', function(){
            $('canvas').css('background-color', '#EDF6FF');
            $menu.fadeOut('fast');
            play();
        });
    };
    function play(){
        canvas.init();
        window.setTimeout(function render(){
            canvas.play();
            if (canvas.lost == false){
                window.setTimeout(render, 20);
            }
            else{
                console.log(canvas.lost);
                $(canvas).trigger('lost');
            }
        }, 20)
    }

}

function Canvas(){
    var canvas = this;
    var $canvas = $('canvas');
    var ctx = $canvas[0].getContext('2d');
    var width = $canvas[0].width;
    var height = $canvas[0].height;
    var offset = $canvas.offset();
    var ball = new Ball();
    var leftPad = new Paddle();
    var rightPad = new Paddle();
    this.lost = false;
    $(window).resize(function() {offset = $canvas.offset(); });
    function Ball(){
        var x = 300;
        var y = 250;
        var moveX = 3;
        var moveY = Math.random()*3;
        var radius = 10;
        this.score = 0;
        this.draw = function(){
            ctx.beginPath();
            ctx.fillStyle = '#FF6C66';
            ctx.arc(x, y, radius, 0, Math.PI*2, false);
            ctx.fill();
            this.checkCollision();
            this.move();
        };
        this.move= function() {
            x += moveX;
            y += moveY;
        }
        this.checkCollision= function(){
            if (y+moveY+radius > height || y+moveY-radius < 0)
                moveY *= -1;
            if (x+moveX+radius-30 > width || x+moveX-radius+20 < 0)
                canvas.lost = true;
            if (y+moveY < leftPad.y+leftPad.h &&
                y+moveY > leftPad.y){
                if (x+moveX+radius > width - 10 || x+moveX-radius<10){
                    moveX *=-1;
                    this.score++;
                    moveX*=1.1;
                    moveY*=1.1;
                }
            }
        }
    }

    function Paddle(){
        var w = 10;
        this.h = 100;
        this.y = 200;
        this.draw = function(x){
            ctx.fillStyle = '#7A526A';
            ctx.fillRect(x, this.y , w, this.h);
        };
        this.init = function() {
            var self = this;
            $canvas.on('mousemove', function(e){
                var pos = e.pageY-self.h/2 - offset.top;
                if (pos+self.h-4 < height && pos+4 > 0)
                    self.y = pos;
            });
        }
    }

    this.clear= function(){
        ctx.clearRect(0, 0, width, height);
        return this;
    };

    this.updateScore = function(){
        $('#score').text(ball.score);
    }

    this.init = function(){
        this.clear();
        canvas.lost = false;
        ball = new Ball();
        leftPad = new Paddle();
        rightPad = new Paddle();
        leftPad.init();
        rightPad.init();
    };

    this.play = function(){
        this.clear();
        ball.draw();
        leftPad.draw(0);
        rightPad.draw(590);
        this.updateScore();
    }


}

$(function(){

    window.pong = new Pong();
    window.pong.start();

})