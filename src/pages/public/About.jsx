// pages/public/About.jsx
import AboutHeader from "../../components/about/AboutHeader";
import AboutIntro from "../../components/about/AboutIntro";
import AboutFeatures from "../../components/about/AboutFeatures";
import AboutStats from "../../components/about/AboutStats";
import AboutTestimonial from "../../components/about/AboutTestimonial";

const About = () => {
  return (
    <div className="bg-gradient-to-b from-[#fff9fb] via-white to-[#fff3f6]">
      <AboutHeader />
      <AboutIntro />
      <AboutFeatures />
      <AboutStats />
      <AboutTestimonial />
    </div>
  );
};

export default About;