/** @format */

import Footer from "./components/footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default App;
