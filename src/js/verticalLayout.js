/**
 * @public
 * @class
 * @param {Object} config
 * @param {Ideogram} ideo
 */
function VerticalLayout(config, ideo) {
    /*
     * 
     */
    Layout.call(this, config, ideo);
    /**
     * @private
     * @member {String}
     */
    this._class = 'VerticalLayout';
    /**
     * Layout margins.
     * @private
     * @member {Object}
     */
    this._margin = {
        top : 30,
        left : 15
    };
}


VerticalLayout.prototype = Object.create(Layout.prototype);


/**
 * @override
 */
VerticalLayout.prototype.rotateForward = function(setNumber, chrNumber, chrElement, callback) {

    var ideoBox = d3.select("#_ideogram").node().getBoundingClientRect();
    var chrBox = chrElement.getBoundingClientRect();

    var scaleX = (ideoBox.width / chrBox.height) * 0.97;
    var scaleY = this._getYScale();

    var transform = "translate(10, 25) scale(" + scaleX + ", " + scaleY + ")";

    d3.select(chrElement.parentNode)
        .transition()
        .attr("transform", transform)
        .on('end', callback);
};


/**
 * @override
 */
VerticalLayout.prototype.rotateBack = function(setNumber, chrNumber, chrElement, callback) {

    var translate = this.getChromosomeSetTranslate(setNumber);

    d3.select(chrElement.parentNode)
        .transition()
        .attr("transform", translate)
        .on('end', callback);
};


/**
 * @override
 */
VerticalLayout.prototype.getHeight = function(taxId) {

    return this._config.chrHeight + this._margin.top * 1.5;
};


/**
 * @override
 */
VerticalLayout.prototype.getChromosomeBandLabelTranslate = function(band) {

};


/**
 * @override
 */
VerticalLayout.prototype.getChromosomeSetLabelTranslate = function() {

    return 'rotate(-90)';
};


/**
 * @override
 */
VerticalLayout.prototype.getChromosomeSetTranslate = function(setNumber) {

    return 'rotate(90) translate(' + this._margin.top + ', -' + this.getChromosomeSetYTranslate(setNumber) + ')';
};


/**
 * @override
 */
VerticalLayout.prototype.getChromosomeSetYTranslate = function(setNumber) {
    /*
     * Get additional padding caused by annotation tracks.
     */
    var additionalPadding = this._getAdditionalOffset();
    /*
     * If no detailed description provided just use one formula for all cases.
     */
    if (! this._config.ploidyDesc) {
        /*
         * TODO: Here is we have magic number 10. It is simpliy adjusted to accomodate bars on histogramm view.
         * But it should be replaced with bar's maximum height...
         */
        return 10 + 35 * (setNumber) + this._config.chrWidth + additionalPadding * 2 + additionalPadding * setNumber;
    }
    /*
     * If detailed description provided start to calculate offsets
     * for each chromosome set separately. This should be done only once.
     */
    if (! this._translate) {
        /*
         * First offset equals to zero.
         */
        this._translate = [this._description.getSetSize(0) * this._config.chrWidth * 2];
        /*
         * Loop through description set.
         */
        for (var i = 1; i < this._config.ploidyDesc.length; i ++) {
            this._translate[i] = this._translate[i - 1] + this._getChromosomeSetSize(i - 1);
        };
    }

    return this._translate[setNumber];
};


/**
 * @override
 */
VerticalLayout.prototype.getChromosomeSetLabelXPosition = function(setNumber) {

    return ((this._description.getSetSize(setNumber) * this._config.chrWidth + 20) / - 2) + (this._config.ploidy > 1 ? 0 : this._config.chrWidth);
};


/**
 * @override
 */
VerticalLayout.prototype.getChromosomeSetLabelYPosition = function(i) {

    return -2 * this._config.chrWidth;
};


/**
 * @override
 */
VerticalLayout.prototype.getChromosomeLabelXPosition = function(i) {

    return this._config.chrWidth / - 2;
};


/**
 * @override
 */
VerticalLayout.prototype.getChromosomeLabelYPosition = function(i) {

    return -5;
};