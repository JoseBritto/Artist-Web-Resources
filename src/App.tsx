import './App.css'
import Search from "./components/Search.tsx";
import BackgroundVideo from "./components/BackgroundVideo.tsx";
import blade2 from './assets/blade2.mp4';
import blade3 from './assets/Blade3_1080p.mp4';
import blade4 from './assets/Blade4_1080p.mp4';
import {useState} from "react";
import Card from "./components/Card.tsx";

function App() {


    const videos = [blade2, blade3, blade4];

    const [currentVideo] = useState(() =>
        Math.floor(Math.random() * videos.length)
    );

  return (
      <BackgroundVideo src={videos[currentVideo]}>
          <main>
              <Search></Search>
              <div className="cards">
                  {Array.from({ length: 50 }, (_, i) => (
                      <>
                      <Card key={i + 'x'} url="https://rockstar.games" tags={[{
                          text: "Melee",
                          icon: "👊 "
                      }, {
                          text: "Ranged",
                          icon: "🔫 "
                      }
                      ]} categoryIcon="🌿" categoryText="Here we go again" title="Rockstar North" pricing="Free 2 Play" />

                      <Card key={i + 'y'} url="https://blender.org" tags={[{
                      text: "Space",
                      icon: "🚀 "
                  }, {
                      text: "Fire",
                      icon: "🔥 "
                  }
                      ]} categoryIcon="🧊" categoryText="Kicthen Tool" title="Blender" pricing="Paid 4 ever" />
                      </>
              ))}

              </div>
          </main>
      </BackgroundVideo>
  )
}

export default App
