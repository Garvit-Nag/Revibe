import BasePage from "@/components/BaseLayout";
import { BackgroundBeams } from "@/components/ui/background-beams";

const About = () => {
  return (
    <BasePage>
      <div className="overflow-hidden">
        <section
          id="features"
          className="relative block px-6 py-10 md:py-20 md:px-10"
        ><div className="overflow-y-scroll max-h-[400px] scrollbar-hide">
          <div className="relative mx-auto max-w-5xl text-center">
            <span className="text-gray-400 my-3 flex items-center justify-center font-medium uppercase tracking-wider">
              Why Revibe?
            </span>
            <h2 className="block w-full bg-gradient-to-b from-white to-gray-400 bg-clip-text font-bold text-transparent text-3xl sm:text-4xl">
              Revolutionize Your Music Discovery
            </h2>
            <p className="mx-auto my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-400">
              Dive deep into the music universe with personalized recommendations crafted by our cutting-edge AI technology.
            </p>
          </div>
          <div className="relative mx-auto max-w-7xl z-10 grid grid-cols-1 gap-10 pt-14 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-md border border-neutral-800 bg-neutral-900/50 p-8 text-center shadow">
              <div
                className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border"
                style={{
                  backgroundImage:
                    "linear-gradient(rgb(80, 70, 229) 0%, rgb(43, 49, 203) 100%)",
                  borderColor: "rgb(93, 79, 240)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-tune"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M3 3v4h4" />
                  <path d="M7 3h4" />
                  <path d="M17 3v4h4" />
                  <path d="M17 3h4" />
                  <path d="M3 17v4h4" />
                  <path d="M7 17h4" />
                  <path d="M17 17v4h4" />
                  <path d="M17 17h4" />
                  <path d="M9 6v12" />
                  <path d="M15 6v12" />
                </svg>
              </div>
              <h3 className="mt-6 text-gray-400">Customized Discovery</h3>
              <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-400">
                Explore tailored recommendations that perfectly align with your musical taste and uncover hidden gems.
              </p>
            </div>
            <div className="rounded-md border border-neutral-800 bg-neutral-900/50 p-8 text-center shadow">
              <div
                className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border"
                style={{
                  backgroundImage:
                    "linear-gradient(rgb(80, 70, 229) 0%, rgb(43, 49, 203) 100%)",
                  borderColor: "rgb(93, 79, 240)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-chart-line"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <line x1={4} y1={18} x2={20} y2={18} />
                  <polyline points="4 14 8 9 12 11 16 6 20 10" />
                </svg>
              </div>
              <h3 className="mt-6 text-gray-400">Data-Driven Insights</h3>
              <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-400">
                Benefit from analytics and trends to understand your musical preferences and patterns better.
              </p>
            </div>
            <div className="rounded-md border border-neutral-800 bg-neutral-900/50 p-8 text-center shadow">
              <div
                className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border"
                style={{
                  backgroundImage:
                    "linear-gradient(rgb(80, 70, 229) 0%, rgb(43, 49, 203) 100%)",
                  borderColor: "rgb(93, 79, 240)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-refresh"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                </svg>
              </div>
              <h3 className="mt-6 text-gray-400">Always Evolving</h3>
              <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-400">
                Our algorithms constantly learn and adapt, ensuring that your recommendations stay fresh and relevant.
              </p>
            </div>
          </div>
          </div>
        </section>
      </div>
      <BackgroundBeams />
    </BasePage>
  );
};

export default About;
