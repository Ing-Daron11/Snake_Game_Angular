import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true
})
export class AppComponent implements AfterViewInit {
  score: number = 0;
  isPaused: boolean = false;
  gameSpeed: number = 250;
  id: any; // ID del setInterval

  @ViewChild("screen", { static: false })
  canvas!: ElementRef;
  ctx!: CanvasRenderingContext2D;

  snake = [
    { x: 20 * 4, y: 0 },
    { x: 20 * 3, y: 0 },
    { x: 20 * 2, y: 0 },
    { x: 20, y: 0 },
    { x: 0, y: 0 }
  ];

  xVelocity: number = 20;
  yVelocity: number = 0;
  foodX!: number;
  foodY!: number;
  gameOver: boolean = false;

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    if (!this.ctx) {
      console.error("No se pudo obtener el contexto del canvas");
      return;
    }

    window.addEventListener("keydown", this.changeDirection.bind(this));
    this.createFood();
    this.id = setInterval(() => this.gameLoop(), this.gameSpeed);
  }

  checkGameOver() {
    if (this.snake[0].x < 0 || this.snake[0].x >= 280 || this.snake[0].y < 0 || this.snake[0].y >= 140) {
      this.gameOver = true;
    }
    for (let i = 1; i < this.snake.length; i++) {
      if (this.snake[i].x == this.snake[0].x && this.snake[i].y == this.snake[0].y) {
        this.gameOver = true;
      }
    }
  }

  createFood() {
    do {
      this.foodX = Math.floor((Math.random() * 13) + 1) * 20;
      this.foodY = Math.floor((Math.random() * 13) + 1) * 10;
    } while (this.snake.some(part => part.x === this.foodX && part.y === this.foodY));
  }

  drawFood() {
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(this.foodX, this.foodY, 20, 10);
  }

  moveSnake() {
    if (this.gameOver || this.isPaused) return;

    const head = { x: this.snake[0].x + this.xVelocity, y: this.snake[0].y + this.yVelocity };
    this.snake.unshift(head);

    if (this.snake[0].x === this.foodX && this.snake[0].y === this.foodY) {
      this.score++;
      if (this.score % 5 === 0) {
        this.gameSpeed = Math.max(100, this.gameSpeed - 50);
        clearInterval(this.id);
        this.id = setInterval(() => this.gameLoop(), this.gameSpeed);
      }
      this.createFood();
    } else {
      this.snake.pop();
    }
  }

  drawSnake() {
    this.ctx.fillStyle = 'black';
    this.snake.forEach(part => this.ctx.fillRect(part.x, part.y, 20, 10));
  }

  changeDirection(event: KeyboardEvent) {
    const { keyCode } = event;
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40, PAUSE = 80;
    const goingUp = (this.yVelocity == -10);
    const goingDown = (this.yVelocity == 10);
    const goingRight = (this.xVelocity == 20);
    const goingLeft = (this.xVelocity == -20);

    if (keyCode === LEFT && !goingRight) {
      this.xVelocity = -20; this.yVelocity = 0;
    } else if (keyCode === UP && !goingDown) {
      this.xVelocity = 0; this.yVelocity = -10;
    } else if (keyCode === RIGHT && !goingLeft) {
      this.xVelocity = 20; this.yVelocity = 0;
    } else if (keyCode === DOWN && !goingUp) {
      this.xVelocity = 0; this.yVelocity = 10;
    } else if (keyCode === PAUSE) {
      this.isPaused = !this.isPaused;
    }
  }

  gameLoop() {
    if (!this.ctx) return;

    if (!this.gameOver) {
      this.checkGameOver();
      this.ctx.fillStyle = 'lightgray';
      this.ctx.fillRect(0, 0, 400, 400);
      this.drawFood();
      this.moveSnake();
      this.drawSnake();
    } else {
      clearInterval(this.id);
      setTimeout(() => {
        if (confirm("Game Over! ¿Quieres jugar de nuevo?")) {
          location.reload();
        }
      }, 100);
    }
  }
}
