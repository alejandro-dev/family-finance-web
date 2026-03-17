// export enum AuthErrorCode {
//    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
//    TOKEN_EXPIRED = "TOKEN_EXPIRED",
//    UNAUTHORIZED = "UNAUTHORIZED",
//    GONE = "GONE",
//    NOT_FOUND = "NOT_FOUND",
//    BAD_REQUEST = "BAD_REQUEST",
// }

export class ErrorCode extends Error {
   status: number;
   // code?: AuthErrorCode;

   constructor(message: string, status: number/*, code?: AuthErrorCode*/) {
      super(message);
      this.name = "ErrorCode";
      this.status = status;
      // this.code = code;
   }
}
