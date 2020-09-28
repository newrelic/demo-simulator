slider = window.slider || {};

slider.current = 30

slider._sliderElement = null
slider._onUpdateHandler = null
slider._outputElement = null

slider.set_current = function(value) {
    slider.current = value
    slider._sliderElement.value = value
    slider.display()
}

slider.display = function() {
    if (slider._outputElement != null){
        slider._outputElement.innerHTML = slider.current
    }
};

slider.init = function (sliderElement, outputElement = null, onUpdateHandler = null) {
    slider._sliderElement = sliderElement
    slider._outputElement = outputElement
    slider._onUpdateHandler = onUpdateHandler
    sliderElement.value = slider.current
    slider.display()

    // Update the current slider value (each time you drag the slider handle)
    sliderElement.oninput = function() {
        slider.current = this.value        
        slider.display()
        if (slider._onUpdateHandler != null){
            slider._onUpdateHandler()
        }
    }
}
