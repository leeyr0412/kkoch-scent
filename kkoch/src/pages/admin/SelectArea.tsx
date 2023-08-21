import LocationButton from "@/components/buttons/LocationButton"

const SelectArea = () => {
  const location = ["aT화훼공판장(양재동)", "부산화훼공판장(엄궁동)", "광주원예농협(풍암)"
                    , "한국화훼농협(음성)", "부산경남화훼농협(강동동)", "한국화훼농협(과천)", "영남화훼농협(김해)"];
  

  return (
    <section className="gap-16 bg-white absolute top-0 left-[5%] h-[100%] flex flex-col justify-center"> 
      <div className="text-center">
        <h1>관리자님 안녕하세요!</h1>
        <br />
        <h1>경매를 진행할 지역을 선택해주세요</h1>
      </div>

      <hr />

      <div className="flex items-center justify-center flex-col mt-[50px]">
        <div>
          <LocationButton location={location[0]} type="admin"/>
          <LocationButton location={location[1]} type="admin"/>
          <LocationButton location={location[2]} type="admin"/>
        </div>
        <div className="mt-[100px]">
          <LocationButton location={location[3]} type="admin"/>
          <LocationButton location={location[4]} type="admin"/>
          <LocationButton location={location[5]} type="admin"/>
          <LocationButton location={location[6]} type="admin"/>
        </div>
      </div>
    </section>
  )
}

export default SelectArea