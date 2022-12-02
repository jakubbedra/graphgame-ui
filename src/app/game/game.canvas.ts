import {TaskGraph} from "../tasks/task-graph";
import {Vector} from "./game.vector";
import {GameGraphBeautifier} from "./game.graph.beautifier";
import {GameCanvasController} from "./game.canvas.controller";
import {WeightedGraph} from "../tasks/weighted-graph.model";

export class GameCanvas {

	graph: TaskGraph;
	taskType: string; 	// DRAW, VERTEX_SELECTION, EDGE_SELECTION, EDGE_COLORING
						// VERTEX_COLORING

	public edgeSelectionStack: number[][] = [];
	public vertexSelectionStack: number[] = [];

	public edges: number[][] = [];
	public weightsMatrix: number[][] = null;
	public vertices: Vector[] = []; // position always {<0;1>, <0;1>}
	public vertexColor: number[] = [];
	public edgeColorMatrix: number[][] = [];
	public limitColors: number = 13;

	canvas() { return this.canvasController.canvas; }
	context() { return this.canvasController.context; }

	beautifier: GameGraphBeautifier = new GameGraphBeautifier();

	canvasController: GameCanvasController;

	public vertexRadius: number = 16;
	public edgeWidth: number = 6;






	public colorsList:string[] = [
		'#F00',
		'#0F0',
		'#00F',
		'#0FF',
		'#F0F',
		'#FF0',
		'#880',
		'#088',
		'#808',
		'#888',
		'#8F8',
		'#88F',
		'#F88'
	];

	getColorValue(colorId: number) {
		if(colorId >= this.colorsList.length) {
			return this.colorsList[0];
		}
		return this.colorsList[colorId];
	}



	getVertexColoring() {
		this.getVertexColor(0);
		return this.vertexColor;
	}

	getEdgeColoringMatrix() {
		this.getEdgeColor(0, 1);
		return this.edgeColorMatrix;
	}

	setVertexColor(vertexId: number, color: number, relative: boolean) {
		this.getVertexColor(0);
		if(relative) {
			this.vertexColor[vertexId] += color;
		} else {
			this.vertexColor[vertexId] = color;
		}
		if(this.limitColors > this.vertices.length)
			this.limitColors = this.vertices.length;
		this.vertexColor[vertexId] += this.limitColors;
		this.vertexColor[vertexId] %= this.limitColors;
		if(this.vertexColor[vertexId] < 0) {
			this.vertexColor[vertexId] += this.limitColors;
		}
		this.vertexColor[vertexId] %= this.limitColors;
	}

	getVertexColor(vertexId: number) {
		if(this.vertexColor.length != this.vertices.length) {
			this.vertexColor = new Array<number>(this.vertices.length);
			for(var i=0; i<this.vertexColor.length; ++i) {
				this.vertexColor[i] = 0;
			}
		}
		return this.vertexColor[vertexId];
	}

	setEdgeColor(ida: number, idb: number, color: number, relative: boolean) {
// 		console.error("game.canvas::setEdgeColoring does not have been",
// 					"implemented");
		if(ida > idb) {
			var tmp = ida;
			ida = idb;
			idb = tmp;
		}
		var c = this.getEdgeColor(ida, idb);
		if(relative) {
			this.edgeColorMatrix[ida][idb] += color;
		} else {
			this.edgeColorMatrix[ida][idb] = color;
		}
		if(this.limitColors > this.countEdges())
			this.limitColors = this.countEdges();
		this.edgeColorMatrix[ida][idb] += this.limitColors;
		this.edgeColorMatrix[ida][idb] %= this.limitColors;
		if(this.edgeColorMatrix[ida][idb] < 0) {
			this.edgeColorMatrix[ida][idb] += this.limitColors;
		}
		this.edgeColorMatrix[ida][idb] %= this.limitColors;
		this.edgeColorMatrix[idb][ida] = this.edgeColorMatrix[ida][idb];
	}

	getEdgeColor(ida: number, idb: number) {
// 		console.error("game.canvas::getEdgeColoring does not have been",
// 					"implemented");
		if(this.edgeColorMatrix.length != this.vertices.length) {
			this.edgeColorMatrix = new Array<number[]>(this.vertices.length);
			for(var i=0; i<this.edgeColorMatrix.length; ++i) {
				this.edgeColorMatrix[i] = new Array<number>(this.vertices.length);
				for(var j=0; j<this.edgeColorMatrix.length; ++j) {
					this.edgeColorMatrix[i][j] = -1;
				}
			}
			for(var i=0; i<this.edges.length; ++i) {
				for(var j=0; j<this.edges[i].length; ++j) {
					this.edgeColorMatrix[i][this.edges[i][j]] = 0;
				}
			}
		}
		if(ida > idb) {
			var tmp = ida;
			ida = idb;
			idb = tmp;
		}
		return this.edgeColorMatrix[ida][idb];
	}
	
	countEdges() {
		var count = 0;
		for(var i=0; i<this.edges.length; ++i) {
			for(var j=0; j<this.edges[i].length; ++j) {
				var id = this.edges[i][j];
				if(id > i) {
					count++;
				}
			}
		}
		return count;
	}







	getNeighbouringMatrix() {
		var mat:number[][] = new Array<number[]>(this.edges.length);
		for(var i=0; i<mat.length; ++i) {
			mat[i] = new Array<number>(this.edges.length);
			for(var j=0; j<mat.length; ++j) {
				mat[i][j] = 0;
			}
		}
		for(var i=0; i<this.edges.length; ++i) {
			var ida = i;
			for(var j=0; j<this.edges[i].length; ++j) {
				var idb = this.edges[i][j];
				mat[ida][idb] = 1;
				mat[idb][ida] = 1;
			}
		}
		return mat;
	}


	constructor(taskType: string, graph: TaskGraph, weightedGraph?: WeightedGraph) {
		if(false) {
			taskType = "EDGE_COLORING";
			weightedGraph = new WeightedGraph();
			weightedGraph.matrix  = [
				[0,1,0,4,0],
				[1,0,2,3,2],
				[0,2,0,0,5],
				[4,3,0,0,5],
				[0,2,5,5,0] ];
		}

		if(weightedGraph != null && weightedGraph != undefined) {
			graph = new TaskGraph();
			graph.neighbourLists = new Array<number[]>(weightedGraph.matrix.length);
			for(var i=0; i<weightedGraph.matrix.length; ++i) {
				graph.neighbourLists[i] = [];
			}
			for(var i=0; i<weightedGraph.matrix.length; ++i) {
				for(var j=0; j<weightedGraph.matrix.length; ++j) {
					if(i != j) {
						if(weightedGraph.matrix[i][j] > 0) {
							graph.neighbourLists[i].push(j);
						}
					}
				}
			}
			this.weightsMatrix = weightedGraph.matrix;
		}

		this.canvasController = new GameCanvasController(this);
		this.initTask(taskType, graph);
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

	findVertices(position: Vector, radiusTolerance: number = 1.5) {
		var ret = [];
		for(var i=0; i<this.vertices.length; ++i) {
			if(this.vertices[i].diff(position).len() < this.vertexRadius*radiusTolerance) {
				ret.push(i);
			}
		}
		var self__this__game_canvas____vertices = this.vertices;
		ret.sort(function(a,b){
			return self__this__game_canvas____vertices[a].dist(position) - self__this__game_canvas____vertices[b].dist(position);
		});
		return ret;
	}

	findEdges(position: Vector, radiusTolerance: number = 1.5) {
		var ret = [];
		for(var i=0; i<this.edges.length; ++i) {
			var ida = i;
			var a = this.vertices[ida].copy();
			for(var j=0; j<this.edges[i].length; ++j) {
				var idb = this.edges[i][j];
				if(idb > ida) {
					var b = this.vertices[idb].copy();
					if(this.edgeCollision(a, b, position, radiusTolerance)) {
						if(ida < idb)
							ret.push([ida, idb]);
						else if(ida > idb)
							ret.push([idb, ida]);
					}
				}
			}
		}
		return ret;
	}

	edgeCollision(a: Vector, b: Vector, position: Vector, radiusTolerance: number = 1.5) {
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
		if(ptp < -this.edgeWidth*radiusTolerance)
			return false;
		else if(ptp > this.edgeWidth*radiusTolerance)
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
		.findIndex((v: number, i: number, obj: number[])=>{
			return v==ids[0];
		});
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
		 * Generating weights matrix from TaskGraph argument. If NULL, then
		 * do not render weights
		 */
// 		this.weightsMatrix = graph.weightsMatrix;
		console.warn("Need to add loading weights to a ",
					 "weightMatrix here from argument in file ",
					 "/src/app/game/game.canvas.ts ::initTask" );

		this.renderGraph();
	}

	generateGraphVertices() {
		this.beautifier.generateGraphVertices(this.canvas(), this.edges,
				this.vertices);
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

					var onstack = {present: false};
					this.edgeSelectionStack.findIndex((v, id_, n)=>{
						if((v[0] == i && v[1]==id) || (v[1]==i && v[0]==id))
							onstack.present = true;
					});
					var col = this.taskType=="EDGE_COLORING" ? this.getColorValue(
						this.getEdgeColor(i, id)) : (onstack.present ? '#C28' : '#CCC');
					
					var fe = this.findEdges(this.canvasController.currentMousePosition);
					if(fe.length > 0) {
						if(fe[0][0] == i && fe[0][1] == id) {
							if(this.taskType == "EDGE_SELECTION" || this.taskType == "EDGE_COLORING") {
								this.context().beginPath();
								this.context().moveTo(a.x, a.y);
								this.context().lineTo(b.x, b.y);
								this.context().lineWidth = this.edgeWidth+5;
								this.context().strokeStyle = ('#F00'== col) ? 'blue' : 'red';
								this.context().stroke();
								this.context().closePath();
							}
						}
					}
					
					this.context().beginPath();
					this.context().moveTo(a.x, a.y);
					this.context().lineTo(b.x, b.y);
					this.context().lineWidth = this.edgeWidth;
					this.context().strokeStyle = col;
					this.context().stroke();
					this.context().closePath();
				}
			}
		}
		this.context().strokeStyle = '#CCC';
		for(var i=0; i<this.edges.length; ++i) {
			for(var j=0; j<this.edges[i].length; ++j) {
				var id = this.edges[i][j];
				if(id > i) {
					var fontSize = 20;
					this.renderEdgeDescription(i, id, fontSize);
				}
			}
		}
	}

	renderVertices() {
		this.context().lineWidth = 3;
		for(var i=0; i<this.vertices.length; ++i) {
			var a = this.vertices[i].copy();
			
			var onstack = {present: false};
			this.vertexSelectionStack.findIndex((v, id, n)=>{
				if(v == i)
					onstack.present = true;
			});
			var col = this.taskType=="VERTEX_COLORING" ? this.getColorValue(
					this.getVertexColor(i)) : (onstack.present ? '#C2C' : '#22B');

			if(this.canvasController.chosenVertexId == i
					|| this.canvasController.findVertexId(this.canvasController.currentMousePosition) == i) {
				this.context().beginPath();
				this.context().fillStyle = (col == '#F00') ? "blue" : "red";
				this.context().ellipse(a.x, a.y, this.vertexRadius+3,
						this.vertexRadius+3, 0, 0, Math.PI*2);
				this.context().fill();
				this.context().closePath();
			}

			this.context().beginPath();

			this.context().fillStyle = col;
			this.context().ellipse(a.x, a.y, this.vertexRadius,
				this.vertexRadius, 0, 0, Math.PI*2);
			this.context().fill();
			this.context().closePath();

			var fontSize = 20;

			this.context().font = "bold "+fontSize+"px Arial";
			this.context().fillStyle = 'black';
			this.context().strokeStyle = 'white';

			var text = ""+i;
			var s = new Vector(this.context().measureText(text).width, fontSize);
			var p = a.sub(s.divf(2).mul(new Vector(1, -0.5))).add(new Vector(0,1));

			this.context().beginPath();
			this.context().strokeText(text, p.x, p.y);
			this.context().fillText(text, p.x, p.y);
			this.context().closePath();

			this.renderVertexDescription(i, fontSize);
		}
	}

	renderVertexDescription(i: number, fontSize: number) {
		var a = this.vertices[i];

		var desc = this.vertexStackIndicesDescription(i);
		var s = new Vector(this.context().measureText(desc).width, fontSize);
		var p = s.mul(new Vector(-0.5, 1.5));

		if(a.y < 100) {
			p.y -= 4;
		} else {
			p.y = -p.y;
			p.y -= 2;
		}
		p = a.sum(p);
		p.y += fontSize/2;

		this.context().beginPath();
		this.context().strokeText(desc, p.x, p.y);
		this.context().fillText(desc, p.x, p.y);
		this.context().closePath();
	}

	vertexStackIndicesDescription(id: number) {
		if(this.taskType == "VERTEX_SELECTION") {
			var ids = [];
			for(var i=0; i<this.vertexSelectionStack.length; ++i) {
				if(this.vertexSelectionStack[i] == id)
					ids.push(i);
			}
			var desc = "";
			for(var i=0; i<ids.length; ++i) {
				if(desc != "")
					desc += ",";
				desc += ids[i];
			}
			return desc;
		} else if(this.taskType == "VERTEX_COLORING") {
			return "" + this.getVertexColor(id);
		}
		return " ";
	}

	renderEdgeDescription(ida: number, idb: number, fontSize: number) {
		var a = this.vertices[ida].copy();
		var b = this.vertices[idb].copy();

		var mid = a.add(b).mulf(0.5);

		var desc = this.edgeStackIndicesDescription(ida, idb);
		var s = new Vector(this.context().measureText(desc).width, fontSize);
		var p = s.mul(new Vector(-0.5, 1.5));

		if(mid.y < 100) {
			p.y -= 4;
		} else {
			p.y = -p.y;
			p.y -= 2;
		}
		p = mid.sum(p);
		p.y += fontSize/2;

		if(this.weightsMatrix != null) {
			if(desc.length > 0) {
				p.y -= fontSize/2 + 3;
			}
		}

		this.context().beginPath();
		this.context().strokeText(desc, p.x, p.y);
		this.context().fillText(desc, p.x, p.y);
		if(this.weightsMatrix != null) {
			var w = "" + this.weightsMatrix[ida][idb];
			var i = w.lastIndexOf(".");
			w = "(" + w.slice(0, i+3) + ")";


			s = new Vector(this.context().measureText(w).width, fontSize);
			p = s.mul(new Vector(-0.5, 1.5));

			if(mid.y < 100) {
				p.y -= 4;
			} else {
				p.y = -p.y;
				p.y -= 2;
			}
			p = mid.sum(p);
			p.y += fontSize/2;
			if(desc.length > 0) {
				p.y += fontSize/2 + 3;
			}
			this.context().strokeText(w, p.x, p.y);
			this.context().fillText(w, p.x, p.y);
		}
		this.context().closePath();
	}

	edgeStackIndicesDescription(ida: number, idb: number) {
		if(this.taskType == "EDGE_SELECTION") {
			var ids = [];
			for(var i=0; i<this.edgeSelectionStack.length; ++i) {
				if(this.edgeSelectionStack[i][0] == ida) {
					if(this.edgeSelectionStack[i][1] == idb) {
						ids.push(i);
					}
				}
			}
			var desc = "";
			for(var i=0; i<ids.length; ++i) {
				if(desc != "")
					desc += ",";
				desc += ids[i];
			}
			return desc;
		} else if(this.taskType == "EDGE_COLORING") {
			return "" + this.getEdgeColor(ida, idb);
		}
		return " ";
	}
}

