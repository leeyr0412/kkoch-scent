import { DataGrid, GridRowParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react'
import TableFilter from './TableFilter';
import axios from 'axios';
import FilterValues from './TableInterface';
import columns from './TableColumns';
import './FlowerTable.css';

const TestComponent = (props) => {

  const codeData = props.code;
  const todayDate = new Date();
  const weekagoDate = new Date(todayDate.getTime());
  weekagoDate.setDate(weekagoDate.getDate() - 7)

  const formatDate = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    
    day = day >= 10 ? day  : '0' + day;
    month = month >= 10 ? month : '0' + month;
    return `${year}-${month}-${day}`
  }
    
  const formatTime = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    day = day >= 10 ? day  : '0' + day;
    month = month >= 10 ? month : '0' + month;
    hours = hours >= 10 ? hours : '0' + hours;
    minutes = minutes >= 10 ? minutes : '0' + minutes;

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  // 테이블 데이터 초기 상태
  const [tableData, setTableData] = useState(null);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [selectCategory, setSelectCategory] = useState('');
  // const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  const response = () => {
    setIsLoading(true);
    axios({
      method: "get",
      url: `https://i9c204.p.ssafy.io/api/admin-service/auction-articles/api?startDateTime=${formatDate(weekagoDate)}&endDateTime=${formatDate(todayDate)}&code=${codeData}`
      // url: `/api/api/admin-service/auction-articles/api?startDateTime=${formatDate(weekagoDate)}&endDateTime=${formatDate(todayDate)}&code=${codeData}`
    })
    .then((res) => {
      const dataWithId = res.data.data.content.map((item, index) => ({
        ...item,
        id: index + 1,
        bidTime: formatTime(new Date(item.bidTime)),
      }));
      setFilteredTableData(dataWithId);
      setTableData(dataWithId);
      console.log(dataWithId,"테이블 데이터")
    })
    .catch(() => {
      setIsLoading(false); 
    })
    .finally(() => {
      setIsLoading(false);
    });
  }

  // TableFilter에서 필터 정보를 받아와서 테이블 데이터를 필터링하는 함수
  const handleFilterChange = (filter: FilterValues) => {
    const filterData = tableData.filter((item) => {
      return (
          ((filter.startDate.format('YYYY-MM-DD') <= formatDate(new Date(item.bidTime))) && 
          (filter.endDate.format('YYYY-MM-DD') >= formatDate(new Date(item.bidTime)))) &&
          (!filter.flower || item.type === filter.flower) &&
          (!filter.variety || item.name === filter.variety) &&
          (!filter.location || item.region === filter.location)
        );
      });
     
      setFilteredTableData(filterData);
    };

  const getRowClassName = (params: GridRowParams) => {
    return params.row.bidPrice >= 0 ? 'custom-row-sold' : '';
  }

  useEffect(() => {
    response()
  }, [codeData])

  return (
    <div className='table-container'>
    <TableFilter onFilterChange={handleFilterChange} selectedCategory={codeData}/>
      <div>
        <div className='table-title'>
          실시간 거래 현황
          <span className='table-units'>
            (단위: 원)
          </span>
        </div>
      </div>
      <div className='tablecontent'>
      {isLoading ? (
          <div className='loading-message'></div>
        ) : (
          <div className='datagrid-container'>
            <DataGrid 
              rows={selectCategory ? filteredTableData.filter((item) => item.flower === selectCategory) : filteredTableData}
              columns={columns}
              getRowClassName={getRowClassName}
              paginationMode='client'
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 15, page: 0 }
                }
              }}
              disableColumnMenu
              sx={{ overflow: 'hidden' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default TestComponent