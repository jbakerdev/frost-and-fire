import * as React from 'react';
import AppStyles, { colors } from '../../AppStyles';
import { ButtonStrip, Select, Button, Icon } from '../helpers/Shared'
import { onInitSession } from '../uiManager/Thunks';
import { Modal } from '../../enum';
import Help from '../views/Help';
import Viewscreen from './CanvasFrame';
import { connect } from 'react-redux';

interface Props {
    
}

interface State {
    
}

@(connect((state: RState) => ({
    
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
            <div style={{position:'relative', padding:'17px'}}>
                <Viewscreen />
            </div>
        )
    }
}