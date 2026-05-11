export interface Prompt {
  id: string;
  title: string;
  description: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  promptText: string;
  copyCount: number;
  createdAt: string;
  category: 'new' | 'hot' | 'all';
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

export interface User {
  userId: number;
  username: string;
  nickname: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  username: string;
  nickname: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  nickname: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}
