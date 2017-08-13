let topEdge = new PhysicsEntity();
let rightEdge = new PhysicsEntity();
let bottomEdge = new PhysicsEntity();
let leftEdge = new PhysicsEntity();

topEdge.width = game.canvas.width;
topEdge.height = 100;
topEdge.x = 0;
topEdge.y = -topEdge.height;

rightEdge.width = 100;
rightEdge.height = game.canvas.height;
rightEdge.x = game.canvas.width;
rightEdge.y = 0;

bottomEdge.width = game.canvas.width;
bottomEdge.height = 100;
bottomEdge.x = 0;
bottomEdge.y = game.canvas.height;

leftEdge.width = 100;
leftEdge.height = game.canvas.height;
leftEdge.x = -leftEdge.width;
leftEdge.y = 0;