import axios, { AxiosError } from "axios";
import { Game } from "@/Entity/game.entity.ts";
import { Result } from "@/interface/common.ts";

export function getGameTags(): Promise<Result<Game[]>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/game/tags")
            .then((res) => {
                console.log(res.data);
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}
