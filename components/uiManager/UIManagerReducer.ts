import { UIReducerActions, Modal } from '../../enum'
import { isNumber, isBoolean } from 'util';

const appReducer = (state = getInitialState(), action:any):RState => {
    switch (action.type) {
        case UIReducerActions.NEW_SESSION:
            return getInitialState()
        case UIReducerActions.START_WAVE:
            return { ...state, activeWave: true, engineEvent: UIReducerActions.START_WAVE }
        case UIReducerActions.WAVE_SENT:
            return { ...state, activeWave: false, engineEvent:null}
        case UIReducerActions.SET_HOUR:
            return { ...state, hour: action.hour, engineEvent:null}
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
        hour: 18
    }
}