import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Footer from '../Footer';
import { Booking_IP, Booking_Port, Movie_IP, Movie_Port, Theatre_IP, Theatre_Port } from "../../config";
import ToggleDisplay from 'react-toggle-display';

const initialstate={
    theatreName: "",
            movieName: "",
            showName: "",
            seatingCapacity: "",
            cost: "",
            date: "",
            showsId:""
};
class Shows extends Component {
    constructor() {
        super();
        this.state = {
            theatreName: "",
            movieName: "",
            showName: "",
            seatingCapacity: "",
            cost: "",
            date: "",

            showsId: "",

            shows: [],
            movies:[],
            theatres: [],
           
            
        }
    }

    componentDidMount() {
        axios.get(Booking_IP + Booking_Port + '/shows')
            .then((response) => {
                //update the state with the response data
                console.log(response.data)
                this.setState({
                    shows: response.data,
                    Shows:response.data

                });
            }).catch(err => {
                console.log(err);
            }).then(()=>{
                axios.get(Movie_IP + Movie_Port + '/movies')
                .then((response) => {
                    //update the state with the response data
                    console.log(response.data)
                    this.setState({
                        movies: response.data,

                    });
                }).catch(err => {
                    console.log(err);
                });

            }).then(()=>{
                axios.get(Theatre_IP + Theatre_Port + '/theatres')
                .then((response) => {
                    //update the state with the response data
                    console.log(response.data)
                    this.setState({
                        theatres: response.data,

                    });
                }).catch(err => {
                    console.log(err);
                });
            })



    }

    change = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    addShow = (e) => {
        e.preventDefault();

        var d = new Date(this.state.date)
        this.state.date = d.getUTCDate() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCFullYear();

        var today= new Date();
        today.setHours(0,0,0,0);
        // today=today.getUTCDate() + "-" + (today.getUTCMonth() + 1) + "-" + today.getUTCFullYear();
        if (today>=d){
            alert("Date should be greater than present date")
            return
        }

        const data = {
            theatreName: this.state.theatreName,
            movieName: this.state.movieName,
            showName: this.state.showName,
            seatingCapacity: this.state.seatingCapacity,
            cost: this.state.cost,
            date: this.state.date,
        }
        console.log(data)

        if((this.state.theatreName.length==0)||(this.state.movieName.length==0)||(this.state.showName.length==0)||(this.state.seatingCapacity.length==0)||(this.state.cost.length==0))
        {
            alert("Please select all the field values")
        }
        else if(this.state.date=="NaN-NaN-NaN")
        {
            alert("please select date")
        }

        else{

        axios.get(Theatre_IP + Theatre_Port + `/theatre/${data.theatreName}`)
            .then((response) => {
                console.log("Theatre is available")

                axios.get(Movie_IP + Movie_Port + `/movie/${data.movieName}`)
                    .then((response) => {
                        console.log("Movie is available",response.data)
                        //   if(response.data.releaseDate>=d){
                             
                        //     alert("Date should be greater than movie release date")
                        //      return
                        //  }
                        axios.post(Booking_IP + Booking_Port + '/shows?Role=' + localStorage.getItem("cookie"), data)
                            .then((response) => {
                                console.log("Status Code : ", response.data);
                                if (response.status === 200) {
                                    alert("Show Added")
                                    this.setState({
                                        ...initialstate
                                    })
                                } else {
                                    console.log("not done")
                                }

                            });

                    }).catch(err => {
                        alert("Error occured.")
                        console.log(err);
                    });


            }).catch(err => {
                alert("Please Add the Theatre first.")
                console.log(err);
            })

    }
}

    updateShow = (e) => {
        e.preventDefault();

        var d = new Date(this.state.date)
        this.state.date = d.getUTCDate() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCFullYear();
        
        const data = {
            theatreName: this.state.theatreName,
            movieName: this.state.movieName,
            showName: this.state.showName,
            seatingCapacity: this.state.seatingCapacity,
            cost: this.state.cost,
            date: this.state.date,
        }
        if((this.state.theatreName.length==0)||(this.state.movieName.length==0)||(this.state.showName.length==0)||(this.state.showsId.length==0)||(this.state.cost.length==0))
        {
            alert("Please select all the field values")
        }

        else if(this.state.date=="NaN-NaN-NaN")
        {
            alert("please select date")
        }

        else{
        axios.put(Booking_IP + Booking_Port + `/shows/${this.state.showsId}?Role=` + localStorage.getItem("cookie"), data)
            .then((response) => {
                console.log("Status Code : ", response);
                if (response.status === 200) {
                    alert("Show Updated")
                    this.setState({
                        ...initialstate
                    })
                } else {
                    console.log("not done")
                }

            }).catch(err => {
                alert("Error occured")
            });
    }
}

    deleteShow = (e) => {
        e.preventDefault();

        if(this.state.showsId.length==0)
        {
            alert("Please select the show id")
        }
        else{

        axios.delete(Booking_IP + Booking_Port + `/shows/${this.state.showsId}?Role=` + localStorage.getItem("cookie"))
            .then((response) => {
                console.log("Status Code : ", response.data);
                if (response.status === 200) {
                    alert("Show Deleted")
                } else {
                    console.log("not done")
                }

            }).catch(err => {
                alert("Check Show Id")
            });;
    }
}

    render() {
        var shows = this.state.shows

        let showDetails = shows.map(show => {
            return (
                <tr>
                    <td>{show.id}</td>
                    <td>{show.theatreName}</td>
                    <td>{show.movieName}</td>
                    <td>{show.showName}</td>
                    <td>{show.seatingCapacity}</td>
                    <td>{show.cost}</td>
                    <td>{show.date}</td>
                </tr>

            )
        })

        var movies = this.state.movies
        let movieDetails = movies.map(movie => {
            return (
                <option value={movie.movieName}>{movie.movieName}</option>
            )
        })

        var theatres = this.state.theatres
        let theatreDetails = theatres.map(theatre => {
            return (
                <option value={theatre.theatreName}>{theatre.theatreName}</option>
            )
        })

        var shows = this.state.shows
        let showIdDetails = shows.map(show => {
            return (
                <option value={show.id}>{show.id}</option>
            )
        })

        return (
            <div>

                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href="#GetShows" role="tab" aria-controls="home" aria-selected="true">Get All Shows</a>
                    </li>
                    <ToggleDisplay if={localStorage.getItem('cookie') == "admin"}>
                        <ul class="nav nav-tabs" id="myTab" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link " data-toggle="tab" href="#AddShow" role="tab" aria-controls="settings" aria-selected="false">Add Show</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#UpdateShow" role="tab" aria-controls="messages" aria-selected="false">Update Show</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#DeleteShow" role="tab" aria-controls="profile" aria-selected="false">Delete Show</a>
                            </li>
                        </ul>
                    </ToggleDisplay>

                </ul>


                <div class="tab-content">
                    <div class="tab-pane active" id="GetShows" role="tabpanel" aria-labelledby="home-tab">
                        <div class="container">
                            <h2>List of All Shows</h2>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Show Id</th>
                                        <th>Theatre Name</th>
                                        <th>Movie Name</th>
                                        <th>Show Name</th>
                                        <th>Seating Capacity</th>
                                        <th>Cost</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/*Display the Tbale row based on data recieved*/}
                                    {showDetails}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="tab-pane" id="AddShow" role="tabpanel" aria-labelledby="profile-tab"> <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-6 col-lg-offset-3  ">
                                <div className="free-space"></div>
                                <div className="row margin-top1 margin-bottom1">

                                    <form class="form">
                                        <div class="form-group col-lg-12">
                                                <select value={this.state.theatreName} name="theatreName" onChange={this.change} className="details_item form-control">
                                                    <option value=""> Select a Theatre Name </option>
                                                    {theatreDetails}
                                                </select>
                                        </div>
                                        <div class="form-group col-lg-12">
                                                <select value={this.state.movieName} name="movieName"onChange={this.change} className="details_item form-control">
                                                <option value=""> Select a Movie Name </option>
                                                {movieDetails}
                                                </select>    
                                        </div>
                                        <div class="form-group col-lg-12">
                                                <select value={this.state.showName} name="showName"onChange={this.change} className="details_item form-control">
                                                <option value=""> Select a Show Name </option>
                                                <option value="Morning">  Morning  </option>
                                                <option value="Matinee">  Matinee  </option>
                                                <option value="Evening">  Evening  </option>
                                                </select>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <input onChange={this.change} type="text" class="form-control" name="seatingCapacity" id="seatingCapacity" placeholder="Seating Capacity" />
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <input onChange={this.change} type="text" class="form-control" name="cost" id="cost" placeholder="Cost" />
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>Date</label> &nbsp;&nbsp;
                                            <input type="date" value={this.state.date} name="date" onChange={this.change} />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <a onClick={this.addShow} class="form-control btn btn-primary btn-rounded" style={{ width: '50%' }} label="Next" href="" type="button">
                                                <span class="btn__label">Add Show</span></a></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div></div>
                    <div class="tab-pane" id="UpdateShow" role="tabpanel" aria-labelledby="messages-tab">
                        <div className="row">
                            <div className="col-lg-6 col-lg-offset-3  ">
                                <div className="free-space"></div>
  
                                <div className="row margin-top1 margin-bottom1">

                                    <form class="form">
                                        <div class="form-group col-lg-12">
                                                <select value={this.state.showsId} name="showsId" onChange={this.change} className="details_item form-control">
                                                    <option value=""> Select a Show Id</option>
                                                    {showIdDetails}
                                                </select>
                                        </div>
                                        <div class="form-group col-lg-12">
                                        
                                                <select value={this.state.theatreName} name="theatreName" onChange={this.change} className="details_item form-control">
                                                    <option value=""> Select a Theatre Name</option>
                                                    {theatreDetails}
                                                </select>
                                        
                                        </div>
                                        <div class="form-group col-lg-12">
                                       
                                                <select value={this.state.movieName} name="movieName"onChange={this.change} className="details_item form-control">
                                                <option value="">Select a Movie Name</option>
                                                {movieDetails}
                                                </select>
                                            
                                        </div>
                                        <div class="form-group col-lg-12">
                                        
                                                <select value={this.state.showName} name="showName"onChange={this.change} className="details_item form-control">
                                                <option value=""> Select a Show Name </option>
                                                <option value="Morning">  Morning  </option>
                                                <option value="Matinee">  Matinee  </option>
                                                <option value="Evening">  Evening  </option>
                                                </select>
                                           
                                        </div>
                                        {/* <div class="form-group col-lg-12">
                                            <input onChange={this.change} type="text" class="form-control" name="seatingCapacity" id="seatingCapacity" placeholder="Seating Capacity" />
                                        </div> */}
                                        <div class="form-group col-lg-12">
                                            <input onChange={this.change} type="text" class="form-control" name="cost" id="cost" placeholder="Cost" />
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>Date</label> &nbsp;&nbsp;
                                            <input type="date" value={this.state.date} name="date" onChange={this.change} />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <a onClick={this.updateShow} class="form-control btn btn-primary btn-rounded" style={{ width: '50%' }} label="Next" href="" type="button">
                                                <span class="btn__label">Update Show</span></a></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane" id="DeleteShow" role="tabpanel" aria-labelledby="settings-tab">
                        <div className="row">
                            <div className="col-lg-6 col-lg-offset-3  ">
                                <div className="free-space"></div>
                                <div className="row margin-top1 margin-bottom1">

                                    <form class="form">

                                        <div class="form-group col-lg-12">
                                        
                                                <select value={this.state.showsId} name="showsId" onChange={this.change} className="details_item form-control" >
                                                    <option value=""> Select a Show Id</option>
                                                    {showIdDetails}
                                                </select>
                                            
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <a onClick={this.deleteShow} class="form-control btn btn-primary btn-rounded" style={{ width: '50%' }} label="Next" href="" type="button">
                                                <span class="btn__label">Delete Show</span></a></div>

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

export default Shows;