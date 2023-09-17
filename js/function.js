const canvas = $('#tela_game')[0];
const ctx = canvas.getContext('2d');
const score = $(".score--value")
const finalScore = $("#spanS")
const menu = $(".menu-screen")
const buttonPlay = $(".btn-play")

const size = 20;
const positionInicial = {x : 200, y: 200}

let snake = [positionInicial]



const randomNumber = (max, min) => {
    return Math.round(Math.random() * (max - min) + min);
}


const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)

    return Math.round(number / 20) * 20
}

const food ={
    x: randomPosition(),
    y: randomPosition(),
    color: "yellow"
}

let direction, loopId;



const incrementScore = () => {
    textoScore = +score.text()
    score.text(textoScore + 10)
}

//função responsável pelo desenho aleatorio da comida 
const drawFood = () => {

    
    ctx.shadowColor = food.color
    ctx.shadowBlur = 6;
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y,size,size);
    ctx.shadowBlur = 0
}

// função responsavel pelo desenho da cobrinha 
const drawSnake = () => {
    ctx.fillStyle = 'white';
    snake.forEach((e, index) => {

        if(index == snake.length - 1){
            ctx.fillStyle = '#808080';
        }

        ctx.fillRect(e.x, e.y, size, size)
    })
    
}

//funcção responsável pelo movimento da cobra 
const moveSnake = () =>{
    if(!direction) return
    
    const head = snake[snake.length -1]


    if(direction == "right"){
        snake.push({x: head.x + size, y: head.y})
    }
    if(direction == "left"){
        snake.push({x: head.x - size, y: head.y})
    }
    if(direction == "down"){
        snake.push({x: head.x, y: head.y + size})
    }
    if(direction == "up"){
        snake.push({x: head.x, y: head.y - size})
    }

    snake.shift()
}

const checkEat = () => {
    const head = snake[snake.length -1]

    if(head.x == food.x && head.y == food.y){
        incrementScore()
        snake.push(head);
        let x, y
        do{
            x = randomPosition();
            y = randomPosition();
        }while(snake.find((position) => position.x == x && position.y == y))

        food.x = x;
        food.y = y
        
    }

    
}

const checkColisao = () => {
    const head = snake[snake.length -1];
    const pescoço = snake.length - 2
    const colisaoParede = head.x < 0 || head.x > canvas.width - size || head.y < 0 || head.y > canvas.height - size

    const selfColisao = snake.find((position, index) => {
        return index < pescoço && position.x == head.x && position.y == head.y
    })
    if (colisaoParede || selfColisao){
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined;

    menu.css("display", "flex")
    canvas.style.filter = "blur(4px)"
}

//faz um loop para que a cobra sempre siga para uma direção 
const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 400, 400);

    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkColisao()
    

    loopId = setTimeout(()=>{
        gameLoop()
    },100)
}

gameLoop()


$(document).on("keydown", function({key}){
    if(key == "ArrowRight" && direction != "left"){
        direction = "right";
    }
    if(key == "ArrowLeft" && direction != "right"){
        direction = "left";
    }
    if(key == "ArrowDown" && direction != "up"){
        direction = "down";
    }
    if(key == "ArrowUp" && direction != 'down'){
        direction = "up";
    }
})


buttonPlay.on("click", function(){
    score.text("00");
    menu.css("display", "none");
    canvas.style.filter = "none"

    snake = [positionInicial]
})