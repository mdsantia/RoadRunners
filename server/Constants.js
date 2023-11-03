/* MongoDB Constants */

const mongoUser = "mdsantia";
const mongoPwd = "efx777db3Fz8xHQi";

const mongoURI = `mongodb+srv://${mongoUser}:${mongoPwd}@data.oknxymr.mongodb.net/Data?retryWrites=true&w=majority`;

/* Google Constants */
const GoogleApiKey = 'AIzaSyDVjFUtCS2Dtwu47A3fx6jsRwkpIKbkI60';

/* TicketMaster Constants */
const TicketMasterApiKey = 'fV8erdwQAxLln3uUEsUdIMqM46tVAqjA';
const TicketMasterSecret = '7fxK4SSYTIEVM6gN';

/* Yelp Constants */
const YelpApiKey = 'hukoy189FRpjG1DGaW34sPOwPJS2nyn9ek6Qr3ldtMOMww5NPKS7woSDT3748feMvu56JgM_R5wBkkOpbZjwXWwImtU-z4umZFk2GChy09FBAy4DxrMnfwZ1_sFEZXYx';
const YelpID = 'nVVrFJOn1461A5WBUMew1Q';

module.exports = {
    mongoURI,
    TicketMasterApiKey,
    TicketMasterSecret,
    YelpApiKey,
    GoogleApiKey,
    mongoPwd,
    mongoUser,
}