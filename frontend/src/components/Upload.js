  //general
import React, { useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
  //material-ui
import { makeStyles } from '@material-ui/core/styles';
import {  Button, Grid, Checkbox} from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import { Alert, AlertTitle } from '@material-ui/lab';
import Tooltip from '@material-ui/core/Tooltip';
  //table
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
  //icons
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';
import LaunchIcon from '@material-ui/icons/Launch';
import StorageIcon from '@material-ui/icons/Storage';
  //components
import Preview from './Preview';
import STLDisplay from './STLDisplay';


const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(8),
  },
  root:{
    marginTop:70,
    height: 550,
    width: "100%",
    backgroundColor: "#eaf2f8",
  },
  upload: {
    flexGrow: 1,
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(12),
    marginBottom: theme.spacing(3),
  },
  fullWidth: {
    width: '100%',
  },
  input: {
    display: 'none',
  },
  table: {
    margin: theme.spacing(2),
    maxHeight: 300,
  },
  paper: {
    margin: theme.spacing(2),
  },
  model: {
    marginLeft:theme.spacing(5),
  },
  buttons: {
    marginLeft:theme.spacing(34),
  },
}));




function Upload() {

  const [models, setModels] = useState([]);
  const [aux, setaux] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState(false);
  const [send, setSend] = useState(false);

  const classes = useStyles();

  //Function for the checkbox works
  function handleCheckboxClick(event, id){
    event.stopPropagation();

      if (models[id].sel === false) {
          models[id].sel = true;
          setCount(count + 1)

      } else if (models[id].sel === true) {
          models[id].sel = false; 
          setCount(count - 1)
      }

  };

  //function for check if name of file exist on the list of models on state
  function contain(element){
    for (let m of models) {
      if(m.value === element){
        setAlert(true);
        return true
      }
    }
    return false
}

  //function for set model or models on a state
  function handlerUpload(e) {

    let counter = models.length;
    let items = [];

    for(let m of models){
      items.push(m);
    }
    var UpModels = Array.from(e.target.files)
    
    for (let um of UpModels) {
      if(contain(um.name)!==true){
        items.push({
          value: um.name,
          sel: false,
          file: um,
          id: counter
        })
        counter++;
      }
    }
    setModels(items)
  }

  function handlerCloseDisplay(){
    setOpen(false)
  }

  //function for upload models to server
  function handlerServer(){
    const data = new FormData()
    if(count > 0){

    for (let m of models) {
      if(m.sel === true){
        data.append('files', m.file)
      }
    }
    axios.post("http://mini3dfactory.duckdns.org:3002/api/models/upload",data).then(response => {
      // server answer
    }).catch(e => {
      console.log(e);
    });
    setSend(true)
  }
  }



  //function for display the STL viewer
  function handlerDisplay(){

    if(count === 1){
      for (let m of models) {
        if(m.sel === true){
            setaux([m.file]);
        }
      }
    }else{
      setOpen(true);
    }
  }
  


  return (
    <div className={classes.root} >
      <Grid container spacing={2} direction="row" >
        <Grid container item xs={4} direction="column">
          <div>
          <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}className={classes.upload}>
              Upload File
              <input
                  type="file"
                  multiple
                  accept=".obj,.stl,.3mf"
                  className={classes.input}
                  id="Upload-button-file"
                  onChange={handlerUpload.bind()}
              />
          </Button>
          </div>
          <TableContainer component={Paper} className={classes.table}>
            <Table  aria-label="simple table" stickyHeader>
              <TableHead>
                <TableRow>
                <TableCell></TableCell>
                  <TableCell>Uploaded files</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {models.map(model =>
                  <TableRow key={model.id}>
                    <TableCell padding="checkbox">
                      <Checkbox className={classes.check} onClick={event => handleCheckboxClick(event, model.id)}/>
                    </TableCell>
                    <TableCell>{model.value}</TableCell>
                    <TableCell>  
                      <Preview size={50} file={model.file} key={3}/>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container item direction="row" className={classes.buttons} >

          <Collapse in={count > 0}>
            <Tooltip title="Send to server">  
              <IconButton color="primary" aria-label="Display" onClick={handlerServer}>
                <SendIcon fontSize="large"/>
              </IconButton>
            </Tooltip>
          </Collapse>

          <Collapse in={count > 0}>
            <Tooltip title="Display">   
              <IconButton color="primary" aria-label="Display" onClick={handlerDisplay}>
                <LaunchIcon fontSize="large"/>
              </IconButton>
            </Tooltip>
          </Collapse>

          <Link to="/server">
            <Tooltip title="Server">  
              <IconButton color="default" aria-label="Display">
                <StorageIcon fontSize="large"/>
              </IconButton>
            </Tooltip>
          </Link>

          </Grid>
        </Grid>
        <Grid item xs={8} >
          <Collapse in={alert}>
            <Alert severity="warning"
              action={
                <IconButton
                  aria-label="alert"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setAlert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              <AlertTitle>Warning</AlertTitle>
                You can not upload 2 files with same name.
            </Alert>
          </Collapse>
          <Collapse in={open}>
            <Alert severity="warning"
              action={
                <IconButton
                  aria-label="alert"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
                <AlertTitle>Warning</AlertTitle>
                  You must select only one model to display.
            </Alert>
          </Collapse>
          <Collapse in={send}>
            <Alert severity="success"
              action={
                <IconButton
                  aria-label="alert"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setSend(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
                <AlertTitle>Send</AlertTitle>
                  Your models had sended to server successful!
            </Alert>
          </Collapse>

          <div className={classes.model} >  
            {aux.map(auxModel=>
                <STLDisplay file={auxModel} closeD={handlerCloseDisplay} size={400} key={auxModel.id+128}/>
            )
            } 
          </div>

        </Grid>
      </Grid>
    </div>
  );
}



export default Upload;