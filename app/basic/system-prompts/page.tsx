"use client";

import { CoreMessage } from "ai";
import { useState } from "react";
import { ArrowBendRightUpIcon } from "@phosphor-icons/react";
import { MessageList } from "@/components/message-list";

export default function StreamText() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [prevSystemMessage, setPrevSystemMessage] = useState("");
  return (
    <div className="text-gray-400 flex-grow flex flex-col items-center justify-between">
      <MessageList messages={messages} />
      <div className="w-1/2 flex flex-row items-center gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            id="system-prompt"
            placeholder="System prompt"
            className="text-gray-400 p-4 h-24 rounded-lg outline-gray-700 outline-1 focus:outline-2 focus:border-0 resize-none"
          />
          <textarea
            id="user-input"
            placeholder="Ask anything"
            className="text-gray-400 p-4 h-24 rounded-lg outline-gray-700 outline-1 focus:outline-2 focus:border-0 resize-none"
          />
        </div>
        <button
          onClick={async () => {
            let messagesCopy = [...messages];
            const systemTextArea = document.getElementById(
              "system-prompt"
            ) as HTMLTextAreaElement;
            let systemPrompt = systemTextArea.value;
            if (systemPrompt && systemPrompt != prevSystemMessage) {
              const systemMessage: CoreMessage = {
                role: "system",
                content: systemPrompt,
              };
              setPrevSystemMessage(systemPrompt);
              messagesCopy.push(systemMessage);
              setMessages([...messagesCopy]);
            } else {
              systemPrompt = prevSystemMessage;
            }

            const userTextArea = document.getElementById(
              "user-input"
            ) as HTMLTextAreaElement;
            const userContent = userTextArea.value;
            if (!userContent || userContent == "") return;
            userTextArea.value = "";
            const userMessage: CoreMessage = {
              role: "user",
              content: userContent,
            };
            messagesCopy.push(userMessage);
            setMessages([...messagesCopy]);
            fetch("/api/basic/system-prompts", {
              method: "POST",
              body: JSON.stringify({
                prompt: userContent,
                systemPrompt: systemPrompt,
              }),
            }).then(async (response) => {
              if (response.body) {
                const reader = response.body.getReader();
                let aiResponse: CoreMessage = {
                  role: "assistant",
                  content: "",
                };
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  aiResponse.content += new TextDecoder().decode(value);
                  setMessages([...messagesCopy, aiResponse]);
                }
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
