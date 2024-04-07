import React, { FC, Fragment, useState } from "react";
import "./styles.scss";
import icons from "../../assets/icons/icons";
import Buttons from "../Buttons/Buttons";
import { useDispatch } from "react-redux";
import { AuthActionCreators } from "../../store/reducers/auth/action-creator";
import { RouteNames } from "../../routes";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { fieldToArray } from "../UI/functions/functions";
import FormInput from "../FormInput/FormInput";
import UserApiRequest from "../../api/User/Users";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";

const Header: FC = () => {
  return <Fragment></Fragment>;
};

export default Header;
