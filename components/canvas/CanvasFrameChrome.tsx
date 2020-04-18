import * as React from 'react';
import AppStyles, { colors } from '../../AppStyles';
import { ButtonStrip, Select, Button, Icon } from '../helpers/Shared'
import { onStartWave } from '../uiManager/Thunks';
import { connect } from 'react-redux';
import CanvasFrame from './CanvasFrame';
import { Icons } from '../../assets/Assets';

interface Props {
    activeWave?:boolean
    hour?:number
}

interface State {
    
}

@(connect((state: RState) => ({
    activeWave: state.activeWave,
    hour: state.hour
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
                <div style={{position:'absolute', top:0, left:0}}>
                    <div style={{transform: 'rotate('+360*(this.props.hour/24)+'deg)'}}>{Icon(Icons.sun_moon, '', true)}</div>
                    <h5>{this.props.hour}</h5>
                </div>
                <CanvasFrame />
                <div style={{position:'absolute', bottom:0, left:0}}>
                    {Button(!this.props.activeWave, onStartWave, 'Go')}
                </div>
            </div>
        )
    }
}