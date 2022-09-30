import {React ,useState } from 'react'
import styled from "styled-components";
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react';
import KakaoOauth from './KakaoOauth';
import GoogleOauth from './GoogleOauth';

const LoginPage = () => {
  const navigate=useNavigate();
  const location=useLocation();

  const [id, setId] = useState("");
  const [clickId, setClickId] = useState(false);

  const [password, setPassword] = useState("");
  const [clickPassword, setClickPassword] = useState(false);

  const [alertId,setAlertId]=useState('');
  const [alertPwd,setAlertPwd]=useState('');

  const dispatch=useDispatch();

  const loginInfo={
    "loginId":id,
    "password":password
  }

  
const click =(event)=>{
  if(event){
     if(event.target.id==='id'){
       setClickId(true)
     }
     if(event.target.id==='password'){
      setClickPassword(true)
     }
   }
 }
 
const loginAlertFunc=()=>{
  if(clickId){
    if(!id.trim()){
      setAlertId('아이디를 입력해 주세요.')
    }else if(id.trim()){
      setAlertId('')
    }
  }

  if(clickPassword){
    if(!password.trim()){
      setAlertPwd('비밀번호를 입력해 주세요.')
    }else if(id.trim()){
      setAlertPwd('')
    }
  }
}

const tabKey=(e)=>{
  if(e.key==="Tab"){
    loginAlertFunc()
  }
}

const tabKey2=(event)=>{
  if(event.key==="Tab"){
    click(event)
  }

}


  const loginPost = async()=>{


    await fetch('http://ec2-43-200-66-53.ap-northeast-2.compute.amazonaws.com:8080/login', {

    method: 'POST',
    headers: { 'content-Type' : 'application/json'},
    body: JSON.stringify(loginInfo)
  }).then((res) => res.json())
  .then((data)=>{
        // console.log(data)
        if(data){
        
             dispatch({type:'USERINFO',payload:{userInfo:data.data}})
            if(location.state?.path){
              navigate(`${location.state.path}`)
            }else{
              navigate(`/`)
              // window.location.reload()
            }
        }
   // access 토큰및 유저정보를 redux로 저장함 정보를이용하고싶으면
   //import { useSelector } from 'react-redux';를하고
  //  const accesstoken=useSelector(state=>state.LoginPageReducer.userinfo.accessToken); *토큰정보만가져오고싶을때임
  //  원하는변수를 설정하고useSelector를통해 그변수에 리덕스정보를 저장하는거임
  //  리덕스에 저장된 다양한 정보를 보고싶다면
  // const 아무거나=useSelector(state=>state.LoginPageReducer.userinfo)
  // console.log('리덕스저장되있는정보',아무거나) *리덕스 userinfo에 어떤 정보가있는지 볼 수 있을거임
  // 로그아웃시에 리덕스정보를 지워야해서 원래는  sessionStorage.removeItem("accessToken") 를해서 세션정보를지웠다면
  //import { useDispatch} from 'react-redux';를한후에
  //dispatch({type:'LOGOUT'}) 이라는 액션을 해야함
  // 
     
    



  }).catch((err) => {
      setAlertPwd('아이디 또는 비밀번호를 확인해 주세요.')
        // console.log(err)
  })
}



  const loginFunc=(event)=>{
    event.preventDefault();
    loginPost();
   
  }



  return (
    <Container onKeyDown={tabKey} onMouseDown={loginAlertFunc}>
        <LoginForm onSubmit={(event)=>loginFunc(event)}>
          <span className='title-style'><Link className='link-style' to='/'>쓰위치</Link></span>
          <input id="id" name="id" type='text' placeholder="아이디" onKeyDown={tabKey2} onMouseDown={(event)=>click(event)} onChange={(e) => setId(e.target.value)}/>
          <AlertMsg>{alertId}</AlertMsg>
          <input id="password" name="password" type="password" placeholder="비밀번호" onKeyDown={tabKey2} onMouseDown={(event)=>click(event)} onChange={(e) => setPassword(e.target.value)}/>
          <AlertMsg>{alertPwd}</AlertMsg>

          <LoginButton type="submit">로그인</LoginButton>
          <div>아직 회원이 아니십니까? <Link to='/signup'>회원가입</Link></div>
          
        </LoginForm>
       
          <KakaoOauth/>
          <GoogleOauth/>
          
    </Container>
  )
}

export default LoginPage


const Container=styled.div`
display: flex;
height: 90vh;
justify-content: center;
align-items: center;
flex-direction: column;
.title-style{
  margin-bottom: 30px;
  font-family: 'Gugi', cursive;
  a{
    text-decoration: none;
    color: rgb(71,182,181);
    font-size: xx-large;
    font-weight: bold;
  } 
};

input{
  overflow: hidden;
  width: 300px;
  height: 40px;
  margin: 0 0 8px;
  padding: 5px 39px 5px 11px;
  border: solid 1px #dadada;
  background: #fff;
  box-sizing: border-box;
}
`
const LoginForm=styled.form`
 display: flex;
  justify-content: center;
  align-items: center;
 background-color: white;
  flex-direction: column;
  padding: 5px;
  text-align: left; 
  border-radius: 10px;
`
const LoginButton=styled.button`
  font-size: 18px;
  font-weight: 700;
  line-height: 49px;
  display: block;
  width: 300px;
  height: 49px;
  margin: 16px 0 7px;
  cursor: pointer;
  text-align: center;
  color: #fff;
  border: none;
  border-radius: 10px;
  background-color: rgb(71,182,181);
`
const AlertMsg=styled.div`
width: 300px;
text-align: left;
font-size: small;
color: red;
`
