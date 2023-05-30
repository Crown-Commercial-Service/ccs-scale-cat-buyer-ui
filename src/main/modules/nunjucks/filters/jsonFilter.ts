export function jsonFilter(value: any) {
  const parsedJSONObject = JSON.parse(value);
  return parsedJSONObject;
}

export function jsontoStringFilter(value: Object) {
  const jsonObjectStringConvertor = JSON.stringify(value);
  return jsonObjectStringConvertor;
}
