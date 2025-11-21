import { HashKeyValue } from "src/redis/interfaces/hash.interface";

/**
 * Helper function that gets a key and save to the proper redis hash form
 * @param key Key string to save on cache
 * @param map Object of data containing key value
 * @returns {HashKeyValue}
 */
export const MapToHashKeyValue = (
  key: string,
  map: Record<string, string>
): HashKeyValue => {
  return {
    key,
    values: Object.entries(map).map(([fieldKey, fieldValue]) => ({
      key: fieldKey,
      value: fieldValue,
    })),
  };
};

/**
 * Helper function that use `MapToHashKeyValue()` to return an array of HashKeyValues
 * @param map Map data structure containing key as a key of the map for redis hash and the values inside the object of value as a iterable
 * @returns {HashKeyValue[]}
 */
export const MapToHashKeyValueArray = (
  map: Map<string, Record<string, string>>
): HashKeyValue[] => {
  return Array.from(map.entries()).map(([key, value]) => {
    return MapToHashKeyValue(key, value);
  });
};
