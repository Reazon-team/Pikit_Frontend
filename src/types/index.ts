export interface Prompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  tags: Tag[];
  aiModel: AiModel;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
}

export type AiModel = 'GPT-4' | 'GPT-3.5' | 'CLAUDE-3' | 'GEMINI-PRO';

export interface SearchFilter {
  keyword?: string;
  tags?: string[];
  aiModel?: AiModel;
  sortBy?: 'latest' | 'popular';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}
