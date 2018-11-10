import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Jumbotron, Container, Row, Col, Button} from 'reactstrap';

import './Home.css';


class Home extends Component {

    render() {

        return (
            <Container>
                <Jumbotron>
                    <h2>Welcome to ChainSkills</h2>
                    <p>This is an example of website developed in React and React Bootstrap</p>
                    <Link to="/about">
                        <Button color="primary">Learn more</Button>
                    </Link>
                </Jumbotron>
                <Row className={"show-grid text-center"}>
                    <Col xs={12} sm={4} className={"person-wrapper"}>
                        <img src={"assets/person-1.jpg"}  className={"profile-pic rounded-circle"} alt={""}/>
                        <h3>Frank</h3>
                        <p>That's what painting is all about. It should make you feel good when you paint. Every
                            highlight needs it's own personal shadow. We don't have to be concerned about it. We just
                            have to let it fall where it will. Use what happens naturally, don't fight it.</p>
                    </Col>
                    <Col xs={12} sm={4} className={"person-wrapper"}>
                        <img src={"assets/person-2.jpg"}  className={"profile-pic rounded-circle"} alt={""}/>
                        <h3>Frank</h3>
                        <p>We don't make mistakes we just have happy little accidents. You can't have light without
                            dark. You can't know happiness unless you've known sorrow. I sincerely wish for you every
                            possible joy life could bring. If it's not what you want - stop and change it. Don't just
                            keep going and expect it will get better.</p>
                    </Col>
                    <Col xs={12} sm={4} className={"person-wrapper"}>
                        <img src={"assets/person-3.jpg"}  className={"profile-pic rounded-circle"} alt={""}/>
                        <h3>Frank</h3>
                        <p>If you do too much it's going to lose its effectiveness. Everyone wants to enjoy the good
                            parts - but you have to build the framework first. When you do it your way you can go
                            anywhere you choose. Happy painting, God bless.</p>
                    </Col>
                </Row>

            </Container>
        );
    }
}

export default Home;
