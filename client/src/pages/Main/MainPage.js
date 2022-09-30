import { useState, useEffect } from "react";
import styled from "styled-components";
import { Map, CustomOverlayMap, MapMarker, Roadview } from "react-kakao-maps-sdk";
import { BiCurrentLocation } from "react-icons/bi";
import { GiCancel } from "react-icons/gi";
import Loading from "../../components/Loading";
import Guide from "../../components/Guide";

function MainPage(){

    // 초기 위치 상태
    const [ initLoc, setInitLoc ] = useState({
        // 초기 위치: 구로구청(위도, 경도)
        center: { lat: 37.495025886857, lng: 126.88797161395 },
        isPanto: false,
    });

    // 현재 위치 상태
    const [ myLocation, setMyLocation ] = useState({
        center: { lat: null, lng: null },
        isPanto: false,
    });

    // 구로구 쓰레기통 상태
    const [ guro, setGuro ] = useState([]);

    const [loading, setLoading] = useState(false)
    const [click, setClick] = useState(false)
    const [hover, setHover] = useState({
        boolean : false ,
        state : ''
    })

    const [markerClick, setMarkerClick] = useState({
        boolean : false ,
        위도 : undefined ,
        경도 : undefined ,
        주소 : undefined
    })

    const [guide, setGuide] = useState(1)
    
    // 구로구 쓰레기통 API
    useEffect(() => {
        fetch(`https://api.odcloud.kr/api/15087773/v1/uddi:d9bdf233-ee41-46fe-8e08-bb74980f1155?page=1&perPage=292&serviceKey=JLEKtRKG4tdEBz4y7sC%2FevNdcgS0EiQ9jhzT%2Bt2pQyQdZyGO0DtMfVGTiosROFjB%2BgYobwwT2wuL5nIXoT4tQA%3D%3D`)
            .then(res => res.json())
            .then(data => {
                setGuro(data.data);
            })
            .catch(err => err)
    }, []);
    
    const handleMyLocation = () => {     
        navigator.geolocation.getCurrentPosition(position => {
            setMyLocation({
                center: { lat: position.coords.latitude, lng: position.coords.longitude },
                isPanto: false,
            });
            setInitLoc({
                center: { lat: position.coords.latitude, lng: position.coords.longitude },
                isPanto: false,
            });
            if(position.coords.latitude){
                setLoading(true)
                setClick(false)
            }
        })
    };

    // console.log(guide)

    return (
        <MainStyle guide>
        {click && !loading ? <Loading /> : undefined }
        {/* <Guide setGuide={setGuide} guide={guide} /> */}
        <Map
            center={{ lat: initLoc.center.lat, lng: initLoc.center.lng }}
            style={{ width: "100%", height: "100vh" }}
                level={6}
            > 
                <CustomOverlayMap position={ !myLocation.center.lat ? 
                    { lat: initLoc.center.lat, lng: initLoc.center.lng } : 
                    { lat: myLocation.center.lat, lng: myLocation.center.lng }
                    }>
                    {myLocation.center.lat ?
                    <CustomInfoWindow>
                        <div className="my_location">{myLocation.center.lat ? "현재 위치" : undefined}</div>
                    </CustomInfoWindow> : undefined}
                </CustomOverlayMap>
                {guro.map((ele, idx) => (
                    <div key={idx}>
                    <MapMarker
                        position={{ lat: ele.위도, lng: ele.경도}}
                        image={{
                            src: ele.수거쓰레기종류 === "일반쓰레기" ? "/trash.png" : "/recycle.png",
                            size: {
                            width: 30,
                            height: 30
                            },
                        }}
                        onMouseOver={() => setHover({boolean: true , state : ele.소재지도로명주소})}
                        onMouseOut={() => setHover({boolean : false , state : ''})}
                        // onClick={() => window.open(`https://map.kakao.com/link/to/${ele.소재지도로명주소},${ele.위도},${ele.경도}`)}
                        onClick={() => setMarkerClick({boolean : true , 위도 : ele.위도 , 경도 : ele.경도 , 주소 : ele.소재지도로명주소})}
                    >
                    {ele.소재지도로명주소 === hover.state ? <div className="info">{hover.state}</div> : undefined}
                    </MapMarker>
                    </div>
                ))}
                {markerClick.boolean ?
                    <div className="roadview_modal_container">
                        <div className="modal_container">
                            <Roadview 
                            position={{ lat : markerClick.위도, lng : markerClick.경도, radius : 50}}
                            style={{width: "100%", height: "100%"}}
                            />
                            <span className="cancel"
                            onClick={() => setMarkerClick({
                                boolean : false ,
                                위도 : undefined ,
                                경도 : undefined ,
                                주소 : undefined
                            })}><GiCancel/></span>
                        </div>
                        <div className="get_directions" 
                        onClick={() => window.open(`https://map.kakao.com/link/to/${markerClick.주소},${markerClick.위도},${markerClick.경도}`)}
                        >길찾기</div>
                    </div> :
                undefined}
                <MyLocationBtn onClick={() => {
                    handleMyLocation()
                    setLoading(false)
                    setClick(true)
                }}>
                    <BiCurrentLocation className="location_icon"/>
                    <div className="guide">현위치 찾기</div>
                </MyLocationBtn>
        </Map>
        </MainStyle>
    )
}

export default MainPage;

const MainStyle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    /* -webkit-filter: blur(5px); 
    -moz-filter: blur(5px); 
    -o-filter: blur(5px); 
    -ms-filter: blur(5px); 
    filter: blur(5px); */
    /* opacity: ${!sessionStorage.getItem("abc") ? '0.5' : '1'}; */
    /* opacity: ${(props) => props.guide ? 0.5 : 1}; */

    .get_directions{
        cursor: pointer;
    font-size: 3vmin;
    position: absolute;
    bottom: 10%;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1vh 2vw;
    background-color: white;
    box-shadow: 0 1px 1px rgba(0,0,0,0.11), 
                0 2px 2px rgba(0,0,0,0.11), 
                0 4px 4px rgba(0,0,0,0.11), 
                0 6px 8px rgba(0,0,0,0.11),
                0 8px 16px rgba(0,0,0,0.11);

        &:hover {
            font-weight: bold;
        }
    }

    .roadview_modal_container{
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
    }

    .modal_container{
        width: 50vw;
        height: 50vh;

        .cancel{
            font-size: 500%;
            position: absolute;
            top: 5%;
            right: 5%;
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            cursor: pointer;
        }
    }

    .info{
        white-space: pre;
        padding: 1vh 1vw;
        font-size: 2vmin;
        border: 3px solid #277BC0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`

const MyLocationBtn = styled.div`
    :hover {
        .location_icon{
            color: lightgray;
        }

        .guide{
            display: block;
            position: absolute;
            top: 10%;
            right: 9%;
            z-index: 1;
            background-color: #73777B;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1vh 1vw;
            font-size: 2vmin;
        }
    }

    .location_icon{
        background: white;
        cursor: pointer;
        z-index: 1;
        font-size: 3.5vmin;
        position: absolute;
        right: 3%;
        top: 10%;
        color: black;
        border-radius: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5vh 1vw;
        box-shadow: 0 1px 1px rgba(0,0,0,0.11), 
                    0 2px 2px rgba(0,0,0,0.11), 
                    0 4px 4px rgba(0,0,0,0.11), 
                    0 6px 8px rgba(0,0,0,0.11),
                    0 8px 16px rgba(0,0,0,0.11);
    }

    .guide{
        display: none;
    }
`;

const CustomInfoWindow = styled.div`
    user-select: none;

    .my_location{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        padding: 1vh 1.5vw;
        margin-top: -1vh;
        border: 3px solid #277BC0;
        cursor: default;
        font-size: 2.5vmin;
        border-radius: 10%;
    }
`;
