import { DataGrid, GridRowParams } from '@mui/x-data-grid';
import { React, useEffect, useState } from 'react'
import TableFilter from './TableFilter';
import axios from 'axios';
import FilterValues from './TableInterface';
import columns from './TableColumns';

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
      // url: `https://i9c204.p.ssafy.io/api/admin-service/auction-articles/api?startDateTime=${formatDate(weekagoDate)}&endDateTime=${formatDate(todayDate)}&code=${codeData}`
      url: `/api/api/admin-service/auction-articles/api?startDateTime=${formatDate(weekagoDate)}&endDateTime=${formatDate(todayDate)}&code=${codeData}`
    })
    .then((res) => {
      const dataWithId = res.data.data.content.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      setFilteredTableData(dataWithId);
      setTableData(dataWithId);
      console.log(tableData)
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
            단위: 원 | 기간: 1주일 단위
          </span>
        </div>
      </div>
      <div className='tablecontent'>
      {isLoading ? (
          <div className='loading-message'>데이터를 불러오는 중...</div>
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
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default TestComponent