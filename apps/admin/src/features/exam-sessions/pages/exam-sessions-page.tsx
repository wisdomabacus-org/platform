
import { ExamSessionsMonitor } from '../components/monitor';

export default function ExamSessionsPage() {
    return (
        <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-6 overflow-y-scroll px-8 py-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Live Exam Monitor</h1>
                <p className="text-muted-foreground">Real-time status of students currently taking exams.</p>
            </div>

            <ExamSessionsMonitor />
        </div>
    );
}
