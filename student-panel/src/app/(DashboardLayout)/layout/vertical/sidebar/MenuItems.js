import { uniqueId } from "lodash";

import {
  IconAperture,
  IconBrandPaypal,
  IconMailCheck,
  IconMessageChatbot,
  IconVideo,
  IconPlus
} from "@tabler/icons-react";
import { IconHelp } from "@tabler/icons-react";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconAperture,
    href: "/",
    chipColor: "secondary",
  },



  {
    navlabel: true,
    subheader: "Tools",
  },
  {
    id: uniqueId(),
    title: "Ai-Interviewer",
    icon: IconAperture,
    href: "/ai-interview",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "chatbot",
    icon: IconMessageChatbot,
    href: "/chatbot",
  },
  {
    navlabel: true,
    subheader: "GD & Mock Interview",
  },
  {
    id: uniqueId(),
    title: "Group Discussion",
    icon: IconVideo,
    href: "/group-discussion",
  },

  {
    id: uniqueId(),
    title: "Mock interview",
    icon: IconPlus,
    href: "/InterviewersList",
  },
  // {

  //   id: uniqueId(),
  //   title: "Make a call",
  //   icon: IconHelp,
  //   href: "tel:+919016600610",
  // },
];

export default Menuitems;
