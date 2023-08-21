import { MDBCard, MDBCardBody, MDBCardTitle } from "mdb-react-ui-kit";
import { GridRowsProp, GridColDef } from '@mui/x-data-grid';
import MyReservModal from '@/pages/user/MyReservation/MyReservModal'
import StripedDataGrid from "../stripedDataGrid";
import { useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

const initailRows: GridRowsProp = [];

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'No', width: 140 },
  { field: 'col2', headerName: '품목', width: 190 },
  { field: 'col3', headerName: '품종', width: 190 },
  { field: 'col4', headerName: '등급', width: 190 },
  { field: 'col5', headerName: '단수', width: 190 },
  { field: 'col6', headerName: '가격', width: 190 },
  { field: 'col7', headerName: '예약 관리', width: 190 },
];

const MyReservation = () => {
  const [rows, setRows] = useState<GridRowsProp>(initailRows);

  function getRows() {
    axios({
      method: 'get',
      url: `https://i9c204.p.ssafy.io/api/user-service/${secureLocalStorage.getItem('memberkey')}/reservations?pageNum=0`,
      // url: `/api/api/user-service/${secureLocalStorage.getItem('memberkey')}/reservations?pageNum=0`,
      headers: {
        Authorization: `Bearer ${secureLocalStorage.getItem("token")}`
      }
    })
    .then((res) => {
      const rawData = res.data.data
      
      const formattedData = rawData["content"].map((item, idx) => ({
        id: idx + 1,
        col1: idx + 1,
        col2: item.type,
        col3: item.name,
        col4: item.grade,
        col5: item.count,
        col6: `${item.price} 원`,
        col7: "낙찰 대기",
      }))
      
      setRows(formattedData);
    })
    .catch(err => {
      console.log(err);
    })
  }
  useEffect(() => {
    getRows()
  }, [])

  // MyReservModal 컴포넌트에서 예약이 추가되었을 때 실행되는 콜백
  const handleReservationAdded = () => {
    getRows(); // 실시간으로 데이터 업데이트
  };

  return (
    <MDBCard>
      <MDBCardBody>
        <MDBCardTitle className="mb-4 font-bold flex justify-between items-start">
          <p>화훼 예약 목록</p>
          <MyReservModal onReservationAdded={handleReservationAdded}/>
        </MDBCardTitle>

        <div className="m-auto h-[70%]">
          <StripedDataGrid
            rows={rows} columns={columns}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
          />
        </div>
      </MDBCardBody>
    </MDBCard>
  )
}

export default MyReservation