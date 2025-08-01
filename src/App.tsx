import React from 'react'
import './App.css'
import HeaderComponent from './layout/header/header.component'
import FooterComponent from './layout/footer/footer.component'

function App() {

  return (
    <>
      <HeaderComponent />

      <main>
        <h1>Welcome to the App</h1>
        <p>This is the main content area.</p>
      </main>
      <FooterComponent />
    </>
  )
}

export default App
