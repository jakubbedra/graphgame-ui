import {TaskGraph} from "../tasks/task-graph";
import {Vector} from "./game.vector";
import {GameGraphBeautifier} from "./game.graph.beautifier";
import {GameCanvasController} from "./game.canvas.controller";

export class GameCanvas {

	graph: TaskGraph;
	taskType: string; // DRAW, VERTEX_SELECTION, EDGE_SELECTION
	
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
					var ab = b.sub(a);
					var dir = ab.divf(ab.len());
					var p = position.sub(a);
					var tp = p.dot(dir);
					var tab = ab.dot(dir);
					
					var result = true;
					
					if(tp < 0)
						result = false;
					else if(tp > tab)
						result = false;
					
					var perdir = new Vector(-dir.y, dir.x);
					
					var ptp = p.dot(perdir);
					if(ptp < -this.edgeWidth*3/2)
						result = false;
					else if(ptp > this.edgeWidth*3/2)
						result = false;
					
					if(result) {
						ret.push([ida, idb]);
					}
				}
			}
		}
		return ret;
		
		
		console.error("GameCanvas::findEdges() is not implemented yet");
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
		this.context().strokeStyle = 'white';
		this.context().fillStyle = 'yellow';
		this.context().lineWidth = this.edgeWidth;
		for(var i=0; i<this.edges.length; ++i) {
			this.context().beginPath();
			var a = this.vertices[i].copy();
			for(var j=0; j<this.edges[i].length; ++j) {
				var id = this.edges[i][j];
				var b = this.vertices[id].copy();
				this.context().moveTo(a.x, a.y);
				this.context().lineTo(b.x, b.y);
				this.context().stroke();
			}
			this.context().closePath();
			this.context().ellipse(a.x, a.y, this.vertexRadius, this.vertexRadius, 0, 0, Math.PI*2);
			this.context().fill();
		}
		for(var i=0; i<this.vertices.length; ++i) {
			this.context().beginPath();
			var a = this.vertices[i].copy();
			this.context().ellipse(a.x, a.y, this.vertexRadius, this.vertexRadius, 0, 0, Math.PI*2);
			this.context().fill();
		}
		this.canvasController.renderAdditional();
	}
}

