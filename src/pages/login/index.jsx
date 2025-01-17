"use client"
import React from 'react'
import { GoogleOAuthProvider, useGoogleOneTapLogin, GoogleLogin } from '@react-oauth/google';
import Classes from "./login.module.css"
import Header from "../landingpage/Header"
import Footer from "../landingpage/Footer"
import Router from 'next/router'
import getConfig from 'next/config';

const LogIn = () => {
   
    const { publicRuntimeConfig } = getConfig();


    const clientId = publicRuntimeConfig.GOOGLE_CLIENT_ID;

    const backendURL = publicRuntimeConfig.NEXT_PUBLIC_REACT_APP_BACKEND_URI;

    
    console.log(backendURL);

    const handleFailure = (error) => {
      console.log("Authentication failed",error);
    };

    const handleLogin = async (credentialResponse) => {

        try {
            console.log("handleLogin invoked",credentialResponse);

            const response = await fetch(backendURL+"/api/google-login", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${credentialResponse.credential}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({  
                    token: credentialResponse.credential,
                    audience: clientId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);

                sessionStorage.setItem('token', credentialResponse.credential);

                const isNewUser = credentialResponse.select_by === "btn";
                sessionStorage.setItem('isNewUser', isNewUser);


                if (isNewUser) {
                  Router.push('/register'); 
              } else {
                  Router.push('/dashboard'); 
              }
            } else {
                console.error('Authentication failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
};


    return (
        <>
            <Header />
            <div className={Classes.auth_section}>
                <div className={Classes.top}></div>

                <div className={Classes.authenticateButton}>
                    <GoogleOAuthProvider
                        auto_select
                        clientId={clientId}
                        className={Classes.gButton}
                    >
                        {
                            console.log(clientId)
                        }
                        <GoogleLogin
                            onSuccess={handleLogin}
                            onFailure={handleFailure}
                            cookiePolicy="single_host_origin"
                            onError={error => {
                                console.error('Login Failed:', error);
                            }}
                            useOneTap
                        />
                    </GoogleOAuthProvider>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default LogIn