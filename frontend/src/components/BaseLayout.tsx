import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Footer from "./Footer";
import NavbarComponent from "./Navbar";

const BasePage = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "h-screen w-screen flex flex-col justify-between items-center",
        className
      )}
    >
      <NavbarComponent />
      {children}
      <Footer />
    </div>
  );
};

export default BasePage;
