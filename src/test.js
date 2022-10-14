import React, { Component, Fragment } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Pagetitle from "../components/Pagetitle";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import "../components/badge.css"
const badgeList = [
  {
    imageUrl: "slide10.jpg",
    title: "Welcome",
    startDate: "7th Dec 2022",
    endDate: "10th Dec 2025",
    price: "$100",
    badge1: "top-student.svg",
    badge2: "onfire.svg",
    badge3: "",
    badge4: "fast-graduate.svg",
  },
  {
    imageUrl: "slide4.jpg",
    title: "to the",
    startDate: "7th Dec 2022",
    endDate: "10th Dec 2025",
    price: "$100",
    badge1: "top-student.svg",
    badge2: "onfire.svg",
    badge3: "challenge-medal.svg",
    badge4: "fast-graduate.svg",
  },
  {
    imageUrl: "Music16.jpg",
    title: "CC team",
    startDate: "7th Dec 2022",
    endDate: "10th Dec 2025",
    price: "$100",
    badge1: "",
    badge2: "onfire.svg",
    badge3: "challenge-medal.svg",
    badge4: "fast-graduate.svg",
  },
  {
    imageUrl: "slide10.jpg",
    title: "Family",
    startDate: "7th Dec 2022",
    endDate: "10th Dec 2025",
    price: "$100",
    badge1: "top-student.svg",
    badge2: "",
    badge3: "challenge-medal.svg",
    badge4: "fast-graduate.svg",
  },
  {
    imageUrl: "slide10.jpg",
    title: "Membors",
    startDate: "7th Dec 2022",
    endDate: "10th Dec 2025",
    price: "$100",
    badge1: "top-student.svg",
    badge2: "onfire.svg",
    badge3: "challenge-medal.svg",
    badge4: "fast-graduate.svg",
  },
  {
    imageUrl: "Music8(1).jpg",
    title: "Helloww",
    startDate: "7th Dec 2022",
    endDate: "10th Dec 2025",
    price: "$100",
    badge1: "top-student.svg",
    badge2: "onfire.svg",
    badge3: "challenge-medal.svg",
    badge4: "fast-graduate.svg",
  },
];
class Badge extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <Leftnav />
        <Rightchat />
        <div className="main-content right-chat-active">
          <div className="middle-sidebar-bottom">
            <div className="middle-sidebar-left pe-0">
              <div className="row">
                <div className="col-xl-12">
                  <Pagetitle title="Contest" />
                  <div className="row ps-2 pe-1">
                    {badgeList.map((value, index) => (
                      <div key={index} className="col-md-4 col-sm-6 pe-2 ps-2">
                        <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
                          <div className="card-body d-block w-100 p-0 text-center">
                            <figure className="avatar ms-auto me-auto mb-0 position-relative  z-index-1">
                              <div className="imgWidth">
                              <img 
                                src={`assets/images/${value.imageUrl}`}
                                alt="avater"
                                className=" bg-white w-100"
                              />
                              </div>
                            </figure>
                            <div className="p-4">
                            <div className="clearfix"></div>
                            <h4 className="fw-700 font-xss mt-0 mb-0">
                              {value.title}{" "}
                            </h4>
                            <p className="fw-500 font-xssss text-grey-500 mt-0 mb-3">
                              {value.email}
                            </p>
                            <ul className="d-flex align-items-center justify-content-center mt-1">
                              <li className="m-2">
                                <h4 className="fw-700 font-sm start-date">
                                  {value.startDate}{" "}
                                  <span className="font-xsssss fw-500 mt-1 text-grey-500 d-block">
                                    Start Date
                                  </span>
                                </h4>
                              </li>
                              <li className="m-2">
                                <h4 className="fw-700 font-sm end-date">
                                  {value.endDate}{" "}
                                  <span className="font-xsssss fw-500 mt-1 text-grey-500 d-block">
                                    End Date
                                  </span>
                                </h4>
                              </li>
                              <li className="m-2">
                                <h4 className="fw-700 font-sm">
                                  {value.price}{" "}
                                  <span className="font-xsssss fw-500 mt-1 text-grey-500 d-block">
                                    Price
                                  </span>
                                </h4>
                              </li>
                            </ul>
                            <ul className="d-flex align-items-center justify-content-center mt-1">
                              {value.badge1 ? (
                                <li className="m-1">
                                  <img
                                    src={`assets/images/${value.badge1}`}
                                    alt="icon"
                                  />
                                </li>
                              ) : (
                                ""
                              )}
                              {value.badge2 ? (
                                <li className="m-1">
                                  <img
                                    src={`assets/images/${value.badge2}`}
                                    alt="icon"
                                  />
                                </li>
                              ) : (
                                ""
                              )}
                              {value.badge3 ? (
                                <li className="m-1">
                                  <img
                                    src={`assets/images/${value.badge3}`}
                                    alt="icon"
                                  />
                                </li>
                              ) : (
                                ""
                              )}
                              {value.badge4 ? (
                                <li className="m-1">
                                  <img
                                    src={`assets/images/${value.badge4}`}
                                    alt="icon"
                                  />
                                </li>
                              ) : (
                                ""
                              )}
                            </ul>
                              <p className="description">
                                diversityavatarpeopleusersiconpersoncommunicationmanpopulation.
                                User photos for download....
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
}
export default Badge;