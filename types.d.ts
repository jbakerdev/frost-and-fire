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
    NO_CHARGE='nchrg',
    HIDE_MODAL='hmdl',
    TOGGLE_AUDIO='tglau',
    SHOW_MODAL='shmdl',
    INC_WAVE='incw'
}

declare enum Modal {
    HELP='halp',
    INTRO='intro',
    LOSE='lose',
    WIN='win'
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
    nextWave: number
}