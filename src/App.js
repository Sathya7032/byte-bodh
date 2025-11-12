import React from 'react'
import Homepage from './pages/Homepage'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import AboutUs from './pages/AboutUs';
import BlogDetail from './pages/BlogDetail';

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path='/blogs' element={<Blog />} />
      <Route path='/about' element={<AboutUs />} />
      <Route path="/blogs/:slug" element={<BlogDetail />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App