export const defaults = [
    // { key: 'destroyed', resource: require('./audio/destroyed.mp3'), type: 'audio' },
    { key: 'bones', resource: require('./icon/bones.png'), type: 'image'},
    { key: 'cryo', resource: require('./icon/cryo.png'), type: 'image'},
    { key: 'laser', resource: require('./icon/laser.png'), type: 'image'},
    { key: 'drone', resource: require('./icon/drone.png'), type: 'image'},
    { key: 'tilemap', resource: require('./tiles.png'), type: 'image'},
    { key: 'map', resource: require('./map.json'), type: 'tilemapTiledJSON', data: {}},
    { key: 'tiles', resource: require('./tiles.png'), type: 'spritesheet', data: { frameWidth: 16, frameHeight: 16 }},
]

//Fun fact these are not zero indexed
export const PassableIndexes = [3,4,5,6]

export const TileIndexes = {
    entrance: 2,
    exit: 1,
    colonist: 9,
    frost: {
         frostTile: 4, 
         frostWave: 11,
         impassible: 7,
         passable: 6,
         debris: 14
    },
    fire: { 
        fireTile: 5, 
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
    drone: require('./icon/drone.png')
}