import React, { Component } from 'react';
import classnames from 'classnames';

export default class Accordion extends Component {
  accordion = null

  state = {
    open: true,
    height: 0,
  }

  componentDidMount() {
    this.setState({
      height: this.accordion.scrollHeight
    });
    this.toggle();
  }

  toggle = () => {
    this.setState({
      open: !this.state.open,
    });

    // Accordions for different heights are difficult to write without JS
    if (this.state.open) {
      let elementTransition = this.accordion.style.transition;
      this.accordion.style.transition = '';

      requestAnimationFrame(() => {
        this.accordion.style.height = this.state.height + 'px';
        this.accordion.style.transition = elementTransition;

        requestAnimationFrame(() => {
          this.accordion.style.height = 0 + 'px';
        });
      });
    }
    else {
      this.accordion.style.height = this.state.height + 'px';
      this.accordion.addEventListener('transitionend', () => {
        this.accordion.removeEventListener('transitionend', arguments.callee);
        this.accordion.style.height = null;
      });
    }
  }

  render = () => (
    <div className="accordion">
      <div className="title" onClick={this.toggle}>
        {this.props.title}
      </div>
      <div
        className={classnames({
          contents: true,
          open: this.state.open,
        })}
        ref={(r) => this.accordion = r}
      >{this.props.children}</div>
    </div>
  )
}
