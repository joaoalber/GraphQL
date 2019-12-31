const bcrypt = require('bcryptjs')
//models
const Event = require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}})
    .then(events => {
       return events.map(event => {
          return { 
              ...event._doc, 
              _id: event.id, 
              date: new Date(event._doc.date).toISOString(),
              creator: user.bind(this, event.creator)
            }
       })
    })
    .catch(err => {
       throw err
    })
 }

 const singleEvent = eventId => {
   return Event.findById(eventId)
   .then(event => {
      return {
         ...event._doc, 
         _id: event.id, 
         creator: user.bind(this, event.creator)
      }
   })
   
   .catch(err => {
      throw err
   })
 }
 
 const user = userId => {
    return User.findById(userId)
    .then(user => {
       return { 
        ...user._doc, 
        _id: user.id, 
        createdEvents: events.bind(this, user._doc.createdEvents) 
       }
    })
    .catch(err => {
       throw err
    })
 }

module.exports = {
    events: () => {
       return Event.find().then(events => {
          return events.map(event => {
             return { 
                 ...event._doc,
                 _id: event.id, 
                 date: new Date(event._doc.date).toISOString(),
                 creator: user.bind(this, event._doc.creator) 
                }
          });
       }).catch(err => {
          throw err
       })
    },
    bookings: () => {
      return Booking.find().then(bookings => {
         return bookings.map(booking => {
            return {
               ...booking._doc, 
               _id: booking.id, 
               user: user.bind(this, booking._doc.user),
               event: singleEvent.bind(this, booking._doc.event),
               createdAt: new Date(booking._doc.createdAt).toISOString(),
               updatedAt: new Date(booking._doc.createdAt).toISOString()
            }
         })
      })
      .catch(err => {
         throw err
      })
    },
    createEvent: args => {
      const event = new Event({
         title: args.eventInput.title,
         description: args.eventInput.description,
         price: +args.eventInput.price,
         date: new Date(args.eventInput.date),
         creator: '5e077d4cf3bb7f1f7caf8010'
      })
      let createdEvent
      return event
       .save()
       .then(result => {
         createdEvent = { 
             ...result._doc, 
             date: new Date(event._doc.date).toISOString(),
             creator: user.bind(this, result._doc.creator) 
            } 
         return User.findById('5e077d4cf3bb7f1f7caf8010')
       }).then(user => {
          if (!user) {
             throw new Error('User not found.')
          }
          user.createdEvents.push(event)
          return user.save()
       }).then(result => {
          return createdEvent
       }).catch(err => {
          console.log(err)
       })
    },
    createUser: args => {
       return User.findOne({email: args.userInput.email}).then(user => {
          if (user) {
             throw new Error('User already exists.')
          }
          return bcrypt.hash(args.userInput.password, 12)
       })
       .then(hashedPassword => {
          const user = new User({
             email: args.userInput.email,
             password: hashedPassword
          })
          return user.save()
       }).then(result => {
          return { ...result._doc, password:null }
       }).catch(err => {
          throw err
       })
    },
    bookEvent: args => {
      return Event.findOne({_id: args.eventId})
      .then(fetchedEvent => {
         const booking = new Booking({
            user: '5e077d4cf3bb7f1f7caf8010',
            event: fetchedEvent
         })
         return booking.save()
      })
      .then(result => {
         return { 
            ...result._doc, 
            _id: result.id, 
            user: user.bind(this, result._doc.user),
               event: singleEvent.bind(this, result._doc.event),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.createdAt).toISOString() 
         }
      })
      .catch(err => {
         throw err
      })
   },
   cancelBooking: args => {
      return Booking.findById(args.bookingId).populate('event')
      .then(booking => {
         return { 
            ...booking.event._doc, 
            _id: booking.event.id, 
            creator: user.bind(this, booking.event._doc.creator) 
         }
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