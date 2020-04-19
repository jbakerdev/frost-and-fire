import * as v4 from 'uuid'
import { GameObjects, Tilemaps, Physics } from 'phaser';
import { TileIndexes } from '../../assets/Assets';

export const SearchDirs = [
    {x:1,y:0},{x:0,y:1},{x:0,y:-1}
]

export const moveTowardXY = (currentSprite:Physics.Arcade.Sprite, x:number, y:number, speed:number) => {
    let dir = {x: x-currentSprite.x, y:y-currentSprite.y}
    if(dir.x > dir.y){
        if(dir.x > 0) {
            currentSprite.anims.play('walk_right', true)
            currentSprite.flipX = false
        }
        else if(dir.x < 0){
            currentSprite.flipX = true
            currentSprite.anims.play('walk_right', true)
        } 
    }
    else if(dir.y > 0 || dir.y < 0) currentSprite.anims.play('walk_up', true)

    let mag = Math.sqrt(dir.x*dir.x + dir.y*dir.y);
    dir.x = dir.x/mag; dir.y = dir.y/mag;
    currentSprite.setVelocity(dir.x*speed, dir.y*speed)
}

export const isFrostTile = (index:number) => {
    return index === TileIndexes.frost.debris||index === TileIndexes.frost.frostTile ||index === TileIndexes.frost.frostTile2 ||index === TileIndexes.frost.frostWave||index === TileIndexes.frost.impassible||index === TileIndexes.frost.passable
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