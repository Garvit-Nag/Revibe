"use client";
import React from "react";
import BasePage from "@/components/BaseLayout";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { RiHome2Line } from "@remixicon/react";
import Image from "next/image";


const ResultComponent: React.FC<{ results?: any }> = ({ results }) => {
  const router = useRouter();

  // Function to handle return to home
  const handleGoHome = () => {
    router.push("/survey");
  };

  if (!results) {
    // Render this block if results are not provided
    return (
      <BasePage>
        <div className="flex items-center flex-col">
          <Image src="/images/error-cat.svg" width={500} height={300} alt="Error"/>
          <div className="flex flex-col items-center gap-5 container"><p className="text-center">
            Oh, it looks like you took a wrong turn. This secret chamber of
            knowledge isn’t just lying around for direct visits!
          </p>
          <Button startContent={<RiHome2Line />} color="primary" variant="bordered" onClick={handleGoHome}>Teleport Home</Button></div>
        </div>
      </BasePage>
    );
  }

  // Render this block if results are provided
  return <BasePage>Results Here</BasePage>;
};

export default ResultComponent;
