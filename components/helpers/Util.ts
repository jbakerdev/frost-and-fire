import * as v4 from 'uuid'
import { GameObjects, Tilemaps, Physics } from 'phaser';
import { store } from '../../App';
import { compute, _getCircle } from './Fov';
import AStar from './AStar';
import { TileIndexes } from '../../assets/Assets';

export const SearchDirs = [
    {x:1,y:0},{x:0,y:1},{x:0,y:-1}
]

export const runSpriteFOV = (sprite:GameObjects.Sprite, tileData:Array<Array<TileInfo>>, map:Tilemaps.Tilemap, getAllTilesAt:Function) => {
    let sight = 3
    let tileX = map.worldToTileX(sprite.getCenter().x), tileY = map.worldToTileY(sprite.getCenter().y)
    let visibleTiles = compute(tileX, tileY, sight, tileData)
    let tiles = _getCircle(tileX, tileY, sight+1)
    tiles.forEach(tile=>{
        let x = tile[0], y=tile[1]
        let coordTiles = getAllTilesAt(x, y)
        if(coordTiles[0] && coordTiles[0].alpha !== 0){
            //Set alpha of all tiles for all layers to 0.2
            coordTiles.forEach(tile=>tile.setAlpha(0.2))
        }
    })
    tiles = [[tileX, tileY]]
    for(var i=0; i<=sight; i++){
        tiles = tiles.concat(_getCircle(tileX, tileY, i))
    }
    tiles.forEach(tile=>{
        let x = tile[0], y=tile[1]
        let coordTiles = getAllTilesAt(x, y)
        if(coordTiles[0]){
            if(visibleTiles[x] && visibleTiles[x][y]){
                coordTiles.forEach(tile=>tile.setAlpha(1))
            }
            else {
                coordTiles.forEach(tile=>tile.setAlpha(0.2))
            }
        }
    })
    // this.deaths.getChildren().forEach((sprite:GameObjects.Sprite)=>{
    //     sprite.setAlpha(this.map.getTileAtWorldXY(sprite.getCenter().x,sprite.getCenter().y, true, undefined, 'terrain').alpha === 1 ? 1 : 0.2)
    // })
}

export const moveTowardXY = (currentSprite:Physics.Arcade.Sprite, x:number, y:number, speed:number) => {
    let dir = {x: x-currentSprite.x, y:y-currentSprite.y}
    if(dir.x > dir.y){
        if(dir.x > 0) currentSprite.anims.play('walk_right')
        else if(dir.x < 0){
            currentSprite.flipX = true
            currentSprite.anims.play('walk_right')
        } 
    }
    else if(dir.y > 0 || dir.y < 0) currentSprite.anims.play('walk_up')
    
    let mag = Math.sqrt(dir.x*dir.x + dir.y*dir.y);
    dir.x = dir.x/mag; dir.y = dir.y/mag;
    currentSprite.setVelocity(dir.x*speed, dir.y*speed)
}

export const isFrostTile = (index:number) => {
    return index === TileIndexes.frost.debris||index === TileIndexes.frost.frostTile||index === TileIndexes.frost.frostWave||index === TileIndexes.frost.impassible||index === TileIndexes.frost.passable
}

export const shuffle = (array:Array<any>) => {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}