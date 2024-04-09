import React, { FC } from "react";
import "./styles.scss";
import icons from "../../assets/icons/icons";
import { RouteNames, navDate } from "../../routes";
import { Link, useNavigate } from "react-router-dom";

const Footer: FC = () => {
  const navigation = useNavigate();

  return (
    <footer className="footer">
      <div className="footerContainer">
        <div
          className="headerLogoText"
          // onClick={() => {
          //   navigation(RouteNames.HOMEPAGE);
          // }}
        >
          <img src={icons.LogoWhite} className="logo" />
          <h4 className="logoText">
            Губернатор и правительство Белгородской области
          </h4>
        </div>
        <object
          type="image/svg+xml"
          data={icons.Footerbg}
          className="footerBg"
        ></object>

        <div className="navFooter">
          {navDate.map((item) => {
            return (
              <Link
                key={item.id}
                className={`navItem ${item.id === 5 && "work"}`}
                to={item?.link || ""}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="footerInfoContainer">
          <div className="infoFooter">
            <p className="address">308501, Белгород, ул. Студенческая 17а</p>
            <a href="tel:+7 (4722) 23-27-58" className="tel">
              +7 (4722) 23-27-58
            </a>
          </div>
          <a
            href="https://indicatordev.ru"
            target="_blank"
            className="linkIndicator"
          >
            <img src={icons.Indicator}></img>
            <p>Индикатор</p>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
