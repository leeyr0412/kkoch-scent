// import { flowerSeries } from '@/pages/flowerInfo/FilterInterface';
import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts';
import './FlowerChart.css';
// import ApexCharts from 'react-apexcharts'


const FlowerChart = ({ flowerSeries }) => {
  console.log(flowerSeries, "시리즈")
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    
    day = day >= 10 ? day  :  day;
    month = month >= 10 ? month : month;
    return `${year}-${month}-${day}`;
  };

  const formatNumberCommas = (number) => {
    return number.toLocaleString();
  };

  const getSearchDay = (selection) => {
    switch (selection) {
      case 'one-week':
        return 7;
      case 'one_month':
        return 30;
      case 'six_months':
        return 180;
      case 'one_year':
        return 365;
      default:
        return 7; // 기본값은 1주일로 설정
    }
  };

  const series = flowerSeries;
  const [selection, setSelection] = useState('one-week');
  const todayDate = formatDate(new Date());

  // const [series, setSeries] = useState([]);
  // const todayList = todayList

  // const response = () => {
  //   axios({
  //     url: '/api/api/admin-service/stats',
  //     method: 'get',
  //     params: {
  //       type: flowerData.type,
  //       name: flowerData.name,
  //       searchDay: 365
  //     }
  //   })
  //   .then((res) => {
  //     const rawData = res.data.data;
  //     console.log(rawData)
  //     // 데이터를 grade별로 나누기
  //     const dataByGrade = {}; // grade별 데이터를 담을 객체

  //     // rawData를 순회하며 grade별로 데이터를 분류
  //     rawData.forEach(item => {
  //       const { grade } = item;
        
  //       if (formatDate(new Date(item.createdDate)) === todayDate && item.grade === "SUPER") {
  //         todayList.push(item)
  //         console.log(todayList)
  //       }
  //       if (!dataByGrade[grade]) {
  //         dataByGrade[grade] = [];
  //       }
  //       dataByGrade[grade].push(item);
  //     });

  //     console.log("!!!!", formatDate(new Date(rawData[0].createdDate)))

      
  //     setSeries([
  //       {
  //         data: dataByGrade["ADVANCED"] ? dataByGrade["ADVANCED"].map(item => [new Date(item.createdDate).getTime(), item.priceAvg]) : [],
  //         color: "#ffe7e6",
  //       },
  //       {
  //         data: dataByGrade["NORMAL"] ? dataByGrade["NORMAL"].map(item => [new Date(item.createdDate).getTime(), item.priceAvg]) : [],
  //         color: "#FF9994",
  //       },
  //       {
  //         data: dataByGrade["SUPER"] ? dataByGrade["SUPER"].map(item => [new Date(item.createdDate).getTime(), item.priceAvg]) : [],
  //         color: "#FF9994",
  //       },
  //     ]);
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })
  // }
  
  // useEffect(() => {
  //   console.log("useEffect is being executed");
  //   response();
  // }, [])

  
  const options:ApexCharts.ApexOptions = {
    chart: {
      id: 'area-datetime',
      // type: 'area',
      height: 350,
      zoom: {
        autoScaleYaxis: true
      },
      toolbar: {
        tools: {
          download: false,
          pan: false,
        }
      },
      background: '#FFFFFF'
    },

    stroke: {
      // 선 스타일 설정
      colors: ['#ffdbaa', '#CBC3D2', '#fba1b7'], // 데이터 배열에 대한 선 색상 (0번 인덱스는 검정색, 1번 인덱스는 빨간색)
      curve: 'smooth', // 곡선형 그래프로 설정
      width: [2, 2, 2], // 데이터 배열에 대한 선 굵기 (0번 인덱스는 2px, 1번 인덱스는 2px)
    },

    dataLabels: {
      enabled: false
    },

    markers: {
      size: 2,
      colors: ['orange', 'purple', 'red']
    },

    xaxis: {
      type: 'datetime',
      min: new Date(todayDate).getTime() - getSearchDay(selection) * 24 * 60 * 60 * 1000, // 일수 * 24시간 * 60분 * 60초 단위 계산
      max: new Date(todayDate).getTime(),
      tickAmount: 30,
      labels: {
        format: 'yyyy-MM-dd', // x축 날짜 포맷
        style: {
          fontWeight: 700,
          fontSize: '14px',
        }
      },
    },

    yaxis: {
      tickAmount: 10,
      labels: {
        formatter: (value) => {
          // Math.ceil(Math.max(...yValues) / 100) * 100 + 1000
          // 숫자를 3자리 구분기호와 함께 단위를 붙여서 반환
          return '￦'+ formatNumberCommas(Math.round(value / 10) * 10);
        },
        style: {
          fontWeight: 700,
          fontSize: '14px',
        }
      },
    },

    tooltip: {
      x: {
        format: 'yyyy-MM-dd'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100]
      }
    },
    legend: {
      position: "top",
      fontSize: '20px',
      offsetX: 0,
      offsetY: 0,
      floating: true,
      itemMargin: {
        horizontal: 20,
        vertical: 0
      },
      fontFamily: 'IM_Hyemin-Bold'
    },
  };

  const updateData = (timeline: string) => {
    let minTimestamp, maxTimestamp;
    switch (timeline) {
      case 'one_week':
        minTimestamp = formatDate(new Date(todayDate).getTime() - 7 * 24 * 60 * 60 * 1000);
        maxTimestamp = formatDate(new Date(todayDate).getTime());
        break;
      case 'one_month':
        minTimestamp = formatDate(new Date(todayDate).getTime() - 30 * 24 * 60 * 60 * 1000);
        maxTimestamp = formatDate(new Date(todayDate).getTime());
        break;
      case 'six_months':
        minTimestamp = formatDate(new Date(todayDate).getTime() - 180 * 24 * 60 * 60 * 1000);
        maxTimestamp = formatDate(new Date(todayDate).getTime());
        break;
      case 'one-year':
        minTimestamp = formatDate(new Date(todayDate).getTime() - 365 * 24 * 60 * 60 * 1000);
        maxTimestamp = formatDate(new Date(todayDate).getTime());
        break;
      default:
        break;
    }

    if (series.length > 0) {
      const filteredData = series[0].data.filter(
        ([timestamp]) => timestamp >= minTimestamp && timestamp <= maxTimestamp
      );
        
      console.log(filteredData)
      // 데이터가 있을 때만 그래프를 그리도록 처리
      if (filteredData.length > 0) {
        const yValues = filteredData.map(([, value]) => value);
        // const minYValue = Math.min(...yValues);
        const maxYValue = Math.ceil(Math.max(...yValues) / 100) * 100 + 1000;
    
        // x축,y 축 최저, 최고가, 날짜 업데이트
        ApexCharts.exec('area-datetime', 'zoomX', minTimestamp, maxTimestamp);
        ApexCharts.exec('area-datetime', 'updateOptions', {
          xaxis: {
            min: minTimestamp,
            max: maxTimestamp,
          },
          yaxis: {
            min: 0,
            max: maxYValue
          },
        });
      }
    }
  }
  return (
    <div id="chart" className='chart_container'>
      <div className="chart-header">
        <h2 className="chart-title">현재 시세</h2>
        <div className="toolbar">
          <button 
            id="one_week"
            onClick={()=> {
              updateData("one-week");
              setSelection("one-week");
            }}
            className={ (selection==='one-week' ? 'active' : '')}
          >
            1주일
          </button>
          <button 
            id="one_month"
            onClick={()=> {
              updateData('one_month');
              setSelection('one_month');
            }}
            className={(selection==='one_month' ? 'active' : '')}
          >
            1개월
          </button>
          <button
            id="six_months"
            onClick={()=> {
              updateData('six_months');
              setSelection('six_months');
            }}
            className={ (selection==='six_months' ? 'active' : '')}
          >
            6개월
          </button>
          <button
            id="one_year"
            onClick={()=> {
              updateData('one_year');
              setSelection('one_year');
            }}
            className={ (selection==='one_year' ? 'active' : '')}
          >
            1년
          </button>
        </div>
      </div>
      <div id="chart-timeline">
        <ReactApexChart options={options} series={series} type="area" height={350} />
      </div>
    </div>
    );
  };

export default FlowerChart;