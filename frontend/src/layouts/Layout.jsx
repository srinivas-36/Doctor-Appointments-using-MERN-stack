import React from 'react'
import Header from '../components/header/Header.jsx'
import Footer from '../components/footer/Footer.jsx'
import Router from '../routes/Router.jsx'

const Layout = () => {
  return (
    <>
      <Header/>
      <main>
        <Router/>
      </main>
      <Footer/>
      
    </>
  )
}

export default Layout
