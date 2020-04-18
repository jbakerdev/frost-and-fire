import { Scene, GameObjects, Tilemaps, Geom, Physics } from "phaser";
import { store } from "../../App";
import { defaults, TileIndexes, PassableIndexes, DebrisShapes } from '../../assets/Assets'
import { _getCircle } from "../helpers/Fov";
import ColonistSprite from "./ColonistSprite";
import AStar from "../helpers/AStar";
import { onSetWaveInactive, onUpdateHour, onToggleAimLaser, onToggleAimCryo } from "../uiManager/Thunks";
import { UIReducerActions } from "../../enum";
import { isFrostTile } from "../helpers/Util";

export default class WorldScene extends Scene {

    unsubscribeRedux: Function
    selectIcon: GameObjects.Image
    map:Tilemaps.Tilemap
    deaths: GameObjects.Group
    colonistSprites: Array<ColonistSprite>
    levelEntrance: Tuple
    levelExit: Tuple
    tileData: Array<Array<TileInfo>>

    constructor(config){
        super(config)
        this.unsubscribeRedux = store.subscribe(this.onReduxUpdate)
        this.colonistSprites = []
    }

    preload = () =>
    {
        defaults.forEach(asset=>{
            (this.load[asset.type] as any)(asset.key, asset.resource, asset.data)
        })
        console.log('assets were loaded.')
    }
    
    onReduxUpdate = () => {
        const uiState = store.getState()
        let engineEvent = uiState.engineEvent
        if(engineEvent)
            switch(engineEvent){
                case UIReducerActions.START_WAVE:
                    this.time.addEvent({
                        delay: 2000,
                        callback: () => {
                            this.spawnColonist()
                        },
                        repeat: 10,
                    })
                    this.time.addEvent({
                        delay:20000,
                        callback: ()=> {
                            onSetWaveInactive()
                        }
                    })
                    break
            }
    }

    create = () =>
    {
        this.deaths = this.add.group()
        this.map = this.make.tilemap({ key: 'map'})
        let tileset = this.map.addTilesetImage('tiles', 'tilemap')
        let terrain = this.map.createDynamicLayer('terrain', tileset).setCollisionByExclusion(PassableIndexes)
        this.physics.world.setBounds(0,0,this.map.widthInPixels, this.map.heightInPixels)
        this.physics.world.setBoundsCollision()
        this.physics.add.collider(this.colonistSprites, terrain)
        this.physics.add.overlap(this.colonistSprites, terrain, this.colonistOverTile)
        let doodads = this.map.createStaticLayer('doodads', tileset)
        this.physics.add.overlap(this.colonistSprites, doodads, this.colonistHitFeature)
        doodads.forEachTile(t=>{
            if(t.index === TileIndexes.entrance) this.levelEntrance = { x: t.x, y: t.y }
            if(t.index === TileIndexes.exit) this.levelExit = { x: t.x, y: t.y }
        })
        this.tileData = [[]]
        terrain.forEachTile((tile) => { 
            if(!this.tileData[tile.x]) this.tileData[tile.x] = []
            this.tileData[tile.x][tile.y]={
                x:tile.x, y:tile.y,
                collides: tile.collides,
                transparent: PassableIndexes.findIndex(i=>i===tile.index)!==-1,
            }
        })
        this.cameras.main.setZoom(2)
        this.cameras.main.centerOn(this.map.widthInPixels/2, this.map.heightInPixels/2)

        this.input.on('pointermove', (event) => {
            let tile = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined,'terrain')
            if(tile){
                let state = store.getState()
                if(state.aimLaser)
                    this.setSelectIconPosition({x: tile.getCenterX(), y: tile.getCenterY()}, 'laser')
                else if(state.aimCryo)
                    this.setSelectIconPosition({x: tile.getCenterX(), y: tile.getCenterY()}, 'cryo')
                else if(this.selectIcon) this.selectIcon.setVisible(false)
            }
        })
        this.input.on('pointerdown', (event, gameObjects) => {
            let state = store.getState()
            if(state.aimLaser) this.fireLaser(this.selectIcon.getCenter())
            if(state.aimCryo) this.fireCryo(this.selectIcon.getCenter())
        })

        this.time.addEvent({
            delay: 3000,
            callback: () => {
                this.onHourTick()
            },
            repeat: -1
        })
        this.time.addEvent({
            delay:500,
            callback: ()=>{
                this.checkColonists()
            },
            repeat:-1
        })
    }

    fireLaser = (worldCoords:Tuple) => {
        let target = this.map.getTileAtWorldXY(worldCoords.x, worldCoords.y, true, undefined, 'terrain')
        this.cameras.main.flash(200,200,0,0)
        if(target.index === TileIndexes.frost.impassible || target.index === TileIndexes.frost.debris){
            target.index = TileIndexes.frost.passable
            target.setCollision(false)
            this.tileData[target.x][target.y].collides = false
        } 
        else if(target.index === TileIndexes.fire.impassible || target.index === TileIndexes.fire.debris){
            target.index = TileIndexes.fire.passable
            target.setCollision(false)
            this.tileData[target.x][target.y].collides = false
        } 
        else if(target.index === TileIndexes.frost.frostTile) target.index = TileIndexes.frost.passable
        onToggleAimLaser()
    }

    fireCryo = (worldCoords:Tuple) => {
        let target = this.map.getTileAtWorldXY(worldCoords.x, worldCoords.y, true, undefined, 'terrain')
        this.cameras.main.flash(200,0,0,200)
        if(target.index === TileIndexes.fire.fireTile) 
            target.index = TileIndexes.fire.passable
        else if(target.index === TileIndexes.fire.passable || target.index === TileIndexes.frost.passable) {
            target.index = TileIndexes.frost.impassible
            target.setCollision(true)
            this.tileData[target.x][target.y].collides = true
        }
        onToggleAimCryo()
    }

    onHourTick = () => {
        let hour = store.getState().hour
        if(hour === 20) this.launchWave(true)
        if(hour === 6) this.launchWave(false)
        onUpdateHour((store.getState().hour+1) % 24)
    }

    checkColonists = () => {
        let indexes = []
        this.colonistSprites.forEach((spr,i)=>{
            if(spr.health <= 0) {
                this.deaths.get(spr.x, spr.y, 'bones')
                spr.destroy()
                indexes.push(i)
            }
        })
        indexes.forEach(i=>this.colonistSprites.splice(i,1))
    }

    launchWave = (isFrost:boolean) => {
        let wave = this.add.tileSprite(0,32,32,this.map.heightInPixels*2, 'tiles', isFrost ? TileIndexes.frost.frostWave : TileIndexes.fire.fireWave).setDepth(2)
        let rotator = this.time.addEvent({
            delay:200,
            repeat:-1,
            callback: ()=> {
                wave.tilePositionX-=5
            }
        })
        this.tweens.add({
            targets: wave,
            x: this.map.widthInPixels,
            duration: 10000,
            onUpdate: ()=>{
                let rect = wave.getBounds()
                this.map.getTilesWithinShape(rect, undefined, undefined, 'terrain').forEach(tile=>{
                    if(isFrost){
                        if(tile.collides) tile.index = TileIndexes.frost.impassible
                        else tile.index = TileIndexes.frost.passable
                    }
                    else {
                        if(tile.collides) tile.index = TileIndexes.fire.impassible
                        else tile.index = TileIndexes.fire.passable
                    }
                })
                let bodies = this.physics.overlapRect(rect.x, rect.y, rect.width, rect.height)
                for(var i=0;i<bodies.length;i++){
                    let spr = bodies[i].gameObject as ColonistSprite
                    this.deaths.get(spr.x, spr.y, 'bones')
                    spr.destroy()
                }
                if(Phaser.Math.Between(0,10) === 10) this.triggerAvalanche()
            },
            onComplete: () => {
                rotator.remove()
                wave.destroy()
            }
        })
    }

    triggerAvalanche = () => {
        let shape = DebrisShapes[Phaser.Math.Between(0,DebrisShapes.length-1)]
        let shapeTilePos = {x: Phaser.Math.Between(0,this.map.width), y: Phaser.Math.Between(0, this.map.height)}
        this.cameras.main.shake(200, 0.001)
        shape.forEach(offset=>{
            let tile = this.map.getTileAt(shapeTilePos.x+offset.x, shapeTilePos.y+offset.y, false, 'terrain')
            if(tile){
                if(Phaser.Math.Between(0,1)===1){
                    if(isFrostTile(tile.index)) tile.index = TileIndexes.frost.debris
                    else tile.index = TileIndexes.fire.debris
                    tile.setCollision(true)
                    this.tileData[tile.x][tile.y].collides = true
                }
                else {
                    if(isFrostTile(tile.index)) tile.index = TileIndexes.frost.frostTile
                    else tile.index = TileIndexes.fire.fireTile
                    tile.setCollision(false)
                    this.tileData[tile.x][tile.y].collides = false
                }
            }
        })
    }

    colonistHitFeature = (colonistSprite:any, tile:any) => {
        if(tile.index === TileIndexes.exit){
            console.log('yay')
            let i = this.colonistSprites.findIndex(spr=>spr.id === colonistSprite.id)
            this.colonistSprites.splice(i,1)
            colonistSprite.destroy()
            //onColonistEscaped
        }
    }

    colonistOverTile = (colonistSprite:any, tile:any) => {
        if(tile.index === TileIndexes.frost.frostTile || tile.index === TileIndexes.fire.fireTile){
            colonistSprite.takeDamage()
        }
    }

    getPathArray = (origin:Tuple) => {
        const myCenter = this.map.worldToTileXY(origin.x, origin.y)                                              
        return new AStar(this.levelExit.x, this.levelExit.y, (tileX:number, tileY:number)=>{ if(this.tileData[tileX] && this.tileData[tileX][tileY]) return !this.tileData[tileX][tileY].collides; else return false }).compute(myCenter.x, myCenter.y)
    }
    
    spawnColonist = () => {
        this.colonistSprites.push(new ColonistSprite(this, this.map.tileToWorldX(this.levelEntrance.x)+16, this.map.tileToWorldY(this.levelEntrance.y)+8, 'tiles', TileIndexes.colonist))
    }

    setSelectIconPosition(tile:Tuple, texture:string){
        if(!this.selectIcon){
            this.selectIcon = this.add.image(tile.x, tile.y, texture).setDepth(2).setScale(0.5)
            this.add.tween({
                targets: this.selectIcon,
                scale: 1,
                duration: 1000,
                repeat: -1,
                yoyo: true
            })
        }
        else if(this.selectIcon.x !== tile.x || this.selectIcon.y !== tile.y) {
            this.selectIcon.setTexture(texture)
            this.selectIcon.setPosition(tile.x, tile.y)
        }
        this.selectIcon.setVisible(true)
    }

    update(time, delta){
        // this.controls.update(delta)
    }
}