import { Home, BarChart2, BookOpen, Award, Settings } from "lucide-react";
import { Calendar, PlusCircle, Filter } from "lucide-react";
import { Users, MessageSquare, Activity } from "lucide-react";
import { BookOpenText } from "lucide-react";
import { BellDot } from "lucide-react";
import { CircleHelp } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { BarChart } from "lucide-react";
import { Play } from "lucide-react";
import { MapPin } from "lucide-react";
import { User } from "lucide-react";

// Function to create the Menus array with role-specific items
export const getMenus = (roleType, userId) => {
  // Base URL for navigation
  const baseUrl = `/${roleType.charAt(0).toUpperCase() + roleType.slice(1)}/${userId}`;
  const isStudent = roleType.toLowerCase() === 'student';

  return [
    {
      name: "Home",
      subMenuHeading: ["Dashboard", "Learning"],
      subMenu: [
        {
          name: "Home",
          desc: "Main dashboard",
          icon: Home,
          path: `${baseUrl}/home`
        },
        {
          name: "Dashboard",
          desc: "Analytics & stats",
          icon: BarChart2,
          path: `${baseUrl}/dashboard`
        },
        ...(isStudent ? [
          {
            name: "Learning Paths",
            desc: "Educational journey",
            icon: BookOpen,
            path: `${baseUrl}/learning-paths`
          },
          {
            name: "Achievements",
            desc: "Your progress",
            icon: Award,
            path: `${baseUrl}/achievements`
          }
        ] : [
          {
            name: "Analytics",
            desc: "Advanced statistics",
            icon: BarChart,
            path: `${baseUrl}/analytics`
          }
        ])
      ],
      gridCols: 2
    },
    {
      name: "Events",
      subMenuHeading: ["Browse", "Manage"],
      subMenu: [
        {
          name: "Browse Events",
          desc: "Discover opportunities",
          icon: Calendar,
          path: `${baseUrl}/view-events`
        },
        ...(isStudent ? [
          {
            name: "My Events",
            desc: "Registered events",
            icon: BookOpenText,
            path: `${baseUrl}/view-events/registered`
          },
          {
            name: "Event Categories",
            desc: "Filter by type",
            icon: Filter,
            path: `${baseUrl}/view-events/categories`
          }
        ] : [
          {
            name: "Add Event",
            desc: "Create new event",
            icon: PlusCircle,
            path: `${baseUrl}/add-events`
          },
          {
            name: "Manage Events",
            desc: "Edit your events",
            icon: Settings,
            path: `${baseUrl}/manage-events`
          }
        ]),
        {
          name: "Upcoming Events",
          desc: "Calendar view",
          icon: MapPin,
          path: `${baseUrl}/view-events/upcoming`
        },
        {
          name: "Event Updates",
          desc: "Recent changes",
          icon: BellDot,
          path: `${baseUrl}/view-events/updates`
        },
      ],
      gridCols: 2
    },
    {
      name: "Teams",
      subMenuHeading: ["My Teams", "Management"],
      subMenu: [
        {
          name: "My Teams",
          desc: "Team overview",
          icon: Users,
          path: `${baseUrl}/teams`
        },
        {
          name: isStudent ? "Team Settings" : "Team Management",
          desc: "Configure teams",
          icon: Settings,
          path: `${baseUrl}/teams/management`
        },
        {
          name: "Team Activity",
          desc: "Recent updates",
          icon: Activity,
          path: `${baseUrl}/teams/activity`
        },
        {
          name: "Team Inbox",
          desc: "Messages & notifications",
          icon: MessageSquare,
          path: `${baseUrl}/teams/inbox`
        },
        ...(isStudent ? [
          {
            name: "Find Teams",
            desc: "Join new teams",
            icon: MapPin,
            path: `${baseUrl}/teams/find`
          }
        ] : [
          {
            name: "Create Team",
            desc: "Start a new team",
            icon: PlusCircle,
            path: `${baseUrl}/teams/create`
          },
          {
            name: "Team Analytics",
            desc: "Performance metrics",
            icon: BarChart,
            path: `${baseUrl}/teams/analytics`
          }
        ])
      ],
      gridCols: 2
    },
    {
      name: "Profile",
      subMenu: [
        {
          name: "My Profile",
          desc: "View and edit",
          icon: User,
          path: `${baseUrl}/profile`
        },
        {
          name: "Account Settings",
          desc: "Preferences",
          icon: Settings,
          path: `${baseUrl}/settings`
        },
        {
          name: "Help Center",
          desc: "Support & guides",
          icon: CircleHelp,
          path: `/help-center`
        },
      ],
      gridCols: 1
    },
  ];
};
