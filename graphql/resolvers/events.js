const Event = require('../../models/event')
const { transformEvent } = require('./merge');

module.exports = {
    events: () => {
       return Event.find().then(events => {
          return events.map(event => {
            return transformEvent(event)
          });
       }).catch(err => {
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
         createdEvent = transformEvent(result)
         return User.findById('5e077d4cf3bb7f1f7caf8010')
       }).then(creator => {
          if (!creator) {
             throw new Error('User not found.')
          }
          creator.createdEvents.push(event)
          return creator.save()
       }).then(() => {
          return createdEvent
       }).catch(err => {
          console.log(err)
       })
    }
}