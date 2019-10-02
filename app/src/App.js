import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FavoriteIcon from '@material-ui/icons/Favorite';
import HomeIcon from '@material-ui/icons/Home';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import clsx from 'clsx';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { grey } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';
import { blue } from '@material-ui/core/colors';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Modal from "@material-ui/core/Modal";
import Button from '@material-ui/core/Button';
import { ButtonBase } from '@material-ui/core';
import MenuItem from "@material-ui/core/MenuItem";

import { BrowserRouter, withRouter, Link } from "react-router-dom";
import { connect } from 'react-redux';
import jwt from "jsonwebtoken";
import api from "./utils/api";
import { format_date } from "./utils/others";
import { loginUser, signupUser } from "./actions";

const styles = theme => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
});

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
//    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2,4,3),
  },
  addButton: {
    color: blue[600],
    fontSize: "1em",
  },
  bottomNav: {
    position: "fixed",
    bottom: "0.4em",
    right: "0.4em",
    fontSize: "5em",
  },
  root: {
    width:1000,
    fontSize: "10em",
    color: blue[600],
    "& > span" : {
      margin: theme.spacing(2),
    },
    "&:hover" : {
      color: blue[700],
    },
  },
  card: {
    maxWidth: 345,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));


function getChildren(id, clbk) {
  api.post.getChildren(id).then(r => {
    clbk(r);
  });
}


function CardChild(props) {
  const [children, setChildren] = useState(false);
  const { classes, data } = props;

  return <Card className={classes.card}
    style={{
      position: "relative",
      marginBottom: "50px",
      borderLeft: "5px solid black"
    }}
  >
    <div style={{
        position: "absolute",
        height: "100%",
        width: "10px",
        left: "-5px",
      }}
      onClick={() => {
        setChildren(false)
      }}
    >

    </div>
  <CardHeader
    avatar={
      <Avatar aria-label="recipe" className={classes.avatar}>
        R
      </Avatar>
    }
    action={
      <IconButton aria-label="settings">
        <MoreVertIcon />
      </IconButton>
    }
    title = {data.Title}
    subheader= {format_date(data.CreatedAt)}
  />
    <CardContent>
      <Typography paragraph>
        {data.Content}
      </Typography>
      {
        !props.childList && !children && <a onClick={() => {
          getChildren(props.data.ID, setChildren);
        }}>返信を読み込む</a>
      }
      {
        (children || props.childList || []).map((v,i) => {
          return <CardChild key={i} data={v}/>
        })
      }
    </CardContent>
  </Card>
}
CardChild = withStyles(styles)(CardChild);


function SmartCard(props) {
  const {classes, info} = props;
  const v = info;

  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState([]);
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
    getChildren(v.ID, setChildren);
  };
  return <Card className={classes.card} style={{marginBottom: "50px"}}>
    <CardHeader
      avatar={
        <Avatar aria-label="recipe" className={classes.avatar}>
          R
        </Avatar>
      }
      action={
        <IconButton aria-label="settings">
          <MoreVertIcon />
        </IconButton>
      }
      title = {v.Title}
      subheader= {format_date(v.CreatedAt)}
    />
    <CardActions disableSpacing>
      <IconButton aria-label="add to favorites">
        <FavoriteIcon />
      </IconButton>
      <IconButton aria-label="share">
        <ShareIcon />
      </IconButton>
      <IconButton
        className={clsx(classes.expand, {
          [classes.expandOpen]: expanded,
        })}
        onClick={handleExpandClick}
      >
        <ExpandMoreIcon />
      </IconButton>
    </CardActions>
    <CardContent>
      <Typography paragraph>
        {v.Content}
      </Typography>
    </CardContent>
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent>
        {
          children && children != [] && children.map((v,i) => {
            return <CardChild key={i} data={v} childList={v.children}/>
          })
        }
      </CardContent>
    </Collapse>
  </Card>
}
SmartCard = withStyles(styles)(SmartCard);


function Content(props) {
  const { classes } = props;
  const [open,setOpen] = React.useState(false);
  const [contents, setContents] = useState([]);
  const [titles,setTitles] = useState([]);
  const [value, setValue] = useState("");
  const [posted,setPosted] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [contentText, setContentText] = useState("");
  const [card,setCard] = useState([]);
  const classes_2 = useStyles();

  useEffect(() => {
    fetchPosts();
  }, []);


  const fetchPosts = () => {
    api.post.list().then(r => {
      console.log(r)
      setCard(r);
    });
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePostClick = () => {
    setPosted(!posted);
  };
  function addContent(text) {
    var newContent = Array.from(contents);
    newContent.push(text);
    setContents(newContent);
  }
  function addTitle(text) {
    var newTitle = Array.from(titles);
    newTitle.push(text);
    setTitles(newTitle);
  }

  function addCard(newcard) {
    var newCard = Array.from(card);
    newCard.push(newcard);
    setCard(newCard);
  }
  return (
    <Paper className={classes.paper}>
      <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
        <Toolbar>
          <BottomNavigation value={value} onChange={(e) => {setValue(e.target.value);}} className={classes_2.root}>
            <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} onClick={() => {props.history.push("/home");}} />
            <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon />} onClick={() => {props.history.push("/favorites");}} />
          </BottomNavigation>
          <div>
            {props.userData.username || "poop"}
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.contentWrapper}>
        {
          card.length === 0 ? 
            <Typography color="textSecondary" align="center">まだ記事がありません</Typography> 
          :
          card.map((v,i) => {
            return (
              <SmartCard key={i} info={v}/>
            )  
          })  
        }          
      </div>
      <div>

      {/*<BottomNavigation value={value} onChange={(e) => {setValue(e.target.value);}} className={classes_2.root}>*/}
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className={classes_2.paper}>
          <TextField 
            fullWidth
            placeholder="タイトルを追加してください"
            className = {classes.textField}
            value = {searchText}
            onChange={(e) => {
                setSearchText(e.target.value);
              }
            }
            onKeyDown={(e) => {
              if(e.keyCode !== 13){
                return false;
              }
              addTitle(searchText);
              addContent(contentText);
              setSearchText("");
              setContentText(""); 
              addCard({"title": searchText, "content": contentText,"time": Date(Date.now())}); 
              handleClose();
            }}  
          />
          <TextField
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            rows="4"
            value = {contentText}
            onChange={(e) => {
              setContentText(e.target.value);
            }
          }
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />       
        </div>
      </Modal>
    </div>
    <BottomNavigationAction
      label="Addcicle" 
      value="addCircle" 
      className={classes_2.bottomNav}
      icon={<AddCircleIcon className={classes_2.addButton} onClick = {handleOpen} />}
    />


    <LoginForm/>
    {/*
    <ButtonBase component={
      <div>
        adwokwdoko
        dwad
      </div>
    }>
    </ButtonBase>
    */}
    </Paper>
  );
}
Content.propTypes = {
  classes: PropTypes.object.isRequired,
};
Content = connect(
  state => {
    return { userData: state.userData }
  },
  null
)(withRouter(withStyles(styles)(Content)));

function LoginForm(props) {
  const {classes} = props;

  const [username, SetUsername] = useState("");
  const [password, SetPassword] = useState("");
  
  useEffect(() => {
    api.post.list().then(r => {
      console.log(r);
    })
  }, []);

  return <div>
    <div>
      username:
      {props.userData.username}
    </div>
    <form className={classes.container} noValidate autoComplete="off">
      <div>
        <TextField
          id="standard-name"
          label="ユーザー名"
          className={classes.textField}
          type="username"
          value={username}
          onChange={(e) => {SetUsername(e.target.value)}}
          margin="normal"
        />
      </div>
      <div>
        <TextField
          id="standard-name"
          label="パスワード"
          className={classes.textField}
          type="password"
          value={password}
          onChange={(e) => {SetPassword(e.target.value)}}
          margin="normal"
        />
      </div>
      <div>
        <Button variant="contained" className={classes.button} onClick={
          () => {
            signupUser({username, password})(props.dispatch);
          }
        }>
          新規登録
        </Button>
        <Button variant="contained" className={classes.button} onClick={
          () => {
            loginUser({username, password})(props.dispatch);
          }
        }>
          ログイン
        </Button>
        <Button variant="contained" className={classes.button} onClick={
          () => {
            api.testAuth().then(r =>console.log(r))
          }
        }>
          認証確認
        </Button>
      </div>
    </form>
  </div>
}
LoginForm = withStyles(styles)(LoginForm);
LoginForm = connect(
  state => {
    return { userData: state.userData }
  },
  null
)(LoginForm)


function MyPage(props) {
  return <div>

  </div>
}


export default Content;