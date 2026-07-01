"use client";

import MessageItem from "@/components/chat/MessageItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

function page() {
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
      const bodyObj = {
        prompt: question,
        userId: localStorage.getItem("userId"),
        role: localStorage.getItem("role"),
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/aiAgent/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyObj),
        },
      );

      if (!response.body) return;
      const data = await response.json();
      console.log("first", data);

      setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          role: "assistant",
          content: data?.response,
        };

        return updated;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col">
      <div className="flex-1 basis-4/5  w-full mx-5 space-y-4 overflow-y-auto lg:h-4/5">
        {messages?.map((message, index) => (
          <MessageItem key={message?.id || index} message={message} />
        ))}
      </div>

      <div className=" border-t p-4 flex gap-2 h-fit sticky">
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

export default page;
