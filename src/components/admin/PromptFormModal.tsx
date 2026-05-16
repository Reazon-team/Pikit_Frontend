'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { useToastStore } from '@/stores/toastStore';
import { PromptAdminItem } from '@/types';

interface PromptFormModalProps {
  mode: 'create' | 'edit';
  initialData?: PromptAdminItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PromptFormModal({ mode, initialData, onClose, onSuccess }: PromptFormModalProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [beforeImageUrl, setBeforeImageUrl] = useState(initialData?.beforeImageUrl ?? '');
  const [afterImageUrl, setAfterImageUrl] = useState(initialData?.afterImageUrl ?? '');
  const [promptText, setPromptText] = useState(initialData?.promptText ?? '');
  const [visible, setVisible] = useState(initialData?.visible ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useToastStore((s) => s.show);

  const handleSubmit = async () => {
    if (!title.trim()) {
      showToast('제목을 입력해주세요.', 'error');
      return;
    }
    if (!beforeImageUrl.trim() || !afterImageUrl.trim()) {
      showToast('이미지 URL을 입력해주세요.', 'error');
      return;
    }
    if (!promptText.trim()) {
      showToast('프롬프트를 입력해주세요.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { title, beforeImageUrl, afterImageUrl, promptText, visible };
      if (mode === 'create') {
        await adminApi.createPrompt(payload);
        showToast('프롬프트가 등록되었습니다.');
      } else {
        await adminApi.updatePrompt(initialData!.id, payload);
        showToast('프롬프트가 수정되었습니다.');
      }
      onSuccess();
      onClose();
    } catch (err) {
      showToast('처리에 실패했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-bg-100 rounded-2xl w-[480px] max-w-[90vw] p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-md text-gr-100">
            {mode === 'create' ? '프롬프트 등록' : '프롬프트 수정'}
          </h2>
          <button onClick={onClose} aria-label="닫기">
            <X size={20} className="text-gr-300 hover:text-gr-100" />
          </button>
        </div>

        {/* 제목 */}
        <div className="mb-4">
          <label className="text-caption-lg-500 text-gr-100 block mb-2">프롬프트 제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요."
            className="w-full border border-line-100 rounded-lg px-4 py-3 text-body-400 outline-none focus:border-primary bg-bg-100"
          />
        </div>

        {/* 이미지 URL (전/후) */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-caption-lg-500 text-gr-100 block mb-2">전 이미지 URL</label>
            <input
              value={beforeImageUrl}
              onChange={(e) => setBeforeImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-line-100 rounded-lg px-3 py-3 text-caption-lg-400 outline-none focus:border-primary bg-bg-100"
            />
          </div>
          <div>
            <label className="text-caption-lg-500 text-gr-100 block mb-2">후 이미지 URL</label>
            <input
              value={afterImageUrl}
              onChange={(e) => setAfterImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-line-100 rounded-lg px-3 py-3 text-caption-lg-400 outline-none focus:border-primary bg-bg-100"
            />
          </div>
        </div>

        {/* 프롬프트 텍스트 */}
        <div className="mb-4">
          <label className="text-caption-lg-500 text-gr-100 block mb-2">프롬프트</label>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="프롬프트를 입력해주세요."
            rows={4}
            className="w-full border border-line-100 rounded-lg px-4 py-3 text-body-400 outline-none focus:border-primary resize-none bg-bg-100"
          />
        </div>

        {/* 노출 여부 토글 */}
        <div className="mb-6">
          <label className="text-caption-lg-500 text-gr-100 block mb-2">노출 여부</label>
          <button
            onClick={() => setVisible(!visible)}
            className={`relative w-11 h-6 rounded-full transition-colors ${visible ? 'bg-primary' : 'bg-gr-400'}`}
            aria-label="노출 여부 토글"
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${visible ? 'translate-x-5' : ''}`} />
          </button>
        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="text-body-500 text-gr-200 px-4 py-2 hover:text-gr-100">
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary text-white px-5 py-2 rounded-lg text-body-500 hover:opacity-90 disabled:opacity-50"
          >
            {mode === 'create' ? '등록' : '수정'}
          </button>
        </div>
      </div>
    </div>
  );
}
