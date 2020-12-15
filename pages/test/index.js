import FormLabel from "@material-ui/core/FormLabel";
import {TextField} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

const useStyles = makeStyles((theme) => ({
    formControl: {
        marginBottom: '32px',
    },
    label: {
        marginBottom: '14px',
    },
    button: {
        marginTop: '16px',
        width: '30%',
        padding: '9px 16px',
        letterSpacing: '1px'
    }
}));

export default function TestPage() {
    const classes = useStyles();
    const router = useRouter();
    const [tests, setTests] = useState([]);
    const [selectValue, setSelectValue] = useState('');

    const handleSelect = (e) => {
        setSelectValue(e.target.value);
    };

    const handleClick = () => {
        if (selectValue === '') return;
        router.push('/test/[testID]', `/test/${selectValue}`);
    };

    useEffect(() => {
        let testsArray = [];
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).includes('Expert')) {
                testsArray.push({
                        ...JSON.parse(localStorage.getItem(localStorage.key(i))),
                        id: localStorage.key(i),
                    }
                );
            }
        }

        setTests(testsArray);
    }, []);

    return (
        <div className="container">
            <div className="consult">
                <FormControl component="fieldset" style={{width: '100%'}} className={classes.formControl}>
                    <FormLabel component="legend" className={classes.label} disabled>Название базы знаний</FormLabel>
                    <TextField
                        select
                        value={selectValue}
                        onChange={handleSelect}
                        id="name"
                        label="База знаний *"
                        variant="outlined"
                    >
                        {tests.map((item, index) => {
                            return (
                                <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                            )
                        })}
                    </TextField>
                    <Button variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={handleClick}>Начать</Button>
                </FormControl>
            </div>
        </div>
    )
}