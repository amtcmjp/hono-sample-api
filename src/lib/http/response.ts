export const response = {
  success<T>(data: T, message = "Success") {
    return {
      success: true as const,
      message,
      data,
    };
  },
  error(message: string, code?: string) {
    return {
      success: false as const,
      message,
      ...(code && { code }),
    };
  },
};
