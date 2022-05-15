export class Vector {
	public x: number;
	public y: number;
	
	constructor(X?:number, Y?:number) {
		if(X)
			this.x = X;
		else this.x;
		if(Y)
			this.y = Y;
		else this.y;
	}
	
	copy() {
		return new Vector(this.x+0, this.y+0);
	}
	
	
	sum(o: Vector) {
		return new Vector(this.x+o.x, this.y+o.y);
	}
	
	diff(o: Vector) {
		return new Vector(this.x-o.x, this.y-o.y);
	}
	
	mul(o: Vector) {
		return new Vector(this.x*o.x, this.y*o.y);
	}
	
	div(o: Vector) {
		return new Vector(this.x/o.x, this.y/o.y);
	}
	
	sumf(o: number) {
		return new Vector(this.x+o, this.y+o);
	}
	
	difff(o: number) {
		return new Vector(this.x-o, this.y-o);
	}
	
	mulf(o: number) {
		return new Vector(this.x*o, this.y*o);
	}
	
	divf(o: number) {
		return new Vector(this.x/o, this.y/o);
	}
	
	len() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}
	
	norm() {
		let len = this.len();
		if(len <= 0.00000001)
			return new Vector();
		return this.divf(len);
	}
	
	dot(o: Vector) {
		return this.x*o.x + this.y*o.y;
	}
}
