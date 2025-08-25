
import "./App.css";
import Banner from "./components/Banner";
import EmBreveCarousel from "./components/EmBreveCarousel";
import JumbotronSearch from "./components/JumbotronSearch";
import PopularMoviesCarousel from "./components/PopularMoviesCarousel";

function App() {

  
  return (
    <>
      <Banner />
      <PopularMoviesCarousel />
      <EmBreveCarousel />
      <JumbotronSearch />
    </>
  );
}

export default App;
