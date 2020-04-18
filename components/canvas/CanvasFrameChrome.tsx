import * as React from 'react';
import AppStyles, { colors } from '../../AppStyles';
import { ButtonStrip, Select, Button, Icon } from '../helpers/Shared'
import { onStartWave } from '../uiManager/Thunks';
import { connect } from 'react-redux';
import CanvasFrame from './CanvasFrame';

interface Props {
    activeWave?:boolean
}

interface State {
    
}

@(connect((state: RState) => ({
    activeWave: state.activeWave
})) as any)
export default class CanvasFrameChrome extends React.Component<Props, State> {

    state = { }

    componentDidMount(){
        //document.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount(){
        //document.removeEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown = (e:KeyboardEvent) => {
        let index = (+e.key)
    }

    render(){
        return (
            <div style={{position:'relative'}}>
                <CanvasFrame />
                <div style={{position:'absolute', bottom:0, left:0}}>
                    {Button(!this.props.activeWave, onStartWave, 'Go')}
                </div>
            </div>
        )
    }
}