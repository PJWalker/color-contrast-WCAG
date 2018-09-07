(function () {
  var colorPicker = document.querySelector('#color-picker');
  var colorCode = document.querySelector('#color-code');
  var colorCodeHex = document.querySelector('#color-display > span');
  var body = document.querySelector('body');

  colorCode.value = colorPicker.value.substr(1);
  
  const toRGB = hex => {
    const r = parseInt(hex.substr(1, 2), 16),
          g = parseInt(hex.substr(3, 2), 16),
          b = parseInt(hex.substr(5, 2), 16)
    return [r,g,b];
  }
 
 const linearise = (value) => {
  const v = (value/255);
  if(v<=0.03928) {
  return v/12.92;
  }
  return Math.pow((v+0.055)/1.055,2.4)
}

  var getContrastWCAG = (hex) => {
    const rgb = toRGB(hex).map(linearise);
    const luma = (rgb[0]*0.2126 + rgb[1]*0.7152 + rgb[2]*0.0722);
    const whiteContrast = 1.05/(luma+0.05);
    const blackContrast = (luma+0.05)/0.05;
    console.log(luma, whiteContrast, blackContrast)
    return (whiteContrast > blackContrast)? "white":"black";
    
  }

  var updateScreen = function updateScreen(hex) {
    var contrastColor = getContrastWCAG(hex);
    body.style.backgroundColor = hex;
    colorCode.style.color = contrastColor;
    colorCode.style.borderColor = contrastColor;
    colorCode.value = hex.substr(1);
    colorCodeHex.style.color = hex;
    colorCodeHex.style.backgroundColor = contrastColor;
    colorPicker.value = hex;
  }

  colorPicker.addEventListener('change', function (event) {
    var hex = event.target.value;
    updateScreen(hex);
  });

  colorCode.addEventListener('keyup', function (event) {
    var regex = /[0-9a-f]{6}|#[0-9a-f]{3}/gi;
    if (event.keyCode === 13 && 
        event.target.value.match(regex)) {
      updateScreen('#' + event.target.value);
    }
  });
})()
