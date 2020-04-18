declare enum UIReducerActions { 
    NEW_SESSION='newsesh',
    START_WAVE='swve',
    WAVE_SENT='wves',
    SET_HOUR='shr'
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
    activeWave: boolean
    hour: number
}