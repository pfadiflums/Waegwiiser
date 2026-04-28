export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  createdAt: string;
}

export interface UpdateMediaMetadataRequest {
  altText?: string;
  caption?: string;
}

export interface PageMediaFileResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: MediaFile[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
