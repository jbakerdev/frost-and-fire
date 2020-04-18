declare enum UIReducerActions { 
    NEW_SESSION='newsesh',
    START_WAVE='swve',
    WAVE_SENT='wves',
    SET_HOUR='shr',
    AIM_CRYO='aim_c',
    AIM_LASER='aim_l',
    CANCEL='cans',
    USE_REACTOR='ureact',
    CHARGE_REACTOR='chrege',
    SAVE_COLONIST='saved',
    COLONIST_LOST='lost',
    START_PLACE_DRONE='place',
    PLACE_DRONE='pld',
    NO_CHARGE='nchrg'
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
    aimLaser: boolean
    aimCryo: boolean
    placingDrone: boolean
    reactorCharges: number
    maxReactorCharges: number
    colonistsRemaining: number
    colonistsSaved: number
    crew: number
}