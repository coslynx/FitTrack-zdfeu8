import { useState, useEffect } from "react";
import { useStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import { updateGoal, deleteGoal } from "@/utils/db";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function GoalCard({ goal }: { goal: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(goal.name);
  const [target, setTarget] = useState(goal.target);
  const [timeframe, setTimeframe] = useState(goal.timeframe);
  const store = useStore();
  const { data: session } = useSession();
  const router = useRouter();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await updateGoal(goal.id, name, parseInt(target), timeframe);
      store.updateGoal({
        id: goal.id,
        name: name,
        target: parseInt(target),
        timeframe: timeframe,
      });
      setIsEditing(false);
      toast.success("Goal updated successfully");
    } catch (error: any) {
      console.error("Error updating goal:", error);
      toast.error("Failed to update goal");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGoal(goal.id);
      store.deleteGoal(goal.id);
      toast.success("Goal deleted successfully");
    } catch (error: any) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
    }
  };

  return (
    <div className="p-4 border rounded-md bg-white shadow-md">
      <h2 className="text-xl font-bold mb-2">{goal.name}</h2>
      <p className="mb-2">Target: {goal.target}</p>
      <p className="mb-2">Timeframe: {goal.timeframe}</p>
      {!isEditing && (
        <>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${(goal.progress / goal.target) * 100}%` }}
            ></div>
          </div>
          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Delete
          </button>
        </>
      )}
      {isEditing && (
        <form onSubmit={handleSave} className="mt-4">
          <div className="mb-2">
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
          <div className="mb-2">
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
          <div className="mb-2">
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
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
        </form>
      )}
    </div>
  );
}