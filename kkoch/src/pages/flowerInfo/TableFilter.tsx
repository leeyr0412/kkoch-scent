import React, { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { MenuItem, Select, FormControl, SelectChangeEvent } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import './TableFilter.css';
import FilterValues from './TableInterface';
import axios from 'axios';
import AsyncSelect from 'react-select/async';

// 테이블 검색 필터 구현
const TableFilter = ({ selectedCategory, onFilterChange }: { selectedCategory: string, onFilterChange: (filter: FilterValues) => void }) => {

  // 상태관리
  // 처음엔 비어있는 상태
  const [filter, setFilter] = useState<FilterValues>({ category: '', startDate: dayjs(new Date()), endDate: dayjs(new Date()), flower: '', variety: '', location: '' });

  const [flowerOptions, setFlowerOptions] = useState([]);
  const [varietyOptions, setVarietyOptions] = useState([]);

  // 부류가 선택되면 품목을 가져온다
  const callFlowers = (e) => {
    console.log(e)
    setFilter({ ...filter, flower: e.selectedCategory});
    setFilter({ ...filter, variety: '' });
    setFlowerOptions([]);
    axios({
      method: "get",
      url: `https://i9c204.p.ssafy.io/api/admin-service/categories/type?code=${e.selectedCategory}`
      // url: `/api/api/admin-service/categories/type?code=${e.selectedCategory}`
    })
    .then(res => {
      // console.log(res.data.data);
      const tmp = res.data.data.map((e) => {
        return {
          value: e,
          label: e
        }
      })
      // console.log(tmp);
      setFlowerOptions(tmp);
      setFilter({ ...filter, category: e.selectedCategory });
    })
    .catch(err => {
      console.log(err);
    })
  };


  // 품목이 선택되면 품종을 가져온다
  const callVarieties = (e) => {
    console.log("품목", filter.category)
    // 초기화
    setFilter({ ...filter, variety: '' });
    setVarietyOptions([]);
    e && axios({
      method: "get",
      url: `https://i9c204.p.ssafy.io/api/admin-service/categories/name?code=${filter.category}&type=${e}`
      // url: `/api/api/admin-service/categories/name?code=${filter.category}&type=${e}`
    })
    .then(res => {
      // console.log(res.data.data);
      const tmp = res.data.data.map((e) => {
        return {
          value: e,
          label: e
        }
      })
      // console.log(tmp);
      setVarietyOptions(tmp);
      setFilter({ ...filter, flower: e });
    })
    .catch(err => {
      console.log(err);
    })
  }

  useEffect(() => {
    callFlowers({ selectedCategory });
  },[selectedCategory])


  const filterFlower = (inputValue: string) => {
    return flowerOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const filterVariety = (inputValue: string) => {
    return varietyOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
  
  const loadFlowerOptions = (inputValue, callback) => {
    setTimeout(() => {
        callback(filterFlower(inputValue));
    }, 100);
  };

  const loadVarietyOptions = (inputValue, callback) => {
    setTimeout(() => {
        callback(filterVariety(inputValue));
    }, 100);
  };


  // 시작날짜 바뀌었을 때
  const handleStartDateChange = (date: dayjs.Dayjs) => {
    setFilter({ ...filter, startDate: date });
  };

  // 종료날짜 바뀌었을 때
  const handleEndDateChange = (date: dayjs.Dayjs) => {
    setFilter({ ...filter, endDate: date });
  };
  
  // 클릭할 때 선택한 필터정보 저장
  const handleFlowerChange = (selectedOption) => {
    // 해당 입력 필드의 이름(name)과 변경된 값(value)을 가져옴
    const { name, value } = selectedOption ? selectedOption["value"] : '';
    setFilter({ ...filter, [name]: value });
    callVarieties(selectedOption ? selectedOption["value"] : '');
  };

  const handleVarietyChange = (selectedOption) => {
    const { name, value } = selectedOption ? selectedOption["value"] : '';
    setFilter({ ...filter, variety: selectedOption.value });
  };

  const handleLocationChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFilter({ ...filter, [name]: value });
  };

  // 검색을 누르면 선택한 정보 출력하는 변수
  const handleSearch = () => {
    axios
      .get(`https://i9c204.p.ssafy.io/api/admin-service/auction-articles/api`, {
      // .get(`/api/api/admin-service/auction-articles/api`, {
        params: {
          startDateTime: filter.startDate.format('YYYY-MM-DD'),
          endDateTime: filter.endDate.format('YYYY-MM-DD'),
          code: filter.category,
          type: filter.flower,
          name: filter.variety,
          region: filter.location
        }
      })
      .then((res) => {
        // const responseData = res.data.data.content;

        // const filter = responseData;
        // console.log('여기서 필터보냄', filter)
        // console.log(responseData);
        onFilterChange(filter);
        console.log("데이터 주세요", res.data)
        // 검색 결과 처리 또는 상태 업데이트 등을 수행
      })
      .catch(err => {
        console.error(err);
      });
  };

  const currentDate = dayjs();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='tablecontent'>
        <div className='tablecontent-inner '>
          <div className='datecontent'>
            <div className='datetitle'>
              날짜
            </div>
            <DatePicker
              className='datepicker'
              value={filter.startDate}
              label="시작날짜"
              format="YYYY-MM-DD"
              maxDate={filter.endDate}
              onChange={handleStartDateChange}
              slotProps={{ textField: { size: 'small' } }}
            />
            <DatePicker
              className='datepicker'
              value={filter.endDate}
              label="종료날짜"
              onChange={handleEndDateChange}
              format="YYYY-MM-DD"
              minDate={filter.startDate}
              maxDate={currentDate}
              slotProps={{ textField: { size: 'small' } }}
            />
          </div>
          <div className='flowercontent'>
            <div className='flowertitle'>
              품목
            </div>
            <FormControl className='flowerinput' variant="outlined" size="small">
              <AsyncSelect
                id="flower-select"
                className='flowerinput w-[140px] '
                placeholder=""
                defaultOptions={flowerOptions} 
                isClearable={true}
                loadOptions={loadFlowerOptions}
                onChange={handleFlowerChange}
                // name="flower"
                // value={filter.flower}
                // onChange={handleFlowerChange}
              />
            </FormControl>
          </div>
          <div className='varietycontent'>
            <div className='varietytitle'>
              품종
            </div>
            <FormControl className='varietyinput' variant="outlined" size="small">
              <AsyncSelect
                id="variety-select"
                className='varietyinput w-[160px]'
                defaultOptions={varietyOptions}
                placeholder="" 
                isClearable={true} 
                loadOptions={loadVarietyOptions}
                onChange={handleVarietyChange}
                // name="variety"
                // value={filter.variety}
                // onChange={handleVarietyChange}
              />
            </FormControl>
          </div>
          <div className='locationcontent'>
            <div className='locationtitle'>
              지역
            </div>
            <FormControl className='locationinput' variant="outlined" size="small">
              <Select
                id="location-select"
                className='locationinput w-[100px]'
                name="location"
                value={filter.location}
                onChange={handleLocationChange}
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value="양재">양재</MenuItem>
                <MenuItem value="광주">광주</MenuItem>
                <MenuItem value="부산엄궁">부산엄궁</MenuItem>
                <MenuItem value="음성">음성</MenuItem>
                <MenuItem value="과천">과천</MenuItem>
                <MenuItem value="부산강동">부산강동</MenuItem>
                <MenuItem value="김해">김해</MenuItem>
              </Select>
            </FormControl>
            <div className='button-search' onClick={handleSearch}>
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default TableFilter;
