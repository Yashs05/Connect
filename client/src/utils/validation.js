export const validateEmail = (email) => {
    // regex for email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-zA-Z]).{6,15}$/
    return re.test(password)
};