let canvas;
let ctx;
let width;
let height;

let stack = [];

let json;
let iter = 5;
let presets = [
	{"angle":26,"len":5,"axiom":"Y","rules":{"X":"X[-FFF][+FFF]FX","Y":"YFX[+Y][-Y]"}},
	{"angle":20,"len":3,"axiom":"X","rules":{"X":"F-[[X]+X]+F[+FX]-X","F":"FF"}},
	{"angle":35,"len":4,"axiom":"F","rules":{"F":"FF+[+F-F-F]-[-F+F+F]"}},
	{"angle":45,"len":3,"axiom":"F","rules":{"F":"F[+FF][-FF]F[-F][+F]F"}},
	{"angle":20,"len":7,"axiom":"VZFFF","rules":{"V":"[+++W][---W]YV","W":"+X[-W]Z","X":"-W[+X]Z","Y":"YZ","Z":"[-FFF][+FFF]F"}},
	{"angle":20,"len":4,"axiom":"X","rules":{"X":"F[-X+F]F[+X-X]","F":"XF"}}
];

$(document).ready(function(){
	loadJSON();
	fillDetails();
	addEventListeners();

	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	if (ctx) {
		width = canvas.width;
		height = canvas.height;
		paint();
	}
});

function loadJSON() {
	// load user JSON; if there is none load preset
	let b64 = window.location.href.split("#");
	if (b64.length < 2) {
		json = presets[3];
		console.log(json);
	} else {
		json = JSON.parse(atob(b64[1]));
	}
}

function addEventListeners() {
	// add event listeners for sliders
	$("#iterSlider").change(function() {
		iter = $(this).val();
		$("#iterations").html(iter);
		paint();
	})

	$("#presets").change(function() {
		let i = parseInt($(this).val());
		json = presets[i];
		paint();
		fillDetails();
	})
}

function fillDetails() {
	// add details to the details section
	let ruleHTML = [];
	for (let [symbol, replacement] of Object.entries(json.rules)) {
		ruleHTML.push(`<p>${symbol} &rarr; ${replacement}</p>`);
	}
	$("#rules").html(ruleHTML.join("\n"));
	$("#axiom").html(json.axiom);
	$("#angle").html(json.angle);
	$("#len").html(json.len);
}

function paint() {
	ctx.strokeStyle = "#639684";
	ctx.resetTransform();
	drawLsys(json.angle, json.len, json.axiom, json.rules, iter);
}

function drawLsys(theta, length, axiom, rules, iter) {
	// generate the sentence
	ctx.clearRect(0, 0, width, height);
	let s = axiom;
	let angle = theta * (Math.PI / 180);
	for (let i = 0; i < iter; i ++) {
		s = iteration(s, rules);
	}

	// and draw the L-system from that
	ctx.translate(width / 2, height);
	ctx.rotate(Math.PI);
	ctx.beginPath();
	let c;
	for (let i = 0; i < s.length; i ++) {
		c = s[i];
		if (c == "F") {
			ctx.lineTo(0, 0);
			ctx.lineTo(0, length);
			ctx.translate(0, length);
		} else if (c == "+") {
			ctx.rotate(-angle);
		} else if (c == "-") {
			ctx.rotate(angle);
		} else if (c == "[") {
			ctx.save();
		} else if (c == "]") {
			ctx.stroke();
			ctx.restore();
			ctx.beginPath();
		}
	}
	ctx.stroke();
}

function iteration(string, rules) {
	// perform an iteration of the string replacement
	let c, r, out = "";
	for (let i = 0; i < string.length; i ++) {
		c = string[i];
		r = rules[c];
		if (r == undefined) {
			r = c;
		}
		out += r;
	}
	return out;
}