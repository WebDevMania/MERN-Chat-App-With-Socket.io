import React, { useRef } from 'react'
import classes from './message.module.css'
import Woman from '../../assets/woman.avif'
import { format } from 'timeago.js';
import { useEffect } from 'react';


const Message = ({ own, message }) => {
 
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <>
      {!own &&
        <div ref={ref} className={classes.container}>
          <div className={classes.wrapper}>
            <img src={Woman} className={classes.personImg} />
            <div className={classes.messageAndTimeAgo}>
              <div className={classes.text}>
                {message.messageText}
              </div>
              <span className={classes.timeAgo}>
                {format(message.createdAt)}
              </span>
            </div>
          </div>
        </div>
      }
      {own &&
        <div ref={ref} className={`${classes.container} ${classes.own}`}>
          <div className={classes.wrapper}>
            <div className={classes.messageAndTimeAgo}>
              <div className={classes.text}>
                {message.messageText}
              </div>
              <span className={classes.timeAgo}>
                {format(message.createdAt)}
              </span>
            </div>
            <img src={Woman} className={classes.personImg} />
          </div>
        </div>
      }
    </>
  )
}

export default Message