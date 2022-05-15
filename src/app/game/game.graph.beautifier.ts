import {Vector} from "./game.vector";

export class GameGraphBeautifier {
	
	public edges: number[][];
 	public vertices: Vector[] = []; // position always {<0;1>, <0;1>}
	public canvas: HTMLCanvasElement;
	
	constructor() {
	}
	
	generateGraphVertices(canvas: HTMLCanvasElement,
						  edges: number[][],
						  vertices: Vector[]) {
		if(canvas) {
		} else {
			return;
		}
		this.canvas = canvas;
		this.edges = edges;
		this.vertices = vertices;
		this.vertices = new Array<Vector>(this.edges.length);
		for(var i=0; i<this.edges.length; ++i) {
			this.vertices[i] = new Vector();
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
		
		/*
		if(fullness >= 0.6) {
			this.beautifyFullGraph();
		} else if(true) {
			
		}
		*/
		this.beautifyFullGraph();
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
				(Math.sin(angle)*0.5 + 0.5) * this.canvas.width,
				(Math.cos(angle)*0.5 + 0.5) * this.canvas.height
			);
		}
	}
}
