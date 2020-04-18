import { Scene, GameObjects, Tilemaps, Geom, Physics } from "phaser";
import { store } from "../../App";
import { defaults, TileIndexes, PassableIndexes } from '../../assets/Assets'
import { _getCircle } from "../helpers/Fov";
import ColonistSprite from "./ColonistSprite";
import AStar from "../helpers/AStar";
import { onSetWaveInactive } from "../uiManager/Thunks";
import { UIReducerActions } from "../../enum";

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
        this.physics.add.collider(this.colonistSprites, terrain)
        let doodads = this.map.createStaticLayer('doodads', tileset)
        this.physics.add.collider(this.colonistSprites, doodads, this.colonistHitFeature)
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
    }

    colonistHitFeature = (colonistSprite:any, tile:any) => {
        if(tile.index === TileIndexes.exit){
            console.log('yay')
            this.colonistSprites = this.colonistSprites.filter(spr=>spr.id !== colonistSprite.id)
            colonistSprite.destroy()
            //onColonistEscaped
        }
    }

    getPathArray = (origin:Tuple) => {
        const myCenter = this.map.worldToTileXY(origin.x, origin.y)                                              
        return new AStar(this.levelExit.x, this.levelExit.y, (tileX:number, tileY:number)=>{ if(this.tileData[tileX] && this.tileData[tileX][tileY]) return !this.tileData[tileX][tileY].collides; else return false }).compute(myCenter.x, myCenter.y)
    }
    
    spawnColonist = () => {
        this.colonistSprites.push(new ColonistSprite(this, this.map.tileToWorldX(this.levelEntrance.x)+16, this.map.tileToWorldY(this.levelEntrance.y)+8, 'tiles', TileIndexes.colonist))
    }

    setSelectIconPosition(tile:Tuple){
        if(!this.selectIcon){
            this.selectIcon = this.add.image(tile.x, tile.y, 'selected').setDepth(2).setScale(0.5)
            this.add.tween({
                targets: this.selectIcon,
                scale: 1,
                duration: 1000,
                repeat: -1,
                yoyo: true
            })
        }
        else if(this.selectIcon.x !== tile.x || this.selectIcon.y !== tile.y) 
            this.selectIcon.setPosition(tile.x, tile.y)
        
        this.selectIcon.setVisible(true)
    }

    update(time, delta){
        // this.controls.update(delta)
    }
}