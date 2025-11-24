export enum ImageSize {
  Size1K = '1K',
  Size2K = '2K',
  Size4K = '4K'
}

export enum VideoAspectRatio {
  Landscape = '16:9',
  Portrait = '9:16'
}

export interface GeneratedImage {
  base64: string;
  mimeType: string;
  url: string; // Data URL for display
}

export interface GeneratedVideo {
  uri: string;
  mimeType: string; // usually video/mp4
}