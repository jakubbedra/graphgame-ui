import {GameCanvas} from "./game.canvas";
import {Vector} from "./game.vector";

export class GameCanvasController {

	gameCanvas: GameCanvas;

	public canvas: HTMLCanvasElement;
	public context: CanvasRenderingContext2D;

	buttonActionDown: boolean = false;
	buttonMovementDown: boolean = false;
	currentMousePosition: Vector = new Vector();
	mouseDownPosition: Vector = new Vector();
	chosenVertexId: number = -1;

	invertedLefRightMouseButtons: boolean = false;
	
	selectColor: number = 0;


	constructor(gameCanvas: GameCanvas) {
		this.gameCanvas = gameCanvas;
		this.fetchCanvasAsync();
	}


	renderAdditional() {
		if(this.gameCanvas.taskType == "DRAW") {
			if(this.buttonActionDown) {
				if(this.chosenVertexId >= 0) {
					this.context.strokeStyle = "blue";
					this.context.beginPath();
					var a = this.gameCanvas.vertices[this.chosenVertexId].copy();
					var b = this.currentMousePosition.copy();
					this.context.moveTo(a.x, a.y);
					this.context.lineTo(b.x, b.y);
					this.context.stroke();
					this.context.closePath();
				}
			}
		}
	}


	async fetchCanvasAsync() {
		function s(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		};
		await s(10);
		this.fetchCanvas();
	};

	fetchCanvas() {
		this.canvas = document.getElementById('canvas-id') as HTMLCanvasElement;
		if(this.canvas == null) {
			this.fetchCanvasAsync();
			return;
		}
		this.context = this.canvas.getContext("2d");

		let self = this;
		this.canvas.onmousemove = function(ev: MouseEvent){self.mouseMove(ev);};
		this.canvas.onmousedown = function(ev: MouseEvent){self.mouseDown(ev);};
		this.canvas.onmouseup = function(ev: MouseEvent){self.mouseUp(ev);};
		this.canvas.onkeyup = function(){console.log("key event", this);self.keyUp(this);};
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
	
	
	
	keyUp(ev) {
			console.log(ev);
		if(this.gameCanvas.taskType == "VERTEX_COLORING" ||
			this.gameCanvas.taskType == "EDGE_COLORING") {
			console.log(ev);
			console.log(ev.keyCode);
			console.log(ev.code);
			switch(ev.code) {
				case "Digit0": this.selectColor = 0; break;
				case "Digit1": this.selectColor = 1; break;
				case "Digit2": this.selectColor = 2; break;
				case "Digit3": this.selectColor = 3; break;
				case "Digit4": this.selectColor = 4; break;
				case "Digit5": this.selectColor = 5; break;
				case "Digit6": this.selectColor = 6; break;
				case "Digit7": this.selectColor = 7; break;
				case "Digit8": this.selectColor = 8; break;
				case "Digit9": this.selectColor = 9; break;
				case "Minus":     this.selectColor = -1; break;
				case "Equal":     this.selectColor = -1; break;
				case "Backspace": this.selectColor = -1; break;
			}
		}
	}


	mousePos(ev: MouseEvent) {
		var p = new Vector(ev.offsetX, ev.offsetY)
		return p;
	}

	findVertexId(p: Vector) {
		var d = this.gameCanvas.findVertices(p);
		if(d.length == 0)
			return -1;
		return d[0];
	}

	getMouseGraphAction() {
		if(this.invertedLefRightMouseButtons) {
			return 2;
		} else {
			return 0;
		}
	}

	getMouseVertexMove() {
		if(this.invertedLefRightMouseButtons) {
			return 0;
		} else {
			return 2;
		}
	}


	/*
	 * TODO: Solve left and right mouse button down at once
	 */

	mouseMove(ev: MouseEvent) {
		var mv = new Vector(ev.movementX, ev.movementY);
		if(this.buttonMovementDown) {
			if(this.chosenVertexId >= 0) {
				this.gameCanvas.vertices[this.chosenVertexId]
				= this.gameCanvas.vertices[this.chosenVertexId].add(mv);
			}
		}
		this.currentMousePosition = this.mousePos(ev);
		this.gameCanvas.renderGraph();
	}

	mouseDown(ev: MouseEvent) {
		this.currentMousePosition = this.mousePos(ev);
		this.mouseDownPosition = this.currentMousePosition.copy();
		this.chosenVertexId = this.findVertexId(this.currentMousePosition);
		if(ev.button == this.getMouseVertexMove()) {
			this.buttonMovementDown = true;
		} else if(ev.button == this.getMouseGraphAction()) {
			this.buttonActionDown = true;
			if(this.gameCanvas.taskType == "DRAW") {

			} else if(this.gameCanvas.taskType == "VERTEX_SELECTION") {

			} else if(this.gameCanvas.taskType == "EDGE_SELECTION") {
				
			} else if(this.gameCanvas.taskType == "VERTEX_COLORING") {
				
			} else if(this.gameCanvas.taskType == "EDGE_COLORING") {
				
			}
		}
		this.gameCanvas.renderGraph();
	}

	mouseUp(ev: MouseEvent) {
		this.currentMousePosition = this.mousePos(ev);
		if(ev.button == this.getMouseVertexMove()) {
			this.buttonMovementDown = false;
			if(this.gameCanvas.taskType == "VERTEX_COLORING") {
				
				if(this.mouseDownPosition.dist(this.currentMousePosition)
						< this.gameCanvas.vertexRadius) {
					// select/deselect vertex
					if(this.chosenVertexId >= 0) {
// 						if(this.selectColor < 0) {
// 							this.gameCanvas.setVertexColor(this.chosenVertexId,
// 								1, true);
// 						} else {
// 							this.gameCanvas.setVertexColor(this.chosenVertexId,
// 								this.selectColor, false);
// 						}
						this.gameCanvas.setVertexColor(this.chosenVertexId,
							-1, true);
					}
				}
			}
		} else if(ev.button == this.getMouseGraphAction()) {
			this.buttonActionDown = false;
			if(this.gameCanvas.taskType == "DRAW") {
				if(this.chosenVertexId >= 0) {
					var nextId = this.findVertexId(this.currentMousePosition);
					if(nextId >= 0) {
						if(nextId != this.chosenVertexId) {
							// add edge
							this.gameCanvas.addEdge(nextId, this.chosenVertexId);
						} else if(this.mouseDownPosition
								  .dist(this.currentMousePosition)
							  < this.gameCanvas.vertexRadius/4) {
								  // delete vertex
								  this.gameCanvas.removeVertexById(nextId);
							  }
					}
				} else {
					var edges = this.gameCanvas.findEdges(this.currentMousePosition);
					if(this.mouseDownPosition.dist(this.currentMousePosition) < this.gameCanvas.vertexRadius/4) {
						if(edges.length > 0) {
							// delete edge
							this.gameCanvas.removeEdgeByIds(edges[0]);
						} else {
							// add vertex
							this.gameCanvas.addVertex(this.currentMousePosition);
						}
					}
				}
			} else if(this.gameCanvas.taskType == "VERTEX_SELECTION") {
				if(this.mouseDownPosition.dist(this.currentMousePosition)
						< this.gameCanvas.vertexRadius) {
					// select/deselect vertex
					if(this.chosenVertexId >= 0) {
						if(this.gameCanvas.vertexSelectionStack.length > 0) {
							if(this.gameCanvas.vertexSelectionStack[
									this.gameCanvas.vertexSelectionStack.length-1]
									== this.chosenVertexId) {
								this.gameCanvas.vertexSelectionStack
								.splice(
									this.gameCanvas.vertexSelectionStack.length-1, 1);
							} else {
								this.gameCanvas.vertexSelectionStack
								.push(this.chosenVertexId);
							}
						} else {
							this.gameCanvas.vertexSelectionStack
							.push(this.chosenVertexId);
						}
					}
				}
			} else if(this.gameCanvas.taskType == "EDGE_SELECTION") {
				
				if(this.chosenVertexId < 0) {
					var edges = this.gameCanvas.findEdges(this.currentMousePosition);
					if(edges.length > 0) {
						if(this.mouseDownPosition.dist(this.currentMousePosition)
								< this.gameCanvas.vertexRadius/4) {
							var newEdge = edges[0];
							if(this.gameCanvas.edgeSelectionStack.length > 0) {
								var lastEdge = this.gameCanvas.edgeSelectionStack[
									this.gameCanvas.edgeSelectionStack.length-1];
								console.log("Comparing edges:");
								console.log(newEdge);
								console.log(lastEdge);
								if(newEdge[0] == lastEdge[0]
										&& newEdge[1] == lastEdge[1]) {
									// deselect last edge
									this.gameCanvas.edgeSelectionStack
									.splice(
										this.gameCanvas.edgeSelectionStack.length-1, 1);
								} else {
									// select new edge
									this.gameCanvas.edgeSelectionStack.push(newEdge);
								}
							} else {
								// select new edge
								this.gameCanvas.edgeSelectionStack.push(newEdge);
							}
						}
					}
				}
				
				
				console.warn("game.canvas::mouseUp does not have",
							  " implemented ", "EDGE_SELECTION");
			} else if(this.gameCanvas.taskType == "VERTEX_COLORING") {
				
				if(this.mouseDownPosition.dist(this.currentMousePosition)
						< this.gameCanvas.vertexRadius) {
					// select/deselect vertex
					if(this.chosenVertexId >= 0) {
// 						if(this.selectColor < 0) {
// 							this.gameCanvas.setVertexColor(this.chosenVertexId,
// 								1, true);
// 						} else {
// 							this.gameCanvas.setVertexColor(this.chosenVertexId,
// 								this.selectColor, false);
// 						}
						this.gameCanvas.setVertexColor(this.chosenVertexId,
							1, true);
					}
				}
				
				
				console.warn("game.canvas::mouseUp does not have",
							  " implemented ", "VERTEX_COLORING");
			} else if(this.gameCanvas.taskType == "EDGE_COLORING") {
				
				
				console.error("game.canvas::mouseUp does not have",
							  " implemented ", "EDGE_COLORING");
			}
		}
		this.gameCanvas.renderGraph();
		this.chosenVertexId = -1;
	}
}
