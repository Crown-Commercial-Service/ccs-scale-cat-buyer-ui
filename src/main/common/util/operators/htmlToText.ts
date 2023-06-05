export class htmlToText {
  static convertor = (strInputCode: string) => {
    return strInputCode.replace(/<\/?[^>]+(>|$)/g, '');
  };
}
