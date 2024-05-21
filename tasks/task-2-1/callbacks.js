function verdoppeln(zahl, callback) {
    callback(zahl * 2);
  }
  
  verdoppeln(5, function(ergebnis) {
    console.log('Das Ergebnis ist:', ergebnis);
  });
  