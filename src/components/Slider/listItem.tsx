import React from "react";
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ListSubheader from '@mui/material/ListSubheader';
import { listMenu } from "@app/configs/data";
import { subMenuItem } from '../../types/subMenuItem.type'
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ArrowRight, ArrowDown } from "../../assets/icon";
import { MenuLink, IconArrowMenu, ListItemDiv } from './slider.css'
import { NavLink } from "react-router-dom";

type Props = {
    name: string,
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
    subMenu: Array<subMenuItem>
}


const Slider: React.FC<Props> = (props: Props) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(!open);
    };
    return (
        <List
            component="nav"
        >
            <ListItemButton component="div" onClick={handleClickOpen}>
                <props.icon style={{ marginRight: '10px' }}></props.icon>
                <ListItemDiv>
                    {props.name}
                </ListItemDiv>
                <IconArrowMenu>
                    {open ? <ArrowDown /> : <ArrowRight />}
                </IconArrowMenu>
            </ListItemButton>
            <Collapse in={open}>
                <List component="div">
                    {props.subMenu.map(e =>
                        <ListItemButton component={MenuLink} to={e.route} sx={{ pl: 6.4 }}>
                            {e.name}
                        </ListItemButton>
                    )}


                </List>
            </Collapse>
        </List>

    );
}

export default Slider;