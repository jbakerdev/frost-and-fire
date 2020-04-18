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