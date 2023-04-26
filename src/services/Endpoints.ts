import { DefaultResponse } from "../model/DefaultResponse";

//Holds default values for endpoints etc.
//Durch env variable initialisieren -> in prod anders als lokal

function getBaseAdress(): string{
    if(process.env["NODE_ENV"] === "development" || process.env["NODE_ENV"] === "test"){
        return "https://api.pons.com/v1";
    } else {
        return "kommt noch";
    }
}



enum Method {
    POST = "POST",
    GET = "GET",
    DELETE = "DELETE",
    PUT = "PUT"
}

export interface Endpoint<Type> {
    readonly requestType: string;
    readonly requiresBody: boolean;
    readonly path: string;
}

//TODO: Response Type für Erfolg/Nichterfolg ersetllen anstatt Null anzugeben?
export const abfrage: Endpoint<DefaultResponse> = {path: "/dictionary", requestType: Method.GET, requiresBody: false};

const endpoints: Map<string, Endpoint<any>> = new Map([["abfrage", abfrage]]);

export {endpoints, getBaseAdress};