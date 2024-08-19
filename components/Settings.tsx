import { useState } from "react";
import { useStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  updateUserProfile,
  updateProfilePicture,
} from "@/utils/db";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const { session } = useSession();
  const router = useRouter();

  const store = useStore();

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateUserProfile(
        session?.user.id,
        name,
        email
      );
      store.updateUserProfile({ name: name, email: email });
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const handleUpdateProfilePicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      try {
        const url = await updateProfilePicture(session?.user.id, file);
        store.updateProfilePicture({ url: url });
        setProfilePicture(url);
        toast.success("Profile picture updated successfully");
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to update profile picture");
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <form onSubmit={handleUpdateProfile}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={name || ""}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email || ""}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Profile
        </button>
      </form>
      <div className="mt-4">
        <label htmlFor="profilePicture" className="block text-gray-700 font-bold mb-2">
          Profile Picture
        </label>
        <input
          type="file"
          id="profilePicture"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          accept="image/*"
          onChange={handleUpdateProfilePicture}
        />
        {profilePicture && (
          <img
            src={profilePicture}
            alt="Profile Picture"
            className="mt-2 rounded-full w-24 h-24"
          />
        )}
      </div>
    </div>
  );
}