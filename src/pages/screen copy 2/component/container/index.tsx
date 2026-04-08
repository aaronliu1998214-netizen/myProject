import React, {} from 'react';

interface containerIp {
children:any
}

const App: React.FC<containerIp> = ({ children }) => {


  return (
     <div className='container'>
        {children}
     </div>
  );
};

export default App;