import axios, { AxiosError } from "axios";
import { Topic } from "@/Entity/topic.entity.ts";
import { Result } from "@/interface/common.ts";

export function getTopicTags(): Promise<Result<Topic[]>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/topic/tags")
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}

export function addTopic(title:string): Promise<Result<Topic>> {
    return new Promise((resolve, reject) => {
        axios
            .post("/topic/add-topic", {title:title})
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}
