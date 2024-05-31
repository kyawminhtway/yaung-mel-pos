class ValidationError extends Error{
    constructor(message){
        super(message);
    }
    serializeError(){
        return {message: this.message};
    }
};

export default ValidationError;