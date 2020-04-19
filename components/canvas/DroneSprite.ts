import { Physics, Scene, GameObjects, Geom } from "phaser"
import WorldScene from "./WorldScene";
import * as v4 from 'uuid'
import ColonistSprite from "./ColonistSprite";


export default class DroneSprite extends GameObjects.Sprite {
    
    id:string
    timer: Phaser.Time.TimerEvent
    scene: WorldScene
    range: Geom.Rectangle
    rangeG: GameObjects.Graphics
    g: GameObjects.Graphics
    floater: Phaser.Tweens.Tween
   
    constructor(scene:Scene, x:number, y:number){
        super(scene, x, y, 'drone')
        scene.add.existing(this)
        this.setDepth(3)
        this.id = v4()
        this.g = scene.add.graphics()
        this.g.lineStyle(1, 0x00ff00, 1)
        this.rangeG = scene.add.graphics()
        this.rangeG.fillStyle(0x00ff00, 0.3)
        this.setInteractive()
        this.g.setDepth(2)
        this.rangeG.setDepth(2)
        this.timer = scene.time.addEvent({
            delay: 500,
            callback: () => {
                this.step()
            },
            repeat:-1
        })
        this.floater = scene.tweens.add({
            targets: this,
            duration:1000,
            y: this.y+5,
            yoyo: true,
            repeat:-1,
            ease:'Stepped',
            easeParams:[3]
        })
    }

    showRange = () => {
        this.range = new Geom.Rectangle(this.getCenter().x-32, this.getCenter().y-32, 64, 64)
        this.rangeG.fillRectShape(this.range)
    }

    hideRange = () => {
        this.rangeG.clear()
    }

    move = (x:number, y:number) => {
        this.scene.sounds.drone.play()
        this.rangeG.clear()
        this.disableInteractive()
        this.scene.tweens.add({
            targets: this,
            x,y,
            duration: 5000,
            onComplete: () => {
                this.floater.remove()
                this.setPosition(x,y)
                this.setInteractive()
                this.floater = this.scene.tweens.add({
                    targets: this,
                    duration:1000,
                    y: this.y+5,
                    yoyo: true,
                    repeat:-1,
                    ease:'Stepped',
                    easeParams:[3]
                })
            }
        })
    }

    step = () => {
        let center = this.getCenter()
        let target = this.scene.physics.overlapRect(this.range.x, this.range.y, this.range.width, this.range.height)[0]
        if(target){
            let colonist = target.gameObject as ColonistSprite
            colonist.heal(3)
            this.g.strokeLineShape(new Geom.Line(center.x, center.y, colonist.getCenter().x, colonist.getCenter().y))
            this.scene.time.addEvent({
                delay: 75,
                callback: ()=>{
                    this.g.clear()
                },
                repeat:1
            })
        }
    }

    destroy(){
        this.timer.remove()
        super.destroy()
    }
}
