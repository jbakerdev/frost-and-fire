import { Scene, GameObjects, Tilemaps, Geom, Physics } from "phaser";
import { store } from "../../App";
import { defaults } from '../../assets/Assets'
import { _getCircle } from "../helpers/Fov";

export default class WorldScene extends Scene {

    unsubscribeRedux: Function

    constructor(config){
        super(config)
        this.unsubscribeRedux = store.subscribe(this.onReduxUpdate)
    }

    preload = () =>
    {
        defaults.forEach(asset=>{
            (this.load[asset.type] as any)(asset.key, asset.resource, asset.data)
        })
        console.log('assets were loaded.')
    }
    
    onReduxUpdate = () => {
        // const uiState = store.getState()
        // let engineEvent = uiState.engineEvent
        //if(engineEvent)
            // switch(engineEvent){
            //     case UIReducerActions.WHATEV:
            //         break
            // }
    }

    create = () =>
    {
        
    }

    update(){

    }
}