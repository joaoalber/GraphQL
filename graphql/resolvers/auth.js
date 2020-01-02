const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../models/user')

module.exports = {
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
    login: ({email, password}) => {
      return User.findOne({email: email})
      .then(user => {
         if (!user)  {
            throw new Error('Usuário não existe!')
         }
         return bcrypt.compare(password, user.password)
         .then(isEqual => {
            if(!isEqual) {
               throw new Error('Senha incorreta')
            }
            const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', {expiresIn: '1h'})
            return {
               userId: user.id,
               token: token,
               tokenExpiration: 1
            }
         })
      })
      .catch(err => {
         throw err
      })
    }
}