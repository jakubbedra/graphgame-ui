import {TaskDescriptionsAndSubjects} from "../tasks/task-descriptions-and-subjects";
import {TaskGraph} from "../tasks/task-graph";
import {Vector} from "./game.vector";

export class GameCanvas {

	graph: TaskGraph;
	taskType: string; // DRAW, VERTEX_SELECTION, EDGE_SELECTION
	
	edges: number[][];
 	vertices: Vector[] = []; // position always {<0;1>, <0;1>}
	
	canvas: HTMLCanvasElement;
 	context: CanvasRenderingContext2D;
	
	public vertexRadius: number = 13;
	public edgeWidth: number = 3;
	
	fetchCanvas() {
		this.canvas = document.getElementById('canvas-id') as HTMLCanvasElement;
		if(this.canvas == null)
			return;
		this.context = this.canvas.getContext("2d");
		
		let self = this;
		this.canvas.onmousemove = function(ev: MouseEvent){self.mouseMove(ev);};
		this.canvas.onmousedown = function(ev: MouseEvent){self.mouseDown(ev);};
		this.canvas.onmouseup = function(ev: MouseEvent){self.mouseUp(ev);};
		
		this.renderGraph();
	}

	constructor() {
		this.fetchCanvas();
		
		var self = this;
		var f = async function() {
			function s(ms) {
				return new Promise(resolve => setTimeout(resolve, ms));
			};
			await s(1000);
			self.fetchCanvas();
		};
		f();
		
		// example graph:
		var g = [[1,2,3],[0,2],[0,1],[0,4],[3]];
		var t = new TaskGraph();
		t.neighbourLists = g;
		this.initTask("DRAW", t);
	}
	
	
	
	leftDown: boolean = false;
	rightDown: boolean = false;
	downMousePosition: Vector;
	currentMousePosition: Vector;
	
	mouseMove(ev: MouseEvent) {
		this.renderGraph();
	}
	
	mouseDown(ev: MouseEvent) {
		if(ev.button == 0) {
			this.leftDown = true;
			// ...
		} else if(ev.button == 2) {
			this.rightDown = true;
			// ...
		}
	}
	
	mouseUp(ev: MouseEvent) {
	}
	
	initTask(taskType: string, graph: TaskGraph) {
		this.taskType = taskType;
		
		this.graph = graph;
		this.edges = graph.neighbourLists;
		console.log("Init task graph");
		console.log(this.graph);
		console.log(this.edges);
		
// 		if(this.taskType != "DRAW") {
			this.generateGraphVertices();
// 		}
		this.renderGraph();
	}
	
	generateGraphVertices() {
		this.vertices = new Array<Vector>(this.graph.neighbourLists.length);
		for(var i=0; i<this.graph.neighbourLists.length; ++i) {
			this.vertices[i] = new Vector();
			console.log("vert: " + this.vertices[i]);
		}
		this.beautifyGraph();
	}
	
	beautifyGraph() {
		var planarity = 0;
		var fullness = 0;
		var verticesByHighestDegree = [];
		var edgesCount = 0;
		var maxEdges = this.vertices.length * (this.vertices.length-1) / 2;
		
		for(var i=0; i<this.edges.length; ++i) {
			verticesByHighestDegree[i] = i;
			edgesCount += this.edges[i].length;
		}
		this.sortByVertexDegree(verticesByHighestDegree);
		
		fullness = edgesCount / maxEdges;
		
		if(fullness >= 0.6) {
			this.beautifyFullGraph();
		} else if(true) {
			
		}
		this.beautifyFullGraph();
		
		console.log("Generate full graph");
		console.log(this.vertices);
	}
	
	sortByVertexDegree(ids: number[]) {
		for(var i=0; i<ids.length; ++i) {
			for(var j=i+1; j<ids.length; ++j) {
				if(this.edges[ids[i]].length < this.edges[ids[j]].length) {
					var t = ids[i];
					ids[i] = ids[j];
					ids[j] = t;
				}
			}
		}
	}
	
	beautifyFullGraph() {
		var verticesCount = this.vertices.length;
		var delta = Math.PI * 2 / verticesCount;
		for(var i=0; i<this.vertices.length; ++i) {
			var angle = delta*i;
			this.vertices[i] = new Vector(
				Math.sin(angle)*0.5 + 0.5,
				Math.cos(angle)*0.5 + 0.5
			);
			console.log(this.vertices[i]);
		}
		console.log(this.vertices);
	}
	
	
	renderGraph() {
		if(this.context == null)
			return;
		this.context.strokeStyle = 'white';
		this.context.fillStyle = 'yellow';
		this.context.lineWidth = this.edgeWidth;
		for(var i=0; i<this.edges.length; ++i) {
			this.context.beginPath();
			var a = this.vertices[i];
			a.x *= this.canvas.width;
			a.y *= this.canvas.height;
			for(var j=0; j<this.edges[i].length; ++j) {
				var id = this.edges[i][j];
				var b = this.vertices[id];
				b.x *= this.canvas.width;
				b.y *= this.canvas.height;
				this.context.moveTo(a.x, a.y);
				this.context.lineTo(b.x, b.y);
				this.context.stroke();
			}
			this.context.closePath();
			this.context.ellipse(a.x, a.y, this.vertexRadius, this.vertexRadius, 0, 0, Math.PI*2);
			this.context.fill();
		}
		for(var i=0; i<this.vertices.length; ++i) {
			this.context.beginPath();
			var a = this.vertices[i];
			a.x *= this.canvas.width;
			a.y *= this.canvas.height;
			this.context.ellipse(a.x, a.y, this.vertexRadius, this.vertexRadius, 0, 0, Math.PI*2);
			this.context.fill();
		}
	}
}

