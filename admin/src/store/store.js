import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import {authSlice} from "./slices/authSlice";
import {booksSlice} from "./slices/booksSlice";
import {bookSlice} from "./slices/bookSlice";
import {contactsSlice} from "./slices/contactsSlice";
import {donationsSlice} from "./slices/donationsSlice";
import {eventsSlice} from "./slices/eventsSlice";
import {announcementsSlice} from "./slices/announcementsSlice";
import {postsSlice} from "./slices/postsSlice"
import {postSlice} from "./slices/postSlice"
import {announcementSlice} from "./slices/announcementSlice";
import {staffMembersSlice} from "./slices/staffMembersSlice"
import {staffMemberSlice} from "./slices/staffMemberSlice"
import {eventSlice} from "./slices/EventSlice"
import {prayersSlice} from "./slices/prayersSlice";
import {sermonsSlice} from "./slices/sermonsSlice"
import {sermonSlice} from "./slices/sermonSlice"
import {usersSlice} from "./slices/usersSlice";

import {categoriesSlice} from "./slices/categoriesSlice";
import {categoryPostsSlice} from "./slices/categoryPostsSlice";

import {quotationsSlice} from "./slices/quotationsSlice";
import {quotationSlice} from "./slices/quotationSlice";

import {categoryMenusSlice} from "./slices/categoryMenusSlice";
import {categorySlice} from "./slices/categorySlice";
import {faqsSlice} from "./slices/faqsSlice";
import {faqSlice} from "./slices/faqSlice";
import {userSlice} from "./slices/userSlice";
import {groupRequestsSlice} from "./slices/groupRequestsSlice";
import {speakersSlice} from "./slices/speakersSlice";
import {speakerSlice} from "./slices/speakerSlice";
import {groupsSlice} from "./slices/groupsSlice";
import {groupSlice} from "./slices/groupSlice";
import {reportsSlice} from "./slices/reportsSlice";

const makeStore = () =>
    configureStore({
        reducer: {
            [authSlice.name]: authSlice.reducer,
            [booksSlice.name]: booksSlice.reducer,
            [bookSlice.name]: bookSlice.reducer,
            [contactsSlice.name]: contactsSlice.reducer,
            [donationsSlice.name]: donationsSlice.reducer,
            [eventsSlice.name]: eventsSlice.reducer,
            [postsSlice.name]: postsSlice.reducer,
            [postSlice.name]: postSlice.reducer,
            [announcementsSlice.name]: announcementsSlice.reducer,
            [announcementSlice.name]: announcementSlice.reducer,
            [staffMembersSlice.name]: staffMembersSlice.reducer,
            [staffMemberSlice.name]: staffMemberSlice.reducer,
            [eventSlice.name]: eventSlice.reducer,
            [prayersSlice.name]: prayersSlice.reducer,
            [sermonsSlice.name]: sermonsSlice.reducer,
            [sermonSlice.name]: sermonSlice.reducer,
            [usersSlice.name]: usersSlice.reducer,
            [userSlice.name]: userSlice.reducer,
            [categoriesSlice.name]: categoriesSlice.reducer,
            [categorySlice.name]: categorySlice.reducer,
            [categoryMenusSlice.name]: categoryMenusSlice.reducer,
            [categoryPostsSlice.name]: categoryPostsSlice.reducer,

            [quotationsSlice.name]: quotationsSlice.reducer,
            [quotationSlice.name]: quotationSlice.reducer,

            [faqsSlice.name]: faqsSlice.reducer,
            [faqSlice.name]: faqSlice.reducer,
            [speakersSlice.name]: speakersSlice.reducer,
            [speakerSlice.name]: speakerSlice.reducer,
            [groupRequestsSlice.name]: groupRequestsSlice.reducer,
            [groupsSlice.name]: groupsSlice.reducer,
            [groupSlice.name]: groupSlice.reducer,
            [reportsSlice.name]: reportsSlice.reducer,
        },
        devTools: true,
    });

export const wrapper = createWrapper(makeStore);
