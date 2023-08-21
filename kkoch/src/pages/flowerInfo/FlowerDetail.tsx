import React, { useEffect, useState } from 'react'
import FlowerPrice from './FlowerPrice';
import FlowerChart from '@/components/chart/FlowerChart';
import './FlowerDetail.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const FlowerDetail = () => {
  const location = useLocation();
  const flowerData = location.state?.flowerData;
  const [loading, setLoading] = useState(true);
  console.log("가져온 꽃", flowerData)


  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    
    day = day >= 10 ? day  :  day;
    month = month >= 10 ? month : month;
    return `${year}-${month}-${day}`;
  };

  console.log("오늘날짜요", formatDate(new Date()))

  const [series, setSeries] = useState([]);
  const [todayList, setTodayList] = useState({
    priceMin: null,
    priceMax: null,
    priceAvg: null
  });

  console.log("오늘오느롱늘", todayList)
  const response = () => {
    axios({
      // url: '/api/api/admin-service/stats',
      url: 'https://i9c204.p.ssafy.io/api/admin-service/stats',
      method: 'get',
      params: {
        type: flowerData.type,
        name: flowerData.name,
        searchDay: 365
      }
    })
    .then((res) => {
      const rawData = res.data.data;
      console.log(rawData)
      // 데이터를 grade별로 나누기
      const dataByGrade = {}; // grade별 데이터를 담을 객체

      // rawData를 순회하며 grade별로 데이터를 분류
      rawData.forEach(item => {
        const { grade } = item;
        // console.log(formatDate(new Date(item.createdDate)), formatDate(new Date()))
        
        if (formatDate(new Date(item.createdDate)) === formatDate(new Date()) && item.grade === flowerData.grade) {
          setTodayList(item);
          setLoading(false);
          console.log("11111", todayList)
        }
        if (!dataByGrade[grade]) {
          dataByGrade[grade] = [];
        }
        dataByGrade[grade].push(item);
        // 해당날짜의 가격 data가 없으면
        setLoading(false);
        // console.log("데이터바이그레이드", dataByGrade)
      });

      // console.log("!!!!", formatDate(new Date(rawData[0].createdDate)))
      // console.log("오늘데이터", todayList)
      
      setSeries([
        { 
          name: "보통",
          data: dataByGrade["보통"] ? dataByGrade["보통"].map(item => [new Date(item.createdDate).getTime(), item.priceAvg]) : [],
          color: "#ffdbaa",
        },
        { 
          name: "상급",
          data: dataByGrade["상급"] ? dataByGrade["상급"].map(item => [new Date(item.createdDate).getTime(), item.priceAvg]) : [],
          color: "#CBC3D2",
        },
        { 
          name: "특급",
          data: dataByGrade["특급"] ? dataByGrade["특급"].map(item => [new Date(item.createdDate).getTime(), item.priceAvg]) : [],
          color: "#fba1b7",
        },
      ]);
      
      console.log("가져올때 시리즈", series)
    })
    .catch(err => {
      console.log(err)
    })
  }
  
  useEffect(() => {
    response();
  }, [])

  return (
    <div className='gap-24 bg-gray-20 pt-3 pl-10 pr-10 md:h-full md:pb-0'>
      <div className="detail-title">
        {flowerData.type}
        <span className='detail-subtitle'>
          {flowerData.name}
        </span>
      </div>
      <div>
        {loading ? (
          <div>
            {/* Loading... */}
          </div>
        ) : (
          <>
            <FlowerPrice todayList={todayList} />
          </>
        )}
      </div>
      <div className='chart-container'>
          <FlowerChart flowerSeries = { series } />
        </div>
    </div>
  )
}

export default FlowerDetail