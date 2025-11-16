export interface KeyValue {
  key: string;
  value: unknown;

  ttl?: number;
  expireOptions?:
    | "EX"
    | "PX"
    | "KEEPTTL"
    | "EXAT"
    | "PXAT"
    | "NX"
    | "XX"
    | "GET";
}
