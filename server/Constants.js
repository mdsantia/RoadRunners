/* MongoDB Constants */

const mongoUser = "mdsantia";
const mongoPwd = "efx777db3Fz8xHQi";

const mongoURI = `mongodb+srv://${mongoUser}:${mongoPwd}@data.oknxymr.mongodb.net/Data?retryWrites=true&w=majority`;

/* Google Constants */
const GoogleApiKey = 'AIzaSyAY4ucRwslDV5QQ-5h_cs18mBsMCBZhi5c';

/* TicketMaster Constants */
const TicketMasterApiKey = 'fV8erdwQAxLln3uUEsUdIMqM46tVAqjA';
const TicketMasterSecret = '7fxK4SSYTIEVM6gN';

module.exports = {
    mongoURI,
    TicketMasterApiKey,
    TicketMasterSecret,
    GoogleApiKey
}