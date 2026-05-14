import PromptDetailClient from './PromptDetailClient';

// 빌드 시점에 백엔드에서 모든 프롬프트 ID를 가져와 정적 페이지 생성
export async function generateStaticParams() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pikit-backend-5nnb.onrender.com';
  
  try {
    // 모든 프롬프트를 가져오기 위해 큰 size 사용
    const response = await fetch(`${API_URL}/api/prompts?page=0&size=1000`);
    
    if (!response.ok) {
      console.error('Failed to fetch prompts for static generation');
      return [{ id: '1' }]; // fallback
    }
    
    const result = await response.json();
    
    // 응답 구조: { success: true, data: { content: [...] } } 또는 { success: true, data: [...] }
    const prompts = result.data?.content || result.data || [];
    
    if (prompts.length === 0) {
      return [{ id: '1' }]; // 최소 하나는 있어야 빌드 통과
    }
    
    return prompts.map((prompt: { id: number }) => ({
      id: String(prompt.id),
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [{ id: '1' }];
  }
}

export default function PromptDetailPage() {
  return <PromptDetailClient />;
}