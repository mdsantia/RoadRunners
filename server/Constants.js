/* MongoDB Constants */

const mongoUser = "mdsantia";
const mongoPwd = "PkLnDkpIynsO9YR8";

const mongoURI = `mongodb+srv://${mongoUser}:${mongoPwd}@data.oknxymr.mongodb.net/Data?retryWrites=true&w=majority`;

/* Google Constants */
const GoogleApiKey = 'AIzaSyBQSWehf4LQiWZKhB7NNmh0LEOoWJmV3-Y';

module.exports = {
    mongoURI,
    GoogleApiKey
}