class ApiResponse {
    constructor(statusCode, message = "success", data){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = true;
    }
}

export { ApiResponse }