export class Vector {
	public x: number = 0;
	public y: number = 0;
	
	constructor(X?:number, Y?:number) {
		if(X)
			this.x = X+0;
		else this.x;
		if(Y)
			this.y = Y+0;
		else this.y;
	}
	
	dist(o: Vector) {
		return this.diff(o).len();
	}
	
	equal(o: Vector) {
		return this.diff(o).len2() <= 0.0000001;
	}
	
	copy() {
		return new Vector(this.x+0, this.y+0);
	}
	
	
	add(o: Vector) { return this.sum(o); }
	sum(o: Vector) {
		return new Vector(this.x+o.x, this.y+o.y);
	}
	
	sub(o: Vector) { return this.diff(o); }
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
	
	len2() {
		return this.x*this.x + this.y*this.y;
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
