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
    colonist: require('./colonist_walk.gif')
}

export const IntroText = "\n\nOne day, earthquakes happened to clear the way to the strange ship while Khu was out hunting. The ship taught Khu its ways, now Khu must save the people.\n\nDeep in the caves Khu's people have lived for thousands of their short generations, ravaged by radiation from the nearby quasar. \n\nThere were legends of a surviving ship far away beyond the rock walls that will carry them to a world of green, far from frost and fire. "