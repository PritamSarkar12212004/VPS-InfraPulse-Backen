export const convertToString = (data: unknown): string => {
  const value = JSON.stringify(data);

  if (value === undefined) {
    throw new Error("Unable to convert data to JSON string");
  }

  return value;
};
