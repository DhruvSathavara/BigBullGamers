import React, { Fragment } from 'react';
import Appfooter from '../components/Appfooter';
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Popupchat from '../components/Popupchat';
import ProfilecardThree from '../components/ProfilecardThree';
import LeaderBoard from '../components/reward/leaderBoard';
import Rewards from '../components/reward/rewards';
import Rightchat from '../components/Rightchat';

function Reward() {
    return (
        <Fragment>
            <Header />
            <Leftnav />
            <Rightchat />

            <div className="main-content right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left pe-0">
                        <div className="row">
                            <div className="col-xl-12 mb-3">
                                <div  className="card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3">
                                <Rewards /> 
                                <h1 style={{marginTop:'100px'}} className='fw-700 text-center'>Leader Board</h1>
                                <LeaderBoard/>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>

            <Popupchat />
            <Appfooter />

        </Fragment>
    );
}

export default Reward;
