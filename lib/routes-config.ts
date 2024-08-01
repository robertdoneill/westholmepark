// for page navigation & to sort on leftbar
export const ROUTES = [
  {
    title: "入门指南 - Getting Started",
    href: "getting-started",
    items: [
      { title: "介绍 - Introduction", href: "/introduction" },
      { title: "价格 - Pricing", href: "/installation" },
      { title: "住宿规则 - House Rules", href: "/quick-start-guide" },
      { title: "访问 - Access", href: "/project-structure" },
      { title: "其他费用 - Other Fees", href: "/changelog" },
      { title: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Moving Out",
    href: "server-actions",
    items: [
      { title: "如何安排搬出 - How To Scheule a Move Out", href: "/schedule-move-out" },
      { title: "Potential Charges", href: "/getToken" },
      { title: "Security Deposit Refund", href: "/getRole" },
    ],
  },
  {
    title: "Other",
    href: "react-hooks",
    items: [
      { title: "需要携带的物品 - What To Bring", href: "/what-to-bring" },
    ],
  },
];

export const page_routes = ROUTES.map(({ href, items }) => {
  return items.map((link) => {
    return {
      title: link.title,
      href: href + link.href,
    };
  });
}).flat();
