'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { adminApi } from '@/lib/api';
import { PromptAdminItem } from '@/types';
import PromptFormModal from '@/components/admin/PromptFormModal';
import Pagination from '@/components/common/Pagination';

export default function AdminPromptsPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const showToast = useToastStore((s) => s.show);

  const [prompts, setPrompts] = useState<PromptAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptAdminItem | null>(null);

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getPrompts(page);
      setPrompts(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      showToast('목록을 불러오는데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.replace('/');
      return;
    }
    fetchPrompts();
  }, [isAuthenticated, isAdmin, router, fetchPrompts]);

  const handleToggleVisibility = async (id: number) => {
    try {
      await adminApi.toggleVisibility(id);
      showToast('노출 여부가 변경되었습니다.');
      fetchPrompts();
    } catch (err) {
      showToast('변경에 실패했습니다.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까? 되돌릴 수 없습니다.')) return;
    try {
      await adminApi.deletePrompt(id);
      showToast('삭제되었습니다.');
      fetchPrompts();
    } catch (err) {
      showToast('삭제에 실패했습니다.', 'error');
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedPrompt(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prompt: any) => {
    setModalMode('edit');
    setSelectedPrompt(prompt);
    setIsModalOpen(true);
  };

  const formatDate = (iso: string) => {
    if (!iso) return '-';
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8 min-h-[calc(100vh-64px-180px)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading-md text-gr-100">프롬프트 관리</h1>
        <button
          onClick={openCreateModal}
          className="bg-primary text-white px-4 py-2 rounded-lg text-caption-lg-500 flex items-center gap-1 hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          프롬프트 등록
        </button>
      </div>

      <div className="overflow-x-auto bg-bg-100 rounded-xl border border-line-100">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-line-100 text-caption text-gr-300 text-left">
              <th className="py-4 px-6 font-normal">제목</th>
              <th className="py-4 px-6 font-normal w-24 text-center">복사 수</th>
              <th className="py-4 px-6 font-normal w-32 text-center">노출 여부</th>
              <th className="py-4 px-6 font-normal w-44">생성일</th>
              <th className="py-4 px-6 font-normal w-28 text-center">수정/삭제</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-gr-300">로딩 중...</td>
              </tr>
            ) : prompts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-gr-300">등록된 프롬프트가 없습니다.</td>
              </tr>
            ) : (
              prompts.map((p) => (
                <tr key={p.id} className="border-b border-line-100 text-body-400 text-gr-100 last:border-0 hover:bg-bg-200 transition-colors">
                  <td className="py-4 px-6 truncate max-w-[200px] lg:max-w-md">{p.title}</td>
                  <td className="py-4 px-6 text-center">{p.copyCount}</td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleToggleVisibility(p.id)}
                      className={`px-3 py-1 rounded-full text-caption-sm ${
                        p.visible 
                          ? 'bg-primary/10 text-primary border border-primary/20' 
                          : 'bg-gr-400/10 text-gr-300 border border-gr-400/20'
                      }`}
                    >
                      {p.visible ? '노출 중' : '숨김'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-caption text-gr-300">
                    {formatDate(p.createdAt)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => openEditModal(p)} 
                        aria-label="수정"
                        className="p-1 hover:bg-bg-300 rounded transition-colors"
                      >
                        <Pencil size={18} className="text-primary" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)} 
                        aria-label="삭제"
                        className="p-1 hover:bg-bg-300 rounded transition-colors text-gr-300 hover:text-danger"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page + 1}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p - 1)}
          />
        </div>
      )}

      {isModalOpen && (
        <PromptFormModal
          mode={modalMode}
          initialData={selectedPrompt}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchPrompts}
        />
      )}
    </div>
  );
}
