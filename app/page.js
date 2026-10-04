import SmoothScroll from '@/components/SmoothScroll';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Trust from '@/components/Trust';
import Services from '@/components/Services';
import RoofBuild from '@/components/RoofBuild';
import Work from '@/components/Work';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import MobileBar from '@/components/MobileBar';

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <a className="skip" href="#services">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Trust />
        <Services />
        <RoofBuild />
        <Work />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
