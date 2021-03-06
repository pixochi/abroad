import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Linkify from 'react-linkify';
import postDateDiff from '../helpers/dateDifference';
import Comment from '../comment/Comment';
import AddComment from '../comment/AddComment';
import Modal from '../widgets/Modal';
import EditPostForm from './EditPostForm';
import SharePost from './SharePost';
import ReplyCommentForm from '../comment/ReplyCommentForm';
import { newLineToBreak, spaceToDash, beautifyUrlSegment } from '../helpers/textFormatting';
import { fbPromises } from '../authentication/social/fb';
import fbConfig from '../constants/fb';
import FacebookProvider, { Share } from 'react-facebook';


class ExtendedPost extends Component {

  addMetaTags = (postObject) => {

    // create this: <html prefix="og: http://ogp.me/ns#">
    let htmlTag = document.getElementsByTagName('html')[0];
    let attr = document.createAttribute("prefix");
    attr.value = 'og: http:/\/ogp.me/ns#';  
    htmlTag.setAttributeNode(attr);  

    //url,title,description,image -> properties recognized by FB Open Graph
    //for sharing a post on FB
    Object.keys(postObject).forEach(key => {
          let meta = document.createElement('meta');

          //create attribute - property
          var attr = document.createAttribute("property");
          attr.value = 'og:'+key;  
          meta.setAttributeNode(attr);  
          
          meta.content = postObject[key];
          document.getElementsByTagName('head')[0].appendChild(meta);
    });
  }

  componentWillMount() { 
    const { socket }  = this.props;
    socket.emit('roomPost', this.props.id);
    socket.on('add comment', (payload) => this.props.socketAddComment(payload));
  }

  componentDidMount(){
     //create meta tags for FB sharing
    const {image, title, content, category, countryIn } = this.props;
    const url = `http:/\/abroad-react-redux.herokuapp.com/${spaceToDash(countryIn)}/${category}/${beautifyUrlSegment(title)}`
    this.addMetaTags({image, title, description: content, url });
  }

  constructor(){
    super();
    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.openEditPostModal = this.openEditPostModal.bind(this);
    this.closeEditPostModal = this.closeEditPostModal.bind(this);
    
    this.state = {
      isEditPostModalOpen: false
    }
  }

  renderComments = (comments, deleteComment) => {
            if(comments.length !== 0)
            {
              const loggedUserId = localStorage.getItem('id');

              return comments.map(comment => 
              <Comment {...comment} 
                       key={comment.id}
                       postId={this.props.id}
                       deleteComment={deleteComment}
                       answerPost={this.props.answerPost} 
                       removePostAnswer={this.props.removePostAnswer}
                       editComment={this.props.editComment}
                       authenticated={this.props.authenticated}
                       isPostAuthor = {loggedUserId === this.props.authorId}
                       isPostAnswered={this.props.isAnswered} />
              ) 
            }
        return "No comments to show";
  }

  handleDeletePost = () => {
        this.props.deletePost(this.props.id);
  }

  openEditPostModal = () => {
        this.setState({ isEditPostModalOpen: true });
  }

  closeEditPostModal = () => {
        this.setState({ isEditPostModalOpen: false });
  }
    
  render() {
    const { upvotes, image, title, content, category, author, authorId, id, deleteComment, editPost, countryFrom, countryIn } = this.props;
    const comments = this.props.comments || [];
    const { authenticated } = this.props;
    const datePosted = this.props.createdAt;
    const loggedUserId = localStorage.getItem('id');

  
    return (
      <article className="extended-post">

        <Modal isOpen={this.state.isEditPostModalOpen} 
               onClose={this.closeEditPostModal}
               title="EDIT POST">

          <EditPostForm postId={id} 
            authorId={authorId} 
            editPost={editPost}
            onSubmitted={this.closeEditPostModal}
            postContent={content} />

        </Modal>

      <FacebookProvider appId={fbConfig.appID}>
        <Share
         href={`http://abroad-react-redux.herokuapp.com/posts/${id}/${spaceToDash(countryIn)}/${category}/${beautifyUrlSegment(title)}`}>
            <button>SHARE ON FB</button>
         </Share>
      </FacebookProvider>

        <span>Upvotes {upvotes}</span>
             <img className="title-img" alt={title} src={image ? image : `/images/post-categories/${category}.jpg`} />
            <h1>{title}</h1>
            <p>{countryFrom + " > " + countryIn}</p>
            <span>Submitted {datePosted} ago by <Link to={`/user/${authorId}/${spaceToDash(author.username)}`}>{author.username }</Link> to {category}</span>
            <section className="post-content">
              <Linkify properties={{target: '_blank'}}>
                { newLineToBreak(content) }
              </Linkify>
            </section>
        { loggedUserId === authorId && <button onClick={this.handleDeletePost}>DELETE POST</button> }
        { loggedUserId === authorId && <button onClick={this.openEditPostModal}>EDIT POST</button> }
            <section className="post-comments">
              <p>{comments.length + " comments"}</p>
              {authenticated ? <AddComment /> : <Link to="/signin">Sign in to add a comment.</Link>}
              {this.renderComments(comments, deleteComment)}
            </section>
      </article>
    )
  }
}

export default ExtendedPost;