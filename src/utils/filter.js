const fenToyuan = function(value,unit=''){
          return unit + parseFloat(Number(value)/100,2).toFixed(2);
      }

  export {
  	fenToyuan
  }