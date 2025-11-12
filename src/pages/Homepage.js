import React from 'react'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import Header from '../components/Header'
import AboutSection from '../components/AboutSection'
import AppShowcase from '../components/AppShowcase'
import YouTubeShowcase from '../components/YoutubeShowcase'
import WorkShowcase from '../components/WorkShowcase'
import FAQSection from '../components/FAQSection'

const Homepage = () => {
  return (
    <div>
        <Header />
        <HeroSection />
        <AboutSection />
        <AppShowcase />
        <YouTubeShowcase />
        <WorkShowcase />
        <FAQSection />
        <Footer />
    </div>
  )
}

export default Homepage