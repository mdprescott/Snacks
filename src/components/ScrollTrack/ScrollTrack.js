import React, { Component } from 'react'
import isEqual from 'lodash.isequal'
import Radium from 'radium'
import PropTypes from 'prop-types'
import componentStyles from './ScrollTrackStyles'
import equalWidthTrack from './equalWidthTrack'
import ScrollTrackPropTypes from './ScrollTrackPropTypes'

import { isNodeEnv } from '../../utils/detectFeature'
import debounce from '../../utils/debounce'
import CircleButton from '../Buttons/CircleButton'
import Icon from '../Icon/Icon'

const noOp = () => {} // eslint-disable-line no-empty-function

@Radium
class ScrollTrack extends Component {
  static equalWidthTrack = equalWidthTrack

  static ScrollTrackPropTypes = ScrollTrackPropTypes

  static propTypes = {
    /** Prop for passing in custom button content for back button */
    backButtonContent: PropTypes.node,

    /** The elements to scroll */
    children: PropTypes.node,

    /** Manually control left positioning of ScrollTrack */
    leftOverride: PropTypes.number,

    /** Prop for passing in custom button content for next button */
    nextButtonContent: PropTypes.node,

    /**
     * A callback called before sliding to next set.
     * ** Passed function must return a promsie **
     * -- will wait for promise resolution before continuing slide.
     * Use for high levels of control
     */
    onBeforeNext: PropTypes.func,

    /**
     * A callback called before sliding to previous set.
     * ** Passed function must return a promsie **
     * -- will wait for promise resolution before continuing slide.
     * Use for high levels of control
     */
    onBeforeBack: PropTypes.func,

    /**  function to be called after sliding to next set. */
    onAfterNext: PropTypes.func,

    /**  function to be called after sliding to previous set. */
    onAfterBack: PropTypes.func,

    /** number of pixels to offset forward scrolls by */
    scrollOffset: PropTypes.number,

    /** Speed of scrolling animaton in milleseconds - defaults to 150ms */
    scrollSpeed: PropTypes.number,

    /** Transition timing function to use for scrolling animation - defaults to ease-in-out */
    scrollTimingFunction: PropTypes.string,

    /** Style top level element */
    style: PropTypes.object,

    /** Style specifc children elements [LeftArrow, RightArrow, Track] */
    styles: PropTypes.shape({
      LeftArrow: PropTypes.object,
      RightArrow: PropTypes.object,
      Track: PropTypes.object,
    }),
  }

  static defaultProps = {
    leftOverride: 0,
    scrollOffset: 0,
    scrollSpeed: 150,
    scrollTimingFunction: 'ease-in-out',
    styles: {
      LeftArrow: {},
      RightArrow: {},
      Track: {},
    },
    style: {},
    onBeforeBack: () => new Promise(resolve => resolve()),
    onAfterNext: noOp,
    onAfterBack: noOp,
    onBeforeNext: () => new Promise(resolve => resolve()),
  }

  constructor(props) {
    super(props)

    this.state = {
      isSliding: false,
      showLeftArrow: false,
      showRightArrow: false,
      left: props.leftOverride,
    }
  }

  componentDidMount() {
    this.debouncdComputeSlideAttributes = debounce(this.computeSlideAttributes, 200)
    this.computeSlideAttributes()

    if (!isNodeEnv()) {
      window.addEventListener('resize', this.debouncdComputeSlideAttributes)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.leftOverride !== this.props.leftOverride) {
      // this allows for control of the scrolltrack by parent components
      this.setState({ left: nextProps.leftOverride })
      this.computeSlideAttributes()
    }
  }

  componentDidUpdate(prevProps) {
    const prevChildren = prevProps.children || []
    const newChildren = this.props.children || []

    if (!isEqual(prevChildren, newChildren)) {
      this.computeSlideAttributes()
    }
  }

  componentWillUnmount() {
    if (!isNodeEnv()) {
      window.removeEventListener('resize', this.debouncdComputeSlideAttributes)
    }
  }

  get childrenWithTrackProps() {
    const nodeWidths = this.getNodeWidths()
    const trackProps = {
      ...this.state,
      ...nodeWidths,
    }

    return React.Children.map(this.props.children, child => {
      const isHtmlTag =
        typeof child.type === 'string' && child.type[0] === child.type[0].toLowerCase()
      const childProps = isHtmlTag ? {} : { trackProps }

      return React.cloneElement(child, childProps)
    })
  }

  getNodeWidths = () => {
    const parentNode = this.refs.container
    const parentNodeBounds = parentNode && parentNode.getBoundingClientRect()
    const trackNode = this.refs.track
    const trackNodeBounds = trackNode && trackNode.getBoundingClientRect()
    const parentWidth = parentNodeBounds && parentNodeBounds.width
    const trackWidth = trackNode && trackNode.offsetLeft + trackNode.scrollWidth
    const trackBounds = trackNodeBounds

    return { parentWidth, trackWidth, trackBounds }
  }

  computeSlideAttributes = () => {
    const { parentWidth, trackWidth } = this.getNodeWidths()
    const trackAtEnd = parentWidth < trackWidth && this.state.left <= parentWidth - trackWidth
    const trackAtBeginning = this.state.left >= 0

    if (!parentWidth || !trackWidth) {
      return
    }
    if (Math.ceil(parentWidth) >= trackWidth) {
      return this.hideArrows()
    }
    if (!trackAtEnd) {
      this.showRightArrow()
    } else {
      this.hideRightArrow()
    }
    if (!trackAtBeginning) {
      this.showLeftArrow()
    } else {
      this.hideLeftArrow()
    }
  }

  onKeyDown = e => {
    if (![39, 37].includes(e.keyCode)) {
      return
    }

    e.preventDefault()

    if (e.keyCode === 39) {
      // right arrow
      this.slideForward()
    } else {
      // left arrow
      this.slideBack()
    }
  }

  hideArrows = () => {
    this.setState({
      showLeftArrow: false,
      showRightArrow: false,
    })
  }

  hideRightArrow = () => {
    this.setState({ showRightArrow: false })
  }

  hideLeftArrow = () => {
    this.setState({ showLeftArrow: false })
  }

  showRightArrow = () => {
    this.setState({ showRightArrow: true })
  }

  showLeftArrow = () => {
    this.setState({ showLeftArrow: true })
  }

  setSliding = () => {
    this.setState({ isSliding: true })
  }

  setNotSliding = () => {
    this.setState({ isSliding: false })
  }

  slideForward = () => {
    if (this.state.isSliding) {
      return
    } // already sliding

    const { parentWidth, trackWidth } = this.getNodeWidths()
    let nextForward = this.state.left - parentWidth + scrollOffset
    const fullForward = parentWidth - trackWidth
    const { onBeforeNext, scrollOffset } = this.props

    // already is, or is going to be, full forward
    if (nextForward <= fullForward) {
      nextForward = fullForward
    }

    const callbackProps = {
      atStart: trackWidth <= parentWidth,
      atEnd: fullForward === nextForward,
      slideTo: nextForward,
      parentWidth,
      trackWidth,
    }

    this.setSliding()

    onBeforeNext(callbackProps).then(response => this.afterBeforeNext(response, callbackProps))
  }

  afterBeforeNext = (response = {}, callbackProps) => {
    // calcuate track values once more, in case children have changed the track size
    const { parentWidth, trackWidth } = this.getNodeWidths()
    const { scrollOffset, onAfterNext } = this.props
    const offset = response.scrollOffset || scrollOffset
    const fullForward = parentWidth - trackWidth
    let nextForward = this.state.left - parentWidth + offset

    // already is, or is going to be, full forward
    if (nextForward <= fullForward) {
      nextForward = fullForward
    }

    this.updateLeftValue({
      left: nextForward,
      callback: onAfterNext,
      callbackProps: {
        ...callbackProps,
        ...{
          atStart: trackWidth <= parentWidth,
          atEnd: fullForward === nextForward,
          slideTo: nextForward,
          parentWidth,
          trackWidth,
        },
      },
    })
  }

  slideBack = () => {
    if (this.state.isSliding) {
      return
    } // already sliding

    const { parentWidth, trackWidth } = this.getNodeWidths()
    const { onBeforeBack, scrollOffset } = this.props
    let nextBack = this.state.left + parentWidth - scrollOffset

    // already is, or is going to be, full back
    if (this.state.left >= 0 || nextBack >= 0) {
      nextBack = 0
    }

    const callbackProps = {
      atStart: nextBack === 0,
      atEnd: false,
      slideTo: nextBack,
      parentWidth,
      trackWidth,
    }

    this.setSliding()

    onBeforeBack(callbackProps).then(response => this.afterBeforeBack(response, callbackProps))
  }

  afterBeforeBack = (response = {}, callbackProps) => {
    // calcuate track values once more, in case children have changed the track size
    const { parentWidth, trackWidth } = this.getNodeWidths()
    const { scrollOffset, onAfterBack } = this.props
    const offset = response.scrollOffset || scrollOffset
    let nextBack = this.state.left + parentWidth - offset

    // already is, or is going to be, full back
    if (this.state.left >= 0 || nextBack >= 0) {
      nextBack = 0
    }

    this.updateLeftValue({
      left: nextBack,
      callback: onAfterBack,
      callbackProps: {
        ...callbackProps,
        ...{
          slideTo: nextBack,
          parentWidth,
          trackWidth,
        },
      },
    })
  }

  updateLeftValue({ left, callback, callbackProps }) {
    this.setState({ left }, () => {
      this.computeSlideAttributes()
      setTimeout(() => {
        this.setNotSliding()
        callback(callbackProps)
      }, this.props.scrollSpeed)
    })
  }

  renderRightArrow = () => {
    const { slideButtonStyles } = componentStyles
    const { showRightArrow } = this.state
    const {
      styles: { RightArrow = {} },
      nextButtonContent,
    } = this.props

    return (
      <CircleButton
        onClick={this.slideForward}
        ariaLabel="next"
        style={[
          slideButtonStyles.default,
          slideButtonStyles.right,
          showRightArrow && { display: 'block' },
          RightArrow,
        ]}
        ref={node => (this.nextButton = node)}
      >
        {nextButtonContent || <Icon name="arrowRightSmallBold" style={{ fontSize: '20px' }} />}
      </CircleButton>
    )
  }

  renderLeftArrow = () => {
    const { slideButtonStyles } = componentStyles
    const { showLeftArrow } = this.state
    const {
      styles: { LeftArrow = {} },
      backButtonContent,
    } = this.props

    return (
      <CircleButton
        onClick={this.slideBack}
        ariaLabel="back"
        style={[
          slideButtonStyles.default,
          slideButtonStyles.left,
          showLeftArrow && { display: 'block' },
          LeftArrow,
        ]}
        ref={node => (this.backButton = node)}
      >
        {backButtonContent || <Icon name="arrowLeftSmallBold" style={{ fontSize: '20px' }} />}
      </CircleButton>
    )
  }

  render() {
    const { containerStyles, innerContainerStyles } = componentStyles
    const {
      children,
      scrollSpeed,
      scrollTimingFunction,
      style,
      styles: { Track = {} },
    } = this.props

    if (!children) {
      return null
    }

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div ref="container" style={{ ...containerStyles, ...style }} onKeyDown={this.onKeyDown}>
        {this.renderLeftArrow()}
        <div
          style={[
            {
              transition: `transform ${scrollSpeed}ms ${scrollTimingFunction}`,
              transform: `translate3d(${this.state.left}px, 0, 0)`,
            },
            innerContainerStyles,
          ]}
        >
          <div ref="track" style={Track}>
            {this.childrenWithTrackProps}
          </div>
        </div>
        {this.renderRightArrow()}
      </div>
    )
  }
}

export default ScrollTrack
