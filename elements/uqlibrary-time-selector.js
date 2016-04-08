(function () {
  Polymer({
    is: 'uqlibrary-time-selector',
    properties: {
      /**
       * The `bookingTimeslots` attribute is a sorted array of objects - time slots to display
       */
      bookingTimeSlots: {
        type: Array,
        value: [],
        notify: true,
        observer: '_bookingTimeSlotsChanged'
      },
      /**
       * The `maxBookingLength` attribute is an int - indicates maximum number of time slots per booking
       */
      maxBookingLength: {
        type: Number,
        notify: true,
        value: 0
      },
      timeslot: { observer: 'timeslotChanged' }
    },
    formatTime: function (timeslotValue) {
      return moment(timeslotValue).format('hh:mm a');
    },
    _bookingTimeSlotsChanged: function () {
      console.log(this.bookingTimeSlots);
    },
    timeslotChanged: function (data, event, source) {
      console.log("CHANGED");
      var selectedIndex = source.attributes['data-index'].value;
      if (this.isTimeslotChangeValid(selectedIndex)) {
        this.set('bookingTimeslots' + ('.' + selectedIndex) + '.selected', !this.bookingTimeslots[selectedIndex].selected);
        this.fire('time-selector-changed', {
          bookingTimeslots: this.bookingTimeslots,
          changedIndex: selectedIndex
        });
      }
    },
    isTimeslotChangeValid: function (index) {
      index = parseInt(index);
      var currentTimeslot = this.bookingTimeslots[index];
      var prevTimeslot = index > 0 ? this.bookingTimeslots[index - 1] : null;
      var nextTimeslot = index + 1 < this.bookingTimeslots.length ? this.bookingTimeslots[index + 1] : null;
      // get currently selected elements
      var selectedTimeslots = this.bookingTimeslots.filter(function (item) {
        return item.selected;
      });
      if (!currentTimeslot.selectable) {
        //cannot select or deselect unavailable time slots
        return false;
      } else if (selectedTimeslots.length == 0) {
        // valid if first timeslot selected
        return true;
      } else if (this.bookingTimeslots[index].selected) {
        // valid if current timeslot is deselected not from the middle of selection
        return !(prevTimeslot && prevTimeslot.selected && nextTimeslot && nextTimeslot.selected);
      } else if (prevTimeslot && prevTimeslot.selected || nextTimeslot && nextTimeslot.selected) {
        // valid if selected time slot is next to previously selected time slots
        // valid if total number of timeslots selections does not exceed max booking length
        return this.maxBookingLength == 0 || selectedTimeslots.length + 1 <= this.maxBookingLength;
      }
      return false;
    },
    _computeId: function (index) {
      return 'timeslot' + index;
    },
    _computeClass: function (timeslot) {
      return 'item selected-' + timeslot.selected + ' occupied-' + !timeslot.selectable;
    }
  });
})();