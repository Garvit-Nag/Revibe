"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { Button } from "@nextui-org/react";
import { RiDiscFill } from "@remixicon/react";
import Link from "next/link";
const LandingPage = () => {
  return (
    <HeroHighlight className="">
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto flex flex-col items-center gap-4"
      >
        <div>
          Get in the groove with <br />
          <Highlight className="text-black dark:text-white">Revibe</Highlight>
          <br />
          where your next favorite track awaits.
        </div>
        <Button
          color="primary"
          startContent={<RiDiscFill />}
          href="/survey"
          as={Link}
        >
          Find Your Vibe
        </Button>
      </motion.h1>
    </HeroHighlight>
  );
};

export default LandingPage;
