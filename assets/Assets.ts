export const defaults = [
    // { key: 'destroyed', resource: require('./audio/destroyed.mp3'), type: 'audio' },
    { key: 'bones', resource: require('./icon/bones.png'), type: 'image'},
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
         frostWave: 10,
         impassible: 7,
         passable: 6 
    },
    fire: { 
        fireTile: 5, 
        fireWave: 11,
        passable: 3,
        impassible: 8
    }
}

export const Icons = {
    sun_moon: require('./icon/sun_moon.png')
}