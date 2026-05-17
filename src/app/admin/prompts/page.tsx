'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { adminApi } from '@/lib/api';
import { PromptAdminItem } from '@/types';
import PromptFormModal from '@/components/admin/PromptFormModal';
import Pagination from '@/components/common/Pagination';
import { SearchBar } from '@/components/ui/SearchBar';

export default function AdminPromptsPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const showToast = useToastStore((s) => s.show);

  const [prompts, setPrompts] = useState<PromptAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptAdminItem | null>(
    null,
  );

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getPrompts(page);
      setPrompts(data.content);
      setTotalPages(data.totalPages);
    } catch {
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

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  const handleToggleVisibility = async (id: number) => {
    try {
      await adminApi.toggleVisibility(id);
      showToast('노출 여부가 변경되었습니다.');
      fetchPrompts();
    } catch {
      showToast('변경에 실패했습니다.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까? 되돌릴 수 없습니다.')) return;
    try {
      await adminApi.deletePrompt(id);
      showToast('삭제되었습니다.');
      fetchPrompts();
    } catch {
      showToast('삭제에 실패했습니다.', 'error');
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return '-';
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(
      d.getDate(),
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const filteredPrompts = prompts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8 min-h-[calc(100vh-64px-180px)]">
      <div className="flex items-center justify-between mb-6">
        {/* Left: Title + Search */}
        <div
          className={`flex items-center ${isSearchOpen ? 'gap-3' : 'gap-1'}`}
        >
          <h1 className="text-heading-md text-gr-100">프롬프트 관리</h1>
          {isSearchOpen ? (
            <div className="relative">
              <SearchBar
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색"
                className="w-[220px]"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gr-300 hover:text-gr-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsSearchOpen(true)} className="p-1">
              <Search size={20} className="text-gr-100" />
            </button>
          )}
        </div>

        {/* Right: 프롬프트 등록 버튼 */}
        <button
          onClick={() => {
            setModalMode('create');
            setSelectedPrompt(null);
            setIsModalOpen(true);
          }}
          className="flex items-center bg-primary text-body-500 text-white transition-all hover:opacity-90"
          style={{
            borderRadius: 'var(--radius-sm)',
            paddingLeft: '10px',
            paddingRight: '14px',
            paddingTop: '7px',
            paddingBottom: '7px',
            gap: '4px',
            height: '38px',
          }}
        >
          <Plus size={16} />
          프롬프트 등록
        </button>
      </div>

      <div className="overflow-x-auto bg-bg-100">
        <table className="w-full border-collapse">
          <thead>
            <tr
              className="text-left text-caption-lg-400 text-gr-200"
              style={{
                backgroundColor: 'var(--color-bg-200)',
                borderBottom: '1px solid var(--color-line-100)',
              }}
            >
              <th className="py-[10px] px-6 font-normal">제목</th>
              <th className="py-[10px] px-6 font-normal w-24 text-center">
                복사 수
              </th>
              <th className="py-[10px] px-6 font-normal w-32 text-center">
                노출 여부
              </th>
              <th className="py-[10px] px-6 font-normal w-44">생성일</th>
              <th className="py-[10px] px-6 font-normal w-28 text-center">
                수정/삭제
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-gr-300">
                  로딩 중...
                </td>
              </tr>
            ) : filteredPrompts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-gr-300">
                  {searchQuery
                    ? '검색 결과가 없습니다.'
                    : '등록된 프롬프트가 없습니다.'}
                </td>
              </tr>
            ) : (
              filteredPrompts.map((p) => (
                <tr
                  key={p.id}
                  className="text-body-400 text-gr-100 hover:bg-bg-200 transition-colors"
                  style={{ borderBottom: '1px solid var(--color-line-100)' }}
                >
                  <td className="py-3 px-6 truncate max-w-[200px] lg:max-w-md">
                    {p.title}
                  </td>
                  <td className="py-3 px-6 text-center">{p.copyCount}</td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={p.visible ? 'text-primary' : 'text-gr-100'}
                    >
                      {p.visible ? '노출' : '숨김'}
                    </span>
                  </td>
                  <td className="py-3 px-6">{formatDate(p.createdAt)}</td>
                  <td className="py-3 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setModalMode('edit');
                          setSelectedPrompt(p);
                          setIsModalOpen(true);
                        }}
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
