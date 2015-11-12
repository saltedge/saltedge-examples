HermesApp.randomStringGenerator = function(length, charSet) {
  var i, randomPoz, randomString;
  charSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  randomString = "";
  i = 0;

  while (i < length) {
    randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
    i++;
  }

  return randomString;
};
