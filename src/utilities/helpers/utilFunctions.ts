const stringToBytes = (string: string): number => {
  return new Blob([string]).size
}

export const utilFunctions = {
  stringToBytes,
}
