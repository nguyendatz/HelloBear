export const MAX_FILE_SIZE = 2097152;
export const MAX_FILE_SIZE_10MB = 10485760;

export const validFileExtensions = ['jpg', 'png', 'jpeg', 'svg', 'webp'];

export function isValidFileType(fileName: string) {
  return validFileExtensions.includes(fileName.split('.').pop() ?? '');
}
