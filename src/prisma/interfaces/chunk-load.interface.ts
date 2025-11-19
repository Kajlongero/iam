export interface ChunkBatchLoader {
  limit: number;
  fnOpts?: Record<string, unknown>;

  cursorField: string;

  fn: FindManyChunks<unknown>;
  fnSave: BatchProcessor<unknown>;
}

export type FindManyChunks<T> = (args?: any) => Promise<T[]>;

export type BatchProcessor<T> = (batch: T[]) => Promise<void> | void;
