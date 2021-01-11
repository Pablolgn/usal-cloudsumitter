  //general
import React, { useState , useEffect } from 'react';
import axios from 'axios';
  //material-ui
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Grid, Checkbox, Button, Collapse} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
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
import DashboardIcon from '@material-ui/icons/Dashboard';
import PrintIcon from '@material-ui/icons/Print';
import DeleteIcon from '@material-ui/icons/Delete';
import LaunchIcon from '@material-ui/icons/Launch';
//components
import State from './State'
import Preview from './Preview';
import STLDisplay from './STLDisplay';

//Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';





const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(8),
  },
  root:{
    marginTop:60,
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
  table: {
    margin: theme.spacing(2),
    maxHeight: 400,
    width: 520
  },
  paper: {
    marginLeft: theme.spacing(20),
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(5),
  },
  model: {
    marginLeft: theme.spacing(15),
    marginTop: theme.spacing(4),
  },
  label1: {
    marginTop: theme.spacing(5),
  },
  margin: {
    marginLeft: theme.spacing(1),
  },
  label2: {
    marginTop: theme.spacing(3),
  },
  closeButton: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(4)
  },
  printStatus: {
    marginLeft:theme.spacing(5),
  },
  buttons: {
    marginLeft:theme.spacing(45),
  },
  numbers: {
    width:50
  },
}));

function FileList() {

  //states
  const [models, setModels] = useState([]);
  const [aux, setAux] = useState([]);
  const [auxModel, setAuxmodel] = useState([]);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [state, setState] = useState([]);
  const [printMess, setPrintMess] = useState(false);
  const [print, setPrint] = useState(false);

  const classes = useStyles();

  //Change the table when reload the page
  useEffect(() => { 
    handlerCharge()
  },[]);

  //Counicate with the printer to get state every second
  
  useEffect(() => {
    const interval = setInterval(() => {
        axios.get("http://mini3dfactory.duckdns.org:3004/api/communication/state").then(response => { 
        updateState(response)
      }).catch(e => {
        console.log(e);
      });
    }, 1000);
    return () => clearInterval(interval);
    
  }, []);
  

  //Set State state
  function updateState(r){

    new Date(r.data.Progress.printTime * 1000).toISOString().substr(11, 8)

    setState({
      state: r.data.state,
      printTime:   new Date(r.data.Progress.printTime * 1000).toISOString().substr(11, 8),
      printTimeLeft: Math.round(r.data.Progress.printTimeLeft / 60),
      percent: r.data.Progress.completion,
      filaLength: (r.data.Job.Filament.Tool0.length / 1000).toFixed(2),
      filaVol: r.data.Job.Filament.Tool0.volume.toFixed(2),
      name: r.data.Job.File.name,
      size: (r.data.Job.File.size * 1e-6).toFixed(2),
      price: (((r.data.Job.Filament.Tool0.volume*1.24 )/1000)*20).toFixed(2), //((volume * density)/1kg)*price 
      user: r.data.Job.user
    })

  }

  //Delete one model
  function handlerDelete(id){

    axios.delete("http://mini3dfactory.duckdns.org:3002/api/models/delete/" + models[id].value).then(response => {
      handlerCharge()
    }).catch(e => {
      console.log(e);
    });

  };




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

  //handler to show numbers on textfield 
  function handlerNumber(n,id){
    if(n !== ""){
      models[id].number = n
    }
  }

  //handler to close the message from the print button
  function handlerButClose(){
    setPrintMess(false)
  }

  function handlerCloseDisplay(){
    setOpen(false)
  }

  //function to optimize the .stl models 
  function handlerOptimize(){
    var arrOfModels = []

    for (let m of models) {
      if (m.sel === true){
        arrOfModels.push({name:m.value , number:m.number})
      }
    }

    axios.post("http://51.137.7.16/api/optimize",arrOfModels).then(response => {
      handlerCharge()
      return response.data
    }).catch(e => {
      console.log(e);
    });


  }
    //function for display the STL viewer
    function handlerDisplay(){

      if(count === 1){
        for (let m of models) {
          if(m.sel === true){
              setAuxmodel([m.file]);
              setOpen(true);
          }
        }
      }
    }

  //Evalue the model and send it to print if it's one, if not , show a message
  function handlerPrint(){
    setPrint(true)/*
    var fullName 
    var arrOfModels = []

    for (let m of models) {
      if (m.sel === true){
        arrOfModels.push({name:m.value , number:m.number, model:m.file})
      }
    }

    if(count > 1 || arrOfModels[0].number > 1){
      setPrintMess(true)
    }else{
      fullName = arrOfModels[0].name      

      setAux([arrOfModels[0].model])


      var filename = fullName.slice(0,-4)
      
      axios.post("http://51.105.248.212/api/models/printupload/"+filename).then(response => {
        // server answer
      }).catch(e => {
        console.log(e);
      });
      setPrint(true)
    }
    */
  }

  //function to read all the models that are uploaded on the server
  function handlerCharge(){

    setCount(0)
    axios.get("http://mini3dfactory.duckdns.org:3002/api/models").then(function (response){ 

          var namelist = response.data;
          var items = [];

          console.log(namelist)
            setModels([])
     
          let counter = 0;

          namelist.forEach( nl => {

            axios.get("http://mini3dfactory.duckdns.org:3002/api/models/Uploaded_models/"+nl,{responseType: 'blob'}).then(function (response){ 

              const f = new Blob([response.data]);
              var file = new File([f], nl, {type: "application/sla", lastModified: Date.now()});

                items.push({
                  value: file.name,
                  sel: false,
                  file: file,
                  number: "1",
                  id: counter
                })
                counter++

                if(counter === namelist.length){
                  setModels(items)
                }
              })
              .catch(function (error) {
                console.log(error);
              });
            })
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  return (
    <div className={classes.root}>
    <Grid container spacing={2} direction="row">
      <Grid item xs={4}>
           <TableContainer component={Paper} className={classes.table}>
              <Table  aria-label="simple table" stickyHeader>
                <TableHead>
                    <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>Files on server</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {models.map(model =>
                      <TableRow key={model.id}>
                        <TableCell padding="checkbox">
                          <Checkbox color="primary" checked={model.sel} onClick={event => handleCheckboxClick(event, model.id)}/>
                        </TableCell>
                        <TableCell>  
                          {model.sel ? 
                            <TextField type={"number"} inputProps={{ min: 1, max: 5}} className={classes.numbers} onChange={event => handlerNumber(event.target.value,model.id)} defaultValue="1" id="number" size="small"/>
                                               : null
                          }
                        </TableCell>
                        <TableCell className={classes.name}>{model.value}</TableCell>
                        <TableCell> 
                        <Preview size={50} file={model.file} key={2}/>  
                        </TableCell>
                        <TableCell>  
                          {model.sel ? 
                            <IconButton color="secondary" aria-label="Delete" onClick={() => handlerDelete(model.id)}>
                              <DeleteIcon fontSize="large"/>
                            </IconButton> 
                                                    : null
                          }
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </TableContainer>


          <Grid container direction="row" className={classes.buttons} >
            <Tooltip title="Display">   
              <span>        
                <IconButton disabled={count!==1}  color="primary" aria-label="Display" onClick={handlerDisplay}>
                  <LaunchIcon fontSize="large"/>
                </IconButton>
              </span>    
            </Tooltip>
            <Tooltip title="Optimize">  
                <IconButton color="primary" disabled={!count} aria-label="Optimize" onClick={handlerOptimize}>
                  <DashboardIcon fontSize="large"/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Print">  
              <span>        
                <IconButton  color="primary" disabled={!count} aria-label="Print" onClick={handlerPrint}>
                  <PrintIcon fontSize="large"/>
                </IconButton>
              </span> 
            </Tooltip>  
            </Grid>
      </Grid>
      <Grid item xs={8}>  
      <Collapse in={!open}>
          <State start={print} model={aux} state={state}/>
      </Collapse> 
      <Collapse in={open} className={classes.model}> 
        {auxModel.map(auxM=>
                  <STLDisplay file={auxM} closeD={handlerCloseDisplay} size={350} key={auxM.id+273}/>
              )
        } 
      </Collapse>
      </Grid>
    </Grid>

    <Dialog
        open={printMess}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          For print severals copies or different models, you need to press the button of the left to combine and optimize them.
          </DialogContentText>
          <DialogContentText>
          Once this is done, you can see that a new model has appeared with a name like OP-XX:XX:XX.stl with the current date, then you can select it and print.
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

export default FileList;

//linea 305 <Preview size={50} file={model.file} key={2}/>