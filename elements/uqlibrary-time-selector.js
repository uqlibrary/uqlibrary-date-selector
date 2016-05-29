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
        notify: true
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
    /**
     * Returns an aria label for a time slot
     * @param item
     * @returns {string}
     * @private
     */
    _ariaLabel: function (item) {
      return this.formatTime(item.startTime) + " - " + (item.selected ? "" : "not ") + "selected";
    },
    /**
     * Formats the time slot for viewing
     * @param timeSlotValue
     * @returns {*}
     */
    formatTime: function (timeSlotValue) {
      return moment(timeSlotValue).format('hh:mm a');
    },
    /**
     * Called when a time slot has been selected
     * @param e
     * @private
     */
    _timeSlotChanged: function (e) {
      var selectedIndex = e.model.index;
      var selectedItem = e.model.item;

      // Check if the time slot change is valid
      result = this._timeSlotChangeValid(selectedIndex);
      if (true === result) {
        selectedItem.selected = !selectedItem.selected;

        // This is required for Polymer to update this object and bubble it up
        this.bookingTimeSlots = this.bookingTimeSlots.slice();
        this.notifyPath('bookingTimeSlots.' + selectedIndex + '.selected', selectedItem.selected);
      } else {
          this.$.toast.text = result;
          this.$.toast.show();
      }
    },
    /**
     * Checks whether this time slot can be selected
     * @param index
     * @private
     */
    _timeSlotChangeValid: function (index) {
      // Get previous and next time slots
      var item = this.bookingTimeSlots[index];
      var previous = (index > 0 ? this.bookingTimeSlots[index - 1] : null);
      var next = ((index + 1) < this.bookingTimeSlots.length ? this.bookingTimeSlots[index + 1] : null);

      var selectedItems = _.filter(this.bookingTimeSlots, function (value) { return value.selected; });

      // Check if the item is selectable
      result = true;
      if (!item.selectable) {
        result = "Time slot cannot be selected";
      }

      if (true == result) {
        if (item.selected) {
          // User wants to deselect, make sure it is not in the middle of the selected area
          if (previous && previous.selected && next && next.selected) {
            result = "You cannot turn off a time slot in the middle of the time block";
          }
        } else {
          // User wants to select this item
          // If no elements have been selected, it is valid
          if (selectedItems.length > 0) {

            // Make sure at least one time slot next to this item is selected
            if (previous && previous.selected || next && next.selected) {
              if (this.maxBookingLength != 0 && selectedItems.length + 1 > this.maxBookingLength) {
                // max booking length reached
                result = "Maximum Length of booking reached"
              }
            } else {
              // non contiguous time selected
              result = "Create a second booking to choose a second block of time";
            }
          }
        }
      }
      return result;
    }
  }); 

})();