import './App.css'
import Search from "./components/Search.tsx";
import BackgroundVideo from "./components/BackgroundVideo.tsx";
import blade2 from './assets/blade2.mp4';
import blade3 from './assets/Blade3_1080p.mp4';
import blade4 from './assets/Blade4_1080p.mp4';
import {useState} from "react";

function App() {


    const videos = [blade2, blade3, blade4];

    const [currentVideo] = useState(() =>
        Math.floor(Math.random() * videos.length)
    );

  return (
      <BackgroundVideo src={videos[currentVideo]}>
          <main>
              <Search></Search>
          </main>
      </BackgroundVideo>
  )
}

export default App
