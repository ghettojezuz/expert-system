import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {useSelector} from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Link from "next/link";

const ListItemLink = (props) => {
    const {href, primaryTypographyProps, ...other} = props;
    const breadcrumbNameMap = useSelector(state => state.app.breadcrumbNameMap);
    const primary = breadcrumbNameMap[href];

    return (
        <li>
            <Link href={href}>
                <a>
                    <ListItem button {...other}>
                        <ListItemText primary={primary}
                                      primaryTypographyProps={primaryTypographyProps}/>
                    </ListItem>
                </a>
            </Link>
        </li>
    );
};

export default ListItemLink;