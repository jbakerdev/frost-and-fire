import { UIReducerActions, Modal, WAVE_SIZE } from '../../enum'
import { isNumber, isBoolean } from 'util';

const appReducer = (state = getInitialState(), action:any):RState => {
    state.engineEvent = null
    switch (action.type) {
        case UIReducerActions.NEW_SESSION:
            return getInitialState()
        case UIReducerActions.START_WAVE:
            return { ...state, activeWave: true, engineEvent: UIReducerActions.START_WAVE, colonistsRemaining: state.colonistsRemaining-WAVE_SIZE }
        case UIReducerActions.WAVE_SENT:
            return { ...state, activeWave: false}
        case UIReducerActions.SET_HOUR:
            return { ...state, hour: action.hour }
        case UIReducerActions.AIM_CRYO:
            return { ...state, aimCryo: !state.aimCryo, engineEvent: UIReducerActions.AIM_CRYO }
        case UIReducerActions.AIM_LASER:
            return { ...state, aimLaser: !state.aimLaser, engineEvent: UIReducerActions.AIM_LASER}
        case UIReducerActions.CANCEL:
            return { ...state, aimCryo:false, aimLaser: false, placingDrone: false}
        case UIReducerActions.USE_REACTOR:
            return { ...state, aimCryo:false, aimLaser: false, placingDrone: false, reactorCharges: state.reactorCharges-1}
        case UIReducerActions.CHARGE_REACTOR:
            return { ...state, reactorCharges: Math.min(state.maxReactorCharges, state.reactorCharges+1)}
        case UIReducerActions.SAVE_COLONIST:
            return { ...state, colonistsRemaining: state.colonistsRemaining-1, colonistsSaved: state.colonistsSaved+1, crew: state.crew+1 }
        case UIReducerActions.COLONIST_LOST:
            return { ...state, colonistsRemaining: state.colonistsRemaining-1}
        case UIReducerActions.START_PLACE_DRONE:
            return { ...state, placingDrone: true}
        case UIReducerActions.PLACE_DRONE:
            return { ...state, placingDrone: false, crew: state.crew-3}
        case UIReducerActions.NO_CHARGE:
            return { ...state, engineEvent: UIReducerActions.NO_CHARGE }
        default:
            return state
    }
};

export default appReducer;

const getInitialState = ():RState => {
    return {
        modal: null,
        activeWave: false,
        engineEvent: null,
        hour: 18,
        aimLaser: false,
        aimCryo: false,
        placingDrone: false,
        reactorCharges: 6,
        maxReactorCharges: 6,
        colonistsRemaining: 100,
        colonistsSaved: 2,
        crew: 2
    }
}