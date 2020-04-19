export enum UIReducerActions { 
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
    HIDE_MODAL='hmdl'
}

export enum Modal {
    HELP='halp',
    INTRO='intro',
    LOSE='lose',
    WIN='win'
}

export const NIGHTFALL=20
export const DAYBREAK=6
export const WAVE_SIZE=10