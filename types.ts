export type AppMode = 'generate' | 'edit' | 'video';

export interface GenerationResult {
  type: 'image' | 'video';
  data: string; // Base64 for image, URL for video
}