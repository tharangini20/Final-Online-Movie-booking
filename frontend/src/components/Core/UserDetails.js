import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Footer from '../Footer';
import { Login_IP, Login_Port } from "../../config";
import ToggleDisplay from 'react-toggle-display';

class UserDetails extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
           
        }
    }

    componentDidMount() {
        axios.get(Login_IP + Login_Port + `/users?Role=` + localStorage.getItem("cookie"))
            .then((response) => {
                //update the state with the response data
                console.log(response.data)
                this.setState({
                    users: response.data,

                });
            }).catch(err => {
                console.log(err);
            });
    }
    

    render() {
        var users = this.state.users

        let userDetails = users.map(user => {
            return (
                <tr>
                    <td>{user.userName}</td>
                    <td>{user.phonenumber}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                </tr>

            )
        })

        return (
            <div>

                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href="#GetAllUsers" role="tab" aria-controls="home" aria-selected="true">Get All User Details</a>
                    </li>
                    

                </ul>


                <div class="tab-content">
                    <div class="tab-pane active" id="GetAllUsers" role="tabpanel" aria-labelledby="home-tab">
                        <div class="container">
                            <h2>List of All Users</h2>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>User Name</th>
                                        <th>Phone Number</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/*Display the Tbale row based on data recieved*/}
                                    {userDetails}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </div>
                    </div>
                    
        )


    }
}

export default UserDetails;