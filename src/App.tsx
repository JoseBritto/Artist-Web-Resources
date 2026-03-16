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
    GetTextSettingsData, GetTextUrlDict,
    type Site,
    type TextSettings
} from "./Helpers/DataHelper.ts";
import SortBar from "./components/SortBar.tsx";

function App() {


    const videos = [blade2, blade3, blade4];

    const [currentVideo] = useState(() =>
        Math.floor(Math.random() * videos.length)
    );
    const [data, setData] = useState<Site[]>();
    const [settings, setSettings] = useState<Map<string, TextSettings>>();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [freeFirst, setFreeFirst] = useState<boolean>(false);
    const [aZ, setAZ] = useState<boolean>(true);

    useEffect(() => {
        GetResourceData()
            .then(x => {
                setData(x);
                return x;
            })
            .then(rData => {
                GetTextUrlDict()
                    .then(x => {
                        setData(
                            rData.map(item => ({
                                ...item,
                                link: x[item.name]
                            }))
                        );
                    });
            });

        GetTextSettingsData()
            .then(x => setSettings(x));
    }, []);

    const filteredByTags = useMemo(() => {
        if(!data) return [];
        if (selectedTags.length === 0) {
            if(selectedPricing.length === 0)
                return data;
            return data.filter(site => selectedPricing.includes(site.pricing));
        }
        if(selectedPricing.length === 0) {
            return data.filter(site =>
                selectedTags.every(tag =>
                    site.tags.includes(tag)
                )
            );
        }
        return data.filter(site =>
            selectedTags.every(tag =>
                site.tags.includes(tag)
            )
        ).filter(site => selectedPricing.includes(site.pricing));
    }, [data, selectedTags, selectedPricing]);

    const filteredAndSortedSites = useMemo(() => {
        const list = [...filteredByTags];

        return list.sort((a, b) => {
            if (freeFirst) {
                const aFree = a.pricing === "Free";
                const bFree = b.pricing === "Free";

                if (aFree !== bFree) {
                    return aFree ? -1 : 1;
                }
            }

            const cmp = a.name.localeCompare(b.name);
            return aZ ? cmp : -cmp;
        });
    }, [filteredByTags, freeFirst, aZ]);

    const fuse = useMemo(() => {
        return new Fuse(filteredAndSortedSites ?? [], {
            keys: [
                { name: "name", weight: 0.9 },
                { name: "tags", weight: 0.7 },
                { name: "pricing", weight: 0.6 },
                { name: "link", weight: 0.2 },
            ],
            threshold: 0.5,
            ignoreLocation: false
        });
    }, [filteredAndSortedSites]);

    const filteredSites = useMemo(() => {
        if (!searchTerm) return filteredAndSortedSites;
        return fuse.search(searchTerm).map(r => r.item);
    }, [searchTerm, fuse, filteredAndSortedSites]);

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

    function onPricingSelect(price: string): void {
        if(selectedPricing.indexOf(price) !== -1) {
            setSelectedPricing(selectedPricing.filter((v) => v !== price));
        } else {
            setSelectedPricing((prevState) => [...prevState, price]);
        }
    }

  return (
      <BackgroundVideo src={videos[currentVideo]}>
          <main>
              <Search setSearchTerm={setSearchTerm} searchText={searchTerm} data={data ?? []}
                      settings={settings} selectedTags={selectedTags} setSelectedTags={setSelectedTags}
                      onTagSelect={onTagSelect}
                      selectedPricing={selectedPricing}
                      onPricingSelect={onPricingSelect}
                      setSelectedPricing={setSelectedPricing}
              ></Search>
              <SortBar freeFirst={freeFirst} setFreeFirst={setFreeFirst} aZ={aZ} setAZ={setAZ} />

              <div className="cards">
                  {((data?.length ?? 0 > 0) && (filteredSites?.length ?? 0) > 0) ? (
                      filteredSites.map(x => (
                          <Card
                              key={x.name}
                              url={x.link}
                              title={x.name}
                              pricing={x.pricing}
                              tags={x.tags.map(tag => ({
                                  text: tag,
                                  icon: settings?.get(tag)?.emoji ?? "",
                                  selected: selectedTags.includes(tag),
                                  onSelectCallback: onTagSelect
                              }))}
                              pricingColor={settings?.get(x.pricing)?.color ?? "#838383"}
                          />
                      ))
                  ) : ((searchTerm || selectedTags.length > 0) ? (<h2 className="no-results" style={{marginTop: "16%", color: "#838383"}}>No Results found</h2>) : (
                      <div className="loader"></div>
                  ))}

              </div>
          </main>
      </BackgroundVideo>
  )
}

export default App
