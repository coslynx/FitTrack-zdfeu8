import { useState, useEffect } from "react";
import { useStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import { getMessagesByConversationId } from "@/utils/db";

export default function MessageList({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState([]);
  const store = useStore();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMessagesByConversationId(
          conversationId,
          session?.user.id
        );
        setMessages(fetchedMessages);
      } catch (error: any) {
        console.error("Error fetching messages:", error);
        // Handle error gracefully, e.g., display a message to the user
      }
    };

    fetchMessages();
  }, [conversationId, session]);

  return (
    <div className="flex flex-col gap-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-2 rounded-md ${
            message.senderId === session?.user.id
              ? "bg-blue-100"
              : "bg-gray-100"
          }`}
        >
          <span className="font-bold">{message.senderName}</span>:{" "}
          {message.content}
        </div>
      ))}
    </div>
  );
}