import BasePage from "@/components/BaseLayout";
import { Meteors } from "@/components/ui/meteors";
import { Tabs } from "@/components/ui/tabs";
import musicData from "@/constants/data";
import { Button, Card, CardHeader, Image, Input } from "@nextui-org/react";

const page = () => {
  const tabs = [
    {
      title: "Search By Song",
      value: "song",
      content: (
        <div className="w-full h-full scrollbar-hide overflow-auto relative rounded-2xl p-4 sm:p-10 text-xl font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900">
          <div className="flex flex-col w-full min-h-full items-center justify-center gap-4">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl">Popular Songs</h3>
            <div className="w-full max-w-5xl px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 overflow-visible scrollbar-hide">
              {musicData.songs.map((song) => (
                <Card
                  isPressable
                  key={song.title}
                  className="h-full"
                >
                  <CardHeader className="absolute z-10 p-2 sm:p-4 w-full flex flex-col items-start">
                    <h4 className="text-md sm:text-lg">{song.title}</h4>
                    <p className="text-xs sm:text-sm">{song.artist}</p>
                  </CardHeader>
                  <Image
                    alt={`Cover for ${song.title}`}
                    src={song.image}
                    removeWrapper
                    className="z-0 w-full h-full object-cover object-center"
                  />
                </Card>
              ))}
            </div>
            <Meteors number={20} />
            <p className="text-sm sm:text-base">OR</p>
            <Input label="Enter Your Own Song" />
            <Button>Submit</Button>
          </div>
        </div>
      ),
    }
    
,
    {
      title: "Search By Artist & Genre",
      value: "artist-genre",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900">
          <div className="flex justify-around w-full">
            <div className="flex-1 overflow-scroll max-h-[600px] pb-32 scrollbar-hide">
              <h3 className="text-lg text-white">Artists</h3>
              {musicData.topArtists.map((artist) => (
                <Card isPressable key={artist.name} className="h-[150px] my-2">
                  <CardHeader className="absolute z-10 p-4  w-full">
                    <h4 className="text-lg text-white">{artist.name}</h4>
                  </CardHeader>
                  <Image
                    alt={`Profile of ${artist.name}`}
                    src={artist.image}
                    removeWrapper
                    className="z-0 w-full h-full object-cover"
                  />
                </Card>
              ))}
            </div>
            <div className="flex-1 overflow-scroll max-h-[600px] pb-32 scrollbar-hide">
              <h3 className="text-lg text-white">Genres</h3>
              {musicData.genres.map((genre) => (
                <Card isPressable key={genre.name} className="h-[150px] my-2">
                  <CardHeader className="absolute z-10 p-4  w-full">
                    <h4 className="text-lg text-white">{genre.name}</h4>
                  </CardHeader>
                  <Image
                    alt={`Image for ${genre.name}`}
                    src={genre.image}
                    removeWrapper
                    className="z-0 w-full h-full object-cover"
                  />
                </Card>
              ))}
            </div>
          </div>
          <Meteors number={20} />
        </div>
      ),
    },
  ];
  return (
    <BasePage>
      <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-2">
        <Tabs tabs={tabs} />
      </div>
    </BasePage>
  );
};

export default page;
