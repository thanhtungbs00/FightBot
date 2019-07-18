const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function appendLeadingZeroes(n){
    if(n <= 9){
      return "0" + n;
    }
    return n;
  }

function getTime(time){
    return time.getFullYear() + "-" + appendLeadingZeroes(time.getMonth() + 1) + "-" + appendLeadingZeroes(time.getDate()) + " " + appendLeadingZeroes(time.getHours()) + ":" + appendLeadingZeroes(time.getMinutes()) + ":" + appendLeadingZeroes(time.getSeconds())
}

module.exports = {
    getTime
}

