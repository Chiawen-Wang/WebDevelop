// Enemies our player must avoid
var player_x = 1000;
var player_y = 1000;
var collision_flag = 0;
var winCount = 0;
var starCount = 0;
var Enemy = function(speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = 0;
    this.y = Math.floor(Math.random()*200) + 40;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
        this.x = this.x + this.speed*dt;
        if(this.x >= 505){
            this.x = 0;
        }
        if(player_x >= this.x-30&&player_x <= this.x+30 && player_y>=this.y-30&& player_y <= this.y+30){
            collision_flag = 1;
            //console.log("inscope");
        }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var player = function(){
    this.speed = 100;
    this.x = 200;
    this.y = 400;
    this.left = 0;
    this.right = 0;
    this.up = 0;
    this.down = 0;
    this.sprite = 'images/char-boy.png';
    winCount = 0;
};
player.prototype.update = function(){
    //console.log(dt);
    if(collision_flag == 1){
        collision_flag = 0;
        this.x = 200;
        this.y = 400;
        //console.log(collision_flag);
        player_x = this.x;
        player_y = this.y;

    }

 if(this.left){
        this.left = 0;
        this.x = this.x - this.speed*0.2;
        if(this.x <= 0){
            this.x = 200;
        }
    }
    if(this.right){
        this.right = 0;
        this.x = this.x + this.speed*0.2;
        if(this.x > 505){
            this.x = 200;
        }
    }
    if(this.up){
        this.up = 0;
        this.y = this.y - this.speed*0.2;
        if(this.y <= 0){
            this.y =400;
            winCount++;
          ctx.fillStyle = "black";
          ctx.font = "70px Impact";
          ctx.textAlign = "center";
          ctx.fillText("You win!",300,200);
          document.getElementById("winTag").style.visibility = "visible";
          document.getElementsByTagName("span")[0].innerHTML = winCount;

          //console.log("you win");
        }
    }
    if(this.down){
        this.down = 0;
        this.y = this.y + this.speed*0.2;
        if(this.y > 400){
            this.y = 400;
        }
    }
    if(this.y == 380){
       document.getElementById("winTag").style.visibility = "hidden";
       starCount = 0;
          document.getElementById("starcount").innerHTML = starCount;
    }

    player_x = this.x;
    player_y = this.y;
    console.log(this.y);
};
player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

player.prototype.handleInput = function(direc) {
    switch (direc) {
        case "left":
            this.left = 1;
            //console.log("left");
            break;
        case "right":
            this.right = 1;
            //console.log("r");
            break;
        case "up":
            this.up = 1;
            //console.log("up");
            break;
        case "down":
            this.down = 1;
            //console.log("d");
            break;
        default:
            // statements_def
            break;
    }
};
var Coin = function(num){
    this.x = Math.floor(Math.random()*45*num);
    this.y = Math.floor(Math.random()*24*num) + 50;
    this.sprite = 'images/lit.png';
};
Coin.prototype.update = function(){
    if(collision_flag!=1 && this.x <= player_x + 20 && this.x >= player_x - 20 && this.y <= player_y + 20 && this.y >= player_y - 20){
        this.x = 1000;
        this.y = 1000;
        starCount += 1;
        document.getElementById("starcount").innerHTML = starCount;
    }
    else if(collision_flag == 1){
        starCount = 0;
        document.getElementById("starcount").innerHTML = starCount;
        this.x = Math.floor(Math.random()*500);
        this.y = Math.floor(Math.random()*240) + 50;
        //collision_flag = 0;
    }


};
Coin.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
allEnemies = [new Enemy(100),new Enemy(10), new Enemy(100), new Enemy(40)];
allCoins = [new Coin(1), new Coin(5), new Coin(10), new Coin(8)];
player = new player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    //console.log(typeof allowedKeys[e.keyCode]);
    player.handleInput(allowedKeys[e.keyCode]);
});