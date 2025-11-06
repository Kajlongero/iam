export interface CompareHierarchy<T> {
  list: T[];
  strict?: boolean;
  parentKey: keyof T;
  superiorId: string;
  inferiorId: string;
}
