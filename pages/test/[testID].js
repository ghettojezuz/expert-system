import {useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {useRouter} from "next/router";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import { DataGrid } from '@material-ui/data-grid';

const useStyles = makeStyles((theme) => ({
    root: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
        borderRadius: '8px',
        padding: '4px',
        backgroundColor: '#FFFFFF'
    },
    button: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    backdrop: {
        zIndex: 9999,
        color: '#fff',
    },
}));

export default function TestIDPage() {
    const classes = useStyles();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [test, setTest] = useState({});
    const [probabilities, setProbabilities] = useState([]);

    const getTableColumns = () => {
        return [
            { field: 'id', headerName: 'ID', width: 50 },
            { field: 'disease', headerName: 'Заболевание', width: 180 },
            {
                field: 'prob',
                headerName: 'Вероятность (%)',
                type: 'number',
                width: 180,
            },
        ];
    };

    const getTableRows = () => {
        let rows = [];
        probabilities.forEach((prob) => {
            rows.push({
                id: prob.index,
                disease: prob.title,
                prob: (prob.points  * 100).toFixed(2)
            })
        });
        return rows;
    };

    useEffect(() => {
        if (router.query.testID) {
            let testObj = JSON.parse(localStorage.getItem(router.query.testID));
            setProbabilities(testObj.items);
            setTest(testObj);
            setIsLoading(false)
        }
    }, [router]);

    const getMaxProb = () => {
        let max = -9999.9999;
        let maxIndex = -1;

        probabilities.forEach((prob, index) => {
            if (prob.points > max) {
                max = prob.points;
                maxIndex = index;
            }
        });

        return probabilities[maxIndex];
    };

    const handleNext = (isYes, queIndex) => {
        probabilities.forEach((prob) => {
            let newProb;
            if (prob.questionPoints[queIndex] !== null && prob.questionPoints[queIndex] !== undefined) {
                let p = prob.points;
                let pMax = prob.questionPoints[queIndex].max;
                let pMin = prob.questionPoints[queIndex].min;

                if (isYes) {
                    newProb = (pMax * p) / (pMax*p + pMin*(1-p));
                } else {
                    newProb = ((1 - pMax) * p) / ((1 - pMax)*p + (1 - pMin) * (1 - p));
                }
                prob.points = newProb;
            }
            // console.log(prob.questionPoints[queIndex]);
        });
        console.log(probabilities)
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        let testObj = JSON.parse(localStorage.getItem(router.query.testID));
        setProbabilities(testObj.items);
        setActiveStep(0);
    };

    if (isLoading) return (
        <Backdrop open={isLoading} className={classes.backdrop}>
            <CircularProgress color="inherit"/>
        </Backdrop>
    );

    return (
        <div className="container">
            <div className={classes.root}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {test.questions.map((que, index) => (
                        <Step key={que.q}>
                            <StepLabel>Вопрос {index + 1}</StepLabel>
                            <StepContent>
                                <Typography>{que.q}</Typography>
                                <div className={classes.actionsContainer}>
                                    <div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleNext(true, index)}
                                            className={classes.button}
                                        >
                                            Да
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleNext(false, index)}
                                            className={classes.button}
                                        >
                                            Нет
                                        </Button>
                                    </div>
                                </div>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === test.questions.length && (
                    <Paper square elevation={0} className={classes.resetContainer}>
                        <Typography gutterBottom variant={'h6'}>Вероятнее всего, у вас {`${getMaxProb().title.toLowerCase()} (Вероятность ${(getMaxProb().points * 100).toFixed(2)}%)`}</Typography>
                        <Button onClick={handleReset} className={classes.button} variant="contained" color={'primary'}>
                            Пройти тест заново
                        </Button>

                        <div style={{ height: 400, width: '50%' }}>
                            <DataGrid rows={getTableRows()} columns={getTableColumns()} pageSize={5} />
                        </div>
                    </Paper>
                )}
            </div>
        </div>
    )
}