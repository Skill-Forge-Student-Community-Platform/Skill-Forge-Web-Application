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
import { Bookmark, DollarSign } from "lucide-react";

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
          name: "Network",
          desc: "Your connections",
          icon: Users,
          path: `${baseUrl}/network`
        },
        {
          name: "Bookmarks",
          desc: "Saved content",
          icon: Bookmark,
          path: `${baseUrl}/bookmarks`
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
          },
          {
            name: "Dashboard",
            desc: "Analytics & stats",
            icon: BarChart2,
            path: `${baseUrl}/dashboard`
          }
        ] : [
          {
            name: "Analytics",
            desc: "Advanced statistics",
            icon: BarChart,
            path: `${baseUrl}/analytics`
          },
          // {
          //   name: "Dashboard",
          //   desc: "Analytics & stats",
          //   icon: BarChart2,
          //   path: `${baseUrl}/dashboard`
          // }
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
          },
          {
            name: "Saved Events",
            desc: "Your bookmarked events",
            icon: Bookmark,
            path: `${baseUrl}/saved-events`
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
          },
          {
            name: "Saved Events",
            desc: "Your bookmarked events",
            icon: Bookmark,
            path: `${baseUrl}/saved-events`
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
        }
      ],
      gridCols: 2
    },
    {
      name: "Teams",
      subMenuHeading: ["My Teams", "Communication"],
      subMenu: [
        {
          name: "Create Team",
          desc: "Start a new team",
          icon: PlusCircle,
          path: `${baseUrl}/teams/create`
        },
        {
          name: "My Teams",
          desc: "Team overview",
          icon: Users,
          path: `${baseUrl}/teams`
        },
        {
          name: "Team Activity",
          desc: "Recent updates",
          icon: Activity,
          path: `${baseUrl}/teams/activity`
        },
        {
          name: "Find Teams",
          desc: "Join new teams",
          icon: MapPin,
          path: `${baseUrl}/teams/find`
        },
        {
          name: "Team Inbox",
          desc: "Messages & notifications",
          icon: MessageSquare,
          path: `${baseUrl}/teams/inbox`
        },
        {
          name: "Team Settings",
          desc: "Configure teams",
          icon: Settings,
          path: `${baseUrl}/teams/management`
        },
        ...(isStudent ? [] : [
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
      subMenuHeading: ["Account", "Support"],
      subMenu: [
        {
          name: "My Profile",
          desc: "View and edit",
          icon: User,
          path: `${baseUrl}/profile`  // This will be handled in MainLayout to route to the correct profile page
        },
        {
          name: "Account Settings",
          desc: "Preferences",
          icon: Settings,
          path: `${baseUrl}/settings`
        },
        {
          name: "Pricing",
          desc: "Subscription plans",
          icon: DollarSign,
          path: `${baseUrl}/pricing`
        },
        {
          name: "Help Center",
          desc: "Support & guides",
          icon: CircleHelp,
          path: `/help-center`
        }
      ],
      gridCols: 2
    }
  ];
};
