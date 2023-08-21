import './TradingTable.css';
import { Link, useLocation } from 'react-router-dom';

const TradingTable = () => {
  const location = useLocation();

  return (
    <div>
      <div className='paging-title'>
        <Link 
          to="/flowers/절화"
          state={{ code: "절화" }}
          className={location.pathname === '/flowers/%EC%A0%88%ED%99%94' ? 'active-link' : ''}
        >
          절화 
        </Link>
        <Link 
          to="/flowers/난"
          state={{ code: "난" }}
          className={location.pathname === '/flowers/%EB%82%9C' ? 'active-link' : ''}
        >
          난
        </Link>
        <Link 
          to="/flowers/관엽"
          state={{ code: "관엽" }}
          className={location.pathname === '/flowers/%EA%B4%80%EC%97%BD' ? 'active-link' : ''}
        >
          관엽
        </Link>
        <Link 
          to="/flowers/춘란" 
          state={{ code: "춘란" }}
          className={location.pathname === '/flowers/%EC%B6%98%EB%9E%80' ? 'active-link' : ''}

        >
          춘란
        </Link>
      </div>
    </div>
  )
}

export default TradingTable
