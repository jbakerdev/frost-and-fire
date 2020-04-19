import * as React from 'react'
import { onInitSession } from '../uiManager/Thunks';
import { IntroText } from '../../assets/Assets';

export default class Intro extends React.Component {

    scrollRef = React.createRef<HTMLDivElement>()
    interval = null

    componentDidMount(){
       this.interval = setInterval(()=>this.scrollRef.current.scrollTop++, 100) 
    }

    componentWillUnmount(){
        clearInterval(this.interval)
    }

    render(){
        return (
            <div style={{position:'absolute', top:0,left:0,right:0,bottom:0, height:'208px', width:'593px', padding:'16px', margin:'auto',zIndex:1, justifyContent:'space-between', background:'black', textAlign:'center', backgroundImage:'url('+require('../../assets/frost.png')+')'}}>
                <div style={{display:'flex', height:'100%', justifyContent:'space-around', alignItems:"center", background:'black'}}>
                    <div style={{marginRight:'10px'}}>
                        <h2 style={{fontFamily: 'title', color:'#00aaaa'}}>FROST</h2>
                        <h2 style={{fontFamily: 'title', marginLeft:'4em'}}>&</h2>
                        <h2 style={{fontFamily: 'title', color:'#ff5555', marginLeft:'4em'}}>FIRE</h2>
                        <h3 className='blink' onClick={onInitSession} style={{marginTop:'1em', cursor:'pointer', textAlign: 'center'}}>START</h3>
                    </div>
                    <div ref={this.scrollRef} style={{overflow:"hidden", height:'80%'}}>
                        <h5 style={{textAlign:'left', whiteSpace:'pre-line'}}>{IntroText}</h5>
                    </div>
                </div>
            </div>
        )
    }
}
