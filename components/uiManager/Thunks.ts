import { dispatch, store } from '../../App'
import { UIReducerActions, Modal } from '../../enum'

export const onInitSession = () => {
    dispatch({ type: UIReducerActions.NEW_SESSION })
}

export const onStartWave = () => {
    dispatch({ type: UIReducerActions.START_WAVE })
}

export const onSetWaveInactive = () => {
    dispatch({ type: UIReducerActions.WAVE_SENT })
}