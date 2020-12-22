import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Button } from 'react-materialize';

const GET_LOGOS = gql`
  query logos($owner: String) {
    logos (owner: $owner) {
      _id
      name
      lastUpdate
    }
  }
`;

class HomeScreen extends Component {

    render() {

        return (
            <Query fetchPolicy={'network-only'} pollInterval={500} query={GET_LOGOS} variables={{ owner: this.props.match.params.id }}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;

                    let logolist = data.logos.sort((a, b) => Date.parse(b.lastUpdate) - Date.parse(a.lastUpdate));

                    return (
                        <div>
                            <div className="row">
                                <nav>
                                    <div className='nav-wrapper col s12'>&nbsp;
                                        <div className='brand-logo' style={{ cursor: 'pointer' }}>
                                            goLogoLo
                                        </div>
                                        <div className='right'>
                                                <Button className='red' onClick={(e) => {
                                                    window.location.href = 'http://localhost:3000/logout'
                                                }}>Logout</Button>
                                            </div>
                                    
                                    </div>
                                </nav>
                            </div>
                            <div className="card-panel col s4">
                                    <div className="col s8">
                                        <h3 syle={{ margin: "5px" }}>Recent Work</h3>
                                        {
                                            logolist.map((logo, index) => (
                                                <div key={index}  className='col s4'
                                                    style={{ cursor: 'pointer', marginTop: '10px' }}>
                                                    <Link to={{
                                                        pathname: `/edit/${logo._id}`,
                                                        state: { owner: this.props.match.params.id }
                                                    }} owner={this.props.match.params.id}>
                                                        <Button className="col grey" style={{ width: '100%' }}>{logo.name}</Button>
                                                    </Link>
                                                    <br />
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <br />
                                    <div className="col s8">
                                        <div>
                                            <Link id="add_logo_button" to={{
                                                pathname: "/create",
                                                state: { owner: this.props.match.params.id }
                                            }} owner={this.props.match.params.id} >
                                                <Button className="blue" style={{ width: '100%' }}>Add Logo</Button>
                                            </Link>
                                        </div>
                                    </div>

                            </div>
                        </div>
                    );
                }
                }
            </Query >
        );
    }
}

export default HomeScreen;
