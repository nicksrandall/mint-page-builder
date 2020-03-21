import facepaint from 'facepaint';

const mq = facepaint([
  '@media(min-width: 600px)',
  '@media(min-width: 960px)',
  '@media(min-width: 1280px)',
  '@media(min-width: 1920px)'
])

export default mq;
