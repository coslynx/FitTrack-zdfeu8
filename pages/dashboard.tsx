import { useSession } from 'next-auth/react';
import { useStore } from '@/utils/store';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import GoalList from '@/components/GoalList';
import GoalForm from '@/components/GoalForm';
import ActivityLog from '@/components/ActivityLog';
import SocialFeed from '@/components/SocialFeed';
import UserProfile from '@/components/UserProfile';
import ProgressChart from '@/components/ProgressChart';
import { getGoalsByUserId, getActivitiesByUserId } from '@/utils/db';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [activities, setActivities] = useState([]);
  const store = useStore();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const fetchedActivities = await getActivitiesByUserId(session?.user.id);
        setActivities(fetchedActivities);
      } catch (error: any) {
        console.error('Error fetching activities:', error);
        toast.error('Failed to fetch activities');
      }
    };

    if (session) {
      fetchActivities();
    }
  }, [session]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Fitness Tracker Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1">
          <GoalForm />
          <GoalList />
        </div>
        <div className="col-span-2">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Progress Chart
              </h2>
              <ProgressChart goalId={selectedGoalId} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Activity Log
              </h2>
              <ActivityLog />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Social Feed
            </h2>
            <SocialFeed conversationId="main-feed" />
          </div>
        </div>
      </div>
      <UserProfile />
    </div>
  );
}