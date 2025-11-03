import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | In Labs",
  description:
    "In Labs와 협업하거나 피드백을 전하고 싶다면 이메일 또는 SNS 메시지로 연락 주세요.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <section className="prose prose-invert max-w-3xl">
      <h1>Contact</h1>
      <p>
        제안, 에러 제보, 협업 문의는{" "}
        <a href="mailto:in63119@gmail.com">in63119@gmail.com</a> 로 보내주시면
        빠르게 회신드립니다.
      </p>
    </section>
  );
}
