interface ReservedEntry {
  alias: string;
  rsSlug: string;
  appSlug: string;
}

export const CategorizeInternals = (data: Set<string>) => {
  const internals: string[] = [];

  data.delete("");

  Array.from(data).forEach((item) => {
    const clean = item.replaceAll(":", "_");

    internals.push(clean);
  });

  return { internals };
};

export const CategorizeExternals = (
  data: Set<string>,
  reserved: ReservedEntry
) => {
  const externals: Record<string, string[]> = {};

  data.delete("");

  if (data.has(reserved.alias)) {
    data.delete(reserved.alias);

    data.add(`${reserved.appSlug}:${reserved.alias}`);
  }

  Array.from(data).forEach((item) => {
    const [appSlug, gateway] = item.split(":");

    if (externals[appSlug]) return externals[appSlug].push(gateway);

    externals[appSlug] = [gateway];
  });

  return { externals };
};
