module.exports = {
    testUserData: {
        id: 1,
        user: 'testuser',
        password: 'password'
    },
    isUser(user){
        return (user = testUserData.user)
    },

    getUser(user){
        if(user = testUserData.user){
            return testUserData;
        }else{
            return {
                error: 'No user with that name'
            }
        }
    }


}