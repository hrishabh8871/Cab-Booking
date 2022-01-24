const { BookeRide } = require('./bookRides')
const { StartRide } = require('./startRides')
const { EndRide } = require('./endRide')
const { AssignCabDriver } = require('./assignCabDriver')
const { CabAvailable } = require('./cabAvailable')

module.exports = {
    BookeRide: BookeRide,
    StartRide: StartRide,
    EndRide: EndRide,
    AssignCabDriver: AssignCabDriver,
    CabAvailable: CabAvailable
}