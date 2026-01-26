export interface LiveClassInfo {
  id: string;
  meetLink: string;
  materialLink: string;
  nextTopic: string;
  nextClassAt: Date;
  scheduleInfo: string;   // e.g., "Tues/Thurs 5 PM IST (Telugu/English)"
  isActive: boolean;

  // UI helpers (not required by backend; safe to ignore when wiring API)
  title?: string;         // e.g., "Beginner Batch A"
  tags?: string[];        // e.g., ["Telugu", "English", "Beginner"]
}
