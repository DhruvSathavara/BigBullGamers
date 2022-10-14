import { CardMedia, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import UseCollector from "./UseCollector";
import { mintNftAddres } from '../../config';
import { toast } from 'react-toastify';
import MintNft from '../../abi/MintNft.json';
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


function Rewards() {

    const { Moralis, account, isInitialized, isAuthenticated, user } = useMoralis()
    const { getUser } = UseCollector();
    const [usePoints, setUsePoints] = useState(0);
    const [walletPoint, setWalletPoint] = useState(0);
    const [createMeme, setCreateMeme] = useState(0);
    const [createPost, setCreatePost] = useState(0);
    const [total, setTotal] = useState(0);
    const [isUpdated, setIsupdated] = useState(false);
    const contractProcessor = useWeb3ExecuteFunction();

    useEffect(async () => {
        if (isInitialized && isAuthenticated) {
            const fetch = async () => {
                const data = await getUser();
                const { ConnectWalletPoints, CreatePostPoint, MintNFT, TotalPoints } = data.attributes;

                setWalletPoint(ConnectWalletPoints);
                setCreatePost(CreatePostPoint)
                setCreateMeme(MintNFT);
                setTotal(TotalPoints);
                // setDaysStreak(daysInRow);
                // setCollectes(moment(lastCollected).isSame(moment.utc(), "day"));
            }
            fetch();
        } else {
            setWalletPoint(0);
            setCreatePost(0)
            setCreateMeme(0);
            setTotal(0);
        }

    }, [isInitialized, isAuthenticated, isUpdated])


    const users = Moralis.Object.extend("UsePointsTable");
    const query = new Moralis.Query(users);

    async function walletPoints() {
        if (user) {
            query.equalTo("user", user.id);
            const data = await query.first(); 
            if (data.attributes.TotalPoints != undefined) {
                data.set("TotalPoints", data.attributes.TotalPoints + walletPoint);
                data.set("ConnectWalletPoints", 0);
                await data.save();
                setIsupdated(!isUpdated);
            } else {
                data.set("TotalPoints", walletPoint);
                data.set("ConnectWalletPoints", 0);
                await data.save();
                setIsupdated(!isUpdated);
            }
        }

    }
    async function nftPoints() {
        if (user) {
            query.equalTo("user", user.id);
            const data = await query.first();
            if (data.attributes.TotalPoints != undefined) {
                data.set("TotalPoints", data.attributes.TotalPoints + createMeme);
                data.set("MintNFT", 0);
                await data.save();
                setIsupdated(!isUpdated);
            } else {
                data.set("TotalPoints", createMeme);
                data.set("MintNFT", 0);
                await data.save();
                setIsupdated(!isUpdated);
            }
        }

    }
    async function postPoints() {
        if (user) {
            query.equalTo("user", user.id);
            const data = await query.first();
            if (data.attributes.TotalPoints != undefined) {
                data.set("TotalPoints", data.attributes.TotalPoints + createPost);
                data.set("CreatePostPoint", 0);
                await data.save();
                setIsupdated(!isUpdated);
            } else {
                data.set("TotalPoints", createPost);
                data.set("CreatePostPoint", 0);
                await data.save();
                setIsupdated(!isUpdated);
            }
        }

    }

    async function mintRewardNft() {
        if (total < 100) {
            toast.error("Make sure you collect enough points before collecting this reward");
            return;
        }
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        let contract = new ethers.Contract(mintNftAddres, MintNft.abi, signer);
        let transaction = await contract.createToken();

        await transaction.wait();
        toast.success("Check your wallet for your new magical NFT");

        if (user) {
            query.equalTo("user", user.id);
            const data = await query.first();
            if (data != undefined) {
                data.set("TotalPoints", data.attributes.TotalPoints - 100);
                await data.save();
                setIsupdated(!isUpdated);
            }
        }

    }
    return (
        // <div className='container'>
        <div className='row mt-3'>
            <div className="col-md-6 col-sm-6 pe-2 ps-2 ">
                <Card sx={{ minWidth: 200,minHeight:150, background: '#000000', borderRadius: "16px" }}>
                    <CardContent>
                        <div className='row'>
                            <div className='col-6'>
                                <Typography color="white" variant="h3" component="div">
                                    {total != null ? total : 0}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="white">
                                    Total points
                                </Typography>
                            </div>
                            <div className='col-6'>
                                <CardMedia
                                    component="img"
                                    height="100%"
                                    width="100%"
                                    image="/assets/images/logo/victory.png"
                                    alt="green iguana"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="col-md-6 col-sm-6 pe-2 ps-2">
                <Card sx={{ minWidth: 275,minHeight:220, background: '#000000', borderRadius: "16px" }}>
                    <CardContent>
                        <div className='row'>
                            <div className='col-6'>
                                <Typography color="white" variant="h3" component="div">
                                    {walletPoint}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="white">
                                    Connect wallet first time to get points
                                </Typography>
                                <Button onClick={walletPoints} className="mt-4  span p-0 btn p-2 lh-24 w100 ms-1 ls-3 d-inline-block rounded-xl bg-white font-xsssss fw-700 ls-lg  text-capitalize" size="small">Claim Points</Button>
                            </div>
                            <div className='col-6'>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image="/assets/images/logo/victory.png"
                                    alt="green iguana"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="col-md-6 col-sm-6 pe-2 ps-2 mt-3">
                <Card sx={{ minWidth: 275,minHeight:220, background: '#000000', borderRadius: "16px" }}>
                    <CardContent>
                        <div className='row'>
                            <div className='col-6'>
                                <Typography color="white" variant="h3" component="div">
                                    {createMeme != null ? createMeme : 0}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="white">
                                    Mint Meme NFT  to get points
                                </Typography>
                                <Button onClick={nftPoints} className="mt-4 span p-0 btn p-2 lh-24 w100 ms-1 ls-3 d-inline-block rounded-xl bg-white font-xsssss fw-700 ls-lg   text-capitalize" size="small">Claim Points</Button>
                            </div>
                            <div className='col-6'>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image="/assets/images/logo/victory.png"
                                    alt="green iguana"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="col-md-6 col-sm-6 pe-2 ps-2 mt-3">
                <Card sx={{ minWidth: 275,minHeight:220, background: '#000000', borderRadius: "16px" }}>
                    <CardContent>
                        <div className='row'>
                            <div className='col-6'>
                                <Typography color="white" variant="h3" component="div">
                                    {createPost != null ? createPost : 0}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="white">
                                    Create Posts to get points
                                </Typography>
                                <Button onClick={postPoints} className="mt-4 span p-0 btn p-2 lh-24 w100 ms-1 ls-3 d-inline-block rounded-xl bg-white font-xsssss fw-700 ls-lg   text-capitalize" size="small">Claim Points</Button>
                            </div>
                            <div className='col-6'>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image="/assets/images/logo/victory.png"
                                    alt="green iguana"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="col-md-6 col-sm-6 pe-2 ps-2 mt-3">
                <Card sx={{ minWidth: 275,minHeight:220, background: '#000000', borderRadius: "16px" }}>
                    <CardContent>
                        <div className='row'>
                            <div className='col-6'>
                                <Typography color="white" variant="h3" component="div">
                                    {total != null ? total : 0}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="white">
                                    Minimum 100 Points to get NFT
                                </Typography>
                                <Button onClick={mintRewardNft} className="mt-4 span p-0 btn p-2 lh-24 w100 ms-1 ls-3 d-inline-block rounded-xl bg-white font-xsssss fw-700 ls-lg  " size="small">Claim NFT</Button>
                            </div>
                            <div className='col-6'>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image="/assets/images/logo/victory.png"
                                    alt="green iguana"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
        // </div>
    );
}

export default Rewards;
