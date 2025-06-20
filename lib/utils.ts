import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// shadcn utils
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// whenever passing large payloads through server actions, we have to stringify and parse them
export const parseStringify = (value: unknown) => {
  return JSON.parse(JSON.stringify(value));
}

// determine the file type and extension
export const getFileType = (fileName: string) => {
  const extension = fileName.split('.').pop(); 
  let type = '';
  switch (extension) {
    case 'pdf':
    case 'docx':
      type = 'DOCUMENT';
      break;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
    case 'svg':
      type = 'IMAGE';
      break;
    case 'mp4':
    case 'mov':
    case 'avi':
    case 'mkv':
      type = 'VIDEO';
      break;
    case 'mp3':
    case 'wav':
      type = 'AUDIO';
      break;
    default:
      type = 'OTHER';
  }
}