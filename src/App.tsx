import './App.css'
import Search from "./components/Search.tsx";
import BackgroundVideo from "./components/BackgroundVideo.tsx";
import blade2 from './assets/blade2.mp4';
import blade3 from './assets/Blade3_1080p.mp4';
import blade4 from './assets/Blade4_1080p.mp4';
import {useEffect, useState} from "react";
import Card from "./components/Card.tsx";
import {
    GetResourceData,
    GetTextSettingsData,
    type Site,
    type TextSettings
} from "./Helpers/DataHelper.ts";

function App() {


    const videos = [blade2, blade3, blade4];

    const [currentVideo] = useState(() =>
        Math.floor(Math.random() * videos.length)
    );
    const [data, setData] = useState<Site[]>();
    const [settings, setSettings] = useState<Map<string, TextSettings>>();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        GetTextSettingsData()
            .then(x => setSettings(x));
        GetResourceData()
            .then(x => setData(x));
    }, []);

    function shouldShowCard (site: Site): boolean {
        if(( selectedTags.length === 0 || (selectedTags.length > 0 && selectedTags.every(t => site.tags.includes(t))))) {
            if(searchTerm) {
                if(site.name.toLowerCase().includes(searchTerm.toLowerCase())){
                    return true;
                }
                if(site.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))){
                    return true;
                }
                if(site.pricing.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return true;
                }
                return site.link.toLowerCase().includes(searchTerm.toLowerCase());

            } else {
                return true;
            }
        }
        return false;
    }

    function onTagSelect(tag: string): void {
        if(selectedTags.indexOf(tag) !== -1) {
            setSelectedTags(selectedTags.filter((v) => v !== tag));
        } else {
            setSelectedTags((prevState) => [...prevState, tag]);
        }
    }

  return (
      <BackgroundVideo src={videos[currentVideo]}>
          <main>
              <Search setSearchTerm={setSearchTerm} searchText={searchTerm}></Search>

              <div className="cards">
                  {data?.length && settings ? (
                      data.map(x => shouldShowCard(x) &&(
                          <Card
                              key={x.name}
                              url={x.link}
                              title={x.name}
                              pricing={x.pricing}
                              tags={x.tags.map(tag => ({
                                  text: tag,
                                  icon: settings.get(tag)?.emoji ?? "",
                                  selected: selectedTags.includes(tag),
                                  onSelectCallback: onTagSelect
                              }))}
                              pricingColor={settings.get(x.pricing)?.color ?? "green"}
                          />
                      ))
                  ) : (
                      <div className="loader"></div>
                  )}

              </div>
          </main>
      </BackgroundVideo>
  )
}

export default App
