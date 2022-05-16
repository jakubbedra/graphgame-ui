import {TaskGraph} from "../tasks/task-graph";
import {Vector} from "./game.vector";
import {GameGraphBeautifier} from "./game.graph.beautifier";
import {GameCanvasController} from "./game.canvas.controller";

export class GameCanvas {

	graph: TaskGraph;
	taskType: string; // DRAW, VERTEX_SELECTION, EDGE_SELECTION
	
	public edgeSelectionStack: number[][] = [];
	public vertexSelectionStack: number[] = [];
	
	public edges: number[][] = [];
 	public vertices: Vector[] = []; // position always {<0;1>, <0;1>}
	
	canvas() { return this.canvasController.canvas; }
	context() { return this.canvasController.context; }
	
	beautifier: GameGraphBeautifier = new GameGraphBeautifier();
	
	canvasController: GameCanvasController;
	
	public vertexRadius: number = 16;
	public edgeWidth: number = 6;
	

	constructor() {
		this.canvasController = new GameCanvasController(this);
		
		// example graph:
		var g = [[1,2,3],[0,2],[0,1],[0,4],[3]];
		var t = new TaskGraph();
		t.neighbourLists = g;
		this.initTask("DRAW", t);
	}
	
	
	
	addEdge(a: number, b: number) {
		var f = this.edges[a]
			.findIndex((v: number, i: number, obj: number[])=>{return v==b;});
		if(f) {
			if(f>=0)
				return;
		}
		this.edges[a].push(b);
		this.edges[b].push(a);
	}
	
	addVertex(position: Vector) {
		this.vertices.push(position.copy());
		this.edges.push([]);
	}
	
	findVertices(position: Vector) {
		var ret = [];
		for(var i=0; i<this.vertices.length; ++i) {
			if(this.vertices[i].diff(position).len() < this.vertexRadius) {
				ret.push(i);
			}
		}
		return ret;
	}
	
	findEdges(position: Vector) {
		var ret = [];
		for(var i=0; i<this.edges.length; ++i) {
			var ida = i;
			var a = this.vertices[ida].copy();
			for(var j=0; j<this.edges[i].length; ++j) {
				var idb = this.edges[i][j];
				if(idb > ida) {
					var b = this.vertices[idb].copy();
					if(this.edgeCollision(a, b, position)) {
						ret.push([ida, idb]);
					}
				}
			}
		}
		return ret;
	}
	
	edgeCollision(a: Vector, b: Vector, position: Vector) {
		var ab = b.sub(a);
		var dir = ab.divf(ab.len());
		var p = position.sub(a);
		var tp = p.dot(dir);
		var tab = ab.dot(dir);

		if(tp < 0)
			return false;
		else if(tp > tab)
			return false;

		var perdir = new Vector(-dir.y, dir.x);

		var ptp = p.dot(perdir);
		if(ptp < -this.edgeWidth*3/2)
			return false;
		else if(ptp > this.edgeWidth*3/2)
			return false;
		
		return true;
	}
	
	removeVertexById(id: number) {
		this.vertices.splice(id, 1);
		this.edges.splice(id, 1);
		for(var i=0; i<this.edges.length; ++i) {
			for(var j=0; j<this.edges[i].length; ++j) {
				if(this.edges[i][j] == id)  {
					this.edges[i].splice(j, 1);
					--j;
				} else if(this.edges[i][j] > id) {
					this.edges[i][j]--;
				}
			}
		}
	}
	
	removeEdgeByIds(ids: number[]) {
		var f = this.edges[ids[0]]
			.findIndex((v: number, i: number, obj: number[])=>{return v==ids[1];});
		if(f) {
		} else if(f>=0) {
		} else
			return;
		this.edges[ids[0]].splice(f, 1);
		
		f = this.edges[ids[1]]
			.findIndex((v: number, i: number, obj: number[])=>{return v==ids[0];});
		if(f) {
		} else if(f>=0) {
		} else
			return;
		this.edges[ids[1]].splice(f, 1);
	}
	
	
	
	initTask(taskType: string, graph: TaskGraph) {
		this.taskType = taskType;
		
		this.graph = graph;
		this.edges = graph.neighbourLists;
		/*
		if(this.edges == null) {
			this.edges = [];
			this.vertices = [];
			return;
		}
	   */
		
// 		if(this.taskType != "DRAW") {
// 			this.generateGraphVertices();
// 		}
		this.renderGraph();
	}
	
	generateGraphVertices() {
		this.beautifier.generateGraphVertices(this.canvas(), this.edges, this.vertices);
		this.edges = this.beautifier.edges;
		this.vertices = this.beautifier.vertices;
	}
	
	
	
	renderGraph() {
		if(this.context() == null)
			return;
		this.context().clearRect(0, 0, this.canvas().width, this.canvas().height);
		this.context().lineWidth = this.edgeWidth;
		this.renderEdges();
		this.renderVertices();
		this.canvasController.renderAdditional();
	}
	
	renderEdges() {
		for(var i=0; i<this.edges.length; ++i) {
			var a = this.vertices[i].copy();
			for(var j=0; j<this.edges[i].length; ++j) {
				var id = this.edges[i][j];
				if(id > i) {
					var b = this.vertices[id].copy();
					this.context().beginPath();
					this.context().moveTo(a.x, a.y);
					this.context().lineTo(b.x, b.y);
					this.context().lineWidth = this.edgeWidth;
					this.context().strokeStyle = '#CCC';
					this.context().stroke();
					this.context().closePath();
				}
			}
// 			this.context().ellipse(a.x, a.y, this.vertexRadius, this.vertexRadius, 0, 0, Math.PI*2);
// 			this.context().fill();
		}
	}
	
	renderVertices() {
		this.context().lineWidth = 3;
		for(var i=0; i<this.vertices.length; ++i) {
			var a = this.vertices[i].copy();
			
			if(this.canvasController.chosenVertexId == i ||
				this.canvasController.currentMousePosition.dist(a)
						   < this.vertexRadius) {
				this.context().beginPath();
				this.context().fillStyle = "red";
				this.context().ellipse(a.x, a.y, this.vertexRadius+3, this.vertexRadius+3, 0, 0, Math.PI*2);
				this.context().fill();
				this.context().closePath();
			}
			
			this.context().beginPath();
			this.context().fillStyle = '#22B';
			this.context().ellipse(a.x, a.y, this.vertexRadius, this.vertexRadius, 0, 0, Math.PI*2);
			this.context().fill();
			this.context().closePath();
			
			var fontSize = 20;
			
			this.context().font = "bold "+fontSize+"px Arial";
			this.context().fillStyle = 'black';
			this.context().strokeStyle = 'white';
			
			var text = ""+i;//"id: " + i;
			var s = new Vector(this.context().measureText(text).width, fontSize);
			var p = a.sub(s.divf(2).mul(new Vector(1, -0.5))).add(new Vector(0,1));
			
			this.context().beginPath();
			this.context().strokeText(text, p.x, p.y);
			this.context().fillText(text, p.x, p.y);
			this.context().closePath();
		}
	}
}

