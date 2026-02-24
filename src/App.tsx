import './App.css'
import Search from "./components/Search.tsx";
import BackgroundVideo from "./components/BackgroundVideo.tsx";
import ring2 from './assets/ring2.webm';

function App() {

  return (
      <BackgroundVideo src={ring2}>
          <main>
              <Search></Search>
          </main>
      </BackgroundVideo>
  )
}

export default App
