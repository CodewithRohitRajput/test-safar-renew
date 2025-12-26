"use client";
import React from 'react'
import AboutSectionInFeature from '../HomePage/HeroSection/AboutSectionInFeature'
import AboutPaageHeroSection from './AboutPageHeroSection'
import WhyChooseSection from './WhyChooseSection'
import ValuesSection from './ValueSection'
import Gallery from '../HomePage/galaryView/GalaryView'
import PartnersSection from '../explorePage/PartnersSection'
import Testimonial from '../HomePage/reviewSection/ReviewSection'

function About() {
  return (
    <div>
      <AboutPaageHeroSection />
      <WhyChooseSection />
      <ValuesSection />
      <Gallery />
      <Testimonial />
    </div>
  )
}
export default About
