
export class ApiResponse {
    result: boolean;
    message?: string;
    
    constructor(result: boolean, message?: string) {
        this.result = result;
        this.message = message;
    }
}