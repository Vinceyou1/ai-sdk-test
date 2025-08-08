"use client";

import { ArrowBendRightUpIcon } from "@phosphor-icons/react";
import Markdown from "markdown-to-jsx";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { Weather } from "@/components/weather";
import { DefaultChatTransport } from "ai";

export default function ToolCalling() {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/tool-calling",
    }),
  });
  return (
    <div className="text-gray-400 flex-grow flex flex-col items-center justify-between">
      <div className="flex flex-col w-1/2 p-4 gap-4">
        {messages.map((message, index) => {
          return (
            <div
              key={"message" + index}
              className={cn(
                "rounded-lg border-2 border-gray-800 p-4",
                message.role == "user" && "ml-8 rounded-br-none",
                message.role == "assistant" && "mr-8 rounded-bl-none"
              )}
            >
              {message.parts.map((part) => {
                if (part.type !== "tool-getCurrentWeather") return null;
                if (part.state == "output-available") {
                  const result = part.output as {
                    current: {
                      temp_f: number;
                      condition: { text: string; icon: string };
                      is_day: boolean;
                    };
                    location: { name: string; localtime: string };
                  };
                  return (
                    <div key={part.toolCallId}>
                      <Weather
                        temperature={result.current.temp_f}
                        condition={result.current.condition.text}
                        location={result.location.name}
                        icon={"https:" + result.current.condition.icon}
                        is_day={result.current.is_day}
                        localtime={result.location.localtime}
                      />
                    </div>
                  );
                } else if (part.state == "input-available") {
                  const input = part.input as { location: string };
                  return (
                    <div key={part.toolCallId}>
                      Loading weather data for {input.location}...
                    </div>
                  );
                }
              })}
              <Markdown>
                {
                  message.parts
                    .filter((part) => part.type === "text")
                    .map((part) => part.text)
                    .join("\n") as string
                }
              </Markdown>
            </div>
          );
        })}
      </div>
      <div className="w-1/2 flex flex-row items-center gap-4">
        <textarea
          id="user-input"
          placeholder="Ask questions about the weather"
          className="text-gray-400 flex-1 p-4 h-24 rounded-lg outline-gray-700 outline-1 focus:outline-2 focus:border-0 resize-none"
        />
        <button
          onClick={() => {
            sendMessage({
              text: (
                document.getElementById("user-input") as HTMLTextAreaElement
              ).value,
            });
            const textarea = document.getElementById(
              "user-input"
            ) as HTMLTextAreaElement;
            textarea.value = "";
          }}
          className="rounded-full outline-1 hover:outline-2 p-2 cursor-pointer text-gray-400 outline-gray-700"
        >
          <ArrowBendRightUpIcon size={48} />
        </button>
      </div>
    </div>
  );
}
