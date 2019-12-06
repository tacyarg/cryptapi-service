const Table = require('memtable')

exports.CreateMemtable = (cfg={}) => {
  return Table({
    primary: 'id',
    indexes: [
      // { name: 'login', required: true, unique: true, index: 'login' },
      // { name: 'email', required: false, unique: true, index: 'email' },
      // { name: 'name', required: false, unique: false, index: 'name' },
    ],
    //Pre save hook, allows for mutations, side effects or validations
    preSet: x => {
      // //validate data
      // validateUser(x)
      //clone our data so it does not get modified outside table
      x = lodash.clone(x)
      //always make sure we have an updated timestamp before saving
      x.updated = Date.now()
      return x
    },
    ...cfg
  })
}