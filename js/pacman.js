// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;
var pathsprites = "res/img/sprites.png";
var eating;
var die;


// GAME FRAMEWORK 
var GF = function(){

 // variables para contar frames/s, usadas por measureFPS
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var fps; 
    var oldTime = 0;
    var delta;
 
    //  variable global temporalmente para poder testear el ejercicio
    inputStates = {};

    const TILE_WIDTH=24, TILE_HEIGHT=24;
        var numGhosts = 4;
	/*var ghostcolor = {};
	ghostcolor[0] = "rgba(255, 0, 0, 255)";
	ghostcolor[1] = "rgba(255, 128, 255, 255)";
	ghostcolor[2] = "rgba(128, 255, 255, 255)";
	ghostcolor[3] = "rgba(255, 128, 0,   255)";
	ghostcolor[4] = "rgba(50, 50, 255,   255)"; // blue, vulnerable ghost
	ghostcolor[5] = "rgba(255, 255, 255, 255)"; // white, flashing ghost
*/
	var ghostcolor = {};
	ghostcolor[0] = {};
	ghostcolor[0]["right"]=[472,16*4];
	ghostcolor[0]["left"]=[472+32,16*4];
	ghostcolor[0]["up"]=[472+64,16*4];
	ghostcolor[0]["down"]=[472+96,16*4];
	ghostcolor[1] = {};
	ghostcolor[1]["right"]=[472,16*5];
	ghostcolor[1]["left"]=[472+32,16*5];
	ghostcolor[1]["up"]=[472+64,16*5];
	ghostcolor[1]["down"]=[472+96,16*5];
	ghostcolor[2] = {};
	ghostcolor[2]["right"]=[472,16*6];
	ghostcolor[2]["left"]=[472+32,16*6];
	ghostcolor[2]["up"]=[472+64,16*6];
	ghostcolor[2]["down"]=[472+96,16*6];
	ghostcolor[3] = {};
	ghostcolor[3]["right"]=[472,16*7];
	ghostcolor[3]["left"]=[472+32,16*7];
	ghostcolor[3]["up"]=[472+64,16*7];
	ghostcolor[3]["down"]=[472+96,16*7];
	ghostcolor[4]=[472+128,16*4];
	ghostcolor[5] = {};
	ghostcolor[5]["right"]=[472+112,16*5];
	ghostcolor[5]["left"]=[472+128,16*5];

	// hold ghost objects
	var ghosts = {};

    var Ghost = function(id, ctx){

		this.x = 0;
		this.y = 0;
		this.velX = 0;
		this.velY = 0;
		this.speed = 1;


		
		this.nearestRow = 0;
		this.nearestCol = 0;
	
		this.ctx = ctx;
	
		this.id = id;
		this.homeX = 0;
		this.homeY = 0;
		this.sprite = new Sprite(pathsprites,ghostcolor[0],[16,16],0.005,[-1,0],[this.x,this.y],[TILE_WIDTH,TILE_HEIGHT]);

	this.draw = function(){
		// Pintar cuerpo de fantasma

		/*if(this.state!=Ghost.SPECTACLES){
			this.ctx.beginPath();
			this.ctx.moveTo(this.x,this.y+thisGame.TILE_HEIGHT);
			this.ctx.quadraticCurveTo(this.x+thisGame.TILE_WIDTH/2,this.y-thisGame.TILE_HEIGHT/2,this.x+thisGame.TILE_WIDTH,this.y+thisGame.TILE_HEIGHT);
			this.ctx.closePath();
			if (this.state==Ghost.NORMAL) {
			this.ctx.fillStyle=ghostcolor[this.id];
			}
			else if(this.state==Ghost.VULNERABLE && thisGame.ghostTimer<=100 && thisGame.ghostTimer%10==0){
				this.ctx.fillStyle=ghostcolor[5];
			}
			else if(this.state==Ghost.VULNERABLE){
				this.ctx.fillStyle=ghostcolor[4];
			}
			
			this.ctx.fill();
		}
		// Pintar ojos 
		this.ctx.beginPath();
		this.ctx.fillStyle="white";
		this.ctx.arc(this.x+thisGame.TILE_WIDTH/3,this.y+thisGame.TILE_HEIGHT/3,thisGame.TILE_WIDTH/6,0,Math.PI*2,false);
		this.ctx.fill();
		this.ctx.beginPath();
		this.ctx.arc(this.x+thisGame.TILE_WIDTH/1.5,this.y+thisGame.TILE_HEIGHT/3,thisGame.TILE_WIDTH/6,0,Math.PI*2,false);
		this.ctx.fill();
		this.ctx.beginPath();
		this.ctx.fillStyle="black";
		this.ctx.arc(this.x+thisGame.TILE_WIDTH/3,this.y+thisGame.TILE_HEIGHT/3,thisGame.TILE_WIDTH/12,0,Math.PI*2,false);
		this.ctx.fill();
		this.ctx.beginPath();
		this.ctx.arc(this.x+thisGame.TILE_WIDTH/1.5,this.y+thisGame.TILE_HEIGHT/3,thisGame.TILE_WIDTH/12,0,Math.PI*2,false);
		this.ctx.fill();*/
		if (this.state!=Ghost.SPECTACLES) {
			if (this.state==Ghost.NORMAL) {
				if (this.velX>0) {
		        	this.sprite.pos=ghostcolor[this.id]["right"];
		        }
		        else if (this.velX<0) {        	
		        	this.sprite.pos=ghostcolor[this.id]["left"];
		        }
		        else if (this.velY<0) {
		        	this.sprite.pos=ghostcolor[this.id]["up"];
		        }
		        else if (this.velY>0) {
		        	this.sprite.pos=ghostcolor[this.id]["down"];
		        }
		        this.sprite.frames=[0,-1];
			}
			else if(this.state==Ghost.VULNERABLE){
				this.sprite.pos=ghostcolor[4];
				this.sprite.frames=[-1,0,1,2];
			}
		}
		else{
			if (this.velX>0) {
		       	this.sprite.pos=ghostcolor[5]["right"];
		    }
		    else if (this.velX<0) {        	
		    	this.sprite.pos=ghostcolor[5]["left"];
		    }
			this.sprite.frames=[0];
		}
		this.sprite.update(delta);
		this.sprite.render(ctx);

	}; // draw

	    	this.move = function() {

			if (this.state!=Ghost.SPECTACLES) {
					if (this.x%thisGame.TILE_WIDTH==0 && this.y%thisGame.TILE_HEIGHT==0) {
		    			var c=Math.floor(this.x/thisGame.TILE_WIDTH);
		    			var r=Math.floor(this.y/thisGame.TILE_HEIGHT);
		    			var soluciones=[];
		    			if (!thisLevel.isWall(r+1,c) && this.velY>=0 && thisLevel.getMapTile(r+1,c)!=20 && thisLevel.getMapTile(r+1,c)!=21) {
		    				soluciones.push([1,0]);
		    			}
		    			if (!thisLevel.isWall(r-1,c) && this.velY<=0 && thisLevel.getMapTile(r-1,c)!=20 && thisLevel.getMapTile(r-1,c)!=21) {
		    				soluciones.push([-1,0]);
		    			}
		    			if (!thisLevel.isWall(r,c+1) && this.velX>=0 && thisLevel.getMapTile(r,c+1)!=20 && thisLevel.getMapTile(r,c+1)!=21) {
		    				soluciones.push([0,1]);
		    			}
		    			if (!thisLevel.isWall(r,c-1) && this.velX<=0 && thisLevel.getMapTile(r,c-1)!=20 && thisLevel.getMapTile(r,c-1)!=21) {
		    				soluciones.push([0,-1]);
		    			}
		    			if (soluciones.length==0) {
		    				this.velX=-this.velX;
		    				this.velY=-this.velY;
		    			}
		    			else{
		    				var rand=Math.floor(Math.random()*soluciones.length);
		    				this.velX=soluciones[rand][1];
		    				this.velY=soluciones[rand][0];
		    				this.x+=this.velX;
		    				this.y+=this.velY;
		    			}
		    		}
		    		else{
		    			this.x+=this.velX;
		    			this.y+=this.velY;
		    		}
		    	}
		    	else{
		    		if (Math.abs(this.homeX-this.x)<this.speed*2 && Math.abs(this.homeY-this.y)<this.speed*2) {
		    			this.x=this.homeX;
		    			this.y=this.homeY;
		    			this.state=Ghost.NORMAL;
		    		}
		    		else{
		    			xvel=this.homeX-this.x;
		    			yvel=this.homeY-this.y;
		    			this.velX=this.speed*xvel/Math.max(Math.abs(xvel),Math.abs(yvel));
		    			this.velY=this.speed*yvel/Math.max(Math.abs(xvel),Math.abs(yvel));
		    			this.x+=this.velX;
		    			this.y+=this.velY;
		    		}
		    	}
		    	this.sprite.posObj=[this.x,this.y];
		};

	}; // fin clase Ghost

	 // static variables
	  Ghost.NORMAL = 1;
	  Ghost.VULNERABLE = 2;
	  Ghost.SPECTACLES = 3;

	var Level = function(ctx) {
		this.ctx = ctx;
		this.lvlWidth = 0;
		this.lvlHeight = 0;
		
		this.map = [];
		
		this.pellets = 0;
		this.powerPelletBlinkTimer = 0;

	this.setMapTile = function(row, col, newValue){
		if (this.map[row]==null) {
			this.map[row]=[];
		}
		this.map[row][col]=newValue;
	};

	this.getMapTile = function(row, col){
		if (this.map[row]==null) {
			return null;
		}
		return this.map[row][col];	
	};

	this.printMap = function(){
		// tu código aquí
	};

	this.loadLevel = function(){
		var data=$.ajax({url:'res/levels/1.txt',async:false}).responseText;
			var list=data.split('\n');
			var i=0;
			while(list[i][0]!='#'){
				i++;
			}
			var line=list[i].split(' ');
			if (line[line.length-2]=='lvlwidth') {
				this.lvlWidth=line[line.length-1];
			}
			else if(line[line.length-2]=='lvlheight'){
				this.lvlHeight=line[line.length-1];
			}
			else{
				console.log("Error en la carga del fichero");
			}
			i++;
			while(list[i][0]!='#'){
				i++;
			}
			var line=list[i].split(' ');
			if (line[line.length-2]=='lvlwidth') {
				this.lvlWidth=line[line.length-1];
			}
			else if(line[line.length-2]=='lvlheight'){
				this.lvlHeight=line[line.length-1];
			}
			else{
				console.log("Error en la carga del fichero");
			}
			i++;
			while(list[i][0]!='#'){
				i++;
			}
			i++;
			var j=0;
			var r=0;
			while(list[i][0]!='#'){
				var line=list[i].split(' ');
				r=0;
				while(line[r]){
					this.setMapTile(j,r,line[r]);
					if (this.getMapTile(j,r)==2 || this.getMapTile(j,r)==3) {
						this.pellets++;
					}
					if (this.getMapTile(j,r)==4){
						player.homeX=r*thisGame.TILE_WIDTH;
						player.homeY=j*thisGame.TILE_HEIGHT;
					}
					if (this.getMapTile(j,r)>=10 && this.getMapTile(j,r)<=13) {
						var fantasma=ghosts[this.getMapTile(j,r)-10];
						fantasma.homeX=r*thisGame.TILE_WIDTH;
						fantasma.homeY=j*thisGame.TILE_HEIGHT;
					}
					r++;
				}
				j++;
				i++;
			}
	};

         this.drawMap = function(){

	    	var TILE_WIDTH = thisGame.TILE_WIDTH;
	    	var TILE_HEIGHT = thisGame.TILE_HEIGHT;

    		var tileID = {
	    		'door-h' : 20,
			'door-v' : 21,
			'pellet-power' : 3
		};

		 this.powerPelletBlinkTimer++;
		if(this.powerPelletBlinkTimer==60){
			this.powerPelletBlinkTimer=0;
		}
		var i=0;
			var j;
			while(this.getMapTile(i,0)){
				j=0;
				while(this.getMapTile(i,j)){
					var val=this.getMapTile(i,j);
					
					if(val>=100 && val<200){
						ctx.fillStyle='blue';
						ctx.fillRect(j*TILE_WIDTH,i*TILE_HEIGHT,TILE_WIDTH,TILE_HEIGHT);
					}
					else if(val==3){
						//bola poder
						if (this.powerPelletBlinkTimer%60<30) {
							ctx.beginPath();
							ctx.moveTo(j*TILE_WIDTH,i*TILE_HEIGHT)
							ctx.fillStyle='red';
							ctx.arc(j*TILE_WIDTH+(TILE_WIDTH/2),i*TILE_HEIGHT+(TILE_HEIGHT/2),5,0,2*Math.PI,true);
							ctx.closePath();
							ctx.fill();
						}
					}
					else if(val==2){
						//bola normal
						ctx.beginPath();
						ctx.moveTo(j*TILE_WIDTH,i*TILE_HEIGHT)
						ctx.fillStyle='white';
						ctx.arc(j*TILE_WIDTH+(TILE_WIDTH/2),i*TILE_HEIGHT+(TILE_HEIGHT/2),5,0,2*Math.PI,true);
						ctx.closePath();
						ctx.fill();
					}
					else if(val==20){
						//door-h
						
					}
					else if(val==21){
						//door-v
						
					}
					j++;
					
				}
				i++;
			}
	};


		this.isWall = function(row, col) {
			if (this.getMapTile(row,col)>=100 && this.getMapTile(row,col)<=199) {
				return true;
			}
			else{
				return false;
			}
		};


		this.checkIfHitWall = function(possiblePlayerX, possiblePlayerY, row, col){
				var posiblex2=possiblePlayerX+thisGame.TILE_WIDTH;
				var posibley2=possiblePlayerY+thisGame.TILE_HEIGHT;
				for (var j = col-1; j <=col+1; j++) {
					for (var i = row-1; i <=row+1; i++) {
						if (this.isWall(i,j)) {
							ahorax1=j*thisGame.TILE_WIDTH;
							ahoray1=i*thisGame.TILE_HEIGHT;
							ahorax2=j*thisGame.TILE_WIDTH+thisGame.TILE_WIDTH;
							ahoray2=i*thisGame.TILE_HEIGHT+thisGame.TILE_HEIGHT;
							//http://math.stackexchange.com/questions/99565/simplest-way-to-calculate-the-intersect-area-of-two-rectangles
	       					var x_overlap = Math.max(0, Math.min(posiblex2, ahorax2) - Math.max(possiblePlayerX, ahorax1));
	       					var y_overlap = Math.max(0, Math.min(posibley2, ahoray2) - Math.max(possiblePlayerY, ahoray1));
	  						overlapArea = x_overlap * y_overlap;
							if(overlapArea>0){
								return true;
							}
						}
					}
				}
				return false;
		};

		this.checkIfHit = function(playerX, playerY, x, y, holgura){
		
			var hx=Math.abs(playerX-x);
			var hy=Math.abs(playerY-y);
			if(hx<holgura && hy<holgura){
				return true;
			}
			else{
				return false;
			}	
		};


		this.checkIfHitSomething = function(playerX, playerY, row, col){
			var tileID = {
	    			'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3,
				'pellet': 2
			};

			var x=Math.floor(playerX/thisGame.TILE_WIDTH);
			var y=Math.floor(playerY/thisGame.TILE_HEIGHT);
			if (x==col && y==row) {
				if (this.getMapTile(row,col)==tileID['door-h']) {
					if (col==0 && x==0) {
						player.x=(this.lvlWidth-1)*thisGame.TILE_WIDTH;
					}
					else{
						player.x=thisGame.TILE_WIDTH;
					}
				}
				if (this.getMapTile(row,col)==tileID['door-v']) {
					if (row==0 && y==0) {
						player.y=(this.lvlHeight-1)*thisGame.TILE_HEIGHT;
					}
					else{
						player.y=thisGame.TILE_HEIGHT;
					}
				}
				if (this.getMapTile(row,col)==tileID['pellet']) {
					this.pellets--;
					this.setMapTile(row,col,"0");
					thisGame.addToScore(10);
					if(thisLevel.pellets==0){
				    	console.log("GAME OVER");
				    }
				    eating.play();
				}
				if (this.getMapTile(row,col)==tileID['pellet-power']) {
					this.pellets--;
					this.setMapTile(row,col,"0");
					thisGame.ghostTimer=360;
					thisGame.addToScore(50);
					if(thisLevel.pellets==0){
				    	console.log("GAME OVER");
				    }
				    eating.play();
				}
			}

		};

	}; // end Level 

	var Pacman = function() {
		this.radius = 10;
		this.x = 0;
		this.y = 0;
		this.speed = 3;
		//this.angle1 = 0.25;
		//this.angle2 = 1.75;
		this.sprite = new Sprite(pathsprites,[471,0],[16,16],0.005,[-1,0],[this.x,this.y],[TILE_WIDTH,TILE_HEIGHT]);
	};
	Pacman.prototype.move = function() {

		var newx=this.x+this.velX;
	    var newy=this.y+this.velY;
	    var row=Math.floor(newy/thisGame.TILE_HEIGHT);
	    var col=Math.floor(newx/thisGame.TILE_WIDTH);
	    

	    if(newx>w-this.radius*2 || newx<0){
	    	return;
		}
		if(newy>h-this.radius*2 || newy<0){
		    return;
		}
		for (var i = 0; i <numGhosts; i++) {
			if(thisLevel.checkIfHit(this.x,this.y,ghosts[i].x,ghosts[i].y,thisGame.TILE_WIDTH/2) && ghosts[i].state==Ghost.NORMAL){
				console.log("Te han comido");
				thisGame.setMode(thisGame.HIT_GHOST);
			}
			else if(thisLevel.checkIfHit(this.x,this.y,ghosts[i].x,ghosts[i].y,thisGame.TILE_WIDTH/2) && ghosts[i].state==Ghost.VULNERABLE){
				ghosts[i].state=Ghost.SPECTACLES;
				thisGame.addToScore(100);
			}
		}
	    if (thisLevel.checkIfHitWall(newx,newy,row,col)) {
		    return;
		}
		this.y=newy;
		this.x=newx;
		this.sprite.posObj=[this.x,this.y];
		//
		// tras actualizar this.x  y  this.y... 
		 // check for collisions with other tiles (pellets, etc)
		    thisLevel.checkIfHitSomething(this.x, this.y, row, col);
		// ....
		
		// test14 Tu código aquí. 
		// Si chocamos contra un fantasma cuando éste esta en estado Ghost.NORMAL --> cambiar el modo de juego a HIT_GHOST

	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {
         
        //ctx.fillStyle='yellow';
        //ctx.beginPath();
        //ctx.moveTo(this.x+thisGame.TILE_WIDTH/2,this.y+thisGame.TILE_HEIGHT/2);
        if(thisGame.mode==thisGame.HIT_GHOST){
        	if (thisGame.modeTimer==20) {
        		this.sprite._index=0;
	        	this.sprite.pos=[487,0];
	        	this.sprite.frames=[0,1,2,3,4,5,6,7,8,9,10,11];
	        	this.sprite.speed=0.01;
        	}
        }
        else{
        	this.sprite.speed=0.005;
        	this.sprite.frames=[0,-1];
	        if (this.velX>0) {
	        	this.sprite.pos=[471,0];
	        	//ctx.arc(this.x+thisGame.TILE_WIDTH/2,this.y+thisGame.TILE_HEIGHT/2,this.radius,Math.PI*this.angle2,(Math.PI*this.angle1),true);
	        }
	        else if (this.velX<0) {        	
	        	this.sprite.pos=[471,16];
	        	//ctx.arc(this.x+thisGame.TILE_WIDTH/2,this.y+thisGame.TILE_HEIGHT/2,this.radius,Math.PI*this.angle2-((180*Math.PI)/180),(Math.PI*this.angle1)-((180*Math.PI)/180),true);
	        }
	        else if (this.velY<0) {
	        	this.sprite.pos=[471,32];
	        	//ctx.arc(this.x+thisGame.TILE_WIDTH/2,this.y+thisGame.TILE_HEIGHT/2,this.radius,Math.PI*this.angle2-((90*Math.PI)/180),(Math.PI*this.angle1)-((90*Math.PI)/180),true);
	        }
	        else if (this.velY>0) {
	        	this.sprite.pos=[471,48];
	        	//ctx.arc(this.x+thisGame.TILE_WIDTH/2,this.y+thisGame.TILE_HEIGHT/2,this.radius,Math.PI*this.angle2+((90*Math.PI)/180),(Math.PI*this.angle1)+((90*Math.PI)/180),true);
	        }
	    }
        //ctx.closePath();
        //ctx.fill();
        this.sprite.update(delta);
        this.sprite.render(ctx);
	    
	// tu código aquí	     
    };

	var player = new Pacman();
	for (var i=0; i< numGhosts; i++){
		ghosts[i] = new Ghost(i, canvas.getContext("2d"));
	}


	var thisGame = {
		getLevelNum : function(){
			return 0;
		},
	    setMode : function(mode) {
			this.mode = mode;
			this.modeTimer = 0;
		},
		displayscore: function(ctx){
			ctx.font = "bold 22px sans-serif";
			ctx.fillStyle="red";
			ctx.fillText(this.lives+" UP",this.TILE_WIDTH,this.TILE_HEIGHT-(this.TILE_HEIGHT/5));
			ctx.fillStyle="blue";
			ctx.fillText("Score: "+this.points,this.TILE_WIDTH*4,this.TILE_HEIGHT-(this.TILE_HEIGHT/5));
			ctx.fillStyle="green";
			ctx.fillText("Highscore: "+this.highscore,this.TILE_WIDTH*13,this.TILE_HEIGHT-(this.TILE_HEIGHT/5));
		},
		gameOver: function(ctx){
			ctx.font = "bold 30px sans-serif";
			ctx.fillStyle="red";
			ctx.fillText("GAME OVER",(this.screenTileSize[1]/3)*this.TILE_WIDTH,(this.screenTileSize[1]/2)*this.TILE_HEIGHT+this.TILE_HEIGHT*2);
			
		},
		pause: function(ctx){
			ctx.font = "bold 30px sans-serif";
			ctx.fillStyle="red";
			ctx.fillText("PAUSED",(this.screenTileSize[1]/3)*this.TILE_WIDTH,(this.screenTileSize[1]/2)*this.TILE_HEIGHT+this.TILE_HEIGHT*2);
			
		},
		levelComplete: function(ctx){
			ctx.font = "bold 30px sans-serif";
			ctx.fillStyle="green";
			ctx.fillText("Level Complete!",(this.screenTileSize[1]/3)*this.TILE_WIDTH,(this.screenTileSize[1]/2)*this.TILE_HEIGHT+this.TILE_HEIGHT*2);
			
		},
		addToScore: function(pts){
			this.points+=pts;
		},
		screenTileSize: [24, 21],
		TILE_WIDTH: 24, 
		TILE_HEIGHT: 24,
		ghostTimer: 0,
		NORMAL : 1,
		HIT_GHOST : 2,
		GAME_OVER : 3,
		WAIT_TO_START: 4,
		LEVEL_COMPLETE: 5,
		PAUSE: 6,
		modeTimer: 0,
		lives : 3,
		points : 0,
		highscore : 0
	};

	var thisLevel = new Level(canvas.getContext("2d"));
	thisLevel.loadLevel( thisGame.getLevelNum() );
	// thisLevel.printMap(); 



	var measureFPS = function(newTime){
		// la primera ejecución tiene una condición especial

		if(lastTime === undefined) {
			lastTime = newTime; 
			return;
		}

		// calcular el delta entre el frame actual y el anterior
		var diffTime = newTime - lastTime; 

		if (diffTime >= 1000) {

			fps = frameCount;    
			frameCount = 0;
			lastTime = newTime;
		}

		// mostrar los FPS en una capa del documento
		// que hemos construído en la función start()
		fpsContainer.innerHTML = 'FPS: ' + fps; 
		frameCount++;
	};

	// clears the canvas content
	var clearCanvas = function() {
		ctx.clearRect(0, 0, w, h);
	};

	var checkInputs = function(){
		var newx;
	    var newy;
	    var row;
	    var col;
	    if(thisGame.mode!=thisGame.PAUSE){
			if(inputStates["left"]==true){
				newx=player.x-player.speed;
		    	newy=player.y;
		    	row=Math.floor(newy/thisGame.TILE_HEIGHT);
		    	col=Math.floor(newx/thisGame.TILE_WIDTH);
				if(!thisLevel.checkIfHitWall(newx,newy,row,col)){
				    player.velX=-player.speed;
				    player.velY=0;
				}
		    }
		    if(inputStates["right"]==true){
		    	newx=player.x+player.speed;
		    	newy=player.y;
		    	row=Math.floor(newy/thisGame.TILE_HEIGHT);
		    	col=Math.floor(newx/thisGame.TILE_WIDTH);
				if(!thisLevel.checkIfHitWall(newx,newy,row,col)){
			      	player.velX=player.speed;
			      	player.velY=0;
			    }
		    }
		    if(inputStates["up"]==true){
		    	newx=player.x;
		    	newy=player.y-player.speed;
		    	row=Math.floor(newy/thisGame.TILE_HEIGHT);
		    	col=Math.floor(newx/thisGame.TILE_WIDTH);
				if(!thisLevel.checkIfHitWall(newx,newy,row,col)){
				    player.velX=0;
				    player.velY=-player.speed;
				}
		    }
		    if(inputStates["down"]==true){
		    	newx=player.x;
		    	newy=player.y+player.speed;
		    	row=Math.floor(newy/thisGame.TILE_HEIGHT);
		    	col=Math.floor(newx/thisGame.TILE_WIDTH);
				if(!thisLevel.checkIfHitWall(newx,newy,row,col)){
				    player.velX=0;
				    player.velY=player.speed;
				}
		    }
		    if(inputStates["p"]==true){
		    	inputStates["p"]=false;
		      	thisGame.setMode(thisGame.PAUSE);
	    	}
	    }
	    else {
	    	if(inputStates["p"]==true){
	    		inputStates["p"]=false;
		      	thisGame.setMode(thisGame.NORMAL);
	    	}
	    }
	};


    var updateTimers = function(){
	// tu código aquí (test12)
        if (thisGame.ghostTimer==0) {
        	estado=Ghost.NORMAL;
        }
        if(thisGame.ghostTimer>0){
        	estado=Ghost.VULNERABLE;
        	thisGame.ghostTimer--;
        }
        for (var i = 0; i < numGhosts; i++) {
        	if (ghosts[i].state !=Ghost.SPECTACLES) {
        		ghosts[i].state=estado;
        	}
        }
        thisGame.modeTimer++;
	    // tu código aquí (test14)
    };

    var timer = function(currentTime){
        var aux= currentTime-oldTime;
        oldTime = currentTime;
        return aux;
    }

    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);
        delta = timer(time);
	// test14
			if (thisGame.mode==thisGame.NORMAL) {
			    // sólo en modo NORMAL
			    if (thisLevel.pellets>0) {
					checkInputs();

					// Tu código aquí
					for (var i = 0; i <numGhosts; i++) {
				    	ghosts[i].move();
				    }

					player.move();
				}
				else{
					thisGame.setMode(thisGame.LEVEL_COMPLETE);
				}
			}
			else if (thisGame.mode==thisGame.HIT_GHOST) {
				if (thisGame.modeTimer==20) {
					die.play();
				}
				if (thisGame.modeTimer==90) {
					thisGame.lives--;
					if(thisGame.lives>0){
						reset();
						thisGame.setMode(thisGame.WAIT_TO_START);
					}
					else{
						thisGame.setMode(thisGame.GAME_OVER);
					}
				}
			}
			else if(thisGame.mode==thisGame.WAIT_TO_START){
				if (thisGame.modeTimer==30) {
					thisGame.setMode(thisGame.NORMAL);
				}
			}
			    
			// Clear the canvas
		        clearCanvas();
		   
			thisLevel.drawMap();
			thisGame.displayscore(ctx);
			

			// Tu código aquí
			for (var i = 0; i <numGhosts; i++) {
			    	ghosts[i].draw();
			    }


		 
			player.draw();

			if(thisGame.mode==thisGame.GAME_OVER){
				thisGame.gameOver(ctx);
			}
			if(thisGame.mode==thisGame.LEVEL_COMPLETE){
				thisGame.levelComplete(ctx);
			}
			if(thisGame.mode==thisGame.PAUSE){
				thisGame.pause(ctx);
				checkInputs()
			}
			updateTimers();
		
        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);

    };

    var addListeners = function(){
	    window.addEventListener("keydown",function(e){
      //l=37,r=39,u=38,d=40,s=32
      inputStates.left=false;
      inputStates.right=false;
      inputStates.up=false;
      inputStates.down=false;
      inputStates.p=false;
      if (e.keyCode==37) {
        inputStates.left=true;
      }
      if (e.keyCode==38) {
        inputStates.up=true;
      }
      if (e.keyCode==39) {
        inputStates.right=true;
      }
      if (e.keyCode==40) {
        inputStates.down=true;
      }
      if (e.keyCode==80) {
        inputStates.p=true;
      }
    });
    };

    var reset = function(){
    	inputStates = {left:false,right:false,down:false,up:false,p:false};
		player.velX=player.speed;
	    player.velY=0;
		player.x=player.homeX;
		player.y=player.homeY;
		for (var i = 0; i < numGhosts; i++) {
			var fantasma=ghosts[i];
			fantasma.x=fantasma.homeX;
			fantasma.y=fantasma.homeY;
			var velocidades= [[-fantasma.speed,0],[fantasma.speed,0],[0,fantasma.speed],[0,-fantasma.speed]];
			var rand=Math.floor(Math.random()*4);
			fantasma.velX=velocidades[rand][0];
			fantasma.velY=velocidades[rand][1];
			fantasma.state=Ghost.NORMAL;
		}
	    // test14
	     thisGame.setMode( thisGame.NORMAL);
    };

    function loadAssets(){
    	eating = new Howl({
    		src: ["res/sound/eating.mp3"],
    		volume: 0.3,
    		onload: function(){
    			die = new Howl({
		    		src: ["res/sound/die.wav"],
		    		volume: 0.3,
		    		onload: function(){
		    			requestAnimationFrame(mainLoop);
		    		}
		    	});
    		}
    	});
    }

    function init(){
    	addListeners();

		reset();

        // start the animation
        loadAssets();
    }

    var start = function(){
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
        resources.load([pathsprites]);
        resources.onReady(init);
	
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start,
	thisGame: thisGame
    };
};


  var game = new GF();
  game.start();


