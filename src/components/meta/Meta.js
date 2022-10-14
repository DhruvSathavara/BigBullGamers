import React, { Fragment } from 'react';
import Iframe from 'react-iframe';
import Header from '../Header';
import Leftnav from '../Leftnav';
import Rightchat from '../Rightchat';

function Meta() {
    return (
        <Fragment>
            <Header />
            {/* <Leftnav />
            <Rightchat /> */}
            <div className="main-content right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left">
                        <div className="row feed-body">
                            <div className="col-xl-8 col-8">
                                <Iframe src="https://sfsmeta.herokuapp.com/"
                                    width="75%"
                                    height="500"
                                    id="myId"
                                    className="myClassname"
                                    display="initial"
                                    position="absolute"
                                    styles={{ overflow: 'hidden' }}
                                    sandbox=''
                                /> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Fragment >
    );
}

export default Meta;
