import React from "react";
import Login from "../pages/Login/Login";
import HomePage from "../pages/HomePage/HomePage";
import PhonePage from "../pages/PhonePage/PhonePage";
import SmsPage from "../pages/SmsPage/SmsPage";
import AccountPage from "../pages/AccountPage/AccountPage";
import AddDamagesPage from "../pages/AddDamagesPage/AddDamagesPage";
import NewActAddress from "../pages/NewActAddressPage/NewActAddress";
import NewActType from "../pages/NewActTypePage/NewActTypePage";
import NewActVictim from "../pages/NewActVictimPage/NewActVictimPage";
import NewActSigningPage from "../pages/NewActSigning/NewActSigning";
import NewActCompletePage from "../pages/NewActComplete/NewActComplete";
import ActInsidePage from "../pages/ActInsidePage/ActInsidePage";
import NewActSigningPhotoPage from "../pages/NewActSignPhoto/NewActSignPhoto";
import NewActDamage from "../pages/NewActDamagePage/NewActDamagePage";

const isAuthenticated = localStorage.getItem("account");
const isAuthenticatedApplicant = localStorage.getItem("applicant");

export interface IRoute {
    path: string;
    element: React.FC<any>;
    exact?: boolean;
    params?: { [key: string]: string | number };
}

export enum RouteNames {
    LOGIN = '/',
  
    PHONEPAGE = '/login-phone',
    SMSPAGE = '/login-sms',
    ACCOUNTPAGE = '/',
    ADDDAMAGEPAGE = '/add-damages',
    NEWACTADDRESS = '/new-act-address',
    NEWACTTYPEPAGE = '/new-act-type',
    NEWACTVICTIMPAGE = '/new-act-victim',
    NEWACTDAMAGEPAGE = '/new-act-damage',
    NEWACTSIGNINGPAGE = '/new-act-signing',
    NEWACTSIGNINPHOTOGPAGE = '/new-act-sign-photo',
    NEWACTCOMPLETEPAGE = '/new-act-complete',
    ACTINSIDE = '/act-inside',
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
    path: `${RouteNames.PHONEPAGE}/:type`,
    exact: false,
    element: PhonePage,
    params:{params: ':type'}
  },
  {
    path: `${RouteNames.SMSPAGE}/:type`,
    exact: false,
    element: SmsPage,
     params:{params: ':type'}
  },
  // {path: RouteNames.ACCOUNTPAGE, exact: true, element: AccountPage},
]

export const privateRoutes: IRoute[] = [
  // {path: RouteNames.LOGIN, exact: true, element: Login},
  {
    path: `${RouteNames.PHONEPAGE}/:type`,
    exact: false,
    element: PhonePage,
    params:{params: ':type'}
  },
  {
    path: `${RouteNames.SMSPAGE}/:type`,
    exact: false,
    element: SmsPage,
     params:{params: ':type'}
  },
    {path: RouteNames.ACCOUNTPAGE, exact: true, element: AccountPage},

    {path: RouteNames.ADDDAMAGEPAGE, exact: false, element: AddDamagesPage},
    {path: RouteNames.NEWACTADDRESS, exact: false, element: NewActAddress},
    {path: RouteNames.NEWACTTYPEPAGE, exact: false, element: NewActType},
    {path: RouteNames.NEWACTVICTIMPAGE, exact: false, element: NewActVictim},
    {path: RouteNames.NEWACTDAMAGEPAGE, exact: false, element: NewActDamage},
    {path:`${RouteNames.NEWACTSIGNINGPAGE}/:id`, exact: false, element: NewActSigningPage, params: { params: ':id' }},
    {path:`${RouteNames.NEWACTSIGNINPHOTOGPAGE}/:id`, exact: false, element: NewActSigningPhotoPage, params: { params: ':id' }},
    {path:`${RouteNames.NEWACTCOMPLETEPAGE}/:id`, exact: false, element: NewActCompletePage, params: { params: ':id' }},
    {path:`${RouteNames.ACTINSIDE}/:id`, exact: false, element: ActInsidePage, params: { params: ':id' }},
    // {path:`${RouteNames.CREATEREPORT}/:id`, exact: false, element: CreateReport, params: { params: ':id' }},
    // {path:`${RouteNames.OBJECTINFO}/:id`, exact: false, element: ObjectInfoPage, params: { params: ':id' }},
]