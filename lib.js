
		//functions
		function s(x) {
			return document.querySelector(x)
		};

		function random(x, y) {
			return x + Math.random() * (y - x);
		};

		function createCanvas(elm, w, h, id, cls) {
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			if (id) {
				canvas.setAttribute("id", id);
				if (cls) {
					canvas.setAttribute("class", cls);
				}
			}
			canvas.width = w;
			canvas.height = h;
			elm.appendChild(canvas)
			return {
				canvas: canvas,
				ctx: ctx,
				w: w,
				h: h,
				cx: w / 2,
				cy: h / 2
			}
		};

		CanvasRenderingContext2D.prototype.line = function(x1, y1, x2, y2, color, width = 2.5) {
			this.beginPath();
			this.strokeStyle = color;
			this.lineWidth = width;
			this.moveTo(x1, y1);
			this.lineTo(x2, y2);
			this.stroke();
			this.closePath();
		};
		CanvasRenderingContext2D.prototype.box = function(x, y, w, h, c) {
			this.beginPath();
			this.fillStyle = c || "black";
			this.fillRect(x, y, w, h);
			this.closePath();
		};
		CanvasRenderingContext2D.prototype.circle = function(x, y, r, opt = {}) {
			this.beginPath();
			this.strokeStyle = (opt.color || opt.strokeStyle || opt.borderColor || "black");
			this.fillStyle = (opt.fill || opt.fillColor || opt.bg || opt.bgColor || "black");
			this.lineWidth = (opt.width || opt.lineWidth || opt.borderWidth || 1);
			this.arc(x, y, r, 0, twoPi);
			this.fill();
			this.stroke();
			this.closePath();
		};

		function map_range(x, inMin, inMax, outMin, outMax) {
			return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
		};