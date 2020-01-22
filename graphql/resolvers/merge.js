const DataLoader = require('dataloader')

const Event = require('../../models/event')
const User = require('../..//models/user')
const { dateToString } = require('../../helpers/date')

const eventLoader = new DataLoader((eventIds) => {
   return events(eventIds)
})

const userLoader = new DataLoader(userIds => {
   return User.find({_id: {$in: userIds}})
})

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}})
    .then(events => {
       return events.map(event => {
          return transformEvent(event)
       })
    })
    .catch(err => {
       throw err
    })
 }

 const singleEvent = eventId => {
   return eventLoader.load(eventId.toString())
   .then(event => {
      return event
   }) 
   .catch(err => {
      throw err
   })
 }
 
 const user = userId => {
    return userLoader.load(userId.toString())
    .then(user => {
       return { 
        ...user._doc, 
        _id: user.id, 
        createdEvents: eventLoader.load.bind(this, user._doc.createdEvents) 
       }
    })
    .catch(err => {
       throw err
    })
 }

 const transformEvent = event => {
    return {
      ...event._doc,
      _id: event.id,
      date: dateToString(event._doc.date),
      creator: user.bind(this, event.creator)
    };
  };

  const transformBooking = booking => {
    return {
       ...booking._doc, 
       _id: booking.id,
       user: user.bind(this, booking._doc.user),
       event: singleEvent.bind(this, booking._doc.event),
       createdAt: dateToString(booking._doc.createdAt),
       updatedAt: dateToString(booking._doc.createdAt)
    }
 }

 exports.transformEvent = transformEvent
 exports.transformBooking = transformBooking
 