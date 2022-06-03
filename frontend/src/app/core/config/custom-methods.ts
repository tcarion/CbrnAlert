import * as dayjs from "dayjs";

// https://www.oodlestechnologies.com/blogs/Extending-Native-JavaScript-Prototypes-In-Angular/
export { } // this will make it module


declare global {
  interface Date {
    toJSON(): string;
  }
}

Date.prototype.toJSON = function () {
  return dayjs(this).format('YYYY-MM-DDTHH:mm:ss');
}

