
exports.getDate= getDate;

 function getDate(){
const today = new Date();
    const options ={
      weekday:'long',
      day:'numeric',
      month:'long'
    }

    return today.toLocaleString('en-US',options)


}

exports.getDay= getDay;
function getDay(){
const today = new Date();
    const options ={
      weekday:'long',
    }

  return today.toLocaleString('en-US',options)


}
