export const API_TOKEN_MODEL = {
    entity: 'token',
    url: 'token/',
    methods: {

    },
}
export const API_USER_MODEL = {
    entity: 'users',
    url: 'users/',
    methods: {
        sendCode:{
            url: 'send-code/'
        },
        verifyCode:{
            url: 'verify-code/'
        },
        authorize:{
            url: 'authorize'
        },
    },
}