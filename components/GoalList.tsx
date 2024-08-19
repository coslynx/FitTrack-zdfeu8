import { useState, useEffect } from "react";
import { useStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import { getGoalsByUserId } from "@/utils/db";
import GoalCard from "./GoalCard";

export default function GoalList() {
  const [goals, setGoals] = useState([]);
  const store = useStore();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const fetchedGoals = await getGoalsByUserId(session?.user.id);
        setGoals(fetchedGoals);
      } catch (error: any) {
        console.error("Error fetching goals:", error);
        // Handle error gracefully, e.g., display a message to the user
      }
    };

    if (session) {
      fetchGoals();
    }
  }, [session]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Goals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}