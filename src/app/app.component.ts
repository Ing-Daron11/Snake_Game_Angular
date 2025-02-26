
import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    score: number = 0;

    @ViewChild("screen", { static: false })
    canvas!: ElementRef;

    ngAfterViewInit() {
        let ctx = this.canvas.nativeElement.getContext('2d');

        let gameOver: boolean = false;

        let snake = [
            { x: 20 * 4, y: 0 },
            { x: 20 * 3, y: 0 },
            { x: 20 * 2, y: 0 },
            { x: 20, y: 0 },
            { x: 0, y: 0 }
        ];

        let xVelocity: number = 20;
        let yVelocity: number = 0;

        let foodX: number;
        let foodY: number;

        function checkGameOver() {
            if (snake[0].x < 0) {
                gameOver = true;
            }
            else if (snake[0].x >= 280) {
                gameOver = true;
            }
            else if (snake[0].y < 0) {
                gameOver = true;
            }
            else if (snake[0].y >= 140) {
                gameOver = true;
            }
            for (let i = 1; i < snake.length; i += 1) {
                if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
                    gameOver = true;
                }
            }
        };

        function createFood() {
            do {
                foodX = Math.floor((Math.random() * 13) + 1) * 20;
                foodY = Math.floor((Math.random() * 13) + 1) * 10;
            }
            while (snake.includes({ x: foodX, y: foodY }))
        };

        function drawFood() {
            ctx.fillStyle = 'red';
            ctx.fillRect(foodX, foodY, 20, 10);
        };

        function moveSnake() {
            const head = {
                x: snake[0].x + xVelocity,
                y: snake[0].y + yVelocity
            };
            snake.unshift(head);
        }

        function drawSnake() {
            ctx.fillStyle = 'black';
            snake.forEach(snakePart => {
                ctx.fillRect(snakePart.x, snakePart.y, 20, 10);
            })
        };

        function changeDirection(event: any) {
            const keyPressed = event.keyCode;

            const LEFT = 37;
            const UP = 38;
            const RIGHT = 39;
            const DOWN = 40;

            const goingUp = (yVelocity == -10);
            const goingDown = (yVelocity == 10);
            const goingRight = (xVelocity == 20);
            const goingLeft = (xVelocity == -20);

            if (keyPressed == LEFT && !goingRight) {
                xVelocity = -20;
                yVelocity = 0;
            }
            else if (keyPressed == UP && !goingDown) {
                xVelocity = 0;
                yVelocity = -10;
            }
            else if (keyPressed == RIGHT && !goingLeft) {
                xVelocity = 20;
                yVelocity = 0;
            }
            else if (keyPressed == DOWN && !goingUp) {
                xVelocity = 0;
                yVelocity = 10;
            }
        };
        createFood();
        let id = setInterval(() => {
            if (!gameOver) {
                window.addEventListener("keydown", changeDirection);
                checkGameOver();
                ctx.fillStyle = 'lightgray';
                ctx.fillRect(0, 0, 400, 400);
                drawFood();
                moveSnake();
                drawSnake();
                if (snake[0].x == foodX && snake[0].y == foodY) {
                    this.score++;
                    createFood();
                }
                else {
                    snake.pop();
                }
            }
            else {
                var answer = confirm("Game Over!")
                if (answer) location.reload();
                clearInterval(id)
            }
        }, 250);
    }
}
