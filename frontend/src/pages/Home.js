import React from 'react';
import Footer from '../components/Footer';
import Upload from '../components/Upload';
import TopMenu from '../components/TopMenu';


function Home() {

    return (
        <div>
          <TopMenu title="My mini 3d factory"/>
            <div>   
              <Upload/>
            </div> 
          <Footer/>
        </div>
      )
}

export default Home;