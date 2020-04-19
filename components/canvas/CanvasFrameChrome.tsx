import * as React from 'react';
import AppStyles, { colors } from '../../AppStyles';
import { ButtonStrip, Select, Button, Icon, ProgressBar, VerticalProgressBar } from '../helpers/Shared'
import { onStartWave, onToggleAimCryo, onToggleAimLaser, onStartPlaceDrone, onNoCharges, onToggleAudio } from '../uiManager/Thunks';
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
        if(e.key === 'Enter' && !this.props.activeWave) return onStartWave()
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
                    <div>
                        <h6>Colonists {this.props.colonistsRemaining}</h6>
                    </div>
                    <div style={{display:'flex', alignItems:'center'}}>
                        <div style={{position:'relative'}}>
                            <div style={{transform: 'rotate('+360*(this.props.hour/24)+'deg)', width:'64px', height:'64px'}}>{Icon(Icons.sun_moon, '', true, true)}</div>
                            <div style={{position:'absolute', bottom:0, left:0, height:'50%', width:'100%', background:'black'}}/>
                        </div>
                        <h4 style={{marginLeft:'0.5em'}}>{getTimeText(this.props.hour)}</h4>
                    </div>
                    <div>
                        <h6>Spare Crew {this.props.crew}</h6>
                    </div>
                </div>
                <CanvasFrame />
                <div style={{position:'absolute', bottom:0, left:0, right:0, display:'flex', justifyContent:"center"}}>
                    <div style={{marginRight:'1em', display:'flex', alignItems:'center'}}>
                        Enter: {Button(!this.props.activeWave, onStartWave, 
                            Icon(Icons.colonist, '', true), 
                            'Signal a group of colonists to run to the ship.')}</div>
                    <div style={{marginRight:'1em', display:'flex', alignItems:'center'}}>
                        1: {Button(!this.props.aimLaser && this.props.reactorCharges > 0, onToggleAimLaser, 
                            Icon(Icons.laser, '', true), 
                            'A mining laser. Removes one obstruction or melts frost.')}</div>
                    <div style={{marginRight:'1em', display:'flex', alignItems:'center'}}>
                        2: {Button(!this.props.aimCryo && this.props.colonistsSaved >= 5 && this.props.reactorCharges > 0, onToggleAimCryo, 
                            Icon(Icons.cryo, '', true), 
                            'A cryo beam. Places one obstruction or removes fire. Requires 5 or more crew to operate.')}</div>
                    <div style={{marginRight:'1em', display:'flex', alignItems:'center'}}>
                        3: {Button(!this.props.placingDrone , onStartPlaceDrone, 
                            Icon(Icons.drone, '', true), 
                            'A drone that heals colonists near it. Each one requires 3 crew to operate.')}</div>
                </div>
                <div style={{position:'absolute', right:0, top:0, bottom:0, display:'flex', justifyContent:'space-around', flexDirection:'column'}}>
                    <div style={{width:'25px'}}>
                        <div style={{height:'150px', marginBottom:'10px'}}>{VerticalProgressBar(this.props.colonistsSaved, 50, 'Crew Saved')}</div>
                        {Icon(Icons.colonist, '', true)}
                    </div>
                    <div style={{width:'25px'}}>
                        <div style={{height:'150px', marginBottom:'10px'}}>{VerticalProgressBar(this.props.reactorCharges, this.props.maxReactorCharges, 'Reactor Power')}</div>
                        {Icon(Icons.energy, '', true)}
                    </div>
                    
                </div>
                <div style={{position:'absolute', bottom:0, right:0}} onClick={onToggleAudio}>{Icon(Icons.audio,'Mute',true)}</div>
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