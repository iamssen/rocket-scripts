export function fixChunkPath(chunkPath: string): string {
  return chunkPath.length > 0 && !/\/$/.test(chunkPath) ? chunkPath + '/' : chunkPath;
}
