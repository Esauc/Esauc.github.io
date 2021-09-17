
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

ctx.canvas.width = window.innerWidth-40;
ctx.canvas.height = window.innerHeight - (window.innerHeight / 3);

var xOffset = ctx.canvas.width / 2;
var yOffset = ctx.canvas.height / 2;

var xOffsetBuffer = 0;
var yOffsetBuffer = 0;

var mouseX = 0;
var mouseY = 0;

var mouseClickX = 0;
var mouseClickY = 0;

var isMouseDown = false;

var pontos = [];
var dPontos = [];

const zoom = 10;

var fx = "";

function draw()
{
	//Desenha o quadro
	setOffset(0, 0);
	ctx.fillStyle = "#F0FFF0"
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	setOffset(xOffset, yOffset); //Ajusta a câmera
	//Desenha os eixos do plano cartesiano
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 2;
	//Eixo Y
	ctx.strokeText("^", -3, -yOffset + 10);
	ctx.beginPath();
	ctx.moveTo(0, -yOffset);
	ctx.lineTo(0, -yOffset + ctx.canvas.height);
	ctx.stroke();
	//Eixo X
	ctx.strokeText(">", -xOffset + ctx.canvas.width - 10, 3);
	ctx.beginPath();
	ctx.moveTo(-xOffset, 0);
	ctx.lineTo(-xOffset + ctx.canvas.width, 0);
	ctx.stroke();

	drawFunction();
}

function setOffset(x, y)
{
	ctx.translate(x - xOffsetBuffer, y - yOffsetBuffer);
	xOffsetBuffer = x;
	yOffsetBuffer = y;
}

class Point
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}
}

function calculateF(x)
{
	if(fx.length > 0)
	{
		x += 1.0;
		x -= 1.0; //Faz X deixar de ser string e virar número.
		return eval(fx);
	}
	return null;
}

function calculateDerivative(x)
{
	if(fx.length > 0)
	{
		const h = 0.000001;
		x += 1.0;
		x -= 1.0; //Faz X deixar de ser string e virar número.
		var f = calculateF(x);
	    var a = calculateF(x + h);
	    console.log(a);
	    derivada = (a -f) / h;
	    return derivada;
	}
	return null;
}

function plotFunction(f)
{
	if(f.length == 0)
	{
		return false;
	}

	pontos = [];

	for(var x = -xOffset -ctx.canvas.width; x < -xOffset + ctx.canvas.width * 2; x ++)
	{
		var y = 0;
		try
		{
			x /= zoom;
			y = eval(f + ";");
			x *= zoom;
		}
		catch(e)
		{
			console.log(e);
			return false;
		}
		var p = new Point(x, y * zoom);
		pontos.push(p);
	}
	draw();

	fx = f;

	return true;
}

function plotDerivative(f)
{
	
}

function drawFunction()
{
	//console.log(pontos);
	
	if(pontos.length > 0)
	{
		ctx.strokeStyle = "#F51E1E";
		ctx.beginPath();
		ctx.moveTo(pontos[0].x, -pontos[0].y);

		for(var i = 1; i < pontos.length; i++)
		{
			ctx.lineTo(pontos[i].x, -pontos[i].y);
		}
		ctx.stroke();
	}
}

let canvasElem = document.querySelector("canvas");

draw();


canvasElem.addEventListener("mousedown", function(e)
{
	let rect = canvas.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;

	mouseClickX = x;
	mouseClickY = y;

	isMouseDown = true;
});
canvasElem.addEventListener("mouseup", function(e)
{
	isMouseDown = false;
	plotFunction(fx);
});
canvasElem.addEventListener("mousemove", function (e)
{
	let rect = canvas.getBoundingClientRect();

	mouseX = e.clientX - rect.left;
	mouseY = e.clientY - rect.top;

	if(isMouseDown)
	{
		xOffset += mouseX -mouseClickX;
		yOffset += mouseY -mouseClickY;

		mouseClickX = mouseX;
		mouseClickY = mouseY;

		draw();
	}
});
canvasElem.addEventListener("touchstart", function(e)
{
	let rect = canvas.getBoundingClientRect();
	let x = e.touches[0].clientX - rect.left;
	let y = e.touches[0].clientY - rect.top;

	mouseClickX = x;
	mouseClickY = y;

	isMouseDown = true;
});
canvasElem.addEventListener("touchend", function(e)
{
	isMouseDown = false;
});
canvasElem.addEventListener("touchmove", function(e)
{
	let rect = canvas.getBoundingClientRect();

	mouseX = e.touches[0].clientX - rect.left;
	mouseY = e.touches[0].clientY - rect.top;

	if(isMouseDown)
	{
		xOffset += mouseX -mouseClickX;
		yOffset += mouseY -mouseClickY;

		mouseClickX = mouseX;
		mouseClickY = mouseY;

		draw();
	}
});

// Start things off
//requestAnimationFrame(mainLoop);