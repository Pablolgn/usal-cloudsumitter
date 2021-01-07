//general
import React, { useState , useEffect } from 'react';
import axios from 'axios';
//material-ui
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import { IconButton, Grid, Button} from '@material-ui/core';
//icons
import CloseIcon from '@material-ui/icons/Close';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
//percentage
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
//component
import Preview from './Preview';
import logo from '../3d-printer.png';
//Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';




const useStyles = makeStyles(theme => ({
  paper: {
    marginLeft: theme.spacing(20),
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(5),
  },
  label1: {
    marginTop: theme.spacing(5),
  },
  margin: {
    margin: theme.spacing(1),
  },
  label2: {
    marginTop: theme.spacing(3),
  },
  closeButton: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(4)
  },
  iframe: {
    width: 490,
    height: 276,
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(11),
  },
  printStatus: {
    marginLeft:theme.spacing(5),
  },
  loading: {
    marginLeft:theme.spacing(35),
    marginTop:theme.spacing(2),
  },
  icon: {
    width:300,
    marginLeft:theme.spacing(40),
    marginTop: theme.spacing(10)
  },

 

}));
function State(props) {

  const classes = useStyles();

  const [status,setStatus] = useState(false);
  const [close, setClose] = useState(false)
  const [enableBut,setEnableBut] = useState(false);
  const [zmove,setZmove] = useState(true);
  const [start, setStart] = useState(false);




  useEffect(() => { 
    if(props.start===true){
      setStart(true)
    }
  },[props.start]);


  if(props.state.state==="Printing"){
    if(status===false){
      setStatus(true)
    }
    if(zmove === false){
      setZmove(true)
    }
    if(start=== true){
      setStart(false)
    }
    if(enableBut===true){
      setEnableBut(false)
    }
  }

  if(props.state.state==="Paused"){
    if(status===false){
      setStatus(true)
    }
    if(enableBut===true){
      setEnableBut(false)
    }
    if(zmove === true){
      setZmove(false)
    }
    
  }

  if(props.state.state==="Operational"){
    if(enableBut===false){
      setEnableBut(true)
    }
    if(zmove === true){
      setZmove(false)
    }
  }

  function handlerCancel(){
    setZmove(true)
    setEnableBut(true)
    axios.get("http://51.137.27.76/api/communication/cancel").then(response => {
      // server answer
    }).catch(e => {
      console.log(e);
    });
  

  }

  function handlerPause(){
   setEnableBut(true)
    axios.get("http://51.137.27.76/api/communication/pause").then(response => {
      // server answer
    }).catch(e => {
      console.log(e);
    });
    moveZ(5)
  }

  function moveZ(number){
    axios.get("http://51.137.27.76/api/communication/zmove/"+number).then(response => {
      // server answer
    }).catch(e => {
      console.log(e);
    });
  }

  function handlerClose(){
    if(props.state.state !== "Operational"){
      setClose(true)
    }else{
      setStatus(false)
      setStart(false)
    }
  }

  function handlerButClose(){
    setClose(false)
  }

  return (
    <div>

      <Collapse in={start}>
        <Grid container direction="row" className={classes.loading}>
            <CircularProgress />
            <Typography variant={"h5"}>
              Your STL is being prepare to print.
            </Typography>

        </Grid>
      </Collapse>

      <Collapse in={!status}>
        <img src={logo} className={classes.icon} alt="icon_3d"/>  
      </Collapse>

      <Collapse in={status}>
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item xs={2} >
              <div className={classes.model} > 
                {props.model.map(auxModel=>
                    <Preview size={70} file={auxModel} key={1024} margin={10}/>
                )}
              </div>
            </Grid>
            <Grid item sm container>
              <Grid item xs={5} container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant={"h5"}>
                    State: {props.state.state}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    File: {props.state.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Size: {props.state.size} MB
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    User: {props.state.user}
                  </Typography>
                </Grid>
                <Grid container direction="row">
                  <Button variant="contained"  size="small" color="default" disabled={enableBut} className={classes.margin} onClick={handlerCancel}>
                    Cancel
                  </Button>
                  <Button variant="contained" size="small" color="default" disabled={enableBut} className={classes.margin} onClick={handlerPause}>
                    {props.state.state === "Paused"
                      ? "Resume"
                      : "Pause"
                    }
                  </Button>
                </Grid>

              </Grid>
              <Grid item xs={5} container direction="column" spacing={2} alignItems={"center"} >
                <Grid item xs className={classes.label1}>
                  <Typography variant="body2" gutterBottom >
                    Filament: {props.state.filaLength}m/{props.state.filaVol}cm<sup>3</sup>
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Print time left: {props.state.printTimeLeft} min
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Print time: {props.state.printTime}
                  </Typography>
                </Grid>
                <Grid container direction="row">
                  <Button variant="contained" disabled={zmove} onClick={() => moveZ(5)} size="small"  component="label" endIcon={<ArrowUpwardIcon/>} className={classes.margin}>
                    Z
                  </Button>
                  <Button variant="contained" disabled={zmove} onClick={() => moveZ(-5)} size="small"  component="label" endIcon={<ArrowDownwardIcon/>} className={classes.margin}>
                    Z
                  </Button>
                </Grid>
              </Grid>
              <Grid item container xs={1} direction={"column"} >
                <Typography variant="subtitle1">
                  {props.state.price}€
                </Typography>
                <Grid item className={classes.label2} >
                  <Box position="relative" display="inline-flex">
                    <CircularProgress variant="static" value={props.state.percent} />
                    <Box
                      top={0}
                      left={0}
                      bottom={0}
                      right={0}
                      position="absolute"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                        props.state.percent,
                      )}%`}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Grid item xs={1} className={classes.closeButton}>
                <IconButton color="default" aria-label="Delete" onClick={handlerClose}>
                  <CloseIcon/>
                </IconButton> 
              </Grid>
            </Grid>
          </Grid>
          <Grid>
            <iframe className={classes.iframe} scrolling="no" frameBorder="0" title="Printer Camera" src="http://mini3dfactory.duckdns.org:3008/webcam/?action=stream"></iframe>
          </Grid>
        </Paper>
      </Collapse>

      <Dialog
        open={close}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can not close state section until the state of the printer will be operational.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlerButClose} color="primary">
            Agree
          </Button>
        </DialogActions>
      </Dialog>


      </div>
  );
}

export default State;