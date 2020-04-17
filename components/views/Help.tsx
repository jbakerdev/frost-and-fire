import * as React from 'react'
import AppStyles from '../../AppStyles';
import { TopBar, Button, Icon, NumericInput, LightButton, ButtonStrip } from '../helpers/Shared'

interface Props{
}

export default class Help extends React.PureComponent<Props> {

    render(){
        return (
            <div style={{height:'800px', width:'600px', justifyContent:'space-between', background:'black', textAlign:'center'}}>
                what up
            </div>
        )
    }
}
