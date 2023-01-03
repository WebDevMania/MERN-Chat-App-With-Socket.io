import React from 'react'
import classes from './conversation.module.css'
import Woman from '../../assets/woman.avif'

const Conversation = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <img src={Woman} className={classes.personImg}/>
        <div className={classes.metaData}>
          <div className={classes.otherUsername}>John</div>
          <div className={classes.lastMsgConvo}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequatur tenetur aspernatur eum doloremque maxime unde deserunt, iusto vero corporis suscipit non enim dolorum sed voluptate sapiente. Voluptatem illo voluptates nisi.</div>
        </div>
      </div>
    </div>
  )
}

export default Conversation