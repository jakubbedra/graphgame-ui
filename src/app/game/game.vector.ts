export class Vector {
	public x: number;
	public y: number;
	
	constructor(X?:number, Y?:number) {
		this.x = X ?? 0;
		this.y = Y ?? 0;
	}
	
	add(o: Vector) : Vector {
		return new Vector(this.x + o.x, this.y*o.y);
	}
}
