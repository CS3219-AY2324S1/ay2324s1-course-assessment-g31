import { StringInterface } from "./stringInterface";

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringify<T>(obj: T): StringInterface<T> {
  const convertedObject = {} as StringInterface<T>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (Array.isArray(value)) {
        convertedObject[key] = value.map((item) =>
          isObject(item) ? stringify(item) : String(item),
        ) as StringInterface<T>[typeof key];
      } else if (value instanceof Date) {
        convertedObject[key] =
          value.toISOString() as StringInterface<T>[typeof key];
      } else if (isObject(value)) {
        convertedObject[key] = stringify(
          value,
        ) as StringInterface<T>[typeof key];
      } else {
        convertedObject[key] = String(value) as StringInterface<T>[typeof key];
      }
    }
  }

  return convertedObject;
}

export default stringify;
