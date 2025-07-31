"use client";

import { cn } from "@/lib/utils";
import { CoreMessage } from "ai";
import { useState } from "react";
import { ArrowBendRightUpIcon } from "@phosphor-icons/react";
import Markdown from "markdown-to-jsx";

export default function GenerateText() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  return (
    <div className="text-gray-400 flex-grow flex flex-col items-center justify-between">
      <div className="flex flex-col w-1/2 p-4 gap-4">
        {messages.map((message, index) => {
          return (
            <div
              key={"message" + index}
              className={cn(
                "rounded-lg border-2 border-gray-800 p-4",
                message.role == "user" ? "ml-8 rounded-br-none" : "mr-8 rounded-bl-none"
              )}
            >
              <Markdown>{message.content as string}</Markdown>
            </div>
          );
        })}
      </div>
      <div className="w-1/2 flex flex-row items-center gap-4">
        <textarea
          id="user-input"
          placeholder="Ask anything"
          className="text-gray-400 flex-1 p-4 h-24 rounded-lg outline-gray-700 outline-1 focus:outline-2 focus:border-0 resize-none"
        />
        <button
          onClick={async () => {
            let tempMessages = messages;
            const textarea = document.getElementById(
              "user-input"
            ) as HTMLTextAreaElement;
            const content = textarea.value;
            if (!content || content == "") return;
            textarea.value = ""
            let userMessage: CoreMessage = {
              role: "user",
              content: content,
            };
            tempMessages.push(userMessage);
            setMessages(tempMessages);
            await fetch("/api/generate-text", {
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
                let aiResponse: CoreMessage = {
                  role: "assistant",
                  content: aiContent,
                };
                setMessages([...messages, aiResponse]);
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
