class operations {
  static equals = (arg1: any, arg2: any) => {
    return arg1 === arg2;
  };

  static notEquals = (arg1: any, arg2: any) => {
    return arg1 !== arg2;
  };

  static isUndefined = (object: any, key: string) => {
    return object[key] === undefined;
  };

  static sortByFirstWord = (arr: any)  => {
    arr.sort((a: any, b: any) =>
        a.values[0].text.split(' ')[1] < b.values[0].text.split(' ')[1] ? -1 : 1
    );
  };
}

export { operations };
