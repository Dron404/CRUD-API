export type ResDataType = {
  code: number;
  data?: unknown;
};

export enum BodyType {
  EMPTY = 0,
  JSON = 1,
  INVALID_JSON = 2,
}

export type ReqParsedDataType = { type: BodyType; payload?: User | string };

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type DB = Map<string, User>;
