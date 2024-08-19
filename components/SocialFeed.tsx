import { useSession } from 'next-auth/react';
import { useStore } from '@/utils/store';
import { useState, useEffect } from 'react';
import { getPostsByConversationId, createPost, deletePost, updatePost } from '@/utils/db';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Post from './Post';
import { FiPlusCircle } from 'react-icons/fi';

export default function SocialFeed({ conversationId }: { conversationId: string }) {
  const [posts, setPosts] = useState([]);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const store = useStore();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPostsByConversationId(conversationId, session?.user.id);
        setPosts(fetchedPosts);
      } catch (error: any) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to fetch posts');
      }
    };

    fetchPosts();
  }, [conversationId, session]);

  const handleCreatePost = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      const newPost = await createPost(conversationId, session?.user.id, newPostContent);
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setIsAddingPost(false);
      toast.success('Post created successfully');
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
      toast.success('Post deleted successfully');
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleUpdatePost = async (postId: string, newContent: string) => {
    try {
      const updatedPost = await updatePost(postId, newContent);
      setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)));
      toast.success('Post updated successfully');
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Social Feed</h1>
      {!isAddingPost && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
          onClick={() => setIsAddingPost(true)}
        >
          <FiPlusCircle className="mr-2" />
          Add Post
        </button>
      )}
      {isAddingPost && (
        <form onSubmit={handleCreatePost} className="mb-4">
          <textarea
            className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your post..."
            value={newPostContent}
            onChange={(event) => setNewPostContent(event.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            Post
          </button>
        </form>
      )}
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onDelete={handleDeletePost}
            onUpdate={handleUpdatePost}
          />
        ))}
      </div>
    </div>
  );
}