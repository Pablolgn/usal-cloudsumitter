	import React, { useState,useEffect } from 'react';
	import {STLViewer} from 'react-stl-obj-viewer';
	import { makeStyles } from '@material-ui/core/styles';
	import {IconButton, Collapse, Grid} from '@material-ui/core';
	import BackspaceIcon from '@material-ui/icons/Backspace';
	import { GithubPicker } from 'react-color';
	


	const useStyles = makeStyles(theme => ({
		display: {
		  flexGrow: 1,
		  marginTop: theme.spacing(3),
		},
	  }));

	function STLDisplay(props){

		const classes = useStyles();
	
		const [aux, setaux] = useState([]);
		const [button, setbutton] = useState(false);
		const [backColor,] = useState("#b0b0b0");
		const [modelColor, setmodelColor ] = useState();

		useEffect(() => {   
			setaux([props.file])
			setbutton(true)
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},[props.file]);

		useEffect(() => {   
			setmodelColor("#ffffff")
		},[modelColor]);

		function deleteid(){
			setaux([])
			setbutton(false)
			props.closeD()
		}

		function changeHandler(color){
			setmodelColor(color.hex)
		}


	
	return(
		<div>
      		<Grid container spacing={2} direction="row">

				<Collapse in={button}>
					<IconButton color="primary" aria-label="Display" onClick={deleteid}>
					<BackspaceIcon fontSize="large"/>
					</IconButton>
				</Collapse>
				{button ? 
				<GithubPicker 
					onChange={ changeHandler }
				/> : null
				}
				
			</Grid>

			<Grid container className={classes.display}>
				{aux.map(auxModel=>
					<STLViewer
					key={auxModel.id+256}
					width={props.size*2}
					height={props.size-80}
					sceneClassName="test-scene"
					file={auxModel}
					className="stl"
					modelColor={modelColor}
					backgroundColor={backColor}
					/> 
				)
				}
			</Grid>


		</div>
	)};
	export default STLDisplay;
