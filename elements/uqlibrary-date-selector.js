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
        observer: 'searchDateChanged'
      },
      /**
       * List of available dates
       */
      _dates: {
        type: Array,
        value: []
      },
      /**
       * Selected date
       */
      _selectedDate: {
        type: Date
      },
      /**
       * Index of the currently selected date tab
       */
      _selectedDateIndex: {
        type: Number,
        value: 0
      }
    },
    ready: function () {
      this.searchDate = new Date();
      this.maxBookingDate = moment(this.searchDate).add(1, "d").toDate();
      this.maxBookingLength = 0;
      this._generateDates();
    },
    /**
     * Generates dates based on the searchDate and maxBookingDate
     * @private
     */
    _generateDates: function () {
      // Get today's date and time (or searchDate)
      var today = moment(new Date()).isBefore(this.searchDate) ? new Date() : this.searchDate;
      today.setHours(this.searchDate.getHours(), this.searchDate.getMinutes(), 0, 0);

      // Get days difference
      var timeDifference = Math.abs(moment(today).diff(moment(this.maxBookingDate)));
      var daysCount = parseInt(moment.duration(timeDifference).asDays());

      var dates = [];
      for (var i = 0; i < daysCount; i++) {
        dates.push(moment(today).add(i, "day").toDate());
      }

      this._dates = dates;
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
      this._selectedDate = this._dates[this._selectedDateIndex];
      this._selectedDateFormatted = moment(this._selectedDate).format('dddd MMM DD, YYYY');
    }
  });
})();