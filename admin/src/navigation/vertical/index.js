import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import Collapse from '@mui/material/Collapse';
import BookIcon from '@mui/icons-material/AutoStoriesOutlined';
import ContactIcon from '@mui/icons-material/ContactPhoneOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import PostIcon from '@mui/icons-material/DynamicFeedOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';

import {
    getCategories,
    categories as categoriesList,
} from '../../store/slices/categoriesSlice'
const navigation = () => {
    const categories = useSelector(categoriesList);

    return [
        {
            title: 'Categories',
            icon: BookIcon,
            path: '/categories',

        },
        // {
        //     title: 'Category Menus',
        //     icon: BookIcon,
        //     path: '/categoryMenus',
        //
        // },
        {
            title: 'Contacts',
            icon: ContactIcon,
            path: '/contacts',
        },
        {
            title: 'Posts',
            icon: PostIcon,
            path: '/posts',
        },
        {
            title: 'Users',
            icon: PeopleOutlinedIcon,
            path: '/users',
        },
        {
            title: 'Quotations',
            icon: PeopleOutlinedIcon,
            path: '/quotations',
        },
        {
            title: 'FAQs',
            icon: PeopleOutlinedIcon,
            path: '/faqs',
        },
        // ...categories.map(category => ({
        //     title: category.name,
        //     icon: BookIcon,
        //     path: `/categoryPosts/${category.id}`
        // }))
    ];
};

export default navigation;
