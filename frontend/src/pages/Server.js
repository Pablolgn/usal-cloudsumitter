import React from 'react';
import Footer from '../components/Footer';
import FileList from '../components/File_list';
import TopMenu from '../components/TopMenu';


function Home() {

    return (
        <div>
          <TopMenu title="Server"/>
            <div>   
              <FileList/>
            </div> 
          <Footer/>
        </div>
      )
}

export default Home;