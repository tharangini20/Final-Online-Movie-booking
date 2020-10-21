import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Footer from '../Footer';
import { Booking_IP, Booking_Port, Movie_IP, Movie_Port } from "../../config";
import ToggleDisplay from 'react-toggle-display';


const initialstate={
    movieName: "",
    language: "",
    genre: "",
    rating: "",
    releaseDate: ""
};
class Movies extends Component {
    constructor() {
        super();
        this.state = {
            movieName: "",
            language: "",
            genre: "",
            rating: "",
            releaseDate: "",
            movieNameError:"",
            movieLanguageError:"",
            movieGenreError:"",
            movieRatingError:"",
            direct: false,
            check: false,

            movies: [],
            cookie: localStorage.getItem('cookie')
        }

        
    }

    
        
    componentDidMount() {
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
    }

    change = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    addMovie = (e) => {
        e.preventDefault();

        var d = new Date(this.state.releaseDate)
        this.state.releaseDate = d.getUTCDate() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCFullYear();

        const data = {
            movieName: this.state.movieName,
            language: this.state.language,
            genre: this.state.genre,
            rating: this.state.rating,
            releaseDate: this.state.releaseDate,
        }
        console.log(data)
        if((this.state.rating.length==0)||(this.state.genre.length==0)||(this.state.language.length==0)||(this.state.movieName.length==0))
                {
                    alert("Please select all the field values")
                }
            else if(this.state.releaseDate=="NaN-NaN-NaN")
            {
                alert("please select date")
            }
        
                else {
        axios.post(Movie_IP + Movie_Port + '/movie?Role=' + localStorage.getItem("cookie"), data)
            .then((response) => {
                console.log("Status Code : ", response.data);
                
                if (response.status === 200) {
                    alert("Movie Added")
                    this.setState({
                        ...initialstate
                    })
                } else {
                    alert("Movie Name Taken")
                }

            }).catch((err) => {
                alert("Movie Name Taken")
            })
    }
}

    updateMovie = (e) => {
        e.preventDefault();

        var d = new Date(this.state.releaseDate)
        this.state.releaseDate = d.getUTCDate() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCFullYear();

        const data = {
            movieName: this.state.movieName,
            language: this.state.language,
            genre: this.state.genre,
            rating: this.state.rating,
            releaseDate: this.state.releaseDate,
        }
        if((this.state.rating.length==0)||(this.state.genre.length==0)||(this.state.language.length==0)||(this.state.movieName.length==0))
                {
                    alert("Please enter all the values")
                }
                else if(this.state.releaseDate=="NaN-NaN-NaN")
            {
                alert("please select date")
            }
                else {
        axios.put(Movie_IP + Movie_Port + '/movie?Role=' + localStorage.getItem("cookie"), data)
            .then((response) => {
                console.log("Status Code : ", response);
                if (response.status === 200) {
                    alert("Movie Updated")
                    this.setState({
                        ...initialstate
                    })
                } else {
                    console.log("not done")
                }

            }).catch(err => {
                alert("Check Movie name")
            });
    }
}

    deleteMovie = (e) => {
        e.preventDefault();
        if(this.state.movieName.length==0){

            alert("Please select movie name")
        }
else{
        axios.delete(Movie_IP + Movie_Port + `/movie/${this.state.movieName}?Role=` + localStorage.getItem("cookie"))
            .then((response) => {
                console.log("Status Code : ", response.data);
                if (response.status === 200) {
                    axios.delete(Booking_IP + Booking_Port + `/deleteBookingByMovie/${this.state.movieName}`)
                        .then((response) => {
                            console.log("Status Code : ", response.data);
                            if (response.status === 200) {
                                console.log("Movie Deleted")
                            } else {
                                console.log("Check Movie name")
                            }
                        }).catch(err => {
                            console.log("Check Movie name")
                        });
                    alert("Movie Deleted")

                } else {
                    console.log("Check Movie name")
                }

            }).catch(err => {
                alert("Check Movie name")
            });
    }
}

    searchMovie = (e) => {
        e.preventDefault();

        if(this.state.movieName.length==0){

            alert("Please enter movie name")
        }
        else{

        axios.get(Movie_IP + Movie_Port + `/movie/${this.state.movieName}`)
            .then((response) => {
                console.log("Status Code : ", response.data);
                if (response.status === 200) {
                    this.setState({
                        movies: [response.data],

                    });
                } else {
                    console.log("Check Movie name")
                }

            }).catch(err => {
                alert("Check Movie name")
            });
    }
}

    render() {
        var movies = this.state.movies

        let movieDetails = movies.map(movie => {
            return (
                <tr>
                    <td>{movie.id}</td>
                    <td>{movie.movieName}</td>
                    <td>{movie.language}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.rating}</td>
                    <td>{movie.releaseDate}</td>
                </tr>

            )
        })

        var movies = this.state.movies
        let movieDropdownDetails = movies.map(movie => {
            return (
                <option value={movie.movieName}>{movie.movieName}</option>
            )
        })

        return (
            <div>

                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href="#GetMovies" role="tab" aria-controls="home" aria-selected="true">Get All Movies</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#SearchMovie" role="tab" aria-controls="profile" aria-selected="false">Search Movie</a>
                    </li>
                    <ToggleDisplay if={localStorage.getItem('cookie') == "admin"}>
                        <ul class="nav nav-tabs" id="myTab" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link " data-toggle="tab" href="#AddMovie" role="tab" aria-controls="settings" aria-selected="false">Add Movie</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#UpdateMovie" role="tab" aria-controls="messages" aria-selected="false">Update Movie</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#DeleteMovie" role="tab" aria-controls="profile" aria-selected="false">Delete Movie</a>
                            </li>
                        </ul>
                    </ToggleDisplay>

                </ul>


                <div class="tab-content">
                    <div class="tab-pane active" id="GetMovies" role="tabpanel" aria-labelledby="home-tab">
                        <div class="container">
                            <h2>List of All Movies</h2>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Movie Id</th>
                                        <th>Movie Name</th>
                                        <th>Language</th>
                                        <th>Genre</th>
                                        <th>Rating</th>
                                        <th>Release Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/*Display the Tbale row based on data recieved*/}
                                    {movieDetails}
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <div class="tab-pane" id="AddMovie" role="tabpanel" aria-labelledby="profile-tab"> <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-6 col-lg-offset-3  ">
                                <div className="free-space"></div>
                                <div className="row margin-top1 margin-bottom1">

                                    <form class="form" >
                                        <div class="form-group col-lg-12">
                                            <input onChange={this.change} type="text" class="form-control" name="movieName" id="movieName" placeholder="Movie Name" />
                                            
                                        </div>
                                        <div class="form-group col-lg-12">
                                            {/* <input onChange={this.change} type="text" class="form-control" name="language" id="language" placeholder="Language" /> */}
                                            <select value={this.state.language} name="language" onChange={this.change} className="details_item form-control">
                                                <option value=""> Select Movie Language </option>
                                                <option value="Hindi">  Hindi </option>
                                                <option value="Telugu">  Telugu </option>
                                                <option value="English">  English  </option>
                                                <option value="Malyalam">  Malyalam  </option>
                                                <option value="Tamil">  Tamil  </option>
                                                </select>
                                           
                                        </div>
                                        <div class="form-group col-lg-12">
                                            {/* <input onChange={this.change} type="text" class="form-control" name="genre" id="genre" placeholder="Genre" /> */}
                                            <select value={this.state.genre} name="genre" onChange={this.change} className="details_item form-control">
                                                <option value=""> Select Movie Genre </option>
                                                <option value="Action">  Action </option>
                                                <option value="Drama">  Drama </option>
                                                <option value="Thriller">  Thriller  </option>
                                                <option value="Horror">  Horror  </option>
                                                <option value="Biography">  Biography </option>
                                                <option value="Comedy">  Comedy  </option>
                                                <option value="Romance">  Romance  </option>
                                                </select>
                                            
                                        </div>
                                        <div class="form-group col-lg-12">
                                            {/* <input onChange={this.change} type="text" class="form-control" name="rating" id="rating" placeholder="Rating" /> */}
                                            <select value={this.state.rating} name="rating" onChange={this.change} className="details_item form-control">
                                                <option value=""> Select Movie Rating </option>
                                                <option value="1">  1 </option>
                                                <option value="2">  2 </option>
                                                <option value="3">  3  </option>
                                                <option value="4">  4  </option>
                                                <option value="5">  5 </option>
                                                </select>
                                            
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>Release Date</label> &nbsp;&nbsp;
                                            <input type="date" value={this.state.releaseDate} name="releaseDate" onChange={this.change} />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <a onClick={this.addMovie} class="form-control btn btn-primary btn-rounded" style={{ width: '50%' }} label="Next" href="" type="button">
                                                <span class="btn__label">Add Movie</span></a></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div></div>
                    <div class="tab-pane" id="UpdateMovie" role="tabpanel" aria-labelledby="messages-tab">
                        <div className="row">
                            <div className="col-lg-6 col-lg-offset-3  ">
                                <div className="free-space"></div>
                                <div className="row margin-top1 margin-bottom1">

                                    <form class="form">
                                        <div class="form-group col-lg-12">
                                            
                                                <select value={this.state.movieName} name="movieName" onChange={this.change} className="details_item form-control">
                                                    <option value="">Select a Movie Name</option>
                                                    {movieDropdownDetails}
                                                </select>
                                            
                                            {/* <input onChange={this.change} type="text" class="form-control" name="movieName" id="movieName" placeholder="Movie Name" /> */}
                                        </div>
                                        <div class="form-group col-lg-12">
                                            {/* <input onChange={this.change} type="text" class="form-control" name="language" id="language" placeholder="Language" /> */}

                                            <select value={this.state.language} name="language" onChange={this.change} className="details_item form-control">
                                                <option value=""> Select Movie Language </option>
                                                <option value="Hindi">  Hindi </option>
                                                <option value="Telugu">  Telugu </option>
                                                <option value="English">  English  </option>
                                                <option value="Malyalam">  Malyalam  </option>
                                                <option value="Tamil">  Tamil  </option>
                                                </select>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            {/* <input onChange={this.change} type="text" class="form-control" name="genre" id="genre" placeholder="Genre" /> */}
                                            <select value={this.state.genre} name="genre" onChange={this.change} className="details_item form-control">
                                                <option value=""> Select Movie Genre </option>
                                                <option value="Action">  Action </option>
                                                <option value="Drama">  Drama </option>
                                                <option value="Thriller">  Thriller  </option>
                                                <option value="Horror">  Horror  </option>
                                                <option value="Biography">  Biography </option>
                                                <option value="Comedy">  Comedy  </option>
                                                <option value="Romance">  Romance  </option>
                                                </select>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            {/* <input onChange={this.change} type="text" class="form-control" name="rating" id="rating" placeholder="Rating" /> */}
                                            <select value={this.state.rating} name="rating" onChange={this.change} className="details_item form-control">
                                                <option value=""> Select Movie Rating </option>
                                                <option value="1">  1 </option>
                                                <option value="2">  2 </option>
                                                <option value="3">  3  </option>
                                                <option value="4">  4  </option>
                                                <option value="5">  5 </option>
                                                </select>
                                        </div>
                                        <div class="form-group col-lg-12">
                                            <label>Release Date</label> &nbsp;&nbsp;
                                            <input type="date" value={this.state.releaseDate} name="releaseDate" onChange={this.change} />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <a onClick={this.updateMovie} class="form-control btn btn-primary btn-rounded" style={{ width: '50%' }} label="Next" href="" type="button">
                                                <span class="btn__label">Update Movie</span></a></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane" id="DeleteMovie" role="tabpanel" aria-labelledby="settings-tab">
                        <div className="row">
                            <div className="col-lg-6 col-lg-offset-3  ">
                                <div className="free-space"></div>
                                <div className="row margin-top1 margin-bottom1">

                                    <form class="form">
                                        <div class="form-group col-lg-12">
                                        <select value={this.state.movieName} name="movieName" onChange={this.change} className="details_item form-control">
                                                    <option value=""> Select a Movie Name</option>
                                                    {movieDropdownDetails}
                                                </select>
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <a onClick={this.deleteMovie} class="form-control btn btn-primary btn-rounded" style={{ width: '50%' }} label="Next" href="" type="button">
                                                <span class="btn__label">Delete Movie</span></a></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane" id="SearchMovie" role="tabpanel" aria-labelledby="settings-tab">
                        <div className="row">
                            <div className="col-lg-6 col-lg-offset-3  ">
                                <div className="free-space"></div>
                                <div className="row margin-top1 margin-bottom1">

                                    <form class="form">
                                        <div class="form-group col-lg-12">
                                            <input onChange={this.change} type="text" class="form-control" name="movieName" id="movieName" placeholder="Movie Name" />
                                        </div>
                                        <div class="form-group col-lg-6">
                                            <a onClick={this.searchMovie} class="form-control btn btn-primary btn-rounded" style={{ width: '50%' }} label="Next" href="" type="button">
                                                <span class="btn__label">Search Movie</span></a></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="container">
                            <h2>Movies</h2>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Movie Name</th>
                                        <th>Language</th>
                                        <th>Genre</th>
                                        <th>Rating</th>
                                        <th>Release Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/*Display the Tbale row based on data recieved*/}
                                    {movieDetails}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default Movies;