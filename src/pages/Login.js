import React, { Fragment, useEffect, useState } from "react";
import { Web3Context } from "../context/WebContext";
import { useMoralis } from "react-moralis";
import { Link, NavLink, useHistory } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
 
import worldID from "@worldcoin/id";




import { ToastContainer, toast } from 'react-toastify';
import { Button } from "@mui/material";

function Login() {
    const history = new useHistory();

    const webContext = React.useContext(Web3Context);
    const { connectWallet, currentAddress, required, isUpdate, account } = webContext;
    const { authenticate, isAuthenticated, user, login, authError, userError, isAuthenticating, Moralis } = useMoralis();
    const [loading, setLoading] = React.useState(false);
    const [themes, setThemes] = useState('');

    let theme;

    const users = Moralis.Object.extend("User");
    const userPoints = Moralis.Object.extend("UsePointsTable");
    const query = new Moralis.Query(users);
    const userQuery = new Moralis.Query(userPoints);


    useEffect(async () => {
        if (isAuthenticated) {
            history.push('/');
        }
        if (authError) {
            toast.error(authError.message)
        }
        if (userError) {
            toast.error(userError.message)
        }
        theme = localStorage.getItem("theme");
        setThemes(theme);

    }, [isAuthenticated, authError, userError, isUpdate])

    const formik = useFormik({
        initialValues: {
            Username: "",
            Password: "",
        },
        validationSchema: Yup.object({
            Username: Yup.string().required(required),
            Password: Yup.string().min(6, 'Password must be at least 6 characters').required(required),
        }),
        onSubmit: async (values) => {
            try {
                await login(values.Username, values.Password);
                setLoading(!loading);
            } catch (error) {
                console.log("Error: " + error.code + " " + error);
            }
        },
    });

    async function getVerified() {
        try {
          const result = await worldID.enable();
          console.log("World ID verified succesfully:", result); // <- Pass this result to your wallet transaction
        } catch (failure) {
          console.warn("World ID verification failed:", failure);
          // Re-activate here so your end user can try again
        }
      }



    return (
        <Fragment>
            <ToastContainer />
            <div className="main-wrap">
                <div className="nav-header bg-white shadow border-0">
                    <div className="nav-top w-100  " style={{ justifyContent: 'space-between' }}>
                        <a href="/">
                            <img
                                height={60}
                                className="mx-auto"
                                width="90%"
                                src="assets/images/logo/logo1.png"
                                alt="HH"
                            />
                        </a>
                        <button className="nav-menu me-0 ms-auto"></button>
                        <div className=" p-2 text-center mt-2 d-flex justify-content-end">
                            <div className="form-group mb-1">
                                <button onClick={() => authenticate()} style={{ border: '2px solid grey' }}
                                    className="form-control text-left style2-input text-dark fw-600  p-0 mb-2">
                                    <img src="assets/images/fx.png" alt="icon" className="ms-2 w40 mb-1 me-2" /> <span className="mx-2">Sign in with Metamask</span></button>
                            </div> 
                            <div className="m-3">
                            <Button 
                            className="mx-2"
                                variant="contained" 
                                onClick={async () => { 
                                    try { 
                                        await connectWallet(); 
                                    } catch (error) { 
                                        console.log(error); 
                                    } 
                                }} 
                            > 
                                Connect 
                            </Button>

                            <Button 
                                variant="contained" 
                                onClick={async () => { 
                                    try { 
                                        await getVerified(); 
                                    } catch (error) { 
                                        console.log(error); 
                                    } 
                                }} 
                            > 
                                Get verified 
                            </Button>

                            </div>
                        </div>

                        


                        {/* <button onClick={() => connectWallet()} className="header-btn btn d-none d-lg-block bg-current fw-500 text-white font-xsss p-3 ms-auto cursot-pointer text-center lh-20 rounded-xl address-wrap">{currentAddress != null && currentAddress != undefined && currentAddress != '' ? currentAddress : "Connect Wallet"}</button> */}

                        {/* <a href="/register" className="header-btn d-none d-lg-block bg-current fw-500 text-white font-xsss p-3 ms-2 w100 text-center lh-20 rounded-xl">Register</a> */}
                    </div>
                </div>
            </div>
            <div className="container  " style={{ marginTop: '200px' }}>
                <div className="row">
                    <div className="col-8 mx-auto">
                        <h1 className="text-center" style={{ fontSize: '40px', lineHeight: '56px', fontWeight: 'bold' }}>
                            Decentralized Educational Network to Empower Learners!
                        </h1>
                        <h4 className="mt-2 mb-4 text-center fw-500">Connect in <span style={{ color: '#589340' }}>Metaverse</span>, Share <span style={{ color: '#589340' }}>Knowledge</span>, Showcase Projects, Get <span style={{ color: '#589340' }}>Scholarships</span>, Earn Crypto!</h4>

                    </div>
                </div>
                <div className="row theme-dark-bg mt-4" style={{ marginTop: '100px' }}>
                    <div className=" shadow-lg border-2">
                        <img src="assets/images/home1.png" width="100%" height="550" />
                    </div>
                </div>
            </div>
        </Fragment>
    );

}

export default Login;