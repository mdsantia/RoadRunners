/* MongoDB Constants */

const mongoUser = "mdsantia";
const mongoPwd = "efx777db3Fz8xHQi";

const mongoURI = `mongodb+srv://${mongoUser}:${mongoPwd}@data.oknxymr.mongodb.net/Data?retryWrites=true&w=majority`;

/* Google Constants */
const GoogleApiKey = 'AIzaSyBQSWehf4LQiWZKhB7NNmh0LEOoWJmV3-Y';

module.exports = {
    mongoURI,
    // vehiclesURI,
    GoogleApiKey
}