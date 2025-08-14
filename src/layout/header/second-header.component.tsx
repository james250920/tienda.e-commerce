import './second-header.component.css';
import { Link } from 'react-router-dom';

export default function SecondHeaderComponent() {
    
  return (
    <header>
      <div>
        <div className="container-category">
          <ul className="list-unstyled d-flex flex-wrap justify-content-center gap-3 mb-0">
            <div className="d-flex justify-content-center">
              <Link to="/product" className="btn btn-outline-dark">Ver todas las categorías</Link>
            </div>
            <li><Link to="#">Categoría 1</Link></li>
            <li><Link to="#">Categoría 2</Link></li>
            <li><Link to="#">Categoría 3</Link></li>
            <li><Link to="#">Categoría 4</Link></li>
            <li><Link to="#">Categoría 5</Link></li>
          </ul>  
        </div>
      </div>
    </header>
  )
}
