import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema(
  {
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a tour.'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user.'],
    },
    price: {
      type: Number,
      required: [true, 'Booking must have a price.'],
    },
    paid: {
      type: Boolean,
      dafault: true,
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.pre(/^find/, function (next) {
  this.populate([{ path: 'tour', select: 'name' }, 'user']);

  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
