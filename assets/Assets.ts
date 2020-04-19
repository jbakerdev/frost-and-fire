export const defaults = [
    { key: 'alarm', resource: require('./audio/alarm.mp3'), type: 'audio' },
    { key: 'dead', resource: require('./audio/dead.mp3'), type: 'audio' },
    { key: 'saved', resource: require('./audio/saved.mp3'), type: 'audio' },
    { key: 'cryo', resource: require('./audio/cryo.mp3'), type: 'audio' },
    { key: 'drone', resource: require('./audio/drone.mp3'), type: 'audio' },
    { key: 'heal', resource: require('./audio/heal.mp3'), type: 'audio' },
    { key: 'laser', resource: require('./audio/laser.mp3'), type: 'audio' },
    { key: 'rock', resource: require('./audio/rock.mp3'), type: 'audio' },
    { key: 'start', resource: require('./audio/start.mp3'), type: 'audio' },
    { key: 'wave', resource: require('./audio/wave.mp3'), type: 'audio' },
    { key: 'bones', resource: require('./icon/bones.png'), type: 'image'},
    { key: 'cryo', resource: require('./icon/cryo.png'), type: 'image'},
    { key: 'laser', resource: require('./icon/laser.png'), type: 'image'},
    { key: 'noenergy', resource: require('./icon/noenergy.png'), type: 'image'},
    { key: 'drone', resource: require('./icon/drone.png'), type: 'image'},
    { key: 'selected', resource: require('./icon/selected.png'), type: 'image'},
    { key: 'tilemap', resource: require('./tiles2.png'), type: 'image'},
    { key: 'map', resource: require('./map.json'), type: 'tilemapTiledJSON', data: {}},
    { key: 'tiles', resource: require('./tiles2.png'), type: 'spritesheet', data: { frameWidth: 16, frameHeight: 16 }},
    { key: 'colonist', resource: require('./colonist.png'), type: 'spritesheet', data: { frameWidth: 16, frameHeight: 16 }},
]

//Fun fact these are not zero indexed
export const PassableIndexes = [3,4,5,6]

export const TileIndexes = {
    entrance: 2,
    exit: 1,
    colonist: 9,
    frost: {
         frostTile: 4, 
         frostTile2: 16,
         frostWave: 11,
         impassible: 7,
         passable: 6,
         debris: 14
    },
    fire: { 
        fireTile: 5, 
        fireTile2:15,
        fireWave: 10,
        passable: 3,
        impassible: 8,
        debris:13
    }
}

export const DebrisShapes = [
    [{x:0,y:0},{x:-1,y:0},{x:0,y:1},{x:1,y:0},{x:0,y:-1}],
    [{x:0,y:0},{x:1,y:0},{x:2,y:1},{x:2,y:-1}],
    [{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:1,y:1}],
    [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}],
    [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:1,y:1}],
]

export const Icons = {
    sun_moon: require('./icon/sun_moon.png'),
    laser: require('./icon/laser.png'),
    cryo: require('./icon/cryo.png'),
    drone: require('./icon/drone.png'),
    colonist: require('./colonist_walk.gif'),
    audio: require('./icon/audio.png'),
    energy: require('./icon/energy.png')
}

export const IntroText = "\n\nOne day, earthquakes happened to clear the way to the strange ship while Khu was out hunting. The ship taught Khu its ways, now Khu must save the people.\n\nDeep in the caves Khu's people have lived for thousands of their short generations, ravaged by radiation from the nearby quasar. \n\nThere were legends of a surviving ship far away beyond the rock walls that will carry them to a world of green, far from frost and fire."
export const WinText = "\n\nWith a full crew onboard, the ship's computer informs Khu they may blast off at any time. \n\nThe people gaze out at the raging storms ravaging the landscape before them as they sit comfortably in the pristine white of the incredible ship. Khu has spent all 10 days of life bringing them here, and is near death. A child, nearing adulthood at 3 days old looks up at Khu. Away from the quasar, it may live a hundred years. Perhaps forever, Khu smiles. There can never be too much of life, Khu thinks."
export const LoseText = "\n\nThe ships computer regretfully informs Khu that there are no longer enough colonists left alive to crew the ship. Khu looks around at those gathered in the ship. The computer says it can support their number for a year. The people gasp, a whole year! Their lives ran a course of 10 days, what a gift a year would be! The people praise Khu and make him their leader. The isolation is too much for most, and they drift away over the year, back to swift deaths the cliffs. At the end only dying Khu remains, regretful of never having discovered the stars."