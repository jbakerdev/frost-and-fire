import { Physics, Scene } from "phaser"
import { moveTowardXY } from "../helpers/Util";
import WorldScene from "./WorldScene";
import * as v4 from 'uuid'


export default class ColonistSprite extends Physics.Arcade.Sprite {
    
    id:string
    timer: Phaser.Time.TimerEvent
    scene: WorldScene
    speed: number
    health: number
   
    constructor(scene:Scene, x:number, y:number, texture:string, frame:number){
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setDepth(1)
        this.speed = Phaser.Math.Between(25,50)
        this.health = Phaser.Math.Between(5,20)
        this.setScale(this.getScale())
        this.id = v4()
        this.timer = scene.time.addEvent({
            delay: 500,
            callback: () => {
                this.step()
            },
            repeat:-1
        })
    }

    getScale = () => {
        if(this.speed >= 40 && this.health<15) return 0.5
        if(this.speed < 40 && this.health<15) return 0.8
        return 1
    }

    step = () => {
        let path = this.scene.getPathArray({x:this.getCenter().x, y:this.getCenter().y})
        if(path && path[0]){
            const targetTile = this.scene.map.getTileAt(path[0].x, path[0].y, false, 'terrain')
            moveTowardXY(this, targetTile.getCenterX(),targetTile.getCenterY(), this.speed)
        }
    }

    destroy(){
        this.timer.remove()
        super.destroy()
    }
}
