

import './App.css'
import HeaderComponent from './layout/header/header.component'
import FooterComponent from './layout/footer/footer.component'
import Routers from './routers/routers.route'
import { BrowserRouter as Router } from 'react-router-dom';


function App() {
  return (
    <Router>
      <HeaderComponent />
      <Routers />
      <FooterComponent />
    </Router>
  );
}

export default App
