import { CoreMessage } from "ai";
import Markdown from "markdown-to-jsx";
import { cn } from "@/lib/utils";

export function MessageList({ messages }: { messages: CoreMessage[] }) {
  return (
    <div className="flex flex-col w-1/2 p-4 gap-4">
      {messages.map((message, index) => (
        <div
          key={"message" + index}
          className={cn(
            "rounded-lg border-2 border-gray-800 p-4",
            message.role == "user" && "ml-8 rounded-br-none",
            message.role == "assistant" && "mr-8 rounded-bl-none"
          )}
        >
          <strong>{`${message.role}: `}</strong>
          <Markdown>{message.content as string}</Markdown>
        </div>
      ))}
    </div>
  );
}