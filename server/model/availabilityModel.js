const mongoose = require('mongoose');
const AvailabilitySchema = new mongoose.Schema({
    teacher: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    dayOfWeek:
    { 
        type:  String, 
        required: true 
    }, 
    startTime: 
    { 
        type: String, 
        required: true 
    }, // Format: "HH:mm"
    endTime: 
    { 
        type: String, 
        required: true 
    },
  });

  const Availability = mongoose.model('Availability', AvailabilitySchema);

module.exports = Availability;