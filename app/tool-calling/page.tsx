"use client";

import { CoreMessage } from "ai";
import { ArrowBendRightUpIcon } from "@phosphor-icons/react";
import Markdown from "markdown-to-jsx";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { ToolInvocation, ToolInvocationUIPart } from "@ai-sdk/ui-utils";
import { Weather } from "@/components/weather";

export default function ToolCalling() {
  const { messages, handleSubmit, handleInputChange } = useChat({
    api: "/api/tool-calling",
  });
  return (
    <div className="text-gray-400 flex-grow flex flex-col items-center justify-between">
      <div className="flex flex-col w-1/2 p-4 gap-4">
        {messages.map((message, index) => {
          let weatherToolCalls: ToolInvocation[] = [];
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
                const { state, toolName, toolCallId } = toolInvocation;

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
            // let messagesCopy = [...messages];
            // const textarea = document.getElementById(
            //   "user-input"
            // ) as HTMLTextAreaElement;
            // const content = textarea.value;
            // if (!content || content == "") return;
            // textarea.value = "";
            // const userMessage: CoreMessage = {
            //   role: "user",
            //   content: content,
            // };
            // messagesCopy.push(userMessage);
            // setMessages([...messagesCopy]);
            // fetch("/api/tool-calling", {
            //   method: "POST",
            //   body: content,
            // }).then(async (response) => {
            //   if (response.body) {
            //     const reader = response.body.getReader();
            //     const decoder = new TextDecoder();
            // 		let aiResponse: CoreMessage = {
            // 			role: "assistant",
            // 			content: "",
            // 		};
            //     try {
            //       while (true) {
            //         const { done, value } = await reader.read();
            //         if (done) break;

            //         const chunk = decoder.decode(value);
            //         const lines = chunk
            //           .split("\n")
            //           .filter((line) => line.trim());

            //         for (const line of lines) {
            //           try {
            //             const parsed = JSON.parse(line);
            //             if (parsed.type === "text") {
            //               console.log("Text stream:", parsed.data);
            //               aiResponse.content += parsed.data;
            // 							setMessages([...messagesCopy, aiResponse]);
            //             } else if (parsed.type === "tool-result") {
            //               console.log("Tool result:", parsed.data);
            // 							const toolResult: CoreMessage = {
            // 								role: "tool",
            // 								content: [
            // 									{
            // 										type: "tool-result",
            // 										toolName: parsed.data.toolName,
            // 										toolCallId: parsed.data.toolCallId,
            // 										result: parsed.data.result,
            // 									}
            // 								]
            // 							};
            // 							messagesCopy.push(toolResult);
            // 							setMessages([...messagesCopy]);
            //             }
            //           } catch (e) {
            //             console.error("Failed to parse line:", line);
            //           }
            //         }
            //       }
            //     } finally {
            //       reader.releaseLock();
            //     }
            //   }
            // });
          }}
          className="rounded-full outline-1 hover:outline-2 p-2 cursor-pointer text-gray-400 outline-gray-700"
        >
          <ArrowBendRightUpIcon size={48} />
        </button>
      </div>
    </div>
  );
}
