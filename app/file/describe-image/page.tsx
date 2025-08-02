"use client";

import { CoreMessage } from "ai";
import { useRef, useState } from "react";
import { MessageList } from "@/components/message-list";

export default function StreamText() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);

  const [processing, setProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    console.log("Button clicked");
    fileInputRef.current?.click();
  };

  return (
    <div className="text-gray-400 flex-grow flex flex-col items-center justify-between">
      <MessageList messages={messages} />
      <div className="w-1/2 flex flex-row items-center gap-4">
        <button
          onClick={handleClick}
          disabled={processing}
          className="text-2xl p-4
        text-gray-400 flex-1 h-24 rounded-lg outline-gray-700 outline-1 hover:outline-2 resize-none
        "
        >
          {processing ? "Processing..." : "Upload Image"}
        </button>
        <input
          className="hidden"
          id="upload"
          type="file"
          name="upload"
          accept="image/*"
          ref={fileInputRef} // Reference to the file input element
          // Event handler to capture file selection and update the state

          onChange={(event) => {
            const file = event.target.files?.[0]; // Get the first file from the FileList
            if (!file) return;
            setProcessing(true);

            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result as string;
              const messagesCopy = [...messages];
              fetch("/api/file/describe-image", {
                method: "POST",
                body: base64String,
              }).then(async (response) => {
                if (response.body) {
                  const reader = response.body.getReader();
                  let aiResponse: CoreMessage = {
                    role: "assistant",
                    content: "",
                  };
                  while (true) {
                    const { done, value } = await reader.read();
                    console.log(
                      "Received chunk:",
                      new TextDecoder().decode(value)
                    );
                    if (done) break;
                    aiResponse.content += new TextDecoder().decode(value);
                  }
                  setMessages([...messagesCopy, aiResponse]);
                }
              });

              setProcessing(false);
            };
            reader.readAsDataURL(file); // 🔥 This converts the image to a base64 data URL
            (document.getElementById("upload") as HTMLInputElement).value = ""; // Reset the input value to allow re-uploading the same file
          }}
        />
      </div>
    </div>
  );
}
