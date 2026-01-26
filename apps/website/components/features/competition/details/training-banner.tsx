import { Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const TrainingBanner = () => {
    return (
        <div className="bg-gradient-to-r from-orange-50 to-white border border-orange-100 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center shadow-sm">
            <div className="bg-orange-100 p-4 rounded-full shrink-0">
                <Video className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Free 30-Day Live Training</h3>
                <p className="text-sm text-slate-600">
                    Get daily 1-hour coaching sessions from expert trainers to prepare for the big day.
                    <span className="font-bold text-orange-600"> Included with your ticket.</span>
                </p>
            </div>
            <div className="hidden sm:block">
                <Badge className="bg-orange-600 text-white px-3 py-1">
                    Worth ₹3,000
                </Badge>
            </div>
        </div>
    );
};
