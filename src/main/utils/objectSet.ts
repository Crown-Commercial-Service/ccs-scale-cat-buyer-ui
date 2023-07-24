/**
 * Returns a unique set of objects based on a key, for example id.
 * @param objArray An array of objects
 * @param identifier A key that all the objects share
 * @returns 
 */
const objectSet = <T>(objArray: T[], identifier: keyof T): T[] => {
  return [...new Map(objArray.map((obj) => [String(obj[identifier as keyof T]), obj])).values()];
};

export { objectSet };
