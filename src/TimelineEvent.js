import React from 'react';
import { VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Image from 'react-bootstrap/Image'
import ReactMarkdown from 'react-markdown';
import { CodeSlash, Lock, PersonCheck, Unlock, Wrench } from 'react-bootstrap-icons';

class TimelineEvent extends React.Component {
  icons = {
    lock: Lock,
    unlock: Unlock,
    login: PersonCheck,
    wrench: Wrench,
    code: CodeSlash
  };
  constructor(props) {
    super(props);
    let className, iconUrl, iconStyle;
    switch (this.props.timelineEvent.action) {
      case 'GitHub_PullRequestEvent':
      case 'GitHub_PullRequestReviewCommentEvent':
      case 'GitHub_ForkEvent':
      case 'GitHub_IssueCommentEvent':
      case 'Git_Commit':
        className = 'blue';
        iconStyle = { color: '#fff' };
        break;
      case 'GitHub_PushEvent':
        className = 'green';
        iconStyle = { color: '#fff' };
        break;
      case 'GitHub_DeleteEvent':
        className = 'red opaque';
        iconStyle = { color: '#fff' };
        break;
      case 'workstation_lock':
        className = 'red opaque';
        iconStyle = { color: '#aaa' };
        break;
      case 'workstation_login':
      case 'workstation_unlock':
        className = 'green opaque';
        iconStyle = { color: '#fff' };
        break;
      default:
        className = 'blue';
        iconStyle = { color: '#fff' };
        //iconStyle = { background: 'rgb(33, 150, 243)', color: '#fff' };
        break;
    }
    switch (this.props.timelineEvent.action) {
      case 'GitHub_PullRequestEvent':
      case 'GitHub_PullRequestReviewCommentEvent':
      case 'GitHub_IssueCommentEvent':
      case 'GitHub_PushEvent':
      case 'GitHub_DeleteEvent':
      case 'GitHub_ForkEvent':
        iconUrl = 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/icon-push-github.png';
        break;
      case 'Bugzilla_BugChange':
      case 'Bugzilla_BugComment':
      case 'Bugzilla_BugCreate':
        iconUrl = 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/icon-bugzilla.png';
        break;
      case 'Git_Commit':
        iconUrl = 'code';
        break;
      case 'workstation_lock':
        iconUrl = 'lock';
        break;
      case 'workstation_login':
        iconUrl = 'login';
        break;
      case 'workstation_unlock':
        iconUrl = 'unlock';
        break;
      default:
        iconUrl = 'wrench';
        break;
    }
    this.state = {
      id: this.props.timelineEvent.id,
      className: className,
      date: this.props.timelineEvent.date,
      url: (this.props.timelineEvent.body && this.props.timelineEvent.body.content.url)
        ? this.props.timelineEvent.body.content.url
        : null,
      iconUrl: iconUrl,
      iconStyle: iconStyle,
      iconHeight: '60px',
      iconWidth: '60px',
      title: {
        prefix: this.props.timelineEvent.title.prefix,
        link: {
          text: this.props.timelineEvent.title.text,
          url: this.props.timelineEvent.title.url
        },
        suffix: this.props.timelineEvent.title.suffix
      },
      subtitle: (this.props.timelineEvent.subtitle) ? {
        prefix: this.props.timelineEvent.subtitle.prefix,
        link: {
          text: this.props.timelineEvent.subtitle.text,
          url: this.props.timelineEvent.subtitle.url
        },
        suffix: this.props.timelineEvent.subtitle.suffix
      } : {},
      body: '',
      commits: (this.props.timelineEvent.body && this.props.timelineEvent.body.tag === 'UnorderedList')
        ? this.props.timelineEvent.body.content
        : []
    };
  }

  render() {
    let body;
    let tag = (this.props.timelineEvent.body)
      ? this.props.timelineEvent.body.tag
      : null;
    switch (tag) {
      case 'UnorderedList':
        body = (
          <ul>
            {
              (Array.isArray(this.props.timelineEvent.body.content))
                ? (
                    this.props.timelineEvent.body.content.map((item, key) =>
                      <li key={key}>
                        {item.prefix}
                        <a href={item.url}>
                          {item.text}
                        </a>
                        {item.suffix}
                      </li>
                    )
                  )
                : (
                    <li>
                      {this.props.timelineEvent.body.content.prefix}
                      <a href={this.props.timelineEvent.body.content.url}>
                        {this.props.timelineEvent.body.content.text}
                      </a>
                      {this.props.timelineEvent.body.content.suffix}
                    </li>
                  )
            }
          </ul>
        );
        break;
      case 'Markdown':
        body = (
          this.props.timelineEvent.body.content.map((item, key) =>
            <ReactMarkdown source={item.text} key={key} />
          )
        );
        break;
      default:
        body = (this.props.timelineEvent.body)
        ? (this.props.timelineEvent.body.content.map((item, key) =>
            <p key={key}>{item.text}</p>
          ))
        : '';
        break;
    }
    const IconTag = this.icons[this.state.iconUrl || 'wrench'];
    return (
      <VerticalTimelineElement
        className={this.state.className}
        key={this.state.id}
        date={
          (new Date(this.state.date)).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toLowerCase() + ' - ' +
          (new Date(this.state.date)).toLocaleTimeString('en-GB', { timeZoneName: 'short' }).toLowerCase()
        }
        iconStyle={this.state.iconStyle}
        icon={
          (this.state.iconUrl && this.state.iconUrl.startsWith('http'))
            ? (<Image src={this.state.iconUrl} style={{width: this.state.iconWidth, height: this.state.iconHeight}} fluid roundedCircle />)
            : (<IconTag />)
        } >
        <h4 className={'vertical-timeline-element-title ' + this.state.className}>
          {
            (this.state.title.link === null)
              ? (this.state.title.prefix)
              : (<span>{this.state.title.prefix} <a href={this.state.title.link.url}>{this.state.title.link.text}</a> {this.state.title.suffix}</span>)
          }
        </h4>
        <h5 className={'vertical-timeline-element-subtitle ' + this.state.className}>
          {
            (this.state.subtitle.link === null || this.state.subtitle.link === undefined)
              ? (this.state.subtitle.prefix)
              : (<span>{this.state.subtitle.prefix} <a href={this.state.subtitle.link.url}>{this.state.subtitle.link.text}</a> {this.state.subtitle.suffix}</span>)
          }
        </h5>
        <div>
        {body}
        </div>
      </VerticalTimelineElement>
    )
  }
}

export default TimelineEvent;