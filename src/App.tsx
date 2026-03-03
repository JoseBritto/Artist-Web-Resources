import './App.css'
import Search from "./components/Search.tsx";
import BackgroundVideo from "./components/BackgroundVideo.tsx";
import blade2 from './assets/blade2.mp4';
import blade3 from './assets/Blade3_1080p.mp4';
import blade4 from './assets/Blade4_1080p.mp4';
import {useEffect, useMemo, useState} from "react";
import Card from "./components/Card.tsx";
import Fuse from "fuse.js";

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

    const filteredByTags = useMemo(() => {
        if(!data) return [];
        if (selectedTags.length === 0) return data;

        return data.filter(site =>
            selectedTags.every(tag =>
                site.tags.includes(tag)
            )
        );
    }, [data, selectedTags]);

    const fuse = useMemo(() => {
        return new Fuse(filteredByTags ?? [], {
            keys: [
                { name: "name", weight: 0.9 },
                { name: "tags", weight: 0.7 },
                { name: "pricing", weight: 0.6 },
                { name: "link", weight: 0.2 },
            ],
            threshold: 0.5,
            ignoreLocation: false
        });
    }, [filteredByTags]);

    const filteredSites = useMemo(() => {
        if (!searchTerm) return filteredByTags;
        return fuse.search(searchTerm).map(r => r.item);
    }, [searchTerm, fuse, filteredByTags]);

/*    function shouldShowCard (site: Site): boolean {
        if(( selectedTags.length === 0 || (selectedTags.length > 0 && selectedTags.every(t => site.tags.includes(t))))) {
            if(searchTerm) {
                /!*
                * The below regex returns all sequences of letters, number and other non-whitespace chars
                * \p{L}+ => sequences of letters (Unicode safe)
                * \d+ => sequences of digits
                * [^\s\p{L}\d] => any single non-whitespace character
                * *!/
                const terms = searchTerm.toLowerCase().match(/\p{L}+|\d+|[^\s\p{L}\d]/gu) ?? [];
                return terms.some(x =>
                    site.name.includes(x)
                    || site.tags.some(t => t.toLowerCase().includes(x))
                    || site.pricing.toLowerCase().includes(x)
                    || site.link.toLowerCase().includes(x)
                );
            } else {
                return true;
            }
        }
        return false;
    }*/

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
                  {filteredSites?.length && settings ? (
                      filteredSites.map(x => (
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
