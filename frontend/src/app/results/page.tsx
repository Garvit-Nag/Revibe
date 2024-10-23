"use client";
import React, { useEffect, useState } from "react";
import BasePage from "@/components/BaseLayout";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { RiHome2Line, RiPlayCircleLine } from "@remixicon/react";
import Image from "next/image";
import { BackgroundBeams } from "@/components/ui/background-beams";
import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "@/components/ui/glowing-stars";
import { SparklesCore } from "@/components/ui/sparkles";
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
      return (
        <div className="relative overflow-auto max-h-[500px] z-40 scrollbar-hide container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-full">
            {results.map((item, index) => (
              <GlowingStarsBackgroundCard key={index}>
                <GlowingStarsTitle>{item.song_name}</GlowingStarsTitle>
                <div className="flex justify-between items-center">
                  <GlowingStarsDescription>
                    {item.artist}
                  </GlowingStarsDescription>
                  <div className="h-10 w-10 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center cursor-pointer hover:bg-[hsla(0,0%,100%,.2)]">
                    <RiPlayCircleLine className="text-white text-2xl" />
                  </div>
                </div>
              </GlowingStarsBackgroundCard>
            ))}
          </div>
        </div>
      );
    } else {
      return <p>Loading... or no data available.</p>;
    }
  };

  // Render this block if results are provided
  return (
    <BasePage>
      <div className="h-[40rem] lg:h-[36rem] w-full flex flex-col items-center justify-center overflow-hidden rounded-md mt-10">
        <h1 className="md:text-4xl text-xl lg:text-6xl font-bold text-center text-white relative z-20">
          Your Recommendations
        </h1>
        <div className="w-[40rem] h-40 relative">
          {/* Gradients */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

          {/* Core component */}
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div className="absolute inset-0 w-full bg-[#09090b] h-full flex items-center [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>
      </div>
      <RenderContent />
      <BackgroundBeams />
    </BasePage>
  );
};

export default ResultComponent;