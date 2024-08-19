import { useSession } from 'next-auth/react';
import { useStore } from '@/utils/store';
import { useRouter } from 'next/navigation';
import { getUserProfile, updateUserProfile, updateProfilePicture } from '@/utils/db';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function UserProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const { data: session } = useSession();
  const router = useRouter();
  const store = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserProfile(session?.user.id);
        setName(user.name || '');
        setEmail(user.email);
        setProfilePicture(user.profilePicture || '/profile-placeholder.png');
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to fetch user profile');
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateUserProfile(session?.user.id, name, email);
      store.updateUserProfile({ name: name, email: email });
      toast.success('Profile updated successfully');
      router.refresh();
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleUpdateProfilePicture = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      try {
        const url = await updateProfilePicture(session?.user.id, file);
        store.updateProfilePicture({ url: url });
        setProfilePicture(url);
        toast.success('Profile picture updated successfully');
      } catch (error: any) {
        console.error('Error updating profile picture:', error);
        toast.error('Failed to update profile picture');
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="flex flex-col items-center mb-4">
        <Image
          src={profilePicture}
          alt="Profile Picture"
          width={150}
          height={150}
          className="rounded-full"
        />
        <div className="mt-2">
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={handleUpdateProfilePicture}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => document.getElementById('profilePicture')?.click()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Change Profile Picture
          </button>
        </div>
      </div>
      <form onSubmit={handleUpdateProfile}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-bold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            readOnly
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}