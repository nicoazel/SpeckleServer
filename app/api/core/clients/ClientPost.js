const winston = require( 'winston' )
const chalk = require( 'chalk' )
const Client = require( '../../../../models/UserAppClient' )

module.exports = ( req, res ) => {
  if ( !req.body.client ) {
    res.status( 400 )
    return res.send( { success: false, message: 'Malformed request. Client not created.' } )
  }

  let myClient = new Client( {
    role: req.body.client.role,
    documentName: req.body.client.documentName,
    documentType: req.body.client.documentType,
    documentGuid: req.body.client.documentGuid,
    documentLocation: req.body.client.documentLocation,
    streamId: req.body.client.streamId,
    online: true,
    private: true,
    owner: req.user ? req.user._id : ''
  } )
  if ( !req.user )
    res.send( { success: true, message: 'Anonymous client created.', clientId: 'temp-' + myClient._id } )
  else
    myClient.save( )
    .then( result => {
      res.send( { success: true, message: 'Client created.', clientId: result._id } )
    } )
    .catch( err => {
      winston.error( err )
      res.status( 400 )
      res.send( { success: false, message: err.toString( ) } )
    } )
}