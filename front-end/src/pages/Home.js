import React from 'react';
import Doctors from '../components/Doctors';
import Services from '../components/Services';
import TheCounter from '../components/TheCounter';
import TheHeader from '../components/TheHeader';
import TheNavbar from '../components/TheNavbar';
import TheNavbarsub from '../components/TheNavbarsub';
import TheFooter from '../components/TheFooter';

const Home = () => {
  return (
    <main>
      <TheNavbarsub />
      <TheNavbar />
      {/* The Header */}
      <TheHeader />
      {/* Counter Div */}
      <section className="mb-4">
        <TheCounter />
      </section>
      {/* doctor section */}
      
      {/* Services section */}
      <section className="mb-10">
        <h2 className="text-center text-4xl font-semibold my-5 py-5 text-blue-700">
          Our Hospital Services
        </h2>
        <Services></Services>
      </section>
      <TheFooter />
    </main>
  );
};

export default Home;
