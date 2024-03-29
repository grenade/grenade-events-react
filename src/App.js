import React, { Component } from "react";
import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from 'mongodb-stitch-browser-sdk';
import {
  VerticalTimeline
} from 'react-vertical-timeline-component';
import TimelineEvent from './TimelineEvent';
import UtcTimelessDate from './UtcTimelessDate';
import Slider, { Range } from 'rc-slider';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rc-slider/assets/index.css';
import './App.css';

const filterDateMin = Math.floor((new UtcTimelessDate ('2013-04-07').floor().getTime()));
const filterDateMax = Math.floor((new UtcTimelessDate ().ceil()).getTime());
const actionRegexes = [
  {
    name: 'bugzilla',
    pattern: new RegExp ('^bugzilla_', 'i')
  },
  {
    name: 'git',
    pattern: new RegExp ('^git_', 'i')
  },
  {
    name: 'github',
    pattern: new RegExp ('^github_', 'i')
  },
  {
    name: 'hg',
    pattern: new RegExp ('^hg_', 'i')
  },
  {
    name: 'workstation',
    pattern: new RegExp ('^workstation_', 'i')
  }
];

const externalLinks = [
  {
    url: 'https://instagram.com/rob_thij',
    icon: 'https://github.com/grenade/grenade-events-react/raw/master/public/ig36.png',
    alt: 'photos on instagram'
  },
  {
    url: 'https://twitter.com/grenade',
    icon: 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/twitter.png',
    alt: 'random musings at twitter'
  },
  {
    url: 'https://www.facebook.com/rob.thijssen',
    icon: 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/facebook.png',
    alt: 'social life and photos on facebook'
  },
  {
    url: 'https://linkedin.com/in/thijssen/',
    icon: 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/in.png',
    alt: 'career history and linkedin connections and profile'
  },
  {
    url: 'https://stackoverflow.com/users/68115/grenade',
    icon: 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/so.png',
    alt: 'giving and receiving technical advice at stackoverflow'
  },
  {
    url: 'https://github.com/grenade',
    icon: 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/githublod.png',
    alt: 'code contribution at github'
  },
  {
    url: 'https://people.mozilla.org/p/grenade',
    icon: 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/mozillalod.png',
    alt: 'working at mozilla'
  },
  {
    url: 'https://steelhorseadventures.com',
    icon: 'https://raw.githubusercontent.com/steelhorseadventures/sha-ng/master/app/images/bike36lod.png',
    alt: 'solo adventure biking in europe on a yamaha fzs 1000'
  },
  {
    url: 'https://draken-magnifik-midget.blogspot.com/',
    icon: 'https://raw.githubusercontent.com/steelhorseadventures/sha-ng/master/app/images/sail36lod.png',
    alt: 'sailing solo on a magnifik midget'
  }
];

function timestampToDateString(timestamp) {
  return new Date(timestamp).toISOString().split('.')[0] + 'Z';
}

class App extends Component {
  constructor() {
    super();
    let filterDateStart = Math.floor((new UtcTimelessDate ().floor().addDays(-30).getTime()));
    let filterDateEnd =  Math.floor((new UtcTimelessDate ().ceil()).getTime());
    this.state = {
      events: [],
      filterEventMax: 100,
      filterDateStart: filterDateStart,
      filterDateEnd: filterDateEnd,
      filterAction: {
        bugzilla: true,
        git: true,
        github: true,
        hg: true,
        workstation: true
      },
      filters: [
        { date: { $gte: timestampToDateString(filterDateStart) } },
        { date: { $lt: timestampToDateString(filterDateEnd) } },
        {
          $or: actionRegexes.map(regex => ({ action: regex.pattern }))
        }
      ]
    };
    this.displayEvents = this.displayEvents.bind(this);
  }
  
  componentDidMount() {
    this.client = Stitch.initializeDefaultAppClient('grenade-tnats');
    const mongodb = this.client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas-grenade-stitch');
    this.db = mongodb.db('grenade');
    this.displayEventsOnLoad();
  }
  
  displayEvents() {
    this.db
      .collection('moment')
      .find(
        {
          $and: this.state.filters
        },
        { limit: this.state.filterEventMax, sort: { date: -1 } })
      .asArray()
      .then(events => {
        this.setState({events});
      });
  }

  displayEventsOnLoad() {
    this.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(this.displayEvents)
      .catch(console.error);
  }

  getFriendlyWordList(list) {
    if (!list || list.length === 0) {
      return '';
    }
    let s = list.join(', ');
    let n = s.lastIndexOf(', ');
    return s.slice(0, n) + s.slice(n).replace(', ', ' and ');
  }

  render() {
    return (
      <Container>
        <Row className="white-text">
          <Col>
            <h1>
              hi, i'm rob
            </h1>
          </Col>
          <Col>
            <div className="rounded" style={{ backgroundColor: 'white', width: '100%' }}>
              {externalLinks.map((el, i) => (
                <a href={el.url} title={el.alt} key={i} target="_blank" rel="noopener noreferrer">
                  <img src={el.icon} alt={el.alt} className="float-right" style={{marginLeft: '10px'}} />
                </a>              
              ))}
            </div>
          </Col>
        </Row>
        <Row className="white-text">
          <p>
            i rarely say anything that warrants capital letters. if you're here to see my resume, please go to: <a className="hot-pink-text" href="https://rob.tn/cv/">https://rob.tn/cv</a>.
            &nbsp;much of what you never wanted to know about me, can be found by following the icon links above.
            &nbsp;a peek into the projects i'm working on, is below.
          </p>
        </Row>
        <Row className="white-text">
          <Col>
            {
              actionRegexes.map(regex => regex.name).map(source => (
                <Form.Check
                  type="switch"
                  id={source}
                  label={source}
                  checked={this.state.filterAction[source]}
                  onChange={this.onCheckboxChange} />
              ))
            }
          </Col>
          <Col>
          </Col>
          <Col>
          </Col>
          <Col>
            <label style={{fontSize: '70%'}}>number of activities to display: {this.state.filterEventMax}</label>
            <Slider
              value={this.state.filterEventMax}
              min={10}
              max={1000}
              onChange={(filterEventMax) => this.setState({filterEventMax}, () => { this.displayEvents(); })} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Range
              allowCross={false}
              value={[this.state.filterDateStart, this.state.filterDateEnd]}
              min={filterDateMin}
              max={filterDateMax}
              onChange={this.onSliderChange} />
            <p className="white-text text-center">
              showing <em>{(this.state.filterEventMax === this.state.events.length) ? 'latest ' + this.state.filterEventMax : 'all ' + this.state.events.length}</em> activities from <em>{this.getFriendlyWordList(actionRegexes.filter(r => this.state.filterAction[r.name]).map(r => r.name))}</em> that took place between
              &nbsp;<em>{(new Date(this.state.filterDateStart)).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toLowerCase()}</em>
              &nbsp;and <em>{(new Date(this.state.filterDateEnd)).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toLowerCase()}</em>.
            </p>
            <VerticalTimeline>
              {this.state.events.map((event) => (
                <TimelineEvent timelineEvent={event} key={event._id} />
              ))}
            </VerticalTimeline>
          </Col>
        </Row>
      </Container>
    );
  }

  onSliderChange = (value) => {
    this.setState(
      (state, props) => ({
        filterDateStart: (new UtcTimelessDate(value[0]).floor().getTime()),
        filterDateEnd: (new UtcTimelessDate(value[1]).ceil().getTime()),
        filters: [
          { date: { $gte: timestampToDateString(value[0]) } },
          { date: { $lt: timestampToDateString(value[1]) } },
          state.filters[2]
        ]
      }),
      () => { this.displayEvents(); }
    );
  }

  onCheckboxChange = (event) => {
    const target = event.target;
    this.setState(
      (state, props) => ({
        filterAction: {
          bugzilla: (target.id === 'bugzilla') ? target.checked : state.filterAction.bugzilla,
          git: (target.id === 'git') ? target.checked : state.filterAction.git,
          github: (target.id === 'github') ? target.checked : state.filterAction.github,
          hg: (target.id === 'hg') ? target.checked : state.filterAction.hg,
          workstation: (target.id === 'workstation') ? target.checked : state.filterAction.workstation
        },
        filters: [
          state.filters[0],
          state.filters[1],
          {
            $or: actionRegexes
              .filter(regex => ((regex.name === target.id) && target.checked) || ((regex.name !== target.id) && state.filterAction[regex.name]))
              .map(regex => ({ action: regex.pattern }))
          }
        ]
      }),
      () => { this.displayEvents(); }
    );
  }
}

export default App;
