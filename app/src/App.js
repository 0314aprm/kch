import React, {useState} from 'react';
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
import SendIcon from '@material-ui/icons/Send';
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
import { ButtonBase } from '@material-ui/core';
import MenuItem from "@material-ui/core/MenuItem";
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';


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
  postbutton: {
    right: 0,
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
  contentBox: {
    width: "100%"
  },
}));

function SmartCard(props) {
  const {classes, info} = props;
  const v = info;
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
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
      title = {v.title}
      subheader= {v.time}
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
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent>
        <Typography paragraph>
          {v.content}
        </Typography>
      </CardContent>
    </Collapse>
  </Card>
}
SmartCard = withStyles(styles)(SmartCard);

function rand() {
  return Math.round(Math.random() * 20) - 10;
}


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
            <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
            <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon />} />
          </BottomNavigation>
        </Toolbar>
      </AppBar>
      <div className={classes.contentWrapper}>
        {
          contents.length === 0 ? 
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
        <div className={classes_2.paper} >
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
            style={{
              width: "100%"
            }}
            margin="normal"
            variant="outlined"
          />
          <div style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
            >
              送信
            </Button>
          </div>
        </div>
        </Modal>
    </div>
    <BottomNavigationAction
      label="Addcicle" 
      value="addCircle" 
      className={classes_2.bottomNav}
      icon={<AddCircleIcon className={classes_2.addButton} onClick = {handleOpen} />}
    />
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

export default withStyles(styles)(Content);
