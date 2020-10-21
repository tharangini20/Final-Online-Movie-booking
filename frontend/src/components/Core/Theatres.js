import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Footer from '../Footer';
import { Booking_IP, Booking_Port, Theatre_IP, Theatre_Port } from "../../config";
import ToggleDisplay from 'react-toggle-display';

const initialstate={
    location: "",
    theatreName: "",
    seatingCapacity: ""

};
class Theatres extends Component {
    constructor() {
        super();
        this.state = {
            location: "",
            theatreName: "",
            seatingCapacity: "",
            deletetheatreName:"",
            theatres:[],

            updatelocation: "",
            updatetheatreName: "",
            updateseatingCapacity: "",
        }
    }

    componentDidMount() {
        axios.get(Theatre_IP + Theatre_Port +'/theatres')
                .then((response) => {
                //update the state with the response data
                console.log(response.data)
                this.setState({
                    theatres : response.data,
                    
                }); 
            }).catch(err => {
                console.log(err);
            });
    }

    change = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    addTheatre = (e) => {
        e.preventDefault();
        const data = {
            location: this.state.location,
            theatreName: this.state.theatreName,
            seatingCapacity: this.state.seatingCapacity,
        }
        if((this.state.theatreName.length==0)||(this.state.location.length==0)||(this.state.seatingCapacity.length==0))
        {
            alert("Please enter all the field values")
        }
        else{
        
        axios.post(Theatre_IP + Theatre_Port + '/theatre?Role=' + localStorage.getItem("cookie"), data)
            .then((response) => {
                console.log("Status Code : ", response.data);
                if (response.status === 200) {
                    alert("Theatre Added")
                    this.setState({
                        ...initialstate
                    })
                } else {
                    alert("Theatre Name Taken")
                }

            }).catch((err) => {
                alert("Theatre Name Taken")
            })
    }
}

    updateTheatre = (e) => {
        e.preventDefault();
        const data = {
            location: this.state.updatelocation,
            theatreName: this.state.updatetheatreName,
            seatingCapacity: this.state.updateseatingCapacity
        }
        if((this.state.updatetheatreName.length==0)||(this.state.updatelocation.length==0)||(this.state.updateseatingCapacity.length==0))
        {
            alert("Please select all the field values")
        }
        else{

        axios.put(Theatre_IP + Theatre_Port + '/theatre?Role=' + localStorage.getItem("cookie"), data)
            .then((response) => {
                console.log("Status Code : ", response);
                if (response.status === 200) {
                    alert("Theatre Updated")
                    this.setState({
                        ...initialstate
                    })
                } else {
                    console.log("Check Theatre name")
                }

            }).catch(err => {
                alert("Check Theatre name")
            });
    }
}

    deleteTheatre = (e) => {
        e.preventDefault();

        if(this.state.deletetheatreName.length==0){

            alert("Please select theatre name")
        }
else{
        
        axios.delete(Theatre_IP + Theatre_Port +`/theatre/${this.state.deletetheatreName}?Role=`+ localStorage.getItem("cookie"))
            .then((response) => {
                console.log("Status Code : ", response.data);
                if (response.status === 200) {
                    axios.delete(Booking_IP + Booking_Port + `/deleteBookingByTheatre/${this.state.deletetheatreName}`)
                        .then((response) => {
                            console.log("Status Code : ", response.data);
                            if (response.status === 200) {
                                console.log("Theatre Deleted")
                            } else {
                                console.log("Check Theatre name")
                            }
                        }).catch(err => {
                            console.log("Check Theatre name")
                        });
                    alert("Theatre Deleted")

                } else {
                    console.log("Check Theatre name")
                }

            }).catch(err => {
                alert("Check Theatre name")
            });
    }
}

    render() {
        var theatres= this.state.theatres

        let theatreDetails = theatres.map(theatre => {
            return(
                <tr>
                    <td>{theatre.id}</td>
                    <td>{theatre.theatreName}</td>
                    <td>{theatre.location}</td>
                    <td>{theatre.seatingCapacity}</td>            
                </tr>
               
            )
       })

       var theatres = this.state.theatres
       let theatreDropdownDetails = theatres.map(theatre => {
           return (
               <option value={theatre.theatreName}>{theatre.theatreName}</option>
           )
       })

        return (
            <div>

                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href="#GetTheatres" role="tab" aria-controls="home" aria-selected="true">Get All Theatres</a>
                    </li>
                    <ToggleDisplay if={localStorage.getItem('cookie')=="admin"}>
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link " data-toggle="tab" href="#AddTheatre" role="tab" aria-controls="settings" aria-selected="false">Add Theatre</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"  data-toggle="tab" href="#UpdateTheatre" role="tab" aria-controls="messages" aria-selected="false">Update Theatre</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#DeleteTheatre" role="tab" aria-controls="profile" aria-selected="false">Delete Theatre</a>
                    </li>
                    </ul>
                    </ToggleDisplay>

                </ul>


                <div class="tab-content">
                    <div class="tab-pane active" id="GetTheatres" role="tabpanel" aria-labelledby="home-tab">
                        <div class="container">
                            <h2>List of All Theatres</h2>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Theatre Id</th>
                                        <th>Theatre Name</th>
                                        <th>Location</th>
                                        <th>Seating Capacity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/*Display the Tbale row based on data recieved*/}
                                    {theatreDetails}
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <div class="tab-pane" id="AddTheatre" role="tabpanel" aria-labelledby="profile-tab"> <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-6 col-lg-offset-3  ">
                                <div className="free-space"></div>
                                <div className="row margin-top1 margin-bottom1">

                                    <form class="form">
                                        <div class="form-group col-lg-12">
                                            <input onChange={this.change} type="text" class="form-control" name="theatreName" id="theatreName" placeholder="Theatre Name" />
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <input onChange={this.change} type="text" class="form-control" name="location" id="location" placeholder="Location" />
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <input onChange={this.change} type="text" class="form-control" name="seatingCapacity" id="seatingCapacity" placeholder="Seating Capacity" />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <a onClick={this.addTheatre} class="form-control btn btn-primary btn-rounded" style={{ width: '50%' }} label="Next" href="" type="button">
                                                <span class="btn__label">Add Theatre</span></a></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div></div>
                    <div class="tab-pane" id="UpdateTheatre" role="tabpanel" aria-labelledby="messages-tab">
                        <div className="row">
                                <div className="col-lg-6 col-lg-offset-3  ">
                                    <div className="free-space"></div>
                                    <div className="row margin-top1 margin-bottom1">

                                        <form class="form">
                                            <div class="form-group col-lg-12">
                                            
                                                <select value={this.state.updatetheatreName} name="updatetheatreName" onChange={this.change} className="details_item form-control" >
                                                    <option value=""> Select a Theatre Name</option>
                                                    {theatreDropdownDetails}
                                                </select>
                                           
                                            </div>
                                            <div class="form-group col-lg-12">
                                                <input onChange={this.change} type="text" class="form-control" name="updatelocation" id="updatelocation" placeholder="Location" />
                                            </div>
                                            <div class="form-group col-lg-12">
                                                <input onChange={this.change} type="text" class="form-control" name="updateseatingCapacity" id="updateseatingCapacity" placeholder="Seating Capacity" />
                                            </div>
                                            <div class="form-group col-lg-6">
                                                <a onClick={this.updateTheatre} class="form-control btn btn-primary btn-rounded" style={{ width: '50%' }} label="Next" href="" type="button">
                                                    <span class="btn__label">Update Theatre</span></a></div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div class="tab-pane" id="DeleteTheatre" role="tabpanel" aria-labelledby="settings-tab">
                    <div className="row">
                                <div className="col-lg-6 col-lg-offset-3  ">
                                    <div className="free-space"></div>
                                    <div className="row margin-top1 margin-bottom1">

                                        <form class="form">
                                            <div class="form-group col-lg-12">
                                            
                                                <select value={this.state.deletetheatreName} name="deletetheatreName" onChange={this.change} className="details_item form-control">
                                                    <option value=""> Select a Theatre Name</option>
                                                    {theatreDropdownDetails}
                                                </select>
                                          
                                            </div>
                                            <div class="form-group col-lg-6">
                                                <a onClick={this.deleteTheatre} class="form-control btn btn-primary btn-rounded" style={{ width: '40%' }} label="Next" href="" type="button">
                                                    <span class="btn__label">Delete Theatre</span></a></div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default Theatres;