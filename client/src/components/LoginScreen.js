import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
//import '../App.css';
import { Button } from 'react-materialize';

class LoginScreen extends Component {

    handleLoginClick = () =>
    {
        window.location.href = 'http://localhost:3000/api/auth/google'
    }

    render() {
        return (
            <div className=''>
                <nav>
                    <div className='nav-wrapper'>&nbsp;
                        <div className='brand-logo'>
                            goLogoLo
                        </div>
                        <div className='center'>
                        <Button node="button" className='blue' onClick={this.handleLoginClick}>
                            Login with Google
                        </Button>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default LoginScreen;
