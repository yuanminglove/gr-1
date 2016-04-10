// module.exports = {
//   options : {
//     db: { native_parser: true },
//     server: { poolSize: 5 },
//     user: '',
//     pass: ''
//   },
//   uri : 'mongodb://admin:eVn5YQhtSafY@gr-chrisdong.rhcloud.com/gr'
// }
module.exports = {
  options : {
    db: { native_parser: true },
    server: { poolSize: 5 },
    user: '',
    pass: ''
  },
  uri : 'mongodb://localhost/gr'
}



// mongoose.connect('mongodb://username:password@host:port/database?options...');

// MongoDB 2.4 database added.  Please make note of these credentials:

//    Root User:     admin
//    Root Password: eVn5YQhtSafY
//    Database Name: gr

// Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/