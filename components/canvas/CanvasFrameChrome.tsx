import * as React from 'react';
import AppStyles, { colors } from '../../AppStyles';
import { ButtonStrip, Select, Button, Icon, ProgressBar } from '../helpers/Shared'
import { onStartWave, onToggleAimCryo, onToggleAimLaser, onStartPlaceDrone, onNoCharges } from '../uiManager/Thunks';
import { connect } from 'react-redux';
import CanvasFrame from './CanvasFrame';
import { Icons } from '../../assets/Assets';
import { NIGHTFALL, DAYBREAK, Modal } from '../../enum';
import Intro from '../views/Intro';
import Lose from '../views/Lose';
import Win from '../views/Win';

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
    modal?:Modal
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
    maxReactorCharges: state.maxReactorCharges,
    modal: state.modal
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
                {this.props.modal === Modal.INTRO && <Intro/>}
                {this.props.modal === Modal.LOSE && <Lose/>}
                {this.props.modal === Modal.WIN && <Win/>}
                <div style={{position:'absolute', top:0, left:0, display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                    <div style={{display:'flex', alignItems:'center'}}>
                        <div style={{position:'relative'}}>
                            <div style={{transition:'all 250ms', transform: 'rotate('+360*(this.props.hour/24)+'deg)', width:'64px', height:'64px'}}>{Icon(Icons.sun_moon, '', true)}</div>
                            <div style={{position:'absolute', bottom:0, left:0, height:'50%', width:'100%', background:'black'}}/>
                        </div>
                        <h4 style={{marginLeft:'0.5em'}}>{getTimeText(this.props.hour)}</h4>
                    </div>
                    <div>
                        <h6>Colonists {this.props.colonistsRemaining}</h6>
                    </div>
                    <div>
                        <h6>Ship's Crew {this.props.colonistsSaved} / 50</h6>
                        <h6>Spare Crew {this.props.crew}</h6>
                    </div>
                </div>
                <CanvasFrame />
                <div style={{position:'absolute', bottom:0, left:0, display:'flex'}}>
                    <div style={{marginRight:'1em'}}>{Button(!this.props.activeWave, onStartWave, Icon(Icons.colonist, 'Signal a group of colonists'))}</div>
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
                    <div style={{width:'100px', marginRight:'2em', height:'32px'}}>
                        <h6>Reactor</h6>
                        {ProgressBar(this.props.reactorCharges, this.props.maxReactorCharges, 'Reactor Power')}
                    </div>
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