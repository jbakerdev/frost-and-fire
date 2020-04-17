import { UIReducerActions, Modal } from '../../enum'
import { isNumber, isBoolean } from 'util';

const appReducer = (state = getInitialState(), action:any):RState => {
    switch (action.type) {
        case UIReducerActions.NEW_SESSION:
            return getInitialState()
        default:
            return state
    }
};

export default appReducer;

const getInitialState = ():RState => {
    return {
        modal: null,
        engineEvent: null
    }
}