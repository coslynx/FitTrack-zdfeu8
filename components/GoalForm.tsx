import { useState } from "react";
import { useStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import { createGoal } from "@/utils/db";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function GoalForm() {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const store = useStore();
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !target.trim() || !timeframe.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const newGoal = await createGoal(
        session?.user.id,
        name,
        parseInt(target),
        timeframe
      );
      store.addGoal({
        id: newGoal.id,
        name: name,
        target: parseInt(target),
        progress: 0,
        timeframe: timeframe,
      });
      toast.success("Goal created successfully");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating goal:", error);
      toast.error("Failed to create goal");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md">
      <h1 className="text-2xl font-bold mb-4">Create a New Goal</h1>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 font-bold mb-2"
        >
          Goal Name
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
          htmlFor="target"
          className="block text-gray-700 font-bold mb-2"
        >
          Target Value
        </label>
        <input
          type="number"
          id="target"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={target}
          onChange={(event) => setTarget(event.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="timeframe"
          className="block text-gray-700 font-bold mb-2"
        >
          Timeframe
        </label>
        <input
          type="text"
          id="timeframe"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={timeframe}
          onChange={(event) => setTimeframe(event.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Goal
      </button>
    </form>
  );
}