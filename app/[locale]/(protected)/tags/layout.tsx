import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags | Dashcode",
  description: "Manage and organize tags for contacts and customer segments.",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
