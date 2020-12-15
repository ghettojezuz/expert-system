import {TextField} from '@material-ui/core';
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

const useStyles = makeStyles((theme) => ({
    form: {
        background: '#FFFFFF',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
        borderRadius: '8px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
    },
    formControl: {
        marginBottom: '32px',
    },
    label: {
        marginBottom: '14px',
    },
}));

export default function BasesForm({editing = false}) {
    const classes = useStyles();
    const router = useRouter();
    // const [name, setName] = useState('Name');
    // const [questions, setQuestions] = useState('Много ли вы чихаете?\n' +
    //     'Болят ли или слезятся ваши глаза?\n' +
    //     'Болит ли у вас горло?\n' +
    //     'Охрип ли ваш голос?\n' +
    //     'Много ли вы кашляете?');
    // const [items, setItems] = useState('Простуда\n' +
    //     '0.02 1) 0.9 0.05 2) 0.8 0.02 3) 0.8 0.02 5) 0.6 0.01 6) 1 0.01 7) 0.2 0.01 8) 0.5 0.01 15) 0.8 0.01 34) 0 0.01\n' +
    //     'Аллергический ринит\n' +
    //     '0.01 1) 1 0.01 2) 1 0.01 6) 0.9 0.01 10) 0.7 0.1 11) 0.7 0.01 12) 0.6 0.01 20) 0.9 0.01');

    const [name, setName] = useState('');
    const [questions, setQuestions] = useState('');
    const [items, setItems] = useState('');

    useEffect(() => {
        if (editing) {
            if (router.query.systemID) {
                let sysObj = JSON.parse(localStorage.getItem(router.query.systemID));
                let parsedQue = '';
                let parsedItems = '';

                sysObj.questions.forEach((item, index) => {
                    parsedQue += item.q;
                    if (index + 1 < sysObj.questions.length) parsedQue += '\n';
                });

                sysObj.items.forEach((item, index) => {
                    parsedItems += item.title + '\n' + item.points;
                    item.questionPoints.forEach((quePoint, index) => {
                        if (quePoint === null) return;
                        parsedItems += ` ${index + 1}) ${quePoint.max} ${quePoint.min}`;
                    })
                    if (index + 1 < sysObj.items.length) parsedItems += '\n';
                });

                setName(sysObj.title);
                setQuestions(parsedQue);
                setItems(parsedItems);
            }
        }

    }, [router]);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleQueChange = (e) => {
        setQuestions(e.target.value);
    };

    const handleItemsChange = (e) => {
        setItems(e.target.value);
    };

    const getItems = () => {
        let position = 0;
        let index = 0;
        let itemsArray = items.split('\n');
        let newItems = [];

        while (itemsArray.length > position) {
            let pointItems = itemsArray[position + 1].split(" ");
            let newItem = {
                title: itemsArray[position],
                points: parseFloat(pointItems[0]),
                index: index,
                questionPoints: []
            };

            for (var i = 1; i < pointItems.length; i += 3) {
                while (pointItems[i] == "") i++;
                var questionIndex = parseFloat(pointItems[i]) - 1;
                var questionPoint = {
                    max: parseFloat(pointItems[i + 1]),
                    min: parseFloat(pointItems[i + 2])
                };
                newItem.questionPoints[questionIndex] = questionPoint;
            }

            newItems.push(newItem);
            index++;
            position += 2;
        }
        return newItems;
    };

    const getQuestions = (items) => {
        let queArray = questions.split('\n');
        let newQuestions = [];
        let position = 0;

        queArray.forEach((que, index) => {
            newQuestions.push({
                q: que,
                items: [],
                index: newQuestions.length
            })
        });

        return newQuestions
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let items = getItems();
        let questions = getQuestions(items);
        let result = {
            title: name,
            items: items,
            questions: questions,
        };

        if (editing) {
            localStorage.setItem(router.query.systemID, JSON.stringify(result))
        } else {
            let newSysIndex = 0;
            for (let i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).includes('Expert')) {
                    let sysIndexTMP = parseInt(localStorage.key(i).replace(/Expert/, ''));
                    if (sysIndexTMP > newSysIndex) newSysIndex = sysIndexTMP;
                }
                console.log(newSysIndex)
            }
            localStorage.setItem(`Expert${parseInt(newSysIndex) + 1}`, JSON.stringify(result))
        }

        router.push('/bases')

    };

    return (
        <form className={classes.form} onSubmit={handleSubmit}>

            <FormControl component="fieldset" style={{width: '50%'}} className={classes.formControl}>
                <FormLabel component="legend" className={classes.label} disabled>Название базы знаний</FormLabel>
                <TextField
                    id="name"
                    label="Название"
                    variant="outlined"
                    value={name}
                    onChange={handleNameChange}
                />
            </FormControl>

            <FormControl component="fieldset" style={{width: '100%'}} className={classes.formControl}>
                <FormLabel component="legend" className={classes.label} disabled>Признаки</FormLabel>
                <TextField
                    id="questions"
                    label="Признаки"
                    variant="outlined"
                    multiline
                    rows={2}
                    rowsMax={15}
                    value={questions}
                    onChange={handleQueChange}
                />
            </FormControl>

            <FormControl component="fieldset" style={{width: '100%'}} className={classes.formControl}>
                <FormLabel component="legend" className={classes.label} disabled>Гипотезы</FormLabel>
                <TextField
                    id="items"
                    label="Гипотезы"
                    variant="outlined"
                    multiline
                    rows={2}
                    rowsMax={15}
                    value={items}
                    onChange={handleItemsChange}
                />
            </FormControl>

            <button className="btn btn__save" type="submit">Сохранить</button>
        </form>
    )
}