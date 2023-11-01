/* MongoDB Constants */

const mongoUser = "mdsantia";
const mongoPwd = "efx777db3Fz8xHQi";

const mongoURI = `mongodb+srv://${mongoUser}:${mongoPwd}@data.oknxymr.mongodb.net/Data?retryWrites=true&w=majority`;

/* Google Constants */
const GoogleApiKey = 'AIzaSyANyesuTDbnZjMYHkkHfa0-ywXNX2esSwI';

module.exports = {
    mongoURI,
    // vehiclesURI,
    GoogleApiKey
}