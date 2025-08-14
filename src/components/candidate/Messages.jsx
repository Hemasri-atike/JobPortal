import React, { useState } from "react";
import { Mail, CheckCircle, AlertCircle, Calendar, Briefcase } from "lucide-react";

const Messages = () => {
  const [messages] = useState([
    {
      id: 1,
      type: "success",
      icon: CheckCircle,
      title: "Application Submitted",
      message: "Your application for Frontend Developer at TCS has been submitted successfully.",
      date: "2025-08-12",
    },
    {
      id: 2,
      type: "info",
      icon: Calendar,
      title: "Interview Scheduled",
      message: "You have an interview for Backend Developer at Infosys on 18th August at 11:00 AM.",
      date: "2025-08-10",
    },
    {
      id: 3,
      type: "warning",
      icon: AlertCircle,
      title: "Profile Update Required",
      message: "Your profile is 70% complete. Add your latest project to get more visibility.",
      date: "2025-08-09",
    },
    {
      id: 4,
      type: "info",
      icon: Briefcase,
      title: "New Job Alert",
      message: "UI/UX Designer role at Wipro matches your skills.",
      date: "2025-08-08",
    },
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Mail className="w-6 h-6 text-blue-500" /> Messages & Notifications
      </h2>

      <div className="space-y-4">
        {messages.map(({ id, icon: Icon, title, message, date, type }) => (
          <div
            key={id}
            className={`flex items-start gap-4 p-4 rounded-lg shadow-sm border 
              ${
                type === "success"
                  ? "bg-green-50 border-green-200"
                  : type === "warning"
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-blue-50 border-blue-200"
              }`}
          >
            <Icon
              className={`w-6 h-6 flex-shrink-0 
                ${
                  type === "success"
                    ? "text-green-500"
                    : type === "warning"
                    ? "text-yellow-500"
                    : "text-blue-500"
                }`}
            />
            <div className="flex-1">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-gray-700">{message}</p>
              <span className="text-xs text-gray-500">{date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
