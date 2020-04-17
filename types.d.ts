declare enum UIReducerActions { 
    NEW_SESSION='newsesh'
}

declare enum Modal {
    HELP='halp'
}

interface Asset {
    key: string
    type: string
    resource: any
    data?: any
}

interface Tuple {
    x: number
    y: number
}

interface TileInfo {
    x:number
    y:number
    collides: boolean
    transparent: boolean
}

interface RState {
    modal: Modal
    engineEvent: UIReducerActions
}