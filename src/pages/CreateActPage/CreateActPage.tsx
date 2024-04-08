import React, { FC, useEffect, useRef, useState } from "react";
import Slider, { LazyLoadTypes } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NewActAddress from "../../components/NewActComponents/NewActAddress/NewActAddress";
import NewActType from "../../components/NewActComponents/NewActType/NewActType";
import NewActVictim from "../../components/NewActComponents/NewActVictim/NewActVictim";
import NewActDamage from "../../components/NewActComponents/NewActDamage/NewActDamage";
import NewActSigning from "../../components/NewActComponents/NewActSigning/NewActSigning";
import Buttons from "../../components/Buttons/Buttons";
import "./styles.scss";
import icons from "../../assets/icons/icons";
import ActsApiRequest from "../../api/Acts/Acts";
import { IOptionInput } from "../../models/IOptionInput";
import { RouteNames } from "../../routes";
import { useNavigate } from "react-router-dom";

const CreateActPage: FC = () => {
  const sliderRef = useRef<Slider>(null);
  const actsAi = new ActsApiRequest();
  const [optionActs, setOptionActs] = useState<IOptionInput[]>();
  const navigate = useNavigate();

  const nextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const prevSlide = () => {
    console.log("sliderRef", sliderRef);

    if (sliderRef.current) {
      //@ts-ignore
      if (sliderRef?.current?.innerSlider?.state.currentSlide === 0) {
        navigate(RouteNames.ACCOUNTPAGE);
      } else {
        sliderRef.current.slickPrev();
      }
    }
  };

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
    swipe: false,
    touchMove: false,
    lazyLoad: "ondemand" as LazyLoadTypes,
  };

  useEffect(() => {
    actsAi.options().then((resp) => {
      if (resp.success) {
        //@ts-ignore
        resp.data && setOptionActs(resp.data.actions.create);
      }
    });
  }, []);

  return (
    <section className="section">
      <Slider {...settings} ref={sliderRef}>
        <div>
          <NewActAddress />
        </div>
        <div>
          <NewActType />
        </div>
        <div>
          <NewActVictim />
        </div>
        <div>
          <NewActDamage />
        </div>
        {/* <div>
          <NewActSigning />
        </div> */}
      </Slider>
      <div className="containerButtonSlider">
        <Buttons
          ico={icons.arrowLeft}
          text={""}
          className="sliderButton"
          onClick={prevSlide}
        />
        <Buttons
          ico={icons.arrowRightOrange}
          text={"Далее"}
          className="sliderButton"
          onClick={nextSlide}
        />
      </div>
    </section>
  );
};

export default CreateActPage;
