import { Endpoint, getBaseAdress } from "./Endpoints";
import { Observable } from "rxjs";

//TODO: Umbauen zu Singleton Architektur

class RequestHandler {

    //Nimmt einen Endpoint parameter, welche die url und alle anderen wichtigen parameter für den request setzt und gibt ein Observable zurück,
    //welches die Daten publisht
    //TODO: Array Rückgabe erstehen durch Standard Response Typ "genericResonse" z.B. der einen Array als wert haben kann -> einfacher zu behandeln.
    static handleRequest<T>(endpoint: Endpoint<T>, parameter: [key: string, value: string][], body?: string, ): Observable<T[]> {
        return new Observable((subscriber) => {

            if (endpoint.requestType === "GET" && body !== undefined) {
                throw Error("Cannot Body not possible with GET Request Type");
            }

            this.dispatchRequest(endpoint, parameter, body).then((resp) => {
                resp.text().then(data => {
                    let model: T[] = JSON.parse(data);
                    subscriber.next(model);
                });
            }).catch(error => {
                subscriber.error(new Error("Error during Data fetch in RequestHandler!"));
            });
        });
    }

    public static dispatchRequest<T>(endpoint: Endpoint<T>, urlparameter: [string, string][], body?: string): Promise<Response> {
        let baseAdress = getBaseAdress();
        if (baseAdress === undefined || baseAdress === "") {
            throw Error("Keine Baseadresse für API angegeben!");
        }
        let options: RequestInit = {};
        
        let headers: HeadersInit = [["X-Secret", "44a56a7bfbed28e96c5d6467a08057951705c120acc74934ae1d0a6f0f677fa1"]];
        let urlParams: string = "";
        options.mode = "cors"



        // options.mode = "cors"
        if (urlparameter.length > 0) {
            urlParams += "?";
            if (endpoint.requestType === "POST") {
                console.warn("Using Url parameters in POST requests is considered bad practice!");
                //TODO: remove from prod
            }
            for (let index = 0; index < urlparameter.length; index++) {
                if (index != 0) {
                    urlParams += "&";
                }
                urlParams += urlparameter[index][0] + "=" + urlparameter[index][1];
            }
        }

        options.method = endpoint.requestType;
        options.headers = headers;

        // let test: RequestInit = {
        //     method: "GET",
        //     mode: "cors",
        //     headers: {
        //         "Access-Control-Allow-Origin": "*",
        //         "X-Secret": "sdf"
        //     }
        // }


        //TODO: Check auf Endpoint bodyrequired variable? -> Vllt nicht praktikabel wenn endpunkt body nehmen kann aber nicht muss
        if (endpoint.requiresBody || body !== undefined) {
            //TODO: Fehlerhandling falls body required aber null/undefined ist
            options.body = body;
        }

        return fetch(baseAdress + endpoint.path + urlParams, options);
    }

}

export { RequestHandler };