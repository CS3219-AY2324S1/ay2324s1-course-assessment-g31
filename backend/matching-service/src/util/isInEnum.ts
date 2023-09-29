// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isInEnum = (enumObject: any, value: any) =>
  Object.values(enumObject).includes(value);

export default isInEnum;
