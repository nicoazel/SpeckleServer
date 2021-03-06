const winston = require( 'winston' )
const chalk = require( 'chalk' )
const jwt = require( 'jsonwebtoken' )

const User = require( '../../../../models/User' )

module.exports = function( req, res ) {
  if ( !req.body.email ) return res.send( { success: false, message: 'Do not fuck with us' } )
  if ( !req.body.password ) return res.send( { success: false, message: 'Do not fuck with us' } )

  let sessionSecret = process.env.SESSION_SECRET

  User.findOne( { 'email': req.body.email.toLowerCase( ) } )
    .then( myUser => {
      if ( !myUser ) throw 'Invalid credentials.'
      myUser.validatePassword( req.body.password, myUser.password, match => {
        if ( match === false ) {
          res.status( 401 )
          return res.send( { success: false, message: 'Invalid credentials.' } )
        }
        myUser.logins.push( { date: Date.now( ) } )
        myUser.save( )
        let token = 'JWT ' + jwt.sign( { _id: myUser._id, name: myUser.name }, sessionSecret, { expiresIn: '24h' } )
        let userObject = myUser.toObject( )
        userObject.token = token
        delete userObject[ 'password' ]
        res.send( { success: true, message: 'You have logged in.', resource: userObject } )
      } )
    } )
    .catch( err => {
      winston.error( err )
      res.status( 401 )
      res.send( { success: false, message: err } )
    } )
}