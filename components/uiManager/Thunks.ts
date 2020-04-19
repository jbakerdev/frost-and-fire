import { dispatch } from '../../App'
import { UIReducerActions } from '../../enum'

export const onInitSession = () => {
    dispatch({ type: UIReducerActions.NEW_SESSION })
}

export const onStartWave = () => {
    dispatch({ type: UIReducerActions.START_WAVE })
}

export const onSetWaveInactive = () => {
    dispatch({ type: UIReducerActions.WAVE_SENT })
}

export const onUpdateHour = (hour:number) => {
    dispatch({ type: UIReducerActions.SET_HOUR, hour })
}

export const onToggleAimLaser = () => {
    dispatch({ type: UIReducerActions.AIM_LASER })
}

export const onToggleAimCryo = () => {
    dispatch({ type: UIReducerActions.AIM_CRYO })
}

export const onStartPlaceDrone = () => {
    dispatch({ type: UIReducerActions.START_PLACE_DRONE })
}

export const onCancelToggle = () => {
    dispatch({ type: UIReducerActions.CANCEL })
}

export const onUseReactor = () => {
    dispatch({ type: UIReducerActions.USE_REACTOR })
}

export const onPlaceDrone = () => {
    dispatch({ type: UIReducerActions.PLACE_DRONE })
}

export const onChargeReactor = () => {
    dispatch({ type: UIReducerActions.CHARGE_REACTOR })
}

export const onSavedColonist = () => {
    dispatch({ type: UIReducerActions.SAVE_COLONIST })
}

export const onLostColonist = () => {
    dispatch({ type: UIReducerActions.COLONIST_LOST })
}

export const onNoCharges = () => {
    dispatch({ type: UIReducerActions.NO_CHARGE })
}

export const onHideModal = () => {
    dispatch({ type: UIReducerActions.HIDE_MODAL })
}