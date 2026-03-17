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
import Contact from "./components/Contact.tsx";

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

        const pricingOrder: Record<string, number> = {
            "Free": 0,
            "Mostly Free": 10,
            "Balanced": 20,
            "Mostly Paid": 30,
            "Paid": 40,
            "Subscription": 50
        };

        return list.sort((a, b) => {
            if (freeFirst) {
                const priceCmp =
                    (pricingOrder[a.pricing] ?? 999) -
                    (pricingOrder[b.pricing] ?? 999);

                if (priceCmp !== 0) return priceCmp;
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
              <div className="app-top">
                  <Search setSearchTerm={setSearchTerm} searchText={searchTerm} data={data ?? []}
                          settings={settings} selectedTags={selectedTags} setSelectedTags={setSelectedTags}
                          onTagSelect={onTagSelect}
                          selectedPricing={selectedPricing}
                          onPricingSelect={onPricingSelect}
                          setSelectedPricing={setSelectedPricing}
                  ></Search>
                  <SortBar freeFirst={freeFirst} setFreeFirst={setFreeFirst} aZ={aZ} setAZ={setAZ} hidden={searchTerm.trim().length !== 0}/>
              </div>

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
          <Contact />
      </BackgroundVideo>
  )
}

export default App
