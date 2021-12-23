import React, { Component } from 'react';
import MyRoutes from './components/MyRoutes';
import { GlobalProvider } from './context/GlobalState';

class App extends Component {
    render() {
        return (
            <GlobalProvider>
                <MyRoutes />
            </GlobalProvider>
        );
    }
}

export default App;
