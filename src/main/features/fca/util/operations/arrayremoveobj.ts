export const RemoveDuplicatedList = (array: any[], ToRemove: any[]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    for (let j = 0; j < ToRemove.length; j++) {
      if (array[i] && array[i].userName === ToRemove[j].userName) {
        array.splice(i, 1);
      }
    }
  }
  return array;
};
