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
      { title: "How To Scheule a Move Out", href: "/getSession" },
      { title: "Potential Charges", href: "/getToken" },
      { title: "Security Deposit Refund", href: "/getRole" },
    ],
  },
  {
    title: "React Hooks",
    href: "react-hooks",
    items: [
      { title: "useSession", href: "/use-session" },

      { title: "useFetch", href: "/use-fetch" },
      { title: "useAuth", href: "/use-auth" },
      { title: "useProduct", href: "/use-product" },
      { title: "useOrder", href: "/use-order" },
      { title: "useCart", href: "/use-cart" },
      { title: "usePayment", href: "/use-payment" },
      { title: "useShipping", href: "/use-shipping" },
      { title: "useNotification", href: "/use-notification" },
      { title: "useReview", href: "/use-review" },
      { title: "useInventory", href: "/use-inventory" },
      { title: "useUser", href: "/use-user" },
      { title: "useSettings", href: "/use-settings" },
      { title: "useAnalytics", href: "/use-analytics" },
      { title: "useTheme", href: "/use-theme" },
      { title: "useRouter", href: "/use-router" },
      { title: "useData", href: "/use-data" },
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
