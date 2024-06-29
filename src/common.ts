export const tryCatch = <TryResult>(
  tryCall: () => TryResult,
): [null, TryResult] | [Error, null] => {
  try {
    const result = tryCall();
    return [null, result];
  } catch (e: any) {
    return [e, null];
  }
};
