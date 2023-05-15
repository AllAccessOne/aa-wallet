import Grid from "@mui/material/Grid";
import { BackgroundImg, ImgSlider, TextSlider, ContainerSlider, TextLogo, LoginH1, Subtitle, ContainerLoginButton, CustomGrid, OrLineContainer } from "./login.css";
import { FristSlider, LogoIconXL } from "../../assets/img";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Button from "../../components/Button";
import { Google } from "../../assets/icon";

const Login = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  return (
    <>
      <Grid container direction='row'>
        <Grid item xs={12} sm={12} md={6}>
          <TextLogo>
            <img src={LogoIconXL} />
            Allaccess.one
          </TextLogo>
          <LoginH1>Log in or sign up</LoginH1>
          <Subtitle>Select how you would like to continue</Subtitle>
          <ContainerLoginButton>
            <Button width='80%' height='48px' styleButton='default' fontSize='18px' iconLeft={Google} text='Continue with Google' />
            <OrLineContainer>
              <hr></hr>
              <p>or</p>
              <hr></hr>
            </OrLineContainer>
            <Button width='80%' height='48px' styleButton='default' fontSize='18px' text='See other options' />
          </ContainerLoginButton>
        </Grid>
        <CustomGrid item xs={12} sm={12} md={6}>
          <BackgroundImg>
            <Slider {...settings}>
              <ContainerSlider>
                <ImgSlider src={FristSlider}></ImgSlider>
                <TextSlider>Quick one-click login when logging in with Gmail and you can directly use the wallet immediately!</TextSlider>
              </ContainerSlider>
              <ContainerSlider>
                <ImgSlider src={FristSlider}></ImgSlider>
                <TextSlider>Quick one-click login when logging in with Gmail and you can directly use the wallet immediately!</TextSlider>
              </ContainerSlider>
              <ContainerSlider>
                <ImgSlider src={FristSlider}></ImgSlider>
                <TextSlider>Quick one-click login when logging in with Gmail and you can directly use the wallet immediately!</TextSlider>
              </ContainerSlider>
            </Slider>
          </BackgroundImg>
        </CustomGrid>
      </Grid>
    </>
  );
};

export default Login;
