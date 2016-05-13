(function () {
  Polymer({
    is: 'uqlibrary-date-selector',
    properties: {
      /**
       *  The `bookingTimeslots` attribute object contains time slots for selected search date
       */
      bookingTimeSlots: {
        type: Array,
        value: [],
        notify: true
      },
      /**
       * The `maxBookingDate` attribute date indicates maximum possible booking date
       */
      maxBookingDate: {
        type: Date,
        notify: true,
        observer: 'maxBookingDateChanged'
      },
      /**
       *  The `maxBookingLength` attribute is an int indicates maximum number of time slots per booking
       */
      maxBookingLength: {
        type: Number,
        notify: true
      },
      /**
       * The `searchDate` attribute date for which to display time slots
       */
      searchDate: {
        type: Date,
        notify: true,
        observer: '_formatDate'
      },
      /**
       * List of available dates
       */
      _dates: {
        type: Array,
        value: []
      },
      /**
       * Index of the currently selected date tab
       */
      _selectedDateIndex: {
        type: Number,
        value: 0
      }
    },
    /**
     * Generates dates based on the searchDate and maxBookingDate
     * @private
     */
    _generateDates: function () {
      if (!this.searchDate) { return; }
      // Get today's date and time (or searchDate)
      var today = moment(new Date()).isBefore(this.searchDate) ? new Date() : this.searchDate;
      today.setHours(this.searchDate.getHours(), this.searchDate.getMinutes(), 0, 0);
      today = moment(today);

      var maxDateFormatted = moment(this.maxBookingDate).format("YYYY-MM-DD");

      var go = true;
      var dates = [];
      while (go) {
        dates.push(today.clone().toDate());
        today.add(1, "day");
        if (today.format("YYYY-MM-DD") > maxDateFormatted) {
          go = false;
        }
      }

      this._dates = dates;
    },
    /**
     * Returns a proper aria label for this date
     * @param date
     * @returns {string}
     * @private
     */
    _ariaLabel: function (date) {
      return moment(date).format("dddd, D MMMM");
    },
    /**
     * Returns the "day of the week letter" for the given date
     * @param date
     * @returns {*}
     * @private
     */
    _dayOfWeek: function (date) {
      return moment(date).format('ddd')[0];
    },
    /**
     * Returns the "day of the month" for the given date
     * @param date
     * @returns {*}
     * @private
     */
    _dayOfMonth: function (date) {
      return moment(date).format('D');
    },
    /**
     * Called when the max booking date changes
     */
    maxBookingDateChanged: function () {
      if (!this.searchDate) { return; }
      this._generateDates();

      this._selectedDateIndex = this._dates.map(function(date) {
        return date.toDateString();
      }).indexOf(this.searchDate.toDateString());
    },
    /**
     * Called when the search date changes
     */
    searchDateChanged: function () {
      this._generateDates();

      this._selectedDateIndex = this._dates.map(function(date) {
        return date.toDateString();
      }).indexOf(this.searchDate.toDateString());
    },
    /**
     * Called when the user selects a date in paper-tabs
     * @param e
     * @private
     */
    _dateSelected: function (e) {
      if (moment(this.searchDate).format("YYYY-MM-DD") != moment(this._dates[this._selectedDateIndex]).format("YYYY-MM-DD")) {
        this.searchDate = this._dates[this._selectedDateIndex];
      }
    },
    /**
     * Formats the search date when it is updated
     * @param e
     * @private
     */
    _formatDate: function (e) {
      this._selectedDateFormatted = moment(this.searchDate).format('dddd MMM DD, YYYY');
    }
  });
})();