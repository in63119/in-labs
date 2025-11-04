"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import { deletePost } from "@/lib/postClient";
import { useAdminAuth } from "@/providers/AdminAuthProvider";

type DeletePostButtonProps = {
  postId: string;
  metadataUrl: string;
  labName: string;
  labSegment: string;
  slug: string;
  className?: string;
};

export default function DeletePostButton({
  postId,
  metadataUrl,
  labName,
  labSegment,
  slug,
  className,
}: DeletePostButtonProps) {
  const router = useRouter();
  const { isVerified, adminCode, setVerified } = useAdminAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [defaultCode, setDefaultCode] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (adminCode) {
      setDefaultCode(adminCode);
    } else if (typeof window !== "undefined") {
      const storedCode = window.localStorage.getItem("adminAuthCode");
      if (storedCode) {
        setDefaultCode(storedCode);
      }
    }
  }, [adminCode]);

  if (!isVerified) {
    return null;
  }

  const openModal = () => {
    const message = `${labName} 글을 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.`;
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-alert
      if (!window.confirm(message)) {
        return;
      }
    }
    setErrorMessage(null);
    setAuthModalOpen(true);
  };

  const closeModal = () => {
    if (isProcessing) {
      return;
    }
    setAuthModalOpen(false);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  const handleAuthVerified = async (code: string) => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      await deletePost({
        adminCode: code,
        postId,
        metadataUrl,
        labSegment,
        slug,
      });

      if (typeof window !== "undefined") {
        window.localStorage.setItem("adminAuthCode", code);
      }

      setVerified(code);

      setAuthModalOpen(false);
      router.push(`/${labSegment}`);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다.";
      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={className}
        ref={triggerRef}
      >
        삭제
      </button>

      <AuthModal
        open={authModalOpen}
        onClose={closeModal}
        onVerified={handleAuthVerified}
        isProcessing={isProcessing}
        errorMessage={errorMessage}
        defaultCode={defaultCode}
        description="포스트를 삭제하려면 관리자 인증이 필요합니다."
        processingMessage="삭제 중입니다… 잠시만 기다려주세요."
      />
    </>
  );
}
