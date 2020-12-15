import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import textInputChange from '../helpers/textInputChange';
import {isLoginDispatch} from "../store/app/actions";

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px 18px',
    },
    mt30: {
        marginTop: '30px'
    },
    mt24: {
        marginTop: '24px'
    }
}));

export default function SignIn() {
    const [state, setState] = useState({email: '', password: ''});
    const classes = useStyles();
    const dispatch = useDispatch();

    function login(e) {
        e.preventDefault();
        const loginData = {
            "username": `${state.email}`,
            "password": `${state.password}`
        };

        if (state.email === 'admin' && state.password === '12345') {
            dispatch(isLoginDispatch(true));
        }
    }

    return (
        <div className="signin__wrapper">
            <div className="signin">
                <div className={classes.paper}>
                    <form className="sign__form" noValidate onSubmit={(e) => login(e, state.email, state.password)}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="E-mail"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={state.email}
                            className={classes.mt30}
                            onChange={(e) => textInputChange(e, state, setState)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Пароль"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={state.password}
                            className={classes.mt24}
                            onChange={(e) => textInputChange(e, state, setState)}
                        />
                        <button
                            type="submit"
                            className="btn btn__sign mt-24"
                        >
                            Войти
                        </button>
                    </form>

                    <p className="signin__text mt-30">Войти с помощью</p>

                    <div className="signin__options mt-16">
                        <button className="btn signin__option">
                            <img src="/icons/google.svg" alt="google"/>
                        </button>
                        <button className="btn signin__option">
                            <img src="/icons/yandex.svg" alt="yandex"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}