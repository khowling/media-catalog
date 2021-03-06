import React, { Component } from 'react';


import ServerState from '../service/server.js';

export const Player = () => {
    return (
             <div className="container">
        <section className="section">
          <header className="section-header row">
            <h1 className="section-title col-xs-24">
              Current Video
            </h1>
          </header>

          <div className="row">
            <div className="col-md-14">
                <video id="azuremediaplayer" className="azuremediaplayer amp-default-skin amp-big-play-centered" controls  width="640" height="400" poster="" data-setup='{"nativeControlsForTouch": false}' tabIndex="0">
                      <source src="http://kehowli.streaming.mediaservices.windows.net.global.prod.fastly.net/19ad8fcd-1f0c-4285-b7e6-67ef0c320360/Xbox 08_05_2016 12_35_11.ism/manifest(format=mpd-time-csf)" type="application/vnd.ms-sstr+xml" />
                      <p className="amp-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video</p>
              </video>
            </div>
            <div className="col-md-10">

              <h3 style={{padding: "0px"}}>Lorem Ipsum</h3>
              <div className="type-sh2">Dolor sit amet</div>
              <p>Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

              <hr/>
              
              <div className="color-fill-accent-vivid-high" style={{"padding": "1em", "marginBottom": "0.5em"}}>
                <div className="rating color-alt">
                    <div className="rating-label rating-label-left">Left label</div>
                    <div className="rating-stars">

                        <ul className="rating-stars-background">

                            <li><i className="glyph glyph-star"></i></li><li>
                            <i className="glyph glyph-star"></i></li><li>
                            <i className="glyph glyph-star"></i></li><li>
                            <i className="glyph glyph-star"></i></li><li>
                            <i className="glyph glyph-star"></i></li>
                        </ul>

                        <ul className="rating-stars-value" style={{width: "80%"}}>
                            <li><i className="glyph glyph-star"></i></li><li>
                            <i className="glyph glyph-star"></i></li><li>
                            <i className="glyph glyph-star"></i></li><li>
                            <i className="glyph glyph-star"></i></li><li>
                            <i className="glyph glyph-star"></i></li>
                        </ul>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
    )
}

export const Landing = ({user}) => {
  return (
    <div>
    <div className="jumbotron theme-light">
      <div className="container">
        <div className="row">
          <div className="col-md-12 col-md-push-12 text-center">
            <img className="img-responsive visible-xs-inline-block visible-sm-inline-block visible-md-inline-block visible-lg-inline-block visible-xl-inline-block" alt="" src="http://dri2.img.digitalrivercontent.net/Storefront/Site/msusa/images/promo/Xbox/en-US-Xbox-Mod-F-360-Console-Holiday15-mobile.png" data-source-index="2"/>
          </div>
          <div className="col-md-12 col-md-pull-12">
            <div className="type-h3">
              Play your TV & Movies on any device
            </div>
            <div className="type-sh3">
              Make the holidays special with streamMeTV
            </div>
            <p>Espresso served best with whole milk. Dripper aromatic sugar beans steamed breve half and half. Pumpkin spice and kopi-luwak seasonal, mug, java lungo mazagran ristretto and body espresso. Macchiato doppio pumpkin spice sit strong bar shop lungo trifecta.</p>
            <div className="btn-group">
              <button className="btn btn-primary" href="#">Get Holiday Pass</button>
              <button className="btn btn-secondary" href="#">Read more</button>
            </div>
          </div>
        </div>
      </div>
    </div>
 

      <div className="container">
        <section className="section">
          <header className="section-header row">
            <h1 className="section-title col-xs-24">
              Recommended Movies for YOU
            </h1>
          </header>

           <div className="row row-sm section-gallery">
            <div className="col-md-6">
                <figure className="media">
                    <div className="media-img ratio-1-1">
                        <a href="" className="no-outline">
                            <img src="http://lorempixel.com/400/400/nature" alt=""/>
                        </a>
                    </div>
    
                    <figcaption className="media-caption">
                        <h4 className="media-header">
                            <a href="">nature</a>
                        </h4>
                        <div className="media-subheader">
                            <a href="">tempor incididunt ut labore et dolore magna aliqua</a>
                        </div>
                    </figcaption>
                </figure>
            </div>

            <div className="col-md-6">
                <figure className="media">
                    <div className="media-img media-img-has-play">
                        <a href="#" className="no-outline ratio-1-1">
                            <img src="http://lorempixel.com/400/400/technics/2" alt=""/>
                            <i className="glyph glyph-play"></i>
                        </a>
                    </div>
                    <figcaption className="media-caption">
                        <h4 className="media-header">
                            <a href="">technics</a>
                        </h4>
                        <div className="media-subheader">
                            <a href="">dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non</a>
                        </div>
                    </figcaption>
                </figure>
            </div>

            <div className="col-md-6">
                <figure className="media">
                    <div className="media-img ratio-1-1">
                        <a href="" className="no-outline">
                            <img src="http://lorempixel.com/400/400/technics" alt=""/>
                        </a>
                    </div>
    
                    <figcaption className="media-caption">
                        <h4 className="media-header">
                            <a href="">technics 2</a>
                        </h4>
                        <div className="media-subheader">
                            <a href="">dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non</a>
                        </div>
                    </figcaption>
                </figure>
            </div>
          </div>

        </section>
      </div>
      </div>
  )
}