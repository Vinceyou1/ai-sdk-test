"use client";

import { ArrowBendRightUpIcon } from "@phosphor-icons/react";
import Markdown from "markdown-to-jsx";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { ToolInvocation } from "@ai-sdk/ui-utils";
import { Weather } from "@/components/weather";

export default function ToolCalling() {
  const { messages, handleSubmit, handleInputChange } = useChat({
    api: "/api/tool-calling",
  });
  return (
    <div className="text-gray-400 flex-grow flex flex-col items-center justify-between">
      <div className="flex flex-col w-1/2 p-4 gap-4">
        {messages.map((message, index) => {
          const weatherToolCalls: ToolInvocation[] = [];
          message.parts.forEach((part) => {
            if (part.type === "tool-invocation") {
              weatherToolCalls.push(part.toolInvocation);
            }
          });
          return (
            <div
              key={"message" + index}
              className={cn(
                "rounded-lg border-2 border-gray-800 p-4",
                message.role == "user" && "ml-8 rounded-br-none",
                message.role == "assistant" && "mr-8 rounded-bl-none"
              )}
            >
              {weatherToolCalls.map((toolInvocation) => {
                const { state, toolCallId } = toolInvocation;
                if (state === "result") {
									const { result } = toolInvocation;
									return (
										<div key={toolCallId}>
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
                } else {
                  return (
                    <div key={toolCallId}>
											Loading weather data for {toolInvocation.args.location}...
                    </div>
                  );
                }
              })}
              <Markdown>{message.content as string}</Markdown>
            </div>
          );
        })}
      </div>
      <div className="w-1/2 flex flex-row items-center gap-4">
        <textarea
          id="user-input"
          placeholder="Ask questions about the weather"
          onChange={handleInputChange}
          className="text-gray-400 flex-1 p-4 h-24 rounded-lg outline-gray-700 outline-1 focus:outline-2 focus:border-0 resize-none"
        />
        <button
          onClick={async (event) => {
            handleSubmit(event);
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
