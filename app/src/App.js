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
    <CardContent>
      <Typography variant="body2" color="textSecondary" component="p">
        １投稿目の最初の行
      </Typography>
    </CardContent>
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
          文~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        </Typography>
      </CardContent>
    </Collapse>
  </Card>
}
SmartCard = withStyles(styles)(SmartCard);

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    //ソースコードであったけど`${left}%`この書き方が分からないjquery？
    //多分modalopenした時のポップアップの位置だと思うんだけどちがうかな
    transform: `translate(-${top}%, -${left}%)`,
  };
  //ここはなに？どこからとってきたの？
  //classes.paperがないからだとおもう
}
//https://material-ui.com/ja/components/modal/
//simplemodal




function Content(props) {
  const { classes } = props;
  const [modalStyle] = React.useState(getModalStyle);
  const [open,setOpen] = React.useState(false);
  const [contents, setContents] = useState([]);
  const [value, setValue] = useState("");
  const [posted,setPosted] = useState(false);
  const [searchText, setSearchText] = useState("");
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

  function addCard(newcard) {
    // ここの引数はカード単体だよ
    var newCard = Array.from(card);
    newCard.push(newcard);
    setCard(newCard);
  }
//card = [ {title: "こんにちは", content: "hellow world!"}, {title: "kodwa"}, ]
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

      {/*<BottomNavigation value={value} onChange={(e) => {setValue(e.target.value);}} className={classes_2.root}>*/}
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes_2.paper}>
          <TextField 
            fullWidth
            placeholder="記事を追加しよう"
            className = {classes.textField}
            value = {searchText}
            onChange={(e) => {setSearchText(e.target.value);}}
            onKeyDown={(e) => {
              if(e.keyCode !== 13){
                return false;
              }
              addContent(searchText);
              setSearchText(""); 
              addCard({"title": searchText, "content": "hellow world!","time": Date(Date.now())}); 
            }}  
          />
          <p id="simple-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p>
        </div>
      </Modal>
    </div>
    <BottomNavigationAction
      label="Addcicle" 
      value="addCircle" 
      className={classes_2.bottomNav}
      icon={<AddCircleIcon className={classes_2.addButton} onClick = {handleOpen} />}
    />
    </Paper>
  );
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
