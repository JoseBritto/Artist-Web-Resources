import './App.css'
import Search from "./components/Search.tsx";
import BackgroundVideo from "./components/BackgroundVideo.tsx";
import ring2 from './assets/ring2.webm';
import blade2 from './assets/blade2.mp4';
import {useState} from "react";

function App() {


    const videos = [ring2, blade2];

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
