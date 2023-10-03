import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getPosts,
    loading as postsLoading,
    posts as postsList,
    total as postTotal,
    totalPages as postTotalPages,
    markAsFeatured as sliceMarkAsFeatured,
    deletePost
} from '../../store/slices/postsSlice'
import Link from "next/link";
import {useRouter} from "next/navigation";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {IconButton, Pagination, Stack} from "@mui/material";
import {Pencil, Delete, Eye} from 'mdi-material-ui'
import { Switch } from '@mui/base';
import {log} from "next/dist/server/typescript/utils";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
//Additonal
// import {deletePost} from "../../store/slices/postsSlice";
// import {getPosts} from "../../store/slices/postsSlice";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function Posts(props) {

    const dispatch = useDispatch()
    const {push} = useRouter()

    const loading = useSelector(postsLoading)
    const posts = useSelector(postsList)
    const total = useSelector(postTotal)
    const totalPages = useSelector(postTotalPages)
    console.log("posts" , posts)
    const [page, setPage] = useState(1)

    function onPageChange(e, p) {
        setPage(p)
    }

    const handleDelete = async (e, id) => {
        e.preventDefault()
        console.log(id)
        await dispatch(deletePost({id}))
        await dispatch(getPosts({page}))
    }

    const markAsFeatured = async (post, value) => {
        await dispatch(sliceMarkAsFeatured({
            post_id: post.id,
            is_featured: value
        }))

        await dispatch(getPosts({page}))
    }

    useEffect(() => {
        dispatch(getPosts({page}))
    }, [page])

    //Detail Modal config
    const [open, setOpen] = React.useState(false);
    const [focused_post, setFocusedPost] = React.useState(null);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Stack direction="row">
                    <Typography variant='h5'>
                        Posts
                    </Typography>
                    <Button component={Link} href='/posts/create' sx={{marginLeft: 'auto'}}>
                        Create Post
                    </Button>
                </Stack>
            </Grid>


            <Grid item xs={12}>
                <Card>
                    <Paper sx={{width: '100%', overflow: 'hidden'}}>
                        {loading ? <Typography variant='h5' sx={{my: 3}} textAlign='center'>Loading...</Typography> : (
                            <TableContainer sx={{maxHeight: 440}}>
                                <Table stickyHeader aria-label='sticky table'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Title Arabic</TableCell>
                                            <TableCell>Featured</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {posts.map(post => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={post.id}>
                                                    <TableCell>
                                                        <span>{post.id}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{post.title}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span>{post.title_ar}</span>
                                                    </TableCell>

                                                    <TableCell className="text-center">
                                                        {
                                                            (post.is_featured == 0) ?
                                                                (
                                                                    <Button onClick={
                                                                        e => {
                                                                            markAsFeatured(post, 1);
                                                                        }
                                                                    }>
                                                                        Mark as Featured
                                                                    </Button>
                                                                ) :
                                                                (
                                                                    <Button onClick={
                                                                        e => {
                                                                            markAsFeatured(post, 0);
                                                                        }
                                                                    }>
                                                                        Remove from Featured
                                                                    </Button>
                                                                )
                                                        }
                                                          {/*<input type="checkbox" checked={post.is_featured == 1} onChange={*/}
                                                          {/*    e => {*/}
                                                          {/*        markAsFeatured(e, post.id);*/}
                                                          {/*    }*/}
                                                          {/*}/>*/}
                                                    </TableCell>

                                                    <TableCell width="200">
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => {
                                                                e.preventDefault()
                                                                push(`/posts/${post.id}`)
                                                            }} sx={{marginLeft: 'auto'}}>
                                                            <Pencil/>
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => handleDelete(e, post.id)}
                                                            sx={{marginLeft: 'auto'}}>
                                                            <Delete/>
                                                        </IconButton>

                                                        {/*show button*/}
                                                        <IconButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={e => {
                                                                setFocusedPost(post);
                                                                handleOpen();
                                                            }}
                                                            sx={{marginLeft: 'auto'}}>
                                                            <Eye/>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}


                        {/*Detail Modal*/}
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <TableContainer sx={{maxHeight: 440}}>
                                    <Table stickyHeader aria-label='sticky table'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>
                                                    <span>{focused_post?.id}</span>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Title</TableCell>
                                                <TableCell>
                                                    <span>{focused_post?.title}</span>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Title Arabic</TableCell>
                                                <TableCell>
                                                    <span>{focused_post?.title_ar}</span>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Description</TableCell>
                                                <TableCell>
                                                    <span>{focused_post?.description}</span>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Description Arabic</TableCell>
                                                <TableCell>
                                                    <span>{focused_post?.description_ar}</span>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Video</TableCell>
                                                <TableCell>
                                                    {focused_post?.video && (
                                                        <video width="240" height="150" controls>
                                                            <source src={focused_post?.video} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Audio</TableCell>
                                                <TableCell>
                                                    {focused_post?.audio && (
                                                        <audio controls>
                                                            <source src={focused_post?.audio} type="audio/mpeg" />
                                                            Your browser does not support the audio element.
                                                        </audio>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Image</TableCell>
                                                <TableCell className="text-center">
                                                    {(focused_post?.image !== null && focused_post?.image !== 'null') ? (
                                                        <Button tag='a' href={focused_post?.image} target="_blank"
                                                                layout="link"
                                                                size="small">
                                                            View Image
                                                        </Button>
                                                    ) : null}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>PDF</TableCell>
                                                <TableCell className="text-center">
                                                    {(focused_post?.pdf !== null && focused_post?.pdf !== 'null') ? (
                                                        <Button tag='a' href={focused_post?.pdf} target="_blank"
                                                                layout="link"
                                                                size="small">
                                                            View File
                                                        </Button>
                                                    ) : null}
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Modal>

                        <Stack direction='row' sx={{my: 4, display: (loading ? 'none' : '')}} justifyContent='center'>
                            <Pagination count={totalPages} onChange={onPageChange}/>
                        </Stack>
                    </Paper>
                </Card>
            </Grid>
        </Grid>
    );
}

export default Posts;
