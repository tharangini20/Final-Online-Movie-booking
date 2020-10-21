import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Login_IP, Login_Port, Node_IP, Node_Port } from "./../../config";

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            userName: "",
            userNameError: "",
            phonenumber: "",
            phonenumberError: "",
            password: "",
            passwordError: "",
            email: "",
            emailError: "",
            check: false
        }
        this.change = this.change.bind(this);
        this.submitSignup = this.submitSignup.bind(this);
    }

    change = (e) => {
        this.setState({
            check: false,
            [e.target.name]: e.target.value

        })
    }

    validate = () => {
        let isError = false;
        var pattern = new RegExp(/^[0-9\b]+$/);
        var pattern1= new RegExp(/^[a-zA-Z]+$/);
        var pattern2=new RegExp (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/);
        var pattern3= new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
        const errors = {
            userNameError: "",
            phonenumberError: "",
            passwordError: "",
            emailError: ""
        };

        if (this.state.email.indexOf("@") === -1) {
            isError = true;
            errors.emailError = "Requires valid email";
        }

        if(!pattern3.test(this.state.email)) {
            isError = true;
            errors.emailError = "Please enter valid email address (ex:xyz@gmail.com)";
          }
        if (this.state.password.length == 0) {
            isError = true;
            errors.passwordError = "Password required";
        }
        if (!pattern2.test(this.state.password)) {
            isError = true;
            errors.passwordError = "Please select the password with atleast one letter, one numeric digit and one special character and length should be between 7 to 15.";
          }

        if (this.state.phonenumber.length == 0){
            isError = true;
            errors.phonenumberError = "phonenumber required";
        }
            
        if (!pattern.test(this.state.phonenumber)) {
          isError = true;
          errors.phonenumberError = "Please enter only number.";
        }

        if (this.state.phonenumber.length != 10){
            isError = true;
            errors.phonenumberError = "please enter a valid number(should be 10 digit)";
        }

        if (this.state.userName.length == 0) {
            isError = true;
            errors.userNameError = "userName name required";
            
        }
        if (!pattern1.test(this.state.userName)) {
            isError = true;
            errors.userNameError= "Please enter only alphabets.";
          }

        this.setState({
            ...errors
        });
        return isError;
    }

    submitSignup = (e) => {
        console.log("inside submit signup")
        var headers = new Headers();
        e.preventDefault();
        const err = this.validate();
        this.setState({
            check: true
        })
        if (!err) {

            const data = {
                userName: this.state.userName,
                phonenumber: this.state.phonenumber,
                email: this.state.email,
                password: this.state.password,
                role: "customer"
            }
            console.log(data)
            // axios.defaults.withCredentials = true;
            axios.post(Login_IP + Login_Port + '/signUp', data)
                .then(response => {

                    console.log("Status Code : ", response.status);
                    if (response.status === 200) {
                        localStorage.setItem('email', response.data.email);
                        localStorage.setItem('cookie', response.data.role)
                        this.setState({
                            authFlag: true,
                            direct: true
                        })
                    } else {
                        this.setState({
                            authFlag: false
                        })
                    }
                }).catch(e => {
                    alert("Try with different Email ID!")
                    console.log(e)
                })
        }
    }


    render() {
        var redirectTo = null;
        if (this.state.direct) {
            redirectTo = <Redirect to="/Home" />
        }

        return (<div className="listBody">
            {redirectTo}
            <div className="text-center">
                <br></br>
                <h1>Sign up for BookMyTicket</h1>
                <h4>Already have an account? <a id="sign-in-link" href="/clogin">Log in</a></h4></div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-6 col-lg-offset-3 listBody1 ">
                        {/* {(this.state.check) ? <div class="col-lg-12 margin-bottom1" style={{ backgroundColor: 'gray', display: 'inline' }} >
                            <h5>{this.state.userNameError}<br></br>
                                {this.state.phonenumberError}
                                <br></br>{this.state.emailError}<br></br>{this.state.passwordError}</h5></div> : <a />} */}
                        <div className="row margin-top1 margin-bottom1">

                            <form class="form">

                                <div class="form-group col-lg-6">
                                    <input onChange={this.change} type="text" class="form-control" name="userName" id="fname" placeholder="Enter name" />
                                    <div style={{color:"red"}}>{this.state.userNameError}</div>
                                </div>

                                <div class="form-group col-lg-6">
                                    <input onChange={this.change} type="text" class="form-control" name="phonenumber" id="lname" placeholder="Enter phonenumber" />
                                    <div style={{color:"red"}}>{this.state.phonenumberError}</div>
                                </div>
                                <div class="form-group col-lg-12">
                                    <input onChange={this.change} type="email" class="form-control" name="email" id="email" placeholder="Enter email" />
                                    <div style={{color:"red"}}>{this.state.emailError}</div>
                                </div>
                                <div class="form-group col-lg-12">
                                    <input onChange={this.change} type="password" name="password" class="form-control" placeholder="Password" />
                                    <div style={{color:"red"}}>{this.state.passwordError}</div>
                                </div>
                                <div class="form-group col-lg-11">
                                    <button style={{ width: '50%' }} onClick={this.submitSignup} className="form-control btn btn-warning">Sign me Up</button>
                                </div>

                                {/* <div class="centered-hr text-center col-lg-11 ">
                                    <span class="text-center"><em>or</em></span>
                                </div>
                                <div className="form-group col-lg-8 col-lg-offset-2">
                                    <input type="button" className="form-control btn-primary fbcolor " value="Log in with Facebook" />
                                </div>
                                <div className="form-group col-lg-8 col-lg-offset-2">
                                    <input type="button" className="form-control btn-secondary gcolor  " value="Log in with Google" />
                                </div> */}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default Signup