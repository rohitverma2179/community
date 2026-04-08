import React from 'react';
import AuthPage from './component/Login'; // Importing the new AuthPage component

const App: React.FC = () => {
    return (
        <div className="App">
            <AuthPage />
        </div>
    );
};

export default App;