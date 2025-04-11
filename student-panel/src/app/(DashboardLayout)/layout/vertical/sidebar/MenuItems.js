import { uniqueId } from "lodash";

import {
  IconAperture,
  IconBrandPaypal,
  IconMailCheck
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
    id: uniqueId(),
    title: "Email Checker",
    icon: IconMailCheck,
    href: "/EmailChecker",
  },

  {
    navlabel: true,
    subheader: "Subscription",
  },

  {
    id: uniqueId(),
    title: "Plans & Upgrade",
    icon: IconBrandPaypal,
    href: "/Plans-and-Upgrade",
  },
  {
    navlabel: true,
    subheader: "Develper",
  },
  {
    id: uniqueId(),
    title: "My APIs",
    icon: IconHelp,
    href: "/myApis",
  },

  {
    navlabel: true,
    subheader: "Contact",
  },
  {

    id: uniqueId(),
    title: "Send a mail",
    icon: IconHelp,
    href: "mailto:support@commerciax.com",
  },
  // {

  //   id: uniqueId(),
  //   title: "Make a call",
  //   icon: IconHelp,
  //   href: "tel:+919016600610",
  // },
];

export default Menuitems;
