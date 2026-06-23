"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useChat, useCompletion } from "@ai-sdk/react";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
        const bodyObj ={
            prompt:question,
            userId:localStorage.getItem("userId"),
            role:localStorage.getItem("role")
        }
      const response = await fetch("http://localhost:5000/api/v1/ai/query", {
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

  return (
    <div className="max-w-4xl mx-auto flex-1 flex flex-col">
      <div className=" basis-4/5 mx-auto max-w-3xl space-y-6">
        {messages.map((message,index) => (
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
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 border rounded px-4 py-2"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              sendMessage();
            }
          }}
        />

        <Button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </Button>
      </div>
    </div>
  );
}


