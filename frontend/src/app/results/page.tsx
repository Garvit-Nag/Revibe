"use client";
import React, { useEffect, useState } from "react";
import BasePage from "@/components/BaseLayout";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { RiHome2Line } from "@remixicon/react";
import Image from "next/image";
interface Song {
  artist: string;
  song_name: string;
}

const ResultComponent = () => {
  const router = useRouter();
  const [results, setResults] = useState<Song[] | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("surveyResults");
    if (data) {
      setResults(JSON.parse(data));
    }
  }, []);

  // Function to handle return to home
  const handleGoHome = () => {
    router.push("/survey");
  };

  if (false) {
    // Render this block if results are not provided
    return (
      <BasePage>
        <div className="flex items-center flex-col">
          <Image
            src="/images/error-cat.svg"
            width={500}
            height={300}
            alt="Error"
          />
          <div className="flex flex-col items-center gap-5 container">
            <p className="text-center">
              Oh, it looks like you took a wrong turn. This secret chamber of
              knowledge isn’t just lying around for direct visits!
            </p>
            <Button
              startContent={<RiHome2Line />}
              color="primary"
              variant="bordered"
              onClick={handleGoHome}
            >
              Teleport Home
            </Button>
          </div>
        </div>
      </BasePage>
    );
  }
  const RenderContent = () => {
    if (Array.isArray(results)) {
      // Rendering list of songs
      return (
        <ul className="mt-4">
          {results.map((item, index) => (
            <li key={index} className="p-3 mb-2 border-b border-gray-300">
              <p><span className="font-semibold">Artist:</span> {item.artist}</p>
              <p><span className="font-semibold">Song:</span> {item.song_name}</p>
            </li>
          ))}
        </ul>
      );
    } else if (typeof results === 'string') {
      // Rendering a message (no songs found)
      return <p>{results}</p>;
    } else {
      // Handle null or unexpected types
      return <p>Loading... or no data available.</p>;
    }
  };

  // Render this block if results are provided
  return (
    <BasePage>
      <RenderContent />
    </BasePage>
  );
};

export default ResultComponent;
