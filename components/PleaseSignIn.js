import { useSelector } from 'react-redux';
import SignIn from './SignIn';


const PleaseSignin = (props) => {
    const logedIn = useSelector(state => state.app.logedIn);

    if (!logedIn) {
        return (
            <SignIn />
        )
    }
    return props.children;
};

export default PleaseSignin;