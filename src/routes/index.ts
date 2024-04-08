import React from "react";
import Login from "../pages/Login/Login";
import HomePage from "../pages/HomePage/HomePage";
import PhonePage from "../pages/PhonePage/PhonePage";
import SmsPage from "../pages/SmsPage/SmsPage";
import AccountPage from "../pages/AccountPage/AccountPage";
import CreateActPage from "../pages/CreateActPage/CreateActPage";
import AddDamagesPage from "../pages/AddDamagesPage/AddDamagesPage";

const isAuthenticated = localStorage.getItem("account");
const isAuthenticatedApplicant = localStorage.getItem("applicant");

export interface IRoute {
    path: string;
    element: React.FC<any>;
    exact?: boolean;
    params?: { [key: string]: string | number };
}

export enum RouteNames {
    LOGIN = '/login',
    HOMEPAGE = '/',
    PHONEPAGE = '/login-phone',
    SMSPAGE = '/login-sms',
    ACCOUNTPAGE = '/account',
    CREATEACTPAGE = '/newact',
    ADDDAMAGEPAGE = '/add-damages',
}

export const navDate = [
  {
    id: 1,
    name: "Авторизация",
    link: RouteNames.LOGIN,
  },
];

export const publicRoutes: IRoute[] = [
  {
    path: RouteNames.LOGIN,
    exact: true,
    element: Login,
  },
  {
    path: RouteNames.PHONEPAGE,
    exact: false,
    element: PhonePage
  },
  {
    path: RouteNames.SMSPAGE,
    exact: false,
    element: SmsPage
  },
  {path: RouteNames.ACCOUNTPAGE, exact: true, element: AccountPage},
]

export const privateRoutes: IRoute[] = [
  {path: RouteNames.LOGIN, exact: true, element: Login},
  {
    path: RouteNames.PHONEPAGE,
    exact: false,
    element: PhonePage
  },
  {
    path: RouteNames.SMSPAGE,
    exact: false,
    element: SmsPage
  },
  {path: RouteNames.ACCOUNTPAGE, exact: true, element: AccountPage},
    {path: RouteNames.HOMEPAGE, exact: true, element: HomePage},
    {path: RouteNames.ACCOUNTPAGE, exact: true, element: AccountPage},
    {path: RouteNames.CREATEACTPAGE, exact: true, element: CreateActPage},
    {path: RouteNames.ADDDAMAGEPAGE, exact: true, element: AddDamagesPage},
    // {path: RouteNames.CREATEOBJECT, exact: true, element: CreatePage},
    // {path:`${RouteNames.CREATEREPORT}/:id`, exact: false, element: CreateReport, params: { params: ':id' }},
    // {path:`${RouteNames.OBJECTINFO}/:id`, exact: false, element: ObjectInfoPage, params: { params: ':id' }},
]