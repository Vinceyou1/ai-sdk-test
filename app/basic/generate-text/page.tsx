"use client";

import { CoreMessage } from "ai";
import { useState } from "react";
import { ArrowBendRightUpIcon } from "@phosphor-icons/react";
import { MessageList } from "@/components/message-list";

export default function GenerateText() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  return (
    <div className="text-gray-400 flex-grow flex flex-col items-center justify-between">
      <MessageList messages={messages} />
      <div className="w-1/2 flex flex-row items-center gap-4">
        <textarea
          id="user-input"
          placeholder="Ask anything"
          className="text-gray-400 flex-1 p-4 h-24 rounded-lg outline-gray-700 outline-1 focus:outline-2 focus:border-0 resize-none"
        />
        <button
          onClick={async () => {
            const messagesCopy = [...messages];
            const textarea = document.getElementById(
              "user-input"
            ) as HTMLTextAreaElement;
            const content = textarea.value;
            if (!content || content == "") return;
            textarea.value = "";
            const userMessage: CoreMessage = {
              role: "user",
              content: content,
            };
            messagesCopy.push(userMessage);
            setMessages([...messagesCopy]);
            await fetch("/api/basic/generate-text", {
              method: "POST",
              body: content,
            }).then(async (response) => {
              if (response.body) {
                const reader = response.body.getReader();
                let aiContent = "";
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  aiContent += new TextDecoder().decode(value);
                }
                const aiResponse: CoreMessage = {
                  role: "assistant",
                  content: aiContent,
                };
                setMessages([...messagesCopy, aiResponse]);
              }
            });
          }}
          className="rounded-full outline-1 hover:outline-2 p-2 cursor-pointer text-gray-400 outline-gray-700"
        >
          <ArrowBendRightUpIcon size={48} />
        </button>
      </div>
    </div>
  );
}
