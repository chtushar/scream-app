
const isEmpty = (string) => {
    return string.trim() === ''
}

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    return email.match(regEx)
}



exports.validateSignupData = (newUser) => {
    let errors= {};
    if (isEmpty(newUser.email)) {
        errors.email = "Must not be empty"
    } else if(!isEmail(newUser.email)){
        errors.email = 'Must be a valid email address'
    }   
    
    
    if (isEmpty(newUser.password)){
        errors.password = 'Must not be Empty'
    }
    if (newUser.password !== newUser.confirmPassword) {
        errors.confirmPassword = 'Passwords must match.'
    }

    if (isEmpty(newUser.handle)){
        errors.handle = 'Must not be Empty'
    }



    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}


exports.validateLoginData = (data) => {
    let errors = {};
  
    if (isEmpty(data.email)) errors.email = 'Must not be empty';
    if (isEmpty(data.password)) errors.password = 'Must not be empty';
  
    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
  };