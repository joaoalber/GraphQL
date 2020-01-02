const Event = require('../../models/event')
const { transformEvent } = require('./merge');
const User = require('../../models/user')

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
    createEvent: (args, req) => {
      if (!req.isAuth) {
         throw new Error('Sem autorização')
      }
      const event = new Event({
         title: args.eventInput.title,
         description: args.eventInput.description,
         price: +args.eventInput.price,
         date: new Date(args.eventInput.date),
         creator: req.userId
      })
      let createdEvent
      return event
       .save()
       .then(result => {
         createdEvent = transformEvent(result)
         return User.findById(req.userId)
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