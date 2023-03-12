export const logError = (...args: any[]) => {
  if (import.meta.env.MODE !== 'production') {
    console.error(args);
  }
}

export const logMessage = (...args: any[]) => {
  if (import.meta.env.MODE !== 'production') {
    console.log(args);
  }
}
