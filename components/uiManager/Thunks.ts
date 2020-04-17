import { dispatch, store } from '../../App'
import { UIReducerActions, Modal } from '../../enum'

export const onInitSession = () => {
    dispatch({ type: UIReducerActions.NEW_SESSION })
}