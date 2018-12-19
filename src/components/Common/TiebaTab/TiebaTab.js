import * as React from "react";
import Swiper from "swiper";
import _ from "lodash";
import { getQueryStringParams, offsetTop, stringifyQueryStringParams, whichTransitionEvent } from "src/utils/utils";
import history from "src/history";
import style from "./TiebaTab.scss";

export default class TiebaTab extends React.Component {

  constructor(props) {
    super(props);
    const tabs = _.clone(props.tabs);
    const { state } = this;
    tabs.forEach(o => {
      o.isLoaded = false;
    });

    const params = getQueryStringParams();
    this.state.tabs = tabs;
    const currentKey = params.key;
    state.currentKey = currentKey || "";
  }

  state = {
    currentKey: "",
    tabs: [],
    swiper: null,
    isAnime: false
  };

  componentDidMount() {
    const { tabs, currentKey } = this.state;
    const that = this;
    const swiper = new Swiper(this.container, {
      on: {
        slideChangeTransitionEnd() {
          tabs[this.activeIndex].isLoaded = true;
          that.setState({ tabs, isAnime: false });
        },
        slideChangeTransitionStart() {
          setTimeout(()=>{
            that.changeStrip(this.previousIndex,this.activeIndex)
          })
        }
      }
    });
    const tabIndex = tabs.findIndex(o => o.key === currentKey);
    tabs[tabIndex].isLoaded = true;
    this.setState({ tabs, swiper });
    swiper.slideTo(tabIndex, 0, false);

    const { strip, tabBar } = this;
    let tabItems = Array.from(tabBar.children);
    const currentItem = tabItems[tabIndex];
    strip.style.width = `${currentItem.offsetWidth}px`;
    strip.style.left = `${currentItem.offsetLeft}px`;

    strip.addEventListener(whichTransitionEvent(), () => {
      setTimeout(() => {
        tabItems = Array.from(this.tabBar.children);
        strip.style.width = `${tabItems[swiper.activeIndex].offsetWidth}px`;
      });
    });

  }

  handleTabChange = (key) => () => {
    const { isAnime } = this.state;
    if (isAnime) {
      return;
    }
    const { tabs, swiper } = this.state;
    const currentIndex = swiper.activeIndex;
    const tabIndex = tabs.findIndex(o => o.key === key);
    if (currentIndex === tabIndex) {
      return;
    }
    this.setState({ isAnime: true });
    const params = getQueryStringParams();
    params.key = key;
    history.replace(`?${stringifyQueryStringParams(params)}`);
    tabs[tabIndex].isLoaded = true;
    this.setState({ tabs });
    swiper.slideTo(tabIndex, 500, true);
    /*    setTimeout(() => {
          this.changeStrip(currentIndex, tabIndex);
        }); */
  };

  changeStrip = (currentIndex, targetIndex) => {
    const { strip, tabBar } = this;
    const tabItems = Array.from(tabBar.children);
    const current = tabItems[currentIndex];
    const target = tabItems[targetIndex];
    if (target.offsetLeft > strip.offsetLeft) { // 去右边
      strip.style.right = "auto";
      strip.style.left = `${current.offsetLeft}px`;
      strip.style.width = `${target.offsetWidth + target.offsetLeft - current.offsetLeft}px`;
      setTimeout(() => {
        strip.style.right = `${document.body.clientWidth - target.offsetWidth - target.offsetLeft}px`;
        strip.style.left = "auto";
      }, 200);
    } else { // 去左边
      strip.style.left = "auto";
      strip.style.right = `${document.body.clientWidth - (current.offsetWidth + current.offsetLeft)}px`;
      strip.style.width = `${current.offsetLeft + current.offsetWidth - target.offsetLeft}px`;
      setTimeout(() => {
        strip.style.left = `${target.offsetLeft}px`;
        strip.style.right = "auto";
      }, 200);
    }
  };

  strip;

  tabBar;

  render() {
    const { tabs } = this.state;

    const tabHeight = this.tabBar?document.documentElement.clientHeight-(this.tabBar.offsetHeight+offsetTop(this.tabBar)):0
    if (this.tabBar) {
    }

    return (
      <div className={style.tiebaTab}>
        <div className={style.tabBar}>
          <div
            className={style.strip}
            ref={(ref) => {
              if (!ref) return;
              this.strip = ref;
            }}
          />
          <ul
            id="tabBar"
            ref={(ref) => {
              if (!ref) {
                return;
              }
              this.tabBar = ref;
            }}
          >
            {tabs.map((o) => (
              <li key={_.uniqueId()} data-key={o.key} onClick={this.handleTabChange(o.key)}>
                {/*                <Link
                  to={`/${o.key}`}
                  replace={true}
                >
                  {o.label}
                </Link> */}
                {o.label}
              </li>
            ))}
          </ul>
        </div>
        {/*        <TransitionGroup>
          <CSSTransition
            timeout={60000}
            classNames={"test"}
            key={key}
          > */}
        <div
          className={`${style.container} swiper-container`}
          ref={(ref) => {
            if (!ref) return;
            this.container = ref;
          }}
        >
          <div className="swiper-wrapper" style={{minHeight:'100%'}}>
            {
              tabs.map((o) => (
                <div key={_.uniqueId()} className="swiper-slide" id={o.key} style={{height:o.isFull?tabHeight:'auto'}}>
                  {
                    o.isLoaded ? o.component : ""
                  }
                </div>
              ))
            }
          </div>
        </div>
        {/*          </CSSTransition>
        </TransitionGroup> */}
      </div>
    );
  }
}


