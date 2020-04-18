import { Physics, Scene, GameObjects, Geom } from "phaser"
import WorldScene from "./WorldScene";
import * as v4 from 'uuid'
import { TileIndexes } from "../../assets/Assets";
import ColonistSprite from "./ColonistSprite";


export default class DroneSprite extends GameObjects.Sprite {
    
    id:string
    timer: Phaser.Time.TimerEvent
    scene: WorldScene
    range: number
    g: GameObjects.Graphics
   
    constructor(scene:Scene, x:number, y:number){
        super(scene, x, y, 'drone')
        scene.add.existing(this)
        this.setDepth(3)
        this.id = v4()
        this.g = scene.add.graphics()
        this.g.lineStyle(3, 0x00ff00, 0.5)
        this.range = 3
        this.timer = scene.time.addEvent({
            delay: 500,
            callback: () => {
                this.step()
            },
            repeat:-1
        })
        scene.tweens.add({
            targets: this,
            duration:1000,
            y: this.y+5,
            yoyo: true,
            repeat:-1
        })
    }

    move = (x:number, y:number) => {
        let dist = Phaser.Math.Distance.Between(x,y,this.x,this.y)
        this.scene.tweens.add({
            targets: this,
            x,y,
            duration: Math.round(dist/50)
        })
    }

    step = () => {
        let center = this.getCenter()
        let target = this.scene.physics.overlapRect(center.x, center.y, 3*16,3*16)[0]
        if(target){
            let colonist = target.gameObject as ColonistSprite
            colonist.heal(1)
            this.g.setPosition(center.x, center.y)
            this.g.strokePoints([
                {x:center.x, y:center.y}, 
                {x:colonist.getCenter().x, y:colonist.getCenter().y}
            ])
            this.scene.time.addEvent({
                delay: 500,
                callback: ()=>{
                    this.g.clear()
                }
            })
        }
    }

    destroy(){
        this.timer.remove()
        super.destroy()
    }
}
