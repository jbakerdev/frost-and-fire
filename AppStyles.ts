export const colors = {
    white: '#f3f3f3',
    grey1: 'silver',
    grey2: '#ababab',
    grey3:'#333333',
    black:'#252525',
    lGreen: '#87e483',
    dGreen: '#006500',
    dBrown: '#967252',
    lBrown: '#c7936d',
    lBlue: '#94caff',
    dBlue: '#0000ca',
    purple: '#360097',
    pink: '#ff0097',
    red: '#dc0000',
    orange: '#ff6500',
    ddBrown: '#392414',
    background: 'black',
}

export default {
    window: {
        background:colors.background,
        border: '1px solid'
    },
    windowBorder: {
        padding:'16px', background:colors.grey1, margin:'16px'
    },
    buttonOuter: {
        cursor:'pointer',
        textAlign:'center' as 'center',
        border: '3px solid',
        background: 'white',
        padding:'2px',
        color:colors.grey3
    },
    buttonInner: {
        padding:'5px',
        background:'black',
        cursor:'pointer',
        display:'flex'
    },
    topBar: {
        background: colors.grey2,
        border: '3px solid rgb(206, 173, 115)',
        textAlign:'center' as 'center',
        margin:'5px', padding:'5px'
    }
}