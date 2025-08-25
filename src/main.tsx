import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MovieDetails from "./pages/MovieDetails.tsx";
import NotFound from "./pages/NotFound.tsx";
import Footer from "./components/Footer.tsx";
import PopularMovies from "./pages/Popular/index.tsx";
import FavoritesSection from "./pages/Favoritos/index.tsx";
import NowPlayingMovies from "./pages/EmCartaz/index.tsx";
import Header from "./components/Header.tsx";
import UpcomingMovies from "./pages/EmBreve/index.tsx";
import ActorPage from "./pages/ActorPage/index.tsx";
import SearchTask from "./pages/Search/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/filme/:id" element={<MovieDetails />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/popular" element={<PopularMovies />} />
        <Route path="/favoritos" element={<FavoritesSection />} />
        <Route path="/em-breve" element={<UpcomingMovies />} />
        <Route path="/em-cartaz" element={<NowPlayingMovies />} />
        <Route path="/actor/:id" element={<ActorPage />} />
        <Route path="/busca" element={<SearchTask />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>
);
