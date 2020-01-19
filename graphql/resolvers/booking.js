const Event = require('../../models/event')
const Booking = require('../../models/booking')
const { transformBooking, transformEvent } = require('./merge')

module.exports = {
    bookings: (args, req) => {
      if (!req.isAuth) {
         throw new Error('Sem autorização')
      }
      return Booking.find({user: req.userId}).then(bookings => {
         return bookings.map(booking => {
            return transformBooking(booking)
         })
      })
      .catch(err => {
         throw err
      })
    },
    bookEvent: (args, req) => {
      if (!req.isAuth) {
         throw new Error('Sem autorização')
      }
      return Event.findOne({_id: args.eventId})
      .then(fetchedEvent => {
         const booking = new Booking({
            user: req.userId,
            event: fetchedEvent
         })
         return booking.save()
      })
      .then(result => {
         return transformBooking(result)
      })
      .catch(err => {
         throw err
      })
   },
   cancelBooking: (args, req) => {
      if (!req.isAuth) {
         throw new Error('Sem autorização')
      }
      return Booking.findById(args.bookingId).populate('event')
      .then(booking => {
         return transformEvent(booking.event)
      })
      .then(event => {
         return Booking.deleteOne({_id: args.bookingId}).then(() => {
            return event
         }).catch(err => {
            throw err
         })
      })
      .catch(err => {
         throw err
      })
   }
}