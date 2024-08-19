import { useState, useEffect } from "react";
import { useStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import { getGoalsByUserId } from "@/utils/db";
import { ProgressChart as Chart } from "react-easy-chart";

export default function ProgressChart({ goalId }: { goalId: string }) {
  const [goal, setGoal] = useState(null);
  const store = useStore();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const fetchedGoal = await getGoalsByUserId(session?.user.id, goalId);
        setGoal(fetchedGoal);
      } catch (error: any) {
        console.error("Error fetching goal:", error);
        // Handle error gracefully, e.g., display a message to the user
      }
    };

    if (session && goalId) {
      fetchGoal();
    }
  }, [session, goalId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Progress Chart</h1>
      {goal && (
        <Chart
          axes
          grid
          data={[
            { x: "Progress", y: goal.progress || 0 },
            { x: "Target", y: goal.target },
          ]}
          width={400}
          height={200}
        />
      )}
    </div>
  );
}