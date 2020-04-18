import * as React from 'react';
import AppStyles, { colors } from '../../AppStyles';
import { ButtonStrip, Select, Button, Icon, ProgressBar } from '../helpers/Shared'
import { onStartWave, onToggleAimCryo, onToggleAimLaser, onStartPlaceDrone, onNoCharges } from '../uiManager/Thunks';
import { connect } from 'react-redux';
import CanvasFrame from './CanvasFrame';
import { Icons } from '../../assets/Assets';
import { NIGHTFALL, DAYBREAK } from '../../enum';

interface Props {
    activeWave?:boolean
    hour?:number
    aimLaser?:boolean
    aimCryo?:boolean
    placingDrone?:boolean
    colonistsRemaining?: number
    colonistsSaved?: number
    crew?: number
    reactorCharges?: number
    maxReactorCharges?: number
}

interface State {
    
}

@(connect((state: RState) => ({
    activeWave: state.activeWave,
    hour: state.hour,
    aimLaser: state.aimLaser,
    aimCryo: state.aimCryo,
    placingDrone: state.placingDrone,
    colonistsRemaining: state.colonistsRemaining,
    colonistsSaved: state.colonistsSaved,
    crew: state.crew,
    reactorCharges: state.reactorCharges,
    maxReactorCharges: state.maxReactorCharges
})) as any)
export default class CanvasFrameChrome extends React.Component<Props, State> {

    state = { }

    componentDidMount(){
        document.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown = (e:KeyboardEvent) => {
        if(this.props.reactorCharges > 0){
            let index = (+e.key)
            switch(index){
                case 1: onToggleAimLaser()
                break
                case 2: onToggleAimCryo()
                break
                case 3: onStartPlaceDrone()
                break
            }
        }
        else onNoCharges()
    }

    render(){
        return (
            <div style={{position:'relative'}}>
                <div style={{position:'absolute', top:0, left:0, display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                    <div style={{display:'flex', alignItems:'center', maxWidth:'75px'}}>
                        <div style={{transition:'all 250ms', transform: 'rotate('+360*(this.props.hour/24)+'deg)', width:'32px', height:'32px'}}>{Icon(Icons.sun_moon, '', true)}</div>
                        <h5>{getTimeText(this.props.hour)}</h5>
                    </div>
                    <div>
                        <h5>Colonists {this.props.colonistsRemaining}</h5>
                        <div>{Button(!this.props.activeWave, onStartWave, 'Run')}</div>
                    </div>
                    <div>
                        <h5>Ship's Crew {this.props.colonistsSaved} / 50</h5>
                        <h5>Spare Crew {this.props.crew}</h5>
                    </div>
                </div>
                <CanvasFrame />
                <div style={{position:'absolute', bottom:0, left:0, display:'flex'}}>
                    <div style={{width:'100px', marginRight:'2em'}}>
                        {ProgressBar(this.props.reactorCharges, this.props.maxReactorCharges, 'Reactor Power')}
                    </div>
                    <div style={{marginRight:'1em', display:'flex', alignItems:'center'}}>
                        1: {Button(!this.props.aimLaser && this.props.reactorCharges > 0, onToggleAimLaser, 
                            Icon(Icons.laser, ''), 
                            'A mining laser. Removes one obstruction or melts frost.')}</div>
                    <div style={{marginRight:'1em', display:'flex', alignItems:'center'}}>
                        2: {Button(!this.props.aimCryo && this.props.colonistsSaved >= 5 && this.props.reactorCharges > 0, onToggleAimCryo, 
                            Icon(Icons.cryo, ''), 
                            'A cryo beam. Places one obstruction or removes fire. Requires 5 or more crew to operate.')}</div>
                    <div style={{marginRight:'1em', display:'flex', alignItems:'center'}}>
                        3: {Button(!this.props.placingDrone , onStartPlaceDrone, 
                            Icon(Icons.drone, ''), 
                            'A drone that heals colonists near it. Each one requires 3 crew to operate.')}</div>
                </div>
            </div>
        )
    }
}

const getTimeText = (hour:number) => {
    if(hour > NIGHTFALL || hour < DAYBREAK) return 'Night'
    if(hour === NIGHTFALL || hour === NIGHTFALL-1) return 'Dusk'
    if(hour === DAYBREAK || hour === DAYBREAK-1) return 'Dawn'
    if(hour > DAYBREAK) return 'Daylight'
}