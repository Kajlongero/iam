import { ChunkBatchLoader } from "../interfaces/chunk-load.interface";

function getCursor(field: string, lastCursor: number | string) {
  return {
    skip: 1,
    cursor: {
      [field]: lastCursor,
    },
  };
}

export async function getChunkedData(opts: ChunkBatchLoader) {
  const { limit, fnOpts, cursorField: field, fn, fnSave } = opts;

  let hasMore = true;
  let lastCursor: number | string | null = null;

  try {
    while (hasMore) {
      const cursorOptions = lastCursor ? getCursor(field, lastCursor) : {};

      const chunk = await fn({
        ...fnOpts,
        take: limit,
        ...cursorOptions,
      });

      await fnSave(chunk);

      const count = chunk.length;

      if (count < limit) hasMore = false;

      if (count > 0) {
        const lastItem = chunk[count - 1] as Record<string, unknown>;

        lastCursor = lastItem[field] as number | string;
      }
    }
  } catch (error) {
    console.log(error);

    throw new Error(
      "Error while preloading data from the DB or saving on Cache"
    );
  }
}
