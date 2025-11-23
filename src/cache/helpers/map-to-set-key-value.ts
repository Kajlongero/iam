import { SetKeyValue } from "../../redis/interfaces/key-set.interface";

export const MapToSetKeyValueArray = (
  map: Map<string, Set<string>>
): SetKeyValue[] => {
  return Array.from(map.entries()).map(([key, set]) => ({
    key,
    members: Array.from(set),
  }));
};
