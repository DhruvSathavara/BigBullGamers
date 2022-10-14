import { Button, Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import { ToastContainer } from 'react-bootstrap';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMoralis, useMoralisFile } from "react-moralis";
import {Web3Context} from '../../context/WebContext';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { toast } from 'react-toastify';

export default function EditProfile() {
    const [open, setOpen] = useState(false);
    const { saveFile, moralisFile } = useMoralisFile();
    const { user, setUserData } = useMoralis();
    const [avatarw, setAvatar] = useState(null);
    const [coverw, setCover] = useState(null);
    const [themes, setThemes] = useState('');

    const webContext = React.useContext(Web3Context);
    const { connectWallet, currentAddress, required, isUpdate } = webContext;

    const handleOpen = () => setOpen(true);
    const handleSumitClose = () => setOpen(false);

    const handleSubmit = () => {
        console.log("success");
    }



    async function onChangeCover(e) {
        const file = e.target.files[0];
        let fileIpfs = await saveFile("social", file, { saveIPFS: true });
        user.set("coverPhoto", fileIpfs);
        await user.save();
        setCover(user.attributes.coverPhoto._url);
      
    }

    async function onChangeAvatar(e) {
        const file = e.target.files[0];
        let fileIpfs = await saveFile("social", file, { saveIPFS: true });
        user.set("profilePic", fileIpfs);
        await user.save();
        setAvatar(user.attributes.profilePic._url);
      
    }

    const formik = useFormik({
        initialValues: {
            // avatar: "",
            // cover: "",
            username: "",
            bio: "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required(required),
            bio: Yup.string().required(required),
            // avatar: Yup.mixed().required(required),
            // cover: Yup.mixed().required(required),
        }),
        onSubmit: async (values) => {
            
            if (user) {
                await setUserData({
                    username: values.username,
                    Avatar: avatarw,
                    cover: coverw,
                    bio: values.bio,
                }
                );
                toast.success("Successfully Updated your Profile!")

            }
        },
    });

    return (
        <div className="">
            <ToastContainer />
            <a className="d-lg-block bg-gold-gradiant  p-3 z-index-1 rounded-3 text-white font-xsssss text-uppercase fw-700 ls-3 cursor-pointer" onClick={handleOpen}>Edit Profile</a>
            <Modal show={open} onHide={handleSumitClose} style={{ overflowY: 'scroll' }}>
                <Modal.Header className="card" closeButton >
                    <Modal.Title className="h4" style={{ fontWeight: "600" }}>Update Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className="card " style={{ padding: "20px" }}>
    
                            <form onSubmit={formik.handleSubmit}>
                                <div className="space-y-1.5 mb-3">
                                    <label className='fw700 h4'>Avatar</label>
                                    <div className="flex items-center gap-3">
                                        <img
                                            alt=""
                                            className="rounded-circle h-24 w-24"
                                            src={
                                                avatarw == null
                                                    ? "https://via.placeholder.com/800x950.png"
                                                    : avatarw
                                            }
                                            width="100"
                                            height="100"
                                        />
                                        <label
                                            htmlFor="avatar"
                                            id="get_file"
                                            name="Asset"
                                            className="btn-main"
                                            style={{
                                                color: "black",
                                                cursor: "pointer",
                                                position: "absolute",
                                                left: "40px",
                                                marginTop: "20px",
                                            }}
                                        >
                                            <AddPhotoAlternateIcon
                                                style={{ fontSize: "60px", opacity: "0" }}
                                            />
                                        </label>
                                        <input
                                            id="avatar"
                                            onChange={onChangeAvatar}
                                            style={{ display: "none" }}
                                            type="file"
                                        // {...formik.getFieldProps("avatar")}
                                        />
                                        {/* {formik.touched.avatar && formik.errors.avatar ? (
                                                <div style={{ color: "red" }}>{formik.errors.avatar}</div>
                                            ) : null} */}
                                    </div>
                                </div>
                                <div className="space-y-1.5 mb-3">
                                    <label className='h4'>Cover</label>
                                    <div className="space-y-3">
                                        <input type="file"
                                            id="cover"
                                            onChange={onChangeCover}
                                            name="file"  
                                            className="input-file"
                                        // {...formik.getFieldProps("cover")} 
                                        />
                                        <label
                                            htmlFor="file"
                                            className="rounded-3 text-center bg-white btn-tertiary js-labelFile p-4 w-100 border-dashed img-upload"
                                        >
                                            <i className="ti-cloud-down large-icon me-3 d-block"></i>
                                            <span className="js-fileName">
                                                Drag and drop or click to replace
                                            </span>
                                        </label>
                                        {/* {formik.touched.cover && formik.errors.cover ? (
                                                <div style={{ color: "red" }}>{formik.errors.cover}</div>
                                            ) : null} */}
                                    </div>
                                </div>
                                <div className="form-group icon-input mb-3">
                                    <i className="font-sm ti-user text-grey-500 pe-0"></i>
                                    {/*---------------------  Your nameeee  */}{" "}
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        className="h4 style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                                        placeholder="Username"
                                        {...formik.getFieldProps("username")}
                                    />
                                    {formik.touched.username && formik.errors.username ? (
                                        <div style={{ color: "red" }}>{formik.errors.username}</div>
                                    ) : null}
                                </div>
                                <div className="form-group icon-input mb-3">
                                    <i className="font-sm ti-email text-grey-500 pe-0"></i>
                                    <input
                                        id="bio"
                                        type="text"
                                        name="bio"
                                        className="h4 style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                                        placeholder="Bio"
                                        {...formik.getFieldProps("bio")}
                                    />
                                    {formik.touched.bio && formik.errors.bio ? (
                                        <div style={{ color: "red" }}>{formik.errors.bio}</div>
                                    ) : null}
                                </div>
                                <button
                                    type="submit"
                                    className="form-control text-center style2-input text-white fw-600 bg-primary border-0 p-0 "
                                >
                                    Update Profile
                                </button>
                            </form> 
                </Modal.Body>
                {/* <Modal.Footer>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Update
                    </button>
                </Modal.Footer> */}
            </Modal>
        </div >
    );
}
