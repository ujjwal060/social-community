const validateSchema =async(schema, data) => {
    try {
        await schema.validateAsync(data, { abortEarly: false });
        return null;
    } catch (error) {
        if (error.isJoi) {
            return error.details.map((err) => err.message);
        }
        throw error;
    }
};

export {
    validateSchema
}