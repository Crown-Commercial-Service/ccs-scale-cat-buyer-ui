
export function jsonFilter (value: any) {
    let parsedJSONObject = JSON.parse(value);
    return parsedJSONObject;
}

export function jsontoStringFilter (value: Object) {
    let jsonObjectStringConvertor = JSON.stringify(value);
    return jsonObjectStringConvertor;
}