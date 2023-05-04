class operations {
  static equals = (arg1: any, arg2: any) => {
    return arg1 === arg2
  }

  static notEquals = (arg1: any, arg2: any) => {
    return arg1 !== arg2
  }

  static isUndefined = (object: any, key : string)=> {
    return object[key] === undefined
  }
}

export { operations }
