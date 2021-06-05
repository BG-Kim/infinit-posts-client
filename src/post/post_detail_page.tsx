///////////////////////////////////////////////////////////////////////////////////////////////////
//                                    Imports                                                    //
///////////////////////////////////////////////////////////////////////////////////////////////////
// Import Basic
import React, {useState, useEffect} from 'react';


// import App Basic
import "./post_detail_page.scss";
// import {api} from "test-api";
import {api} from "api";
// import App Types
import {PostData} from "app-types";

import { RouteComponentProps } from "react-router-dom";


import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CommentIcon from '@material-ui/icons/Comment';


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import CommentCard from "./post_card";

import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Input from '@material-ui/core/Input';





interface Props { match: {params: { postId: string; }; }; }
export default function PostDetailPage(props : RouteComponentProps & Props) {
  let postId : number | null = null;
  const [post, setPost] = useState<PostData | null>(null);
  
    
  try {
    postId = parseInt(props.match.params.postId);
  } catch(e) {
    // show page not available
  }  
    
  useEffect(() => {
      (async ()=> {      
        if( postId ) {
          
          const postDetail = await api.getPostDetail(postId);
          setPost(  postDetail );
          console.info("postDetail>>>>", postDetail);
        }
      })();        
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  if( postId === null )
    return <>Post ID가 없도다</>;

  if(post === null )
      return <></>;  
  

  return (
    <div className="post-dir post-detail-page">

      <TopBar {...props} />
      <PostContent post={post} />

      <LinkPostSection history={props.history} postId={postId} />


      <div>
        {post.children && 0 < post.children.length &&
          post.children.map((post)=>{
            return (
              <CommentCard post={post}/>

            );
          })
        }

      </div>    
    </div>
  );
}



function TopBar(props : RouteComponentProps) {
  const history = props.history;

  function handleGoBack() {
    history.goBack();    
  }

  return (
    <AppBar className="app-topbar" position="fixed">
        <Toolbar>
          <IconButton className="app-left-comp" aria-label="menu" onClick={handleGoBack}>
            <ArrowBackIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
  ); 
}


interface PostContentParams {
  post : PostData
}

function PostContent(props : PostContentParams) {
  const post : PostData = props.post; 
  
  return (
    <Container className="post-content-container">
        <Typography variant="h5" className="title">{post.title}</Typography>

        <pre className="description">
          {post.content}
        </pre>

        <div className="toolbar">
          <IconButton >
              <ThumbUpIcon />
          </IconButton>
          <Typography>0</Typography>
          <IconButton >
              <ThumbDownIcon />
          </IconButton>

          <IconButton >
              <CommentIcon />
          </IconButton>
          <Typography >{post.numOfChildren}</Typography>          
        </div>        
    </Container>
  ); 
}



// Title & Input
interface LinkPostSectionProps {
  history : RouteComponentProps["history"],
  postId : number
}
function LinkPostSection(props : LinkPostSectionProps) {
  function onWriteLinkedPostClick() {
    props.history.push(`/write?parentId=${props.postId}`);
  }

  return (
    <Container className="link-post-section">
      
      <Typography variant="h6" className="title" >
          LINKED POSTS
      </Typography>
      
      <Container className="input-container">
        <Avatar className="user-profile"/>
        <Input  className="txt-input" inputProps={{readOnly: true}} placeholder="Write link post..." onClick={onWriteLinkedPostClick}/>
      </Container>
    </Container>
  );
}


