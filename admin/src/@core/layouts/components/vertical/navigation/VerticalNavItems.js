// import {useSelector} from "react-redux";
// import {categories as categoriesList, getCategories} from '../../../../../store/slices/categoriesSlice';
// import {getMenuCategories} from '../../../../../store/slices/categoriesSlice';
import {getMenu} from '../../../../../services/categoryService';
import {useState} from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
// import BookIcon from "@mui/icons-material/AutoStoriesOutlined";
import VerticalNavLink from './VerticalNavLink'
import VerticalNavSectionTitle from './VerticalNavSectionTitle'
import {useRouter} from "next/router";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import StarBorder from "@mui/icons-material/StarBorder";

const resolveNavItemComponent = item => {
    if (item.sectionTitle) return VerticalNavSectionTitle

    return VerticalNavLink
}

const VerticalNavItems = props => {
    // const categories = useSelector(categoriesList);
    const [expandedCategory, setExpandedCategory] = useState(null);

    const [open, setOpen] = useState(true);
    const router = useRouter();

    const [categories, setCategories] = useState([]);

    const handleClick = async (e) => {
        e.preventDefault();
        setOpen(!open);

        try {
            const categoriesResponse = await getMenu();
            const fetchedCategories = categoriesResponse?.data?.data;

            setCategories(fetchedCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const navigateToPath = (path) => {
        router.push(path).then((r => 'error'));
    };

    const handleCategoryClick = (categoryId) => {
        if (expandedCategory === categoryId) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(categoryId);
        }
    };

    const RenderMenuItems = props.verticalNavItems?.map((item, index) => {
        const TagName = resolveNavItemComponent(item);
        return <TagName {...props} key={index} item={item}/>;
    });

    return (
        <>
            <List
                sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                component="vertical"
                aria-labelledby="category-list-subheader"
            >
                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <InboxIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Category List"/>
                    {open ? <ExpandLess/> : <ExpandMore/>}
                </ListItemButton>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {categories.map((category) => (
                            <div key={category.id}>
                                <ListItemButton
                                    sx={{pl: 4}}
                                    onClick={() => {
                                        handleCategoryClick(category.id);
                                        navigateToPath(`/categoryPosts/${category.id}`);
                                    }}
                                >
                                    <ListItemIcon><CategoryOutlined/></ListItemIcon>
                                    <ListItemText primary={category.name}/>
                                    {category.children.length > 0 && (
                                        expandedCategory === category.id ? <ExpandLess/> : <ExpandMore/>
                                    )}
                                </ListItemButton>
                                {expandedCategory === category.id && (
                                    <Collapse in={true} timeout="auto" unmountOnExit>
                                        {category.children.length > 0 && (
                                            <List component="div" disablePadding>
                                                {category.children.map((childCategory) => (
                                                    <ListItemButton
                                                        key={childCategory.id}
                                                        sx={{pl: 8}}
                                                        onClick={() => navigateToPath(`/categoryPosts/${childCategory.id}`)}
                                                    >
                                                        <ListItemIcon><StarBorder/></ListItemIcon>
                                                        <ListItemText primary={childCategory.name}/>
                                                    </ListItemButton>
                                                ))}
                                            </List>
                                        )}
                                    </Collapse>
                                )}
                            </div>
                        ))}
                    </List>
                </Collapse>
            </List>
            {RenderMenuItems}
        </>
    );
};

export default VerticalNavItems;
