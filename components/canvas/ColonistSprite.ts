import { Physics, Scene } from "phaser"
import { moveTowardXY, SearchDirs, shuffle } from "../helpers/Util";
import WorldScene from "./WorldScene";
import * as v4 from 'uuid'
import { TileIndexes } from "../../assets/Assets";


export default class ColonistSprite extends Physics.Arcade.Sprite {
    
    id:string
    timer: Phaser.Time.TimerEvent
    scene: WorldScene
    speed: number
    health: number
    invul: boolean
   
    constructor(scene:Scene, x:number, y:number){
        super(scene, x, y, 'tiles', TileIndexes.colonist)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setCollideWorldBounds()
        this.setDepth(1)
        this.speed = Phaser.Math.Between(35,60)
        this.health = Phaser.Math.Between(5,20)
        this.body.setSize(8,8)
        this.body.setOffset(4,8)
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
        if(this.speed < 40 && this.health<15) return 0.7
        return 0.9
    }

    step = () => {
        let path = this.scene.getPathArray({x:this.getCenter().x, y:this.getCenter().y})
        if(path && path[0]){
            const targetTile = this.scene.map.getTileAt(path[0].x, path[0].y, false, 'terrain')
            moveTowardXY(this, targetTile.getCenterX(),targetTile.getCenterY(), this.speed)
        }
        else {
            const myTile = this.scene.map.getTileAtWorldXY(this.x, this.y, true, undefined, 'terrain')
            let targetTile
            shuffle(SearchDirs).forEach(coord=>{
                let tile = this.scene.map.getTileAt(myTile.x+coord.x, myTile.y+coord.y,false,'terrain')
                if(tile && !tile.collides && !targetTile) targetTile = tile
            })
            if(targetTile) moveTowardXY(this, targetTile.getCenterX(),targetTile.getCenterY(), this.speed)
        }
    }

    takeDamage = () => {
        if(!this.invul){
            this.scene.tweens.addCounter({
                from: 255,
                to: 0,
                duration: 700,
                onUpdate: (tween) => {
                    var value = Math.floor(tween.getValue());
                    this.setTintFill(Phaser.Display.Color.GetColor(value, 0, 0));
                },
                onComplete: () => {
                    this.invul = false
                    this.clearTint()
                }
            })
            this.invul = true
            this.health--
            this.setTintFill(0xff0000)
        }
    }

    heal = (amount:number) => {
        this.scene.sounds.heal.play()
        this.health+=amount
        this.setTintFill(0x00ff00)
        this.scene.tweens.addCounter({
            from: 255,
            to: 0,
            duration: 700,
            onUpdate: (tween) => {
                var value = Math.floor(tween.getValue());
                this.setTintFill(Phaser.Display.Color.GetColor(0, value, 0));
            },
            onComplete: () => {
                this.invul = false
                this.clearTint()
            }
        })
    }

    destroy = () => {
        this.timer.remove()
        super.destroy()
    }
}
