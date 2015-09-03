/* Model
 *
 * Model for JSON data
 */

(function (exports) {
  "use strict";

  // the model for the Media Sample Data
  // {Object} appSettings are the user-defined settings from the index page
  function JSONMediaModel(appSettings) {
    // mixin inheritance, initialize this as an event handler for these events:
    Events.call(this, ['error']);

    this.mediaData       = [];
    this.categoryData    = [];
    this.currSubCategory = [];
    this.currData = [];
    this.currentCategory = 0;
    this.currentItem     = 0;
    this.defaultTheme    = "default";
    this.currentlySearchData = false;

    //timeout default to 1 min
    this.TIMEOUT = 60000;

    /**
     * This function loads the initial data needed to start the app and calls the provided callback with the data when it is fully loaded
     * @param {function} the callback function to call with the loaded data
     */
    this.loadInitialData = function (dataLoadedCallback) {
      var requestData = {
        url: appSettings.dataURL,
        type: 'GET',
        crossDomain: true,
        dataType: 'json',
        context : this,
        cache : true,
        timeout: this.TIMEOUT,
        success : function() {
          var contentData = arguments[0];
          this.handleJsonData(contentData);
          dataLoadedCallback();
        }.bind(this),
        error : function(jqXHR, textStatus) {
          // Data feed error is passed to model's parent (app.js) to handle
          if (jqXHR.status === 0) {
            this.trigger("error", ErrorTypes.INITIAL_NETWORK_ERROR, errorHandler.genStack());
            return;
          }
          switch (textStatus) {
          case "timeout" :
            this.trigger("error", ErrorTypes.INITIAL_FEED_TIMEOUT, errorHandler.genStack());
            break;
          case "parsererror" :
            this.trigger("error", ErrorTypes.INITIAL_PARSING_ERROR, errorHandler.genStack());
            break;
          default:
            this.trigger("error", ErrorTypes.INITIAL_FEED_ERROR, errorHandler.genStack());
            break;
          }
        }.bind(this)
      };
      utils.ajaxWithRetry(requestData);
    }.bind(this);

    /**
     * Handles requests that contain json data
     * @param {Object} jsonData data returned from request
     */
    this.handleJsonData = function (jsonData) {
      this.categoryData = [];
      this.currentCategory = 0;
      this.mediaData = jsonData.media;
      if (!jsonData.categories) {
        this.createFoldersFromMediaData(jsonData);
      }
      this.categories = jsonData.categories;
      this.rootCategory = this.categories[2];

      // create left nav based on the folder stucture object
      for (var i = 0; i < this.rootCategory.items.length; i++) {
        for (var j = 0; j < this.categories.length; j++) {
          if (this.categories[j].title === this.rootCategory.title) {
            this.categoryData.push(this.categories[j].title);
          }
        }
      }

    }.bind(this);

   

  }

  exports.JSONMediaModel = JSONMediaModel;

})(window);

