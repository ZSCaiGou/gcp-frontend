import { Game } from "@/Entity/game.entity.ts";

export interface CategoryGameList{
    [key:string]:{
        gameList:Game[],
        pageInfo:{
            total:number,
            page:number,
            size:number
        }
    }
}