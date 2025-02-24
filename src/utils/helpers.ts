export const checkIsServiceUnavailableError = (
  e: any,
  handler?: () => void
) => {
  if (e instanceof Error) {
    if (e.message == "Service unavailable") {
      if (handler) handler();
    }
  }
};

export const withRetry = async (fn: () => Promise<void>, retry: number) => {
  try {
    await fn();
  } catch (e) {
    checkIsServiceUnavailableError(e, () => {
      throw e;
    });

    if (retry <= 0) {
      throw e;
    }
    await withRetry(fn, --retry);
  }
};
