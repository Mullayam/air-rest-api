import { HttpStatusName } from "../../types/index.js";

export class Http {

   static HttpStatus:HttpStatusName = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    DUPLICATE: 404,
    INTERNAL_SERVER_ERROR: 500
}
}