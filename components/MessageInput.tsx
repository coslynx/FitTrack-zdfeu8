import { useState } from 'react';
import { useStore } from '@/utils/store';
import { useSession } from 'next-auth/react';
import { sendMessage } from '@/utils/db';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function MessageInput({ conversationId }: { conversationId: string }) {
  const [message, setMessage] = useState('');
  const store = useStore();
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage(conversationId, session?.user.id, message);
      setMessage('');
      store.addMessage({
        content: message,
        senderId: session?.user.id,
        senderName: session?.user.name,
      });
      toast.success('Message sent successfully');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-grow rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Send
      </button>
    </form>
  );
}