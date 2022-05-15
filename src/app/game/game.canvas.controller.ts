import {GameCanvas} from "./game.canvas";
import {Vector} from "./game.vector";

export class GameCanvasController {
	
	gameCanvas: GameCanvas;
	
	public canvas: HTMLCanvasElement;
 	public context: CanvasRenderingContext2D;
	
	leftDown: boolean = false;
	rightDown: boolean = false;
	currentMousePosition: Vector = new Vector();
	mouseDownPosition: Vector = new Vector();
	chosenVertexId: number = -1;
	
	
	constructor(gameCanvas: GameCanvas) {
		this.gameCanvas = gameCanvas;
		this.fetchCanvasAsync();
	}
	
	
	renderAdditional() {
		if(this.gameCanvas.taskType == "DRAW") {
			if(this.rightDown) {
				if(this.chosenVertexId >= 0) {
					this.context.strokeStyle = "blue";
					this.context.beginPath();
					var a = this.gameCanvas.vertices[this.chosenVertexId].copy();
					var b = this.currentMousePosition.copy();
					this.context.moveTo(a.x, a.y);
					this.context.lineTo(b.x, b.y);
					this.context.stroke();
					this.context.closePath();
// 					console.log("Draw: " + a.x + "," + a.y + " to " + b.x + "," + b.y);
				}
			}
		}
	}
	
	
	async fetchCanvasAsync() {
		function s(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		};
		await s(1000);
		this.fetchCanvas();
	};
	
	fetchCanvas() {
		this.canvas = document.getElementById('canvas-id') as HTMLCanvasElement;
		if(this.canvas == null) {
			this.fetchCanvasAsync();
		}
		this.context = this.canvas.getContext("2d");
		
		let self = this;
		this.canvas.onmousemove = function(ev: MouseEvent){self.mouseMove(ev);};
		this.canvas.onmousedown = function(ev: MouseEvent){self.mouseDown(ev);};
		this.canvas.onmouseup = function(ev: MouseEvent){self.mouseUp(ev);};
		this.canvas.onresize = function() {
			self.canvas.width = self.canvas.offsetWidth;
			self.canvas.height = self.canvas.offsetHeight;
		};
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
		this.canvas.oncontextmenu = function(e) { return false; };
		
		this.gameCanvas.generateGraphVertices();
		this.gameCanvas.renderGraph();
	}
	
	
	mousePos(ev: MouseEvent) {
		var p = new Vector(ev.x, ev.y)
			.diff(new Vector(this.canvas.offsetLeft, this.canvas.offsetTop));
// 			.div(new Vector(this.canvas.offsetWidth, this.canvas.offsetHeight))
		return p;
	}
	
	findVertexId(p: Vector) {
		var d = this.gameCanvas.findVertices(p);
		if(d.length == 0)
			return -1;
		return d[0];
	}
	
	
	
	/*
	 * TODO: Solve left and right mouse button down at once
	 */
	
	mouseMove(ev: MouseEvent) {
		this.currentMousePosition = this.mousePos(ev);
		this.gameCanvas.renderGraph();
	}
	
	mouseDown(ev: MouseEvent) {
		this.currentMousePosition = this.mousePos(ev);
		this.mouseDownPosition = this.currentMousePosition.copy();
		if(ev.button == 0) {
			this.leftDown = true;
			// ...
		} else if(ev.button == 2) {
			this.rightDown = true;
			this.chosenVertexId = this.findVertexId(this.currentMousePosition);
		}
		this.gameCanvas.renderGraph();
	}
	
	mouseUp(ev: MouseEvent) {
		this.currentMousePosition = this.mousePos(ev);
		if(ev.button == 0) {
			this.leftDown = false;
			// ...
		} else if(ev.button == 2) {
			this.rightDown = false;
			if(this.chosenVertexId >= 0) {
				var nextId = this.findVertexId(this.currentMousePosition);
				if(nextId >= 0) {
					if(nextId != this.chosenVertexId) {
						// add edge
						this.gameCanvas.addEdge(nextId, this.chosenVertexId);
					} else if(this.mouseDownPosition.dist(this.currentMousePosition) < this.gameCanvas.vertexRadius/2) {
						// delete vertex
						this.gameCanvas.removeVertexById(nextId);
					}
				}
			} else {
				if(this.mouseDownPosition.dist(this.currentMousePosition) < this.gameCanvas.vertexRadius/2) {
					// add vertex
					this.gameCanvas.addVertex(this.currentMousePosition);
				}	
			}
		}
		this.gameCanvas.renderGraph();
		this.chosenVertexId = -1;
	}
}
