import { Scene, GameObjects, Tilemaps, Geom, Physics, Sound } from "phaser";
import { store } from "../../App";
import { defaults, TileIndexes, PassableIndexes, DebrisShapes } from '../../assets/Assets'
import ColonistSprite from "./ColonistSprite";
import AStar from "../helpers/AStar";
import { onSetWaveInactive, onUpdateHour, onCancelToggle, onUseReactor, onSavedColonist, onLostColonist, onPlaceDrone, onChargeReactor, onStartWave, onShowModal, onUpdateWaveTime } from "../uiManager/Thunks";
import { UIReducerActions, NIGHTFALL, DAYBREAK, WAVE_SIZE, Modal, GOAL_CREW } from "../../enum";
import { isFrostTile } from "../helpers/Util";
import DroneSprite from "./DroneSprite";

interface Sounds {
    alarm: Sound.BaseSound
    cryo: Sound.BaseSound
    drone: Sound.BaseSound
    heal: Sound.BaseSound
    laser: Sound.BaseSound
    rock: Sound.BaseSound
    start: Sound.BaseSound
    wave: Sound.BaseSound
    dead: Sound.BaseSound
    saved: Sound.BaseSound
}

export default class WorldScene extends Scene {

    unsubscribeRedux: Function
    selectIcon: GameObjects.Image
    map:Tilemaps.Tilemap
    deaths: GameObjects.Group
    colonistSprites: Array<ColonistSprite>
    droneSprites: Array<DroneSprite>
    levelEntrance: Tuple
    levelExit: Tuple
    tileData: Array<Array<TileInfo>>
    sounds: Sounds
    chooseDronePosition?: DroneSprite

    constructor(config){
        super(config)
        this.unsubscribeRedux = store.subscribe(this.onReduxUpdate)
        this.colonistSprites = []
        this.droneSprites = []
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
                        repeat: WAVE_SIZE,
                    })
                    this.time.addEvent({
                        delay:20000,
                        callback: ()=> {
                            onSetWaveInactive()
                        }
                    })
                    this.sounds.start.play()
                    break
                case UIReducerActions.AIM_CRYO:
                case UIReducerActions.AIM_LASER:
                case UIReducerActions.START_PLACE_DRONE:
                    this.updateSelectedIcon()
                    break
                case UIReducerActions.NO_CHARGE:
                    this.flashSprite(this.input.activePointer.worldX, this.input.activePointer.worldY, 'noenergy')
                    break
                case UIReducerActions.NEW_SESSION:
                    this.colonistSprites.forEach(spr=>spr.destroy())
                    this.colonistSprites.slice(0,this.colonistSprites.length-1)
                    this.startTimers()
                    break
                case UIReducerActions.TOGGLE_AUDIO:
                    if(this.sound.volume === 0) this.sound.volume = 0.6
                    else this.sound.volume = 0
                    break
            }
    }

    create = () =>
    {
        this.sounds = {
            alarm: this.sound.add('alarm'),
            cryo: this.sound.add('cryo'),
            drone: this.sound.add('drone'),
            heal: this.sound.add('heal'),
            laser: this.sound.add('laser'),
            rock: this.sound.add('rock'),
            start: this.sound.add('start'),
            wave: this.sound.add('wave'),
            dead: this.sound.add('dead'),
            saved: this.sound.add('saved')
        }
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

        this.input.on('pointerover', (event, gameObjects) => {
            if(gameObjects[0]) {
                this.updateSelectedIcon(gameObjects[0])
                gameObjects[0].showRange()
            } 
        })
        this.input.on('pointerout', (event, gameObjects) => {
            if(gameObjects[0]) {
                gameObjects[0].hideRange()
                this.selectIcon.setVisible(false)
            } 
        })
        this.input.on('pointermove', (event, gameObjects) => {
            this.updateSelectedIcon(gameObjects[0])
        })
        this.input.on('pointerdown', (event, gameObjects) => {
            let state = store.getState()
            if(state.aimLaser) this.fireLaser(this.selectIcon.getCenter())
            if(state.aimCryo) this.fireCryo(this.selectIcon.getCenter())
            if(state.placingDrone) this.placeDrone(this.selectIcon.getCenter())
            if(this.chooseDronePosition){
                this.chooseDronePosition.move(this.input.activePointer.worldX, this.input.activePointer.worldY)
                this.chooseDronePosition = null
                this.selectIcon.setVisible(false)
            } 
            if(gameObjects[0]){
                if(!this.chooseDronePosition) this.chooseDronePosition = gameObjects[0]
            } 
        })
        this.input.keyboard.on('keydown-ESC', (event) => {
            onCancelToggle()
            this.chooseDronePosition = null
            this.selectIcon.setVisible(false)
        })
        this.anims.create({
            key: 'walk_right',
            frames: this.anims.generateFrameNumbers('colonist', { start: 4, end: 7 }),
            frameRate: 4,
            repeat: -1
        })
        this.anims.create({
            key: 'walk_up',
            frames: this.anims.generateFrameNumbers('colonist', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        })

        onStartWave()
    }

    startTimers = () => {
        this.time.addEvent({
            delay: 10000,
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
        this.time.addEvent({
            delay: 3000,
            callback: ()=>{
                onChargeReactor()
            },
            repeat: -1
        })
        this.time.addEvent({
            delay:1000,
            repeat: -1,
            callback: () => {
                if(store.getState().nextWave === 1) onStartWave()
                onUpdateWaveTime()
                this.map.forEachTile((tile)=>{
                    if(tile.index === TileIndexes.frost.frostTile) return tile.index = TileIndexes.frost.frostTile2
                    if(tile.index === TileIndexes.frost.frostTile2) return tile.index = TileIndexes.frost.frostTile
                    if(tile.index === TileIndexes.fire.fireTile) return tile.index = TileIndexes.fire.fireTile2
                    if(tile.index === TileIndexes.fire.fireTile2) return tile.index = TileIndexes.fire.fireTile
                }, undefined,undefined,undefined,undefined,undefined,undefined,'terrain')
            }
        })
    }

    stopTimers = () => {
        this.time.removeAllEvents()
    }

    updateSelectedIcon = (gameObject?:DroneSprite) => {
        if(gameObject){
            this.setSelectIconPosition({x: gameObject.getCenter().x, y: gameObject.getCenter().y}, 'selected')
            return
        }
        let tile = this.map.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined,'terrain')
        if(tile){
            let state = store.getState()
            if(state.aimLaser)
                this.setSelectIconPosition({x: tile.getCenterX(), y: tile.getCenterY()}, 'laser')
            else if(state.aimCryo)
                this.setSelectIconPosition({x: tile.getCenterX(), y: tile.getCenterY()}, 'cryo')
            else if(state.placingDrone || this.chooseDronePosition)
                this.setSelectIconPosition({x: tile.getCenterX(), y: tile.getCenterY()}, 'drone')
            else this.selectIcon && this.selectIcon.setVisible(false)
        }
    }

    fireLaser = (worldCoords:Tuple) => {
        let target = this.map.getTileAtWorldXY(worldCoords.x, worldCoords.y, true, undefined, 'terrain')
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
        else if(target.index === TileIndexes.frost.frostTile || target.index === TileIndexes.frost.frostTile2) target.index = TileIndexes.frost.passable
        this.sounds.laser.play()
        onUseReactor()
        let exit = this.map.getTileAt(this.levelExit.x, this.levelExit.y, false, 'doodads')
        exit.index = TileIndexes.exit
    }

    fireCryo = (worldCoords:Tuple) => {
        let target = this.map.getTileAtWorldXY(worldCoords.x, worldCoords.y, true, undefined, 'terrain')
        if(target.index === TileIndexes.fire.fireTile || target.index === TileIndexes.fire.fireTile2) 
            target.index = TileIndexes.fire.passable
        else if(target.index === TileIndexes.fire.passable || target.index === TileIndexes.frost.passable) {
            target.index = TileIndexes.frost.impassible
            target.setCollision(true)
            this.tileData[target.x][target.y].collides = true
        }
        this.sounds.cryo.play()
        onUseReactor()
    }

    placeDrone = (worldCoords:Tuple) => {
        this.droneSprites.push(new DroneSprite(this, worldCoords.x, worldCoords.y))
        this.sounds.drone.play()
        onPlaceDrone()
    }

    onHourTick = () => {
        let hour = store.getState().hour
        if(hour === NIGHTFALL) this.launchWave(true)
        if(hour === DAYBREAK) this.launchWave(false)
        if(hour === NIGHTFALL-1 || hour === DAYBREAK-1) {
            this.time.addEvent({
                delay: 1000,
                callback: ()=>{
                    this.sounds.alarm.play()
                },
                repeat: 5
            })
            this.flashText(hour === NIGHTFALL-1 ? 'NIGHT IS APPROACHING' : 'DAWN IS APPROACHING', hour === NIGHTFALL-1 ? '#00aaaa' : 'red')
        }
        onUpdateHour((store.getState().hour+1) % 24)
    }

    checkColonists = () => {
        let indexes = []
        this.colonistSprites.forEach((spr,i)=>{
            if(spr.health <= 0) {
                indexes.push(i)
            }
        })
        indexes.forEach(i=>{
            this.destroyColonist(this.colonistSprites[i])
        })
    }

    launchWave = (isFrost:boolean) => {
        let wave = this.add.tileSprite(0,32,64,this.map.heightInPixels*2, 'tiles', isFrost ? TileIndexes.frost.frostWave : TileIndexes.fire.fireWave).setDepth(5)
        let rotator = this.time.addEvent({
            delay:200,
            repeat:-1,
            callback: ()=> {
                wave.tilePositionX-=5
            }
        })
        this.sounds.wave.play({volume:0.3})
        this.tweens.add({
            targets: wave,
            x: this.map.widthInPixels,
            duration: 10000,
            onUpdate: ()=>{
                let rect = wave.getBounds()
                this.map.getTilesWithinShape(rect, undefined, undefined, 'terrain').forEach(tile=>{
                    let doodad = this.map.getTileAt(tile.x,tile.y,false,'doodads')
                    if(isFrost){
                        if(doodad) tile.index = TileIndexes.frost.passable
                        else if(tile.collides) tile.index = TileIndexes.frost.impassible
                        else {
                            if(Phaser.Math.Between(0,1)===0){
                                tile.index = TileIndexes.frost.frostTile
                            } 
                            else tile.index = TileIndexes.frost.passable
                        }
                    }
                    else {
                        if(doodad) tile.index = TileIndexes.fire.passable
                        else if(tile.collides) tile.index = TileIndexes.fire.impassible
                        else {
                            if(Phaser.Math.Between(0,1)===0){
                                tile.index = TileIndexes.fire.fireTile
                            } 
                            else tile.index = TileIndexes.fire.passable
                        }
                    }
                })
                let bodies = this.physics.overlapRect(rect.x, rect.y, rect.width, rect.height)
                for(var i=0;i<bodies.length;i++){
                    let spr = bodies[i].gameObject as ColonistSprite
                    this.destroyColonist(spr)
                }
                if(Phaser.Math.Between(0,30) === 10) this.triggerAvalanche()
            },
            onComplete: () => {
                rotator.remove()
                wave.destroy()
                let exit = this.map.getTileAt(this.levelExit.x, this.levelExit.y, false, 'terrain')
                exit.index = isFrost ? TileIndexes.frost.passable : TileIndexes.fire.passable
                exit.setCollision(false)
                this.tileData[this.levelExit.x][this.levelExit.y].collides = false
            }
        })
    }

    destroyColonist = (spr:ColonistSprite)=> {
        if(spr){
            this.deaths.get(spr.x, spr.y, 'bones')
            this.sounds.dead.play()
            let j = this.colonistSprites.findIndex(cspr=>cspr.id === spr.id)
            onLostColonist()
            this.colonistSprites.splice(j,1)[0].destroy()
            let state = store.getState()
            if(state.colonistsRemaining < GOAL_CREW-state.colonistsSaved){
                this.stopTimers()
                onShowModal(Modal.LOSE)
            } 
        }
    }

    triggerAvalanche = () => {
        let shape = DebrisShapes[Phaser.Math.Between(0,DebrisShapes.length-1)]
        let shapeTilePos = {x: Phaser.Math.Between(0,this.map.width), y: Phaser.Math.Between(0, this.map.height)}
        this.cameras.main.shake(200, 0.001)
        this.sounds.rock.play()
        shape.forEach(offset=>{
            let tile = this.map.getTileAt(shapeTilePos.x+offset.x, shapeTilePos.y+offset.y, false, 'terrain')
            if(tile){
                if(isFrostTile(tile.index)) tile.index = TileIndexes.frost.debris
                else tile.index = TileIndexes.fire.debris
                tile.setCollision(true)
                this.tileData[tile.x][tile.y].collides = true
            }
        })
    }

    colonistHitFeature = (colonistSprite:any, tile:any) => {
        if(tile.index === TileIndexes.exit){
            this.sounds.saved.play()
            let i = this.colonistSprites.findIndex(spr=>spr.id === colonistSprite.id)
            this.colonistSprites.splice(i,1)[0].destroy()
            onSavedColonist()
            let state = store.getState()
            if(state.colonistsSaved >= GOAL_CREW && state.colonistsRemaining <= 0) {
                this.stopTimers()
                onShowModal(Modal.WIN)
            }
        }
    }

    colonistOverTile = (colonistSprite:any, tile:any) => {
        if(tile.index === TileIndexes.frost.frostTile || tile.index === TileIndexes.frost.frostTile2 ||  tile.index === TileIndexes.fire.fireTile || tile.index === TileIndexes.fire.fireTile2){
            colonistSprite.takeDamage()
        }
    }

    getPathArray = (origin:Tuple) => {
        const myCenter = this.map.worldToTileXY(origin.x, origin.y)                                              
        return new AStar(this.levelExit.x, this.levelExit.y, (tileX:number, tileY:number)=>{ if(this.tileData[tileX] && this.tileData[tileX][tileY]) return !this.tileData[tileX][tileY].collides; else return false }).compute(myCenter.x, myCenter.y)
    }
    
    spawnColonist = () => {
        this.colonistSprites.push(new ColonistSprite(this, this.map.tileToWorldX(this.levelEntrance.x)+16, this.map.tileToWorldY(this.levelEntrance.y)+8))
    }

    setSelectIconPosition(tile:Tuple, texture:string){
        if(!this.selectIcon){
            this.selectIcon = this.add.image(tile.x, tile.y, texture).setDepth(2).setScale(0.8)
            this.add.tween({
                targets: this.selectIcon,
                scale: 1.5,
                duration: 1000,
                repeat: -1,
                yoyo: true,
                ease: 'Stepped',
                easeParams:[3]
            })
        }
        else if(this.selectIcon.x !== tile.x || this.selectIcon.y !== tile.y) {
            this.selectIcon.setTexture(texture)
            this.selectIcon.setPosition(tile.x, tile.y)
        }
        this.selectIcon.setVisible(true)
    }

    flashSprite = (x:number, y:number, texture:string) => {
        let spr = this.add.image(x, y, texture).setScale(1.5)
        spr.setDepth(4)
        this.add.tween({
            targets: spr,
            ease: 'Stepped',
            easeParams:[3],
            duration: 1000,
            alpha: 0,
            onComplete: ()=>{
                spr.destroy()
            }
        })
    }

    flashText = (text:string, color:string) => {
        let font = this.add.text(100, this.map.heightInPixels/2, text,  {
            fontFamily: 'Arcology',
            fontSize: '12px',
            color
        })
        font.setStroke('#ffffff', 2);
        font.setDepth(4)
        this.add.tween({
            targets: font,
            ease: 'Stepped',
            easeParams:[4],
            duration: 500,
            alpha: 0,
            yoyo:true,
            repeat: 4,
            onComplete: ()=>{
                font.destroy()
            }
        })
    }

    update(time, delta){
        // this.controls.update(delta)
    }
}