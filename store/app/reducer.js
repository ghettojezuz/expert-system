import {LOGIN} from "./actions";

const initialAppState = {
    logedIn: false,
    breadcrumbNameMap: {
        '/test': 'Консультирование',
        '/bases': 'Базы знаний',
        '/bases/new': 'Новая база знаний',
        '/bases/edit': 'Редактирование базы знаний',
    },
};

export const appReducer = (state = initialAppState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                logedIn: action.payload,
            };
        default:
            return state
    }
};