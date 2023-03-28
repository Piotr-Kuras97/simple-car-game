// example js files

import "./sass/main.scss"

class Game{
    constructor(canvas){
        this.road = document.querySelector(".road")
        this.car = document.querySelector("svg")
        this.score = document.querySelector(".points")
        this.gamePanel = document.querySelector(".panel")
        this.playBtn = document.querySelector(".panel__play") 
        this.soundDrive = document.querySelector(".drive-sound") 
        this.soundCrash = document.querySelector(".crash-sound")
        this.bgAnim = document.querySelector(".bg")
        this.soundCrash.volume = 0.1 
        this.points = 0
        this.carLeft = this.car.getBoundingClientRect().left
        this.carTop = this.car.getBoundingClientRect().top
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.width = window.innerWidth
        this.height = this.road.offsetHeight
        this.animateId = 0
        this.flag = true

        this.posY = 0
    }
    
    clearCanvas(){
        this.ctx.fillStyle = "#333333"
        this.ctx.fillRect(0, 0, this.width, this.height)

        this.ctx.strokeStyle = "darkgoldenrod";
        this.ctx.lineWidth = 15;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.width, 0);
        this.ctx.moveTo(0, this.height);
        this.ctx.lineTo(this.width, this.height);
        this.ctx.stroke();
    }
    
    initCanvas(){
        this.canvas.width = this.width
        this.canvas.height = this.height

        this.ctx.fillStyle = "#333333"
        this.ctx.fillRect(0, 0, this.width, this.height)

        this.ctx.strokeStyle = "darkgoldenrod";
        this.ctx.lineWidth = 15;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.width, 0);
        this.ctx.moveTo(0, this.height);
        this.ctx.lineTo(this.width, this.height);
        this.ctx.stroke();
    }

    numbersOfLines(){
        let number = 0
        if (number * 150 < this.width){
            number = Math.floor(this.width / 150) + 1
        }

        return number
    }

    generateLines(num){
        let lines = []
        for (let i = 0; i < num; i++){
            lines.push({
                x: i * 150,
                y: this.height/2 - 12.5,
                color: "white",
                speedX: -5
            })
            
        }
        
        this.lines = lines
    }

    drawLine(item){
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(item.x, item.y, 100, 25);
    }

    drawLines(){
        this.lines.forEach(item =>{
            this.drawLine(item)
        })
    }

    updateLines(){
        this.lines.forEach(lines => {
            lines.x += lines.speedX 
            
            if(lines.x + 100 < 0){
                lines.x = this.width
            }
        })
    }

    generateObstacle(num){
        let obstacles = []

        for (let i = 0; i < num; i++){
            obstacles.push({
                x: i * 1000 + 500,
                y: Math.random() * this.height,
                size: 50,
                color: "gray",
                speedX: -5
            })
        }
       
        this.obstacles = obstacles
    }


    updateObstacles(){
        this.obstacles.forEach(obstacles => {
            obstacles.x += obstacles.speedX
            
            if(obstacles.x + 100 < 0){
                obstacles.x = this.width + (Math.floor(Math.random() * 2)) * 100,
                obstacles.y = Math.random() * this.height
            }
        })
    }

    drawObstacle(obs){
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(obs.x, obs.y, obs.size, obs.size);

        this.ctx.strokeStyle = "red";
		this.ctx.lineWidth = 2;
		this.ctx.strokeRect(obs.x, obs.y, 50, 50);

        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 2;
        const xSize = Math.min(obs.size, 30); 
        const xX = obs.x + (obs.size - xSize) / 2;
        const xY = obs.y + (obs.size - xSize) / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(xX, xY);
        this.ctx.lineTo(xX + xSize, xY + xSize);
        this.ctx.moveTo(xX, xY + xSize);
        this.ctx.lineTo(xX + xSize, xY);
        this.ctx.stroke();
    }

    drawObstacles(){
        this.obstacles.forEach(obs =>{
            this.drawObstacle(obs)
        })
    }

    move(){
        this.carMove = (e) => {
            if(e.code === "ArrowUp"){
                if(this.road.getBoundingClientRect().top > this.car.getBoundingClientRect().top + 25){
                    return
                } else{
                    this.posY = this.posY - 10
                    TweenMax.to(this.car, .05, {y: this.posY})
                }

            }

            if(e.code === "ArrowDown"){
                if(this.car.getBoundingClientRect().top + 70 > window.innerHeight){
                    return
                } else {
                    this.posY = this.posY + 10
                    TweenMax.to(this.car, .05, {y: this.posY})     
                }
            }
        }

        window.addEventListener("keydown", this.carMove)

    }

    fasterMoving(){
        this.fasterId =     setInterval(()=> {
            this.lines.forEach((item) => {
                if(item.speedX === -10){
                    return
                } else {
                item.speedX--
                }
            })

            this.obstacles.forEach((item) => {
                if(item.speedX === -10){
                    return
                } else {
                item.speedX--
                }
            })
        },10000)
    }

    scorePoints(){
        this.intervalId = setInterval(() => {
            this.points = this.points + 10
            this.score.textContent = this.points
            
        }, 1000)
    }

    stopGame(){
        for(let i = 0; i < this.obstacles.length; i++){
            if(Math.floor(this.obstacles[i].x) < Math.floor(this.car.getBoundingClientRect().left + 70) && this.posY + this.obstacles[i].size > Math.floor(this.obstacles[i].y)){

                if(Math.floor(this.obstacles[i].y) - this.posY + this.obstacles[0].size - 90 < 0 && Math.floor(this.obstacles[i].y) - this.posY + this.obstacles[i].size - 90 > -70){
                    console.log(Math.floor(this.obstacles[0].y) - this.posY + this.obstacles[0].size - 90);
                    
                    cancelAnimationFrame(this.animateId)  
                    this.flag = true
                    this.points = 0
                    clearInterval(this.intervalId)
                    clearInterval(this.fasterId)
                    window.removeEventListener("keydown", this.carMove)
                    this.playBtn.textContent = "Try again!"
                    this.gamePanel.style.opacity = 1
                    this.soundDrive.pause()
                    this.soundDrive.currentTime = 0
                    this.soundCrash.play()
                    this.bgAnim.style.animationPlayState = "paused";
                } 
            }
        }
    }

    draw(){
        this.clearCanvas()
        this.drawLines()
        this.updateLines()
        this.drawObstacles()
        this.updateObstacles()
        
        this.animateId = window.requestAnimationFrame(this.draw.bind(this));
        
        // this.stopGame()
        this.stopGame()
    }


    run(){
        this.initCanvas()
        this.generateLines(this.numbersOfLines())
        this.generateObstacle(5)
        this.draw()
        this.move() 
        this.fasterMoving()
        this.scorePoints()

        this.score.textContent = 0

        this.flag = false
    }


}
const play = document.querySelector(".panel__play")
const panel = document.querySelector(".panel")
const song = document.querySelector(".song")
const driveSound = document.querySelector(".drive-sound")
driveSound.volume = .1
const crashSound = document.querySelector(".crash-sound")
const bg = document.querySelector(".bg")

let start = new Game(document.querySelector("canvas"))


play.addEventListener("click", () => {
   if(start.flag){
    start.run()
    panel.style.opacity = 0
    driveSound.play()
    song.play()
    crashSound.pause()
    crashSound.currentTime = 0
    bg.style.animationPlayState = "running";
   } 
})

window.onload = () => {
    const bg = new Game(document.querySelector("canvas"))
    bg.initCanvas()
    bg.generateLines(bg.numbersOfLines())
    bg.drawLines()
}


const volumeOn = document.querySelector(".volume__on")
const volumeOff = document.querySelector(".volume__off")
const allSounds = document.querySelectorAll("audio")

volumeOn.addEventListener("click", () => {
    allSounds.forEach(item => {
        item.muted = true
    })

    volumeOn.style.display = "none"
    volumeOff.style.display = "block"
})

volumeOff.addEventListener("click", () => {
    allSounds.forEach(item => {
        item.muted = false
    })

    volumeOn.style.display = "block"
    volumeOff.style.display = "none"
})

//change car color

const car = document.querySelector(".st1")
const colorSelect = document.getElementById("color-select");

colorSelect.addEventListener("change", (e) => {
    const selectedColor = colorSelect.value;
    car.style.fill = selectedColor
})




