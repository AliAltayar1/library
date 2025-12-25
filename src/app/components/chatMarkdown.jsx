import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ChatMessage({ text }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}
