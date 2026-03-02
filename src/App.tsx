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

    useEffect(() => {
        GetTextSettingsData()
            .then(x => setSettings(x));
        GetResourceData()
            .then(x => setData(x));
    }, [])

  return (
      <BackgroundVideo src={videos[currentVideo]}>
          <main>
              <Search></Search>

              <div className="cards">
                  {data?.length && settings ? (
                      data.map(x => (
                          <Card
                              key={x.name}
                              url={x.link}
                              categoryText={x.category}
                              title={x.name}
                              pricing={x.pricing}
                              tags={x.tags.map(tag => ({
                                  text: tag,
                                  icon: settings?.get(tag)?.emoji ?? "❌"
                              }))}
                              pricingColor={settings.get(x.pricing)?.color ?? "green"}
                              categoryIcon={settings.get(x.category)?.emoji ?? "❌"}
                          />
                      ))
                  ) : (
                      "Loading..."
                  )}

              </div>
          </main>
      </BackgroundVideo>
  )
}

export default App
