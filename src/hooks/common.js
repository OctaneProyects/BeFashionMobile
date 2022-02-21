  //funcion para obtener fecha del dispositivo
  export function getDeviceDate() {
    let date = new Date(); //Current Date
    let day = `${date.getDate()}`.padStart(2, '0'); //Current day
    let month = `${date.getMonth() + 1}`.padStart(2, '0'); //Current Month
    let year = date.getFullYear(); //Current Year
    let hours = date.getHours(); //Current Hours
    let min = date.getMinutes(); //Current Minutes
    let sec = date.getSeconds(); //Current Seconds
  
    let currentDate = `${year}/${month}/${day} ${hours}:${min}:${sec} `;
    return currentDate;
  }