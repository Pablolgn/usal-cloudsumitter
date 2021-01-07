import React from "react";
import {STLViewer} from 'react-stl-obj-viewer';

function Preview (props){

return( 
	<STLViewer
		width={props.size}
		height={props.size}
		sceneClassName="test-scene"
		file={props.file}
		className="stl"
		modelColor="#0af50a"
		backgroundColor='#FFFFFF'
		rotate={false}
		orbitControls={false}
		back
		/> 
	)

}

export default Preview;