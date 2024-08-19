import { useSession } from "next-auth/react";
import { useStore } from "@/utils/store";
import { useState, useEffect } from "react";
import { getActivitiesByUserId } from "@/utils/db";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const { data: session } = useSession();
  const store = useStore();
  const router = useRouter();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const fetchedActivities = await getActivitiesByUserId(session?.user.id);
        setActivities(fetchedActivities);
      } catch (error: any) {
        console.error("Error fetching activities:", error);
        toast.error("Failed to fetch activities");
      }
    };

    if (session) {
      fetchActivities();
    }
  }, [session]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Activity Log</h1>
      <div className="flex flex-col gap-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-2 rounded-md bg-gray-100"
          >
            <span className="font-bold">{activity.type}</span>:{" "}
            {activity.description} - {activity.date}
          </div>
        ))}
      </div>
    </div>
  );
}