document.addEventListener('DOMContentLoaded', tasksOnLoad);

function tasksOnLoad() {
	let canvas = document.getElementById('arena_canvas')
	canvas.width = 1000
	canvas.height = 1000
	let arena = new Arena(canvas,40)
	arena.display()
}

class Arena {
	constructor(canvas, width=10, height=0) {
		this.canvas = canvas
		this.context = canvas.getContext('2d')
		this.width = width
		this.height = height ? height : width
		this.area = this.width * this.height
		this.ROOT3 = Math.sqrt(3)
		this.minimumVisiblePath = 12
		this.minimumScale = Math.min(
			this.canvas.width / (this.ROOT3 * this.width),
			this.canvas.height / (1.5 * this.height)
		)
		this.maximumScale = Math.min(
			this.canvas.width / (this.minimumVisiblePath * this.ROOT3),
			this.canvas.height / (this.minimumVisiblePath * 1.5)
		)
		this.maximumScale = 10
		this.scale = 50
		this.arenaColors = [
			'#FFFFFF',
			'#F0E442',
			'#CC79A7',
			'#56B4E9',
			'#D55E00',
			'#009E73',
			'#0072B2',
			'#000000'
		]
		this.wrapOffsets = [
			{u:0, v:0},
			{u:0, v:-this.height},
			{u:0, v:this.height},
			{u:-this.width, v:0},
			{u:this.width, v:0},
			{u:-this.width, v:-this.height},
			{u:-this.width, v:this.height},
			{u:this.width, v:-this.height},
			{u:this.width, v:this.height}
		]
		this.hexVertices = []
		for (let vertex = 0; vertex < 6; vertex++) {
			let angle = vertex/3 * Math.PI
			this.hexVertices[vertex] = {
				x: Math.sin(angle),
				y: Math.cos(angle)
			}
		}
		this.cells = [width * height]
		this.randomFill()
	}

	random() {
		return Math.random()
	}

	randomFill() {
		for (let i = 0; i < this.area; i++) {
			this.cells[i] = Math.floor(this.random() * 8)
		}
	}

	display() {
		for (let i = 0; i < this.area; i++) {
			for (let k = 0; k < this.wrapOffsets.length; k++) {
				let offset = this.wrapOffsets[k]
				let u = i % this.width + offset.u
				let v = Math.floor(i / this.width) + offset.v
				let x = (u + v * 0.5) * this.ROOT3 * this.scale
				let y = v * 1.5 * this.scale
				this.drawHexagon(x, y, this.cells[i])
			}
		}
	}

	drawHexagon(x, y, color) {
		this.context.fillStyle = this.arenaColors[color]
		this.context.beginPath()
		this.context.moveTo(
			x + this.hexVertices[0].x * this.scale,
			y + this.hexVertices[0].y * this.scale
		)
		for (let i=1; i < 6; i++) {
			this.context.lineTo(
				x + this.hexVertices[i].x * this.scale,
				y + this.hexVertices[i].y * this.scale
			)
		}
		this.context.fill()
	}
}
