import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { interval, fromEvent } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: true
})
export class AppComponent implements AfterViewInit {
    score: number = 0;

    @ViewChild("screen", { static: false })
    canvas!: ElementRef;

    private gameOver: boolean = false;
    private ctx!: CanvasRenderingContext2D;
    private snake = [
        { x: 20 * 4, y: 0 },
        { x: 20 * 3, y: 0 },
        { x: 20 * 2, y: 0 },
        { x: 20, y: 0 },
        { x: 0, y: 0 }
    ];

    private xVelocity: number = 20;
    private yVelocity: number = 0;

    private foodX!: number;
    private foodY!: number;

    ngAfterViewInit() {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.createFood();
        this.startGameLoop();
        this.listenToKeyEvents();
    }

    private startGameLoop() {
        interval(250).pipe(
            takeWhile(() => !this.gameOver) // Detiene cuando gameOver es true
        ).subscribe(() => {
            this.checkGameOver();
            if (this.gameOver) {
                if (confirm("Game Over!")) location.reload();
            } else {
                this.updateGame();
            }
        });
    }

    private listenToKeyEvents() {
        fromEvent<KeyboardEvent>(window, 'keydown').subscribe(event => this.changeDirection(event));
    }

    private checkGameOver() {
        if (this.snake[0].x < 0 || this.snake[0].x >= 280 ||
            this.snake[0].y < 0 || this.snake[0].y >= 140) {
            this.gameOver = true;
        }
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) {
                this.gameOver = true;
            }
        }
    }

    private createFood() {
        do {
            this.foodX = Math.floor((Math.random() * 13) + 1) * 20;
            this.foodY = Math.floor((Math.random() * 13) + 1) * 10;
        } while (this.snake.some(segment => segment.x === this.foodX && segment.y === this.foodY));
    }

    private drawFood() {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.foodX, this.foodY, 20, 10);
    }

    private moveSnake() {
        const head = {
            x: this.snake[0].x + this.xVelocity,
            y: this.snake[0].y + this.yVelocity
        };
        this.snake.unshift(head);
    }

    private drawSnake() {
        this.ctx.fillStyle = 'black';
        this.snake.forEach(snakePart => {
            this.ctx.fillRect(snakePart.x, snakePart.y, 20, 10);
        });
    }

    private changeDirection(event: KeyboardEvent) {
        const keyPressed = event.keyCode;

        const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
        const goingUp = (this.yVelocity == -10);
        const goingDown = (this.yVelocity == 10);
        const goingRight = (this.xVelocity == 20);
        const goingLeft = (this.xVelocity == -20);

        if (keyPressed == LEFT && !goingRight) {
            this.xVelocity = -20;
            this.yVelocity = 0;
        } else if (keyPressed == UP && !goingDown) {
            this.xVelocity = 0;
            this.yVelocity = -10;
        } else if (keyPressed == RIGHT && !goingLeft) {
            this.xVelocity = 20;
            this.yVelocity = 0;
        } else if (keyPressed == DOWN && !goingUp) {
            this.xVelocity = 0;
            this.yVelocity = 10;
        }
    }

    private updateGame() {
        this.ctx.fillStyle = 'lightgray';
        this.ctx.fillRect(0, 0, 400, 400);
        this.drawFood();
        this.moveSnake();
        this.drawSnake();

        if (this.snake[0].x === this.foodX && this.snake[0].y === this.foodY) {
            this.score++;
            this.createFood();
        } else {
            this.snake.pop();
        }
    }
}
