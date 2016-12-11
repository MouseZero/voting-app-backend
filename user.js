module.exports={

  isUser(user){
    return (user = 'testuser')
  },

  getUser(user){
    console.log(user);
    if(user === 'testuser'){
      return {
        id: 1,
        user: 'testuser',
        password: 'password'
      }
    }else{
      return {
        error: 'No user with that name'
      }
    }
  }
}
