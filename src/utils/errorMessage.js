export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;
  if (typeof error === "string") return error;

  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "object") {
    return error.error || error.message || fallback;
  }

  return fallback;
}
