const cont = s(".cont")

let showAll = false;
s("#showall").onclick = function() {
	if (this.getAttribute("display") == "0") {
		this.setAttribute("display", "1");
		cont.style.display = "block"
		showAll = true;
	} else if (this.getAttribute("display") == "1") {
		this.setAttribute("display", "0");
		cont.style.display = "none";
		showAll = false;
	}
}

let canvas = s("#main");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cw = canvas.width,
	ch = canvas.height,
	cx = canvas.width / 2,
	cy = canvas.height / 2;

const twoPi = 2 * Math.PI;


class Wave {
	constructor(amp, time, phase) {
		this.amp = amp;
		this.time = time || 1;
		this.phase = phase || 0;
		this.lastY = 0;
		this.color;
		this.animY = 0;
	}
	f(t) {
		return (this.amp * Math.sin(((2 * Math.PI * t) / this.time) + this.phase));
	}
	updatePhase(p, dt) {
		this.phase += p * dt;
	}
}

let pointX = Math.floor(cx);
document.body.ontouchmove = function(e) {
	if (showAll) {
		pointX = Math.floor(e.touches[0].clientX);
	}
}
const offsetLen = 20;
const maxAmp = 50,
	waveCount = 8;

const barH = maxAmp + 10;
const filler = (ch - (barH * waveCount)) / (waveCount + 1);

let waves = [];
let wavePos = [];
let prevPos = 0;


function generateWaves() {
	cont.innerHTML = "";
	waves = [];
	wavePos = []
	prevPos = 0;

	for (let i = 0; i < waveCount; i++) {
		let amplitude = random(10, maxAmp),
			time_period = random(0, 15),
			phase = random(-twoPi, twoPi);
		let w = new Wave(amplitude, time_period, phase);
		w.color = `hsl(${map_range(i,0,waveCount-1,0,360)},30%,80%)`;
		waves.push({ wave: w, display: true });
		let y1 = prevPos + filler;
		let y2 = y1 + barH;
		wavePos.push(Math.floor(y1 + maxAmp / 2));
		prevPos = y2;

		let div = document.createElement("div");
		cont.appendChild(div);
		let canva = document.createElement("canvas");
		div.appendChild(canva);

		let btn = document.createElement("button");
		btn.setAttribute("state", "0");
		btn.innerHTML = "Hide";
		btn.onclick = function() {
			if (btn.innerHTML == "Hide") {
				waves[i].display = false;
				btn.innerHTML = "Show";
				canva.style.opacity = 0;
				btn.setAttribute("state", "1");
			} else {
				btn.innerHTML = "Hide";
				waves[i].display = true;
				canva.style.opacity = 1;
				btn.setAttribute("state", "0");
			}
		}

		div.appendChild(btn)
		canva.width = cw;
		canva.height = barH;
		w.canvas = canva;
		w.ctx = canva.getContext("2d")
		div.style.top = y1 + "px"
	}
};

generateWaves();

let now;
let lastTime = 0;
let lastY = 0;

function innit() {
	now = Date.now();
	let dt = (now - lastTime) / 1000.0;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//Move the waves;
	for (let wave of waves) {
		wave.wave.ctx.clearRect(0, 0, wave.wave.canvas.width, wave.wave.canvas.height)
		wave.wave.updatePhase(2.5, dt);
	};
	//Draw the waves;
	let pointY;
	for (let x = 0; x < canvas.width; x += 1) {
		let finalY = 0;
		for (let i = 0; i < waves.length; i++) {
			if (waves[i].display) {
				let curr = waves[i].wave;
				let y = curr.f((x / canvas.width) * twoPi);
				if (showAll) {
					let lastY1 = (curr.canvas.height / 2) + (curr.lastY / 2),
						currY1 = (curr.canvas.height / 2) + (y / 2);
					curr.ctx.line(x - 1, lastY1, x, currY1, curr.color, 1);
				}
				finalY += y;
				curr.lastY = y;
			}
		};
		if (x == pointX) {
			pointY = finalY + cy;
		}
		ctx.line(x - 1, lastY + cy, x, finalY + cy, "black")
		lastY = finalY;
	};

	if (showAll) {
		for (let i = 0; i < waves.length; i++) {
			if (waves[i].display) {
				let curr = waves[i].wave;
				let y = (curr.f((pointX / canvas.width) * twoPi) / 2) + wavePos[i] + 6;

				let offval = (i >= 5) ? waves.length - 1 - i : i + 1;
				let offset = pointX + (((i % 2 == 0) ? 1 : -1) * (offsetLen * offval));

				let w = 2;
				ctx.line(pointX, y, offset, y, curr.color, w);
				ctx.line(offset, y, pointX, pointY, curr.color, w)
				ctx.circle(pointX, y, 3, { fill: curr.color })
				ctx.circle(pointX, pointY, 5, { fill: "red" })
			}
		}
	};

	lastTime = now;
	window.requestAnimationFrame(innit)
}
innit();
s("#reset").addEventListener('click', function() {
	generateWaves();
});