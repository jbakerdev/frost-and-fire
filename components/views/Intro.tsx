import * as React from 'react'
import AppStyles from '../../AppStyles';
import { TopBar, Button, Icon, NumericInput, LightButton, ButtonStrip } from '../helpers/Shared'
import { onHideModal, onInitSession } from '../uiManager/Thunks';

export default class Intro extends React.PureComponent {

    render(){
        return (
            <div style={{position:'absolute', top:0,left:0,right:0,bottom:0, height:'90vh', margin:'auto',zIndex:1, justifyContent:'space-between', background:'black', textAlign:'center'}}>
                {Button(true, onInitSession, 'Start')}
            </div>
        )
    }
}
