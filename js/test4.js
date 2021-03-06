// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;


// GAME FRAMEWORK 
var GF = function(){

 // variables para contar frames/s, usadas por measureFPS
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var fps; 
 
    //  variable global temporalmente para poder testear el ejercicio
    inputStates = {left:false,right:false,down:false,up:false,space:false};

	var Pacman = function() {
		this.radius = 15;
		this.x = 0;
		this.y = 0;
		this.speed = 5;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
	};
	Pacman.prototype.move = function() {
    var newx=this.x+this.velX;
    var newy=this.y+this.velY;
    if(newx<=w-this.radius*2&&newx>=0){
      this.x=newx;
    }
    if(newy<=h-this.radius*2&&newy>=0){
      this.y=newy;
    }
		
	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function() {
         
         // Pac Man
	      ctx.fillStyle='yellow';
        ctx.beginPath();
        ctx.moveTo(this.x+this.radius,this.y+this.radius);
        ctx.arc(this.x+this.radius,this.y+this.radius,this.radius,Math.PI*this.angle2,(Math.PI*this.angle1),true);
        ctx.closePath();
        ctx.fill(); 	         
    }
  
	// OJO, esto hace a pacman una variable global	
	player = new Pacman();



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
		
    if(inputStates["left"]==true){
      player.velX=-player.speed;
      player.velY=0;
    }
    if(inputStates["right"]==true){
      player.velX=player.speed;
      player.velY=0;
    }
    if(inputStates["up"]==true){
      player.velX=0;
      player.velY=-player.speed;
    }
    if(inputStates["down"]==true){
      player.velX=0;
      player.velY=player.speed;
    }
    if(inputStates["space"]==true){
      console.log("pause");
    }
	};


 
    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);
     
	checkInputs();
 
        // Clear the canvas
        clearCanvas();
    
	player.move();
 
	player.draw();
        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };

   var addListeners = function(){
		//add the listener to the main, window object, and update the states
		window.addEventListener("keydown",function(e){
      //l=37,r=39,u=38,d=40,s=32
      inputStates.left=false;
      inputStates.right=false;
      inputStates.up=false;
      inputStates.down=false;
      inputStates.space=false;
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
      if (e.keyCode==32) {
        inputStates.space=true;
      }
    });
   };


    var start = function(){
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
       
	addListeners();

	player.x = 0;
	player.y = 0; 
	player.velY = 0;
	player.velX = player.speed;
 
        // start the animation
        requestAnimationFrame(mainLoop);
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start
    };
};



  var game = new GF();
  game.start();

 test('Testeando pos. inicial', function(assert) {  

	     	assert.pixelEqual( canvas, player.x+10, player.y+10, 255, 255,0,255,"Passed!"); 
});

	
test('Movimiento hacia derecha OK', function(assert) {

  	var done = assert.async();
	inputStates.right = true;
  	setTimeout(function() {
			// console.log(player.x);
 		   assert.ok(player.x > 110 && player.x < w, "Passed!");

			inputStates.right = false;
			inputStates.down = true;
    		   done();
			test2();
  }, 1000);

});


var test2 = function(){
test('Movimiento hacia abajo OK', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
			// console.log(player.y);
   		        assert.ok(player.y > 110 && player.y < h, "Passed!");
			inputStates.down = false;
			inputStates.left = true;
    		   done();
			test3();
  }, 1000);

});
};

var test3 = function(){
test('Movimiento hacia izquierda OK', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
			// console.log(player.x);
   		        assert.ok(player.x == 0 , "Passed!");
			inputStates.left = false;
			inputStates.up = true;
    		   done();
		test4();
  }, 1000);

}); };



var test4 = function(){
test('Movimiento hacia arriba OK', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
			// console.log(player.y);
   		        assert.ok(player.y < 10 , "Passed!");
			inputStates.up = false;
    		   done();
  }, 1000);

}); };


