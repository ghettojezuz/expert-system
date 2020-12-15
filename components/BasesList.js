import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from "@material-ui/core/styles";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import CardActions from "@material-ui/core/CardActions";


const useStyles = makeStyles((theme) => ({
    paragraph: {
        fontSize: '16px',
    },
    basesListWrapper: {},
    basesListItem: {
        marginBottom: '16px',
    },
    card: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
        display: 'flex',
    },
    cardContent: {
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
    }
}));

export default function BasesList() {
    const classes = useStyles();
    const [expertSystems, setExpertSystems] = useState([]);
    const router = useRouter();

    const handleRoute = (id) => {
        router.push('/bases/edit/[systemID]', `/bases/edit/${id}`)
    };

    const handleDelete = (id) => {
        localStorage.removeItem(id);
        let systems = [];
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).includes('Expert')) {
                systems.push({
                        ...JSON.parse(localStorage.getItem(localStorage.key(i))),
                        id: localStorage.key(i),
                    }
                );
            }
        }
        setExpertSystems(systems);
    };

    useEffect(() => {
        let systems = [];
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).includes('Expert')) {
                systems.push({
                        ...JSON.parse(localStorage.getItem(localStorage.key(i))),
                        id: localStorage.key(i),
                    }
                );
            }
        }

        setExpertSystems(systems);
        console.log(systems)
    }, []);

    return (
        <div className={`${classes.basesListWrapper}`}>
            {
                expertSystems.map((item) => {
                    return (
                        <div className={`${classes.basesListItem}`} key={item.id}>
                            <Card elevation={0} className={classes.card}>
                                <CardActionArea onClick={() => handleRoute(item.id)}>
                                    <CardContent className={classes.cardContent}>
                                        <p className={`${classes.paragraph}`}>{item.title}</p>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <IconButton aria-label="delete" onClick={() => {handleDelete(item.id)}}>
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </div>
                    )
                })
            }
        </div>
    )
}