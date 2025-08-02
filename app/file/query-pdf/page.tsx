"use client";

import { CoreMessage } from "ai";
import { useRef, useState } from "react";
import { MessageList } from "@/components/message-list";
import { ArrowBendRightUpIcon, PlusIcon } from "@phosphor-icons/react";

export default function QueryPDF() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);

	const [attachmentName, setAttachmentName] = useState<string | null>(null);
	const [attachmentSrc, setAttachmentSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    console.log("Button clicked");
		fileInputRef.current!.value = ""; // Reset the input value to allow re-uploading the same file
		setAttachmentName(null);
		setAttachmentSrc(null);
    fileInputRef.current?.click();
  };

  return (
    <div className="text-gray-400 flex-grow flex flex-col items-center justify-between">
      <MessageList messages={messages} />
      <div className="w-1/2 flex flex-row items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleClick}
            className="rounded-full outline-1 hover:outline-2 p-2 cursor-pointer text-gray-400 outline-gray-700"
          >
            <PlusIcon size={32} />
          </button>
          <input
            className="hidden"
            id="upload"
            type="file"
            name="upload"
            accept=".pdf"
            ref={fileInputRef} // Reference to the file input element
            // Event handler to capture file selection and update the state

            onChange={(event) => {
              const file = event.target.files?.[0]; // Get the first file from the FileList
              if (!file) {
								setAttachmentName(null);
								setAttachmentSrc(null);
								return;
							}

              const reader = new FileReader();
              reader.onloadend = () => {
                const base64String = reader.result as string;
                const messagesCopy = [...messages];
								setAttachmentName(file.name);
								setAttachmentSrc(base64String);
              };
              reader.readAsDataURL(file); // 🔥 This converts the image to a base64 data URL
              (document.getElementById("upload") as HTMLInputElement).value = ""; // Reset the input value to allow re-uploading the same file
            }}
          />
          <div>
            {attachmentName ? (
              <span className="text-gray-400">{attachmentName}</span>
            ) : (
              <span className="text-gray-400">No file selected</span>
            )}
          </div>
        </div>
        <textarea
          id="user-input"
          placeholder="Ask anything"
          className="text-gray-400 flex-1 p-4 h-24 rounded-lg outline-gray-700 outline-1 focus:outline-2 focus:border-0 resize-none"
        />
        <button
          onClick={async () => {
            let messagesCopy = [...messages];
            const textarea = document.getElementById(
              "user-input"
            ) as HTMLTextAreaElement;
            const content = textarea.value;
            if (!content || content == "") return;
            textarea.value = "";
            const userMessage: CoreMessage = {
              role: "user",
              content: content + "\nAttached: " + (attachmentName || "document.pdf"),
            };
            messagesCopy.push(userMessage);
            setMessages([...messagesCopy]);
            fetch("/api/file/query-pdf", {
              method: "POST",
              body: JSON.stringify({
                prompt: content,
                attachment: attachmentSrc,
                attachmentName: attachmentName || "document.pdf", // Default name if not set
              }),
              headers: {
                "Content-Type": "application/json",
              },
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
