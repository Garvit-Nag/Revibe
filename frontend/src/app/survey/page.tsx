"use client";
import BasePage from "@/components/BaseLayout";
import { Meteors } from "@/components/ui/meteors";
import { Tabs } from "@/components/ui/tabs";
import musicData from "@/constants/data";
import { Button, Card, CardHeader, Image, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Song {
  title: string;
  artist: string;
  image: string;
}

interface Artist {
  name: string;
  image: string;
}

interface Genre {
  name: string;
  image: string;
}

interface CustomInputs {
  song: string;
  artist: string;
  genre: string;
  songArtist: string;
}

const SurveyPage = () => {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<{ song: Song | null, artist: Artist | null, genre: Genre | null }>({ song: null, artist: null, genre: null });
  const [customInputs, setCustomInputs] = useState<CustomInputs>({ song: "", artist: "", genre: "", songArtist: "" });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submitFlag, setSubmitFlag] = useState(false);  // Flag to control submission timing

  useEffect(() => {
    if (submitFlag) {
      const { song, artist, genre } = selectedItems;
      const { song: customSong, artist: customArtist, genre: customGenre } = customInputs;

      if ((song || customSong) && (!(artist || customArtist) && !(genre || customGenre)) || ((artist || customArtist) && (genre || customGenre) && !(song || customSong))) {
        submitForm();
      } else {
        setErrorMessage("Please select either a song or both an artist and a genre.");
      }
      setSubmitFlag(false);
    }
  }, [submitFlag, selectedItems, customInputs]);

  const handleSelect = (type: keyof typeof selectedItems, item: Song | Artist | Genre) => {
    if (type === 'song') {
      setSelectedItems({ song: item as Song, artist: null, genre: null });
      setCustomInputs({ song: "", artist: "", genre: "", songArtist: "" });
    } else {
      setSelectedItems(prev => ({ ...prev, [type]: item, song: null }));
      setCustomInputs(prev => ({ ...prev, [type]: "", song: "" }));
    }
  };

  const handleInputChange = (type: keyof CustomInputs, value: string) => {
    setCustomInputs(prev => ({ ...prev, [type]: value }));
    if (type === 'song' || type === 'songArtist') {
      setSelectedItems({ song: null, artist: null, genre: null });  // Clear selected items when entering custom song info
    } else {
      setSelectedItems(prev => ({ ...prev, song: null }));  // Clear selected song when entering custom artist or genre info
    }
  };
  
  const handleSubmit = () => {
    setErrorMessage("");
    setSubmitFlag(true);
  };

  const submitForm = async () => {
    const { song, artist, genre } = selectedItems;
    const { song: customSong, artist: customArtist, genre: customGenre, songArtist: customSongArtist } = customInputs;
  
    let payload;
    if (song || (customSong && customSongArtist)) {
      // Option 1: Song and Artist - Using the required format with "-" separator
      payload = {
        song: song 
          ? `${song.title.toLowerCase()} - ${song.artist.toLowerCase()}`
          : `${customSong.toLowerCase()} - ${customSongArtist.toLowerCase()}`,
        artist: "",  // Keep these empty as per backend requirements
        genre: ""
      };
    } else if ((artist || customArtist) && (genre || customGenre)) {
      // Option 2: Artist and Genre
      payload = {
        song: "",  // Keep this empty for artist+genre path
        artist: (artist ? artist.name : customArtist).toLowerCase(),
        genre: (genre ? genre.name : customGenre).toLowerCase()
      };
    } else {
      setErrorMessage("Invalid input. Please provide either a song and artist, or an artist and genre.");
      return;
    }
  
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://garvitcpp-revibe.hf.space/recommend';
      const response = await axios.post(apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'  // Add CORS header
        }
      });
      
      if (response.data.error) {
        setErrorMessage(response.data.error);
      } else {
        localStorage.setItem('surveyResults', JSON.stringify(response.data));
        router.push('/results');
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setErrorMessage(error.response?.data?.error || "An error occurred while processing your request.");
    }
  };

  const tabs = [
    {
      title: "Search By Song",
      value: "song",
      content: (
        <div className="w-full h-full scrollbar-hide overflow-auto relative rounded-2xl p-4 sm:p-10 text-xl font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900">
          <div className="flex flex-col w-full min-h-full items-center justify-center gap-4">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl">Popular Songs</h3>
            <div className="w-full max-w-5xl px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 overflow-visible scrollbar-hide z-30">
              {musicData.songs.map((song) => (
                <Card
                  isPressable
                  key={song.title}
                  onClick={() => handleSelect('song', song)}
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
            <p className="text-sm sm:text-base">OR</p>
            <div className="flex w-full gap-2 flex-col lg:flex-row">
              <Input
                label="Enter Your Own Song"
                onChange={(e) => handleInputChange('song', e.target.value)}
              />
              <Input
                label="Enter Artist Name"
                onChange={(e) => handleInputChange('songArtist', e.target.value)}
              />
            </div>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            <Button onPress={handleSubmit}>Submit</Button>
            <Meteors number={20} />
          </div>
        </div>
      ),
    },

    {
      title: "Search By Artist & Genre",
      value: "artist-genre",
      content: (
        <div className="w-full h-full overflow-auto relative rounded-2xl p-4 sm:p-10 text-lg md:text-xl font-bold text-white bg-gradient-to-br from-gray-800 to-black scrollbar-hide">
          <div className="flex flex-col lg:flex-row justify-around items-start w-full">
            <div className="flex-1 overflow-auto max-h-[600px] pb-4 lg:pb-0 lg:pr-8 scrollbar-hide">
              <h3 className="text-xl md:text-3xl mb-4">Artists</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {musicData.topArtists.map((artist) => (
                  <Card
                    isPressable
                    key={artist.name}
                    onClick={() => handleSelect('artist', artist)}
                    className="relative"
                  >
                    <CardHeader className="absolute z-40 p-4 w-full bg-black bg-opacity-50">
                      <h4 className="text-lg md:text-xl">{artist.name}</h4>
                    </CardHeader>
                    <Image
                      alt={`Profile of ${artist.name}`}
                      src={artist.image}
                      removeWrapper
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto max-h-[600px] pb-4 lg:pb-0 lg:pl-8 scrollbar-hide">
              <h3 className="text-xl md:text-3xl mb-4">Genres</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {musicData.genres.map((genre) => (
                  <Card
                    isPressable
                    key={genre.name}
                    onClick={() => handleSelect('genre', genre)}
                    className="relative"
                  >
                    <CardHeader className="absolute z-40 p-4 w-full bg-black bg-opacity-50">
                      <h4 className="text-lg md:text-xl">{genre.name}</h4>
                    </CardHeader>
                    <Image
                      alt={`Image for ${genre.name}`}
                      src={genre.image}
                      removeWrapper
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm sm:text-base my-2 mt-3">OR</p>
            <div className="flex flex-col lg:flex-row items-center justify-around w-full py-2">
              <div className="flex-1 mx-2 my-2">
                <Input
                  label="Enter Your Own Artist"
                  onChange={(e) => handleInputChange('artist', e.target.value)}
                />
              </div>

              <div className="flex-1 mx-2 my-2">
                <Input
                  label="Enter Your Own Genre"
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                />
              </div>
            </div>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            <Button className="mt-2 lg:mt-0 lg:ml-2" onPress={handleSubmit}>
              Submit
            </Button>
          </div>
          <Meteors number={20} />
        </div>
      ),
    },
  ];

  return (
    <BasePage>
      <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-2">
        <Tabs tabs={tabs} />
      </div>
    </BasePage>
  );
};

export default SurveyPage;
