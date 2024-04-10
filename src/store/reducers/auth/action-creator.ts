import { AppDispatch } from "../../index";
import { IUser, IUserReg } from "../../../models/IUser";
import { AuthActionEnum, ClearDataAction, SetAuthAction, SetDataAction, SetErrorAction, SetIsLoadingAction, SetTokenAction, SetUserAction } from "./types";
import { IToken } from "../../../models/IToken";
import TokenApiRequest from "../../../api/User/Token";
import jwt from 'jwt-decode';
import UserApiRequest from "../../../api/User/Users";
import EmployersApiRequest from "../../../api/Acts/Acts";
import { DataPressActionCreators } from "../dataPressItem/action-creator";
import { encryptData } from "../../../components/UI/functions/functions";

export const AuthActionCreators = {
    setUser: (user: IUser): SetUserAction => ({ type: AuthActionEnum.SET_USER, payload: user }),
    setToken: (token: IToken): SetTokenAction => ({ type: AuthActionEnum.SET_TOKEN, payload: token }),
    setIsAuth: (auth: boolean): SetAuthAction => ({ type: AuthActionEnum.SET_AUTH, payload: auth }),
    setErr: (payload: string): SetErrorAction => ({ type: AuthActionEnum.SET_ERROR, payload }),
    setData: (payload: string): SetDataAction => ({ type: AuthActionEnum.SET_DATA, payload }),
    clearData: (): ClearDataAction => ({ type: AuthActionEnum.CLEAR_DATA }),


    setIsLoading: (payload: boolean): SetIsLoadingAction => ({ type: AuthActionEnum.SET_IS_LOADING, payload }),
    login: (phone: string, code: string) => async (dispatch: AppDispatch) => {
        console.log('dddaaa',phone);
        
        dispatch(AuthActionCreators.setIsLoading(true));
        const mockUser = { phone, code };
        const userToken = new EmployersApiRequest();
        const userData = new UserApiRequest();
        const employersData = new EmployersApiRequest();
        setTimeout(()=>{
            if (mockUser.phone.length === 0 || mockUser.code.length === 0) {
                dispatch(AuthActionCreators.setErr('Некорректный логин или пароль'));
                dispatch(AuthActionCreators.setIsLoading(false));
                return;
            }
            try {
                userData.verifyCode(mockUser).then((resp)=>{
                    if (resp.success) {
                        //@ts-ignore
                        const tokens = resp.data as IToken;
                        dispatch(AuthActionCreators.setToken(tokens));
                        localStorage.setItem('access', tokens.access || '')
                        localStorage.setItem('refresh', tokens.refresh || '')
                        //@ts-ignore
                        const decodeJwt = jwt(tokens.refresh) || '';
                        //@ts-ignore
                        if (decodeJwt && decodeJwt.user_id) {
                            //@ts-ignore
                            userData.getById({id: decodeJwt.user_id + '/'}).then((resp)=>{
                                
                                if(resp.success){
                                    localStorage.setItem('auth', "true");
                                    localStorage.setItem('username', mockUser.phone);
                                    if (resp.data) {
                                        //@ts-ignore
                                        const dataUser: {
                                            date_joined: string | string;
                                            email: string | string;
                                            first_name: string | string;
                                            groups: [];
                                            id: number;
                                            is_active: boolean;
                                            is_employee: boolean;
                                            is_staff: boolean;
                                            is_superuser: boolean;
                                            last_login: string | string;
                                            last_name: string | string;
                                            password: string | string;
                                            patronymic: string | null;
                                            phone_number: string | string;
                                            position: string | null;
                                            user_permissions: [];
                                            username: string | string;
                                            workplace: string | null;
                                          } = resp.data;
                                          
                                          const user = {
                                            id: dataUser.id,
                                            email: dataUser.email,
                                            phone: dataUser.phone_number,
                                            first_name: dataUser.first_name,
                                            last_name: dataUser.last_name,
                                            date_joined: dataUser.date_joined,
                                            is_active: dataUser.is_active,
                                            is_employee: dataUser.is_employee,
                                            is_staff: dataUser.is_staff,
                                            is_superuser: dataUser.is_superuser,
                                            last_login: dataUser.last_login,
                                            password: dataUser.password,
                                            patronymic: dataUser.patronymic,
                                            position: dataUser.position,
                                            user_permissions: dataUser.user_permissions,
                                            username: dataUser.username,
                                            workplace: dataUser.workplace
                                          };
                                          
                                    
                                        localStorage.setItem('account', JSON.stringify(encryptData(user)));
                                        dispatch(AuthActionCreators.setIsAuth(true));
                                    }
                                    
                                    //@ts-ignore
                                    dispatch(AuthActionCreators.setUser({username: resp.data.username, password: mockUser.password, firstname: resp.data.first_name, lastname: resp.data.last_name, patronymic: resp.data.patronymic}));
                                    // localStorage.setItem('user',${username: resp.data.username, firstname: resp.data.first_name, lastname: resp.data.last_name, patronymic: resp.data.patronymic});
                                } else {
                                    dispatch(AuthActionCreators.setErr('Ошибка получения пользователя'));
                                }
                            })
                          
                        }
                      
                    } else {
                        dispatch(AuthActionCreators.setErr('Произошла ошибка авторизации'));
                    }
                });
               
            } catch (e) {
                dispatch(AuthActionCreators.setErr('Произошла ошибка при авторизации'));
            }
            dispatch(AuthActionCreators.setIsLoading(false));
        }, 2000)
      
    },
    registration: (body:IUserReg) => async (dispatch: AppDispatch) => {
        dispatch(AuthActionCreators.setIsLoading(true));
        
        const employersApi = new EmployersApiRequest();
        setTimeout(()=>{
            //@ts-ignore
            if (body.contact_person_fio === undefined|| 
                 //@ts-ignore
                 body.inn === undefined ||
                 //@ts-ignore
                 body.legal_address === undefined ||
                 //@ts-ignore
                 body.name === undefined ||
                 //@ts-ignore
                 body.phone_number === undefined
            ) {
                dispatch(AuthActionCreators.setErr('Не заполнены обязательные поля'));
                dispatch(AuthActionCreators.setIsLoading(false));
                return;
            }
            try {
                // employersApi.sendToModeration(body).then((resp:any)=>{
                //     if (resp.success) {
                //         console.log('res', resp.data);
                //         dispatch(AuthActionCreators.setIsLoading(false));
                //             dispatch(AuthActionCreators.setData(resp.data));
                //             dispatch(DataPressActionCreators.clearDataPress())

                //         setTimeout(() => {
                            
                //             dispatch(AuthActionCreators.clearData()); // Предполагается, что у вас есть экшен для очистки данных
                //         }, 5000);
                        
                //     }
                // });
               
            } catch (e) {
                dispatch(AuthActionCreators.setErr('Произошла ошибка при авторизации'));
            }
            dispatch(AuthActionCreators.setIsLoading(false));
        }, 0)
      
    },
    logout: () => async (dispatch: AppDispatch) => {
        dispatch(AuthActionCreators.setIsLoading(true));
        localStorage.removeItem('auth');
        localStorage.removeItem('username');
        localStorage.removeItem('applicant');
        localStorage.removeItem('account');
        localStorage.removeItem('access');
        localStorage.removeItem('accountEmployers');
        localStorage.removeItem('currentRoute');
        localStorage.removeItem('refresh');
        localStorage.removeItem('userVK');
        dispatch(AuthActionCreators.setIsAuth(false));
        dispatch(AuthActionCreators.setUser({} as IUser));
        dispatch(AuthActionCreators.setIsLoading(false));
    }
}
