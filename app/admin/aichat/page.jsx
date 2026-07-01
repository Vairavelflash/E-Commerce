"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import axios from "axios";

import { useRef, useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const fileInputRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const question = input;
    setInput("");
    setLoading(true);

    const assistantId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
      },
    ]);

    try {
      const bodyObj = {
        prompt: question,
        userId: localStorage.getItem("userId"),
        role: localStorage.getItem("role"),
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyObj),
      });

      //       const response = await api.post("/ai/chat",{
      //     "question":question
      // })

      if (!response.body) return;

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      while (reader) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;

          const text = line.replace("data:", "").trim();

          if (!text || text === "[DONE]" || text === "Connected") {
            continue;
          }

          assistantMessage += text;

          setMessages((prev) => {
            const updated = [...prev];

            updated[updated.length - 1] = {
              role: "assistant",
              content: assistantMessage,
            };

            return updated;
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessageBulk = async () => {
    try {
      if (!input.trim()) return;
      // Upload Document
      if (file) {
        uploadPdf();
      }

      const userMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: input,
      };

      setMessages((prev) => [...prev, userMessage]);

      setInput("");
      setLoading(true);

      const assistantId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
        },
      ]);

      const response = await api.post("/ai/chat", {
        prompt: input,
      });
      console.log("first", response);
      if (response.data.success) {
        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "assistant",
            content: response.data.content,
          };

          return updated;
        });
      }
    } catch (error) {
      console.error(err);
    } finally {
      fileInputRef.current.value = "";
      setFile(null);
      setLoading(false);
    }
  };

  const uploadPdf = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/pdf/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Upload Successful");
    } catch (error) {
      console.log(error);

      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  console.log("first", file);
  return (
    <div className="max-w-4xl mx-auto flex-1 flex flex-col">
      <div className=" basis-4/5  w-full mx-5 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <div className="basis-1/5 border-t p-4 flex gap-2">
        <div className="flex flex-col gap-2 w-full">
          {file && (
            <div className="flex items-center gap-2 mb-2 bg-gray-50 p-2 rounded border">
              <span className="text-sm truncate flex-1">{file.name} </span>
              <button
                onClick={removeFile}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove file"
              >
                x
              </button>
            </div>
          )}

          <input
            type="file"
            accept=".pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.length) {
                setFile(e.target.files[0]);
              }
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="border rounded px-3 py-1.5 hover:bg-gray-50 transition-colors"
              title="Attach file"
            >
              +
            </button>{" "}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 border rounded px-4 py-2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  // sendMessage();
                  sendMessageBulk();
                }
              }}
            />
            <Button
              // onClick={sendMessage}
              onClick={sendMessageBulk}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
