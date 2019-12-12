import React from 'react';
import { VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Image from 'react-bootstrap/Image'
import ReactMarkdown from 'react-markdown';

class TimelineEvent extends React.Component {
  constructor(props) {
    super(props);
    let className;
    let iconUrl;
    switch (this.props.timelineEvent.action) {
      case 'GitHub_PullRequestEvent':
      case 'GitHub_PullRequestReviewCommentEvent':
      case 'GitHub_ForkEvent':
      case 'GitHub_IssueCommentEvent':
        className = 'blue';
        break;
      case 'GitHub_PushEvent':
        className = 'green';
        break;
      case 'GitHub_DeleteEvent':
        className = 'red opaque';
        break;
      default:
        className = 'gray';
        break;
    }
    switch (this.props.timelineEvent.action) {
      case 'GitHub_PullRequestEvent':
        iconUrl = 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/icon-push-github.png';
        break;
      case 'GitHub_PullRequestReviewCommentEvent':
        iconUrl = 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/icon-push-github.png';
        break;
      case 'GitHub_IssueCommentEvent':
        iconUrl = 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/icon-push-github.png';
        break;
      case 'GitHub_PushEvent':
        iconUrl = 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/icon-push-github.png';
        break;
      case 'GitHub_DeleteEvent':
        iconUrl = 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/icon-push-github.png';
        break;
      case 'GitHub_ForkEvent':
        iconUrl = 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/icon-push-github.png';
        break;
      case 'Bugzilla_BugChange':
        iconUrl = 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/icon-bugzilla.png';
        break;
      case 'Bugzilla_BugComment':
        iconUrl = 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/icon-bugzilla.png';
        break;
      default:
        iconUrl = 'https://github.com/grenade/grenade-ng-root/raw/master/app/images/icon-push-github.png';
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
              this.props.timelineEvent.body.content.map((item, key) =>
                <li key={key}>
                  {item.prefix}
                  <a href={item.url}>
                    {item.text}
                  </a>
                  {item.suffix}
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
    return (
      <VerticalTimelineElement
        className={this.state.className}
        key={this.state.id}
        date={
          (new Date(this.state.date)).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toLowerCase() + ' - ' +
          (new Date(this.state.date)).toLocaleTimeString('en-GB', { timeStyle: 'full', timeZone: 'UTC', timeZoneName: 'short' }).toLowerCase()
        }
        icon={<Image src={this.state.iconUrl} style={{width: this.state.iconWidth, height: this.state.iconHeight}} fluid roundedCircle />} >
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