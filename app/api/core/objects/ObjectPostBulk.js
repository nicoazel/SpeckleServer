const winston = require( 'winston' )
const chalk = require( 'chalk' )
const _ = require( 'lodash' )

const SpeckleObject = require( '../../../../models/SpeckleObject' )
const BulkObjectSave = require( '../../middleware/BulkObjectSave' )

module.exports = ( req, res ) => {

  if ( !req.body ) {
    res.status( 400 )
    return res.send( { success: false, message: 'Malformed request.' } )
  }

  BulkObjectSave( req.body, req.user )
    .then( objects => {
      res.send( { success: true, message: 'Saved objects to database.', resources: objects.map( o => o._id ) } )
    } )
    .catch( err => {
      inston.error( err )
      res.status( 400 )
      res.send( { success: false, message: err.toString( ) } )
    } )
}