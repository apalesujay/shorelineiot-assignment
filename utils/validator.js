export const isInt = (value) => {
    const result = !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
    return result;
}

export const isEmpty = (value) => {
    return value === '';
}