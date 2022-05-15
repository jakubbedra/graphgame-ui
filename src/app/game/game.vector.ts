export class Vector {
	public x: number;
	public y: number;
	
	constructor(X?:number, Y?:number) {
		if(X)
			this.x = X;
		else this.x = 0.0;
		if(Y)
			this.y = Y;
		else this.y = 0.0;
	}
	
	copy() {
		return new Vector(this.x, this.y);
	}
}
